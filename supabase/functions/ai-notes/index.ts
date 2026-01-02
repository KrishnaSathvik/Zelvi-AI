// Supabase Edge Function: ai-notes
// This function handles AI interactions within notes, including voice transcription and chat
// Deploy with: supabase functions deploy ai-notes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// CORS configuration
const ALLOWED_ORIGINS = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://zelvi.pp',
]

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Max-Age': '86400',
  }
}

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const maxRequests = 30 // 30 requests per minute for notes (transcription + chat)
  const windowMs = 60000
  const key = userId
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetTime }
}

serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  try {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Get auth token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Verify user - try getUser first, if it fails decode JWT and use admin API
    const token = authHeader.replace('Bearer ', '')
    
    let user
    const {
      data: { user: getUserResult },
      error: authError,
    } = await supabase.auth.getUser(token)
    
    if (authError || !getUserResult) {
      // Fallback: decode JWT and use admin API (works for anonymous users)
      try {
        const parts = token.split('.')
        if (parts.length !== 3) {
          throw new Error('Invalid token format')
        }
        const payload = JSON.parse(atob(parts[1]))
        const userId = payload.sub
        
        if (!userId) {
          throw new Error('No user ID in token')
        }

        // Verify user exists using admin API (works for both regular and anonymous users)
        const { data: adminUser, error: userError } = await supabase.auth.admin.getUserById(userId)
        
        if (userError || !adminUser) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid token or user not found' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        
        user = adminUser.user
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else {
      user = getUserResult
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(user.id)
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    // Parse request body
    const body = await req.json()
    const { action, message, audio_base64, notes_content } = body

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Handle speech-to-text (transcription)
    if (action === 'transcribe' && audio_base64) {
      // Convert base64 to blob
      const audioBlob = Uint8Array.from(atob(audio_base64), (c) => c.charCodeAt(0))
      
      const formData = new FormData()
      const audioFile = new Blob([audioBlob], { type: 'audio/webm' })
      formData.append('file', audioFile, 'audio.webm')
      formData.append('model', 'whisper-1')

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      })

      if (!transcriptionResponse.ok) {
        const error = await transcriptionResponse.json()
        return new Response(
          JSON.stringify({ success: false, error: error.error?.message || 'Transcription failed' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const transcriptionData = await transcriptionResponse.json()
      return new Response(
        JSON.stringify({
          success: true,
          data: { text: transcriptionData.text },
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    // Handle AI chat with notes context
    if (action === 'chat' && message) {
      // Fetch user profile for personalization
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle()
      
      const userName = profile?.name || user.email?.split('@')[0] || 'there'

      // Fetch user's notes and recent activity for context
      const [notesResult, jobsResult, recruitersResult, learningResult, projectsResult, contentResult, goalsResult] =
        await Promise.all([
          supabase.from('notes').select('content').eq('user_id', user.id).limit(1).maybeSingle(),
          supabase
            .from('jobs')
            .select('role, company, status, applied_date, notes')
            .eq('user_id', user.id)
            .order('applied_date', { ascending: false })
            .limit(15),
          supabase
            .from('recruiters')
            .select('name, company, status, last_contact_date, notes')
            .eq('user_id', user.id)
            .order('last_contact_date', { ascending: false })
            .limit(15),
          supabase
            .from('learning_logs')
            .select('topic, category, minutes, date, takeaways')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(15),
          supabase.from('projects').select('name, status, priority, next_action, notes').eq('user_id', user.id).order('created_at', { ascending: false }).limit(15),
          supabase
            .from('content_posts')
            .select('title, platform, status, date, notes')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(15),
          supabase.from('goals').select('title, current, target, deadline, status').eq('user_id', user.id).eq('status', 'active').limit(5),
        ])

      const notesContent = notesResult.data?.content || notes_content || ''
      const recentJobs = jobsResult.data || []
      const recentRecruiters = recruitersResult.data || []
      const recentLearning = learningResult.data || []
      const recentProjects = projectsResult.data || []
      const recentContent = contentResult.data || []
      const activeGoals = goalsResult.data || []

      // Build rich context summary
      const jobsList = recentJobs.map(j => 
        `- ${j.role} at ${j.company} (${j.status}, applied ${j.applied_date}${j.notes ? `, notes: ${j.notes.substring(0, 100)}` : ''})`
      ).join('\n') || 'None'
      
      const recruitersList = recentRecruiters.map(r => 
        `- ${r.name}${r.company ? ` at ${r.company}` : ''} (${r.status}, last contact ${r.last_contact_date}${r.notes ? `, notes: ${r.notes.substring(0, 100)}` : ''})`
      ).join('\n') || 'None'
      
      const learningList = recentLearning.map(l => 
        `- ${l.topic} (${l.category}, ${l.minutes}min on ${l.date}${l.takeaways ? `, takeaways: ${l.takeaways.substring(0, 100)}` : ''})`
      ).join('\n') || 'None'
      
      const projectsList = recentProjects.map(p => 
        `- ${p.name} (${p.status}, ${p.priority} priority${p.next_action ? `, next: ${p.next_action}` : ''}${p.notes ? `, notes: ${p.notes.substring(0, 100)}` : ''})`
      ).join('\n') || 'None'
      
      const contentList = recentContent.map(c => 
        `- ${c.title} on ${c.platform} (${c.status}, ${c.date}${c.notes ? `, notes: ${c.notes.substring(0, 100)}` : ''})`
      ).join('\n') || 'None'
      
      const goalsList = activeGoals.map(g => 
        `- ${g.title}: ${g.current}/${g.target}${g.deadline ? ` (deadline: ${g.deadline})` : ''}`
      ).join('\n') || 'None'

      const contextSummary = `User: ${userName}

User's Notes (current):
${notesContent.substring(0, 3000)}

Recent Job Applications:
${jobsList}

Recent Recruiter Contacts:
${recruitersList}

Recent Learning Activity:
${learningList}

Recent Projects:
${projectsList}

Recent Content Posts:
${contentList}

Active Goals:
${goalsList}`

      const systemPrompt = `You are Zelvi AI, integrated into ${userName}'s notes. You have access to their notes and all their activity data (jobs, recruiters, learning, projects, content, goals).

Your role:
1. Help them understand, organize, and extract insights from their notes
2. Answer questions about their progress using their actual data
3. Connect their notes to their recent activity (e.g., "Based on your note about X, I see you applied to Y company...")
4. Help them plan and stay organized by referencing their actual projects, goals, and tasks
5. Provide personalized insights that connect their notes to their broader activity
6. Use their name naturally in responses

Be conversational, helpful, and specific. Reference their actual notes, jobs, learning topics, projects, and goals when relevant. Ask clarifying questions if needed to better understand their needs.`

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'system', content: `Here is ${userName}'s current data:\n\n${contextSummary}` },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      })

      if (!openaiResponse.ok) {
        const error = await openaiResponse.json()
        return new Response(
          JSON.stringify({ success: false, error: error.error?.message || 'OpenAI API error' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const openaiData = await openaiResponse.json()
      const aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            response: aiResponse,
          },
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

