// Supabase Edge Function: ai-weekly-summary
// This function generates AI-powered weekly summaries
// Deploy with: supabase functions deploy ai-weekly-summary

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
  const maxRequests = 5 // 5 requests per minute for weekly summaries
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
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    // Parse request body
    const { week_start, week_end, stats, review_text, goals } = await req.json()

    if (!week_start || !week_end || !stats) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch user profile for personalization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('user_id', user.id)
      .maybeSingle()
    
    const userName = profile?.name || user.email?.split('@')[0] || 'there'

    // Fetch detailed data for richer context
    const [jobsData, recruitersData, learningData, projectsData, contentData] = await Promise.all([
      supabase
        .from('jobs')
        .select('role, company, status, applied_date')
        .eq('user_id', user.id)
        .gte('applied_date', week_start)
        .lte('applied_date', week_end)
        .order('applied_date', { ascending: false }),
      supabase
        .from('recruiters')
        .select('name, company, status, last_contact_date')
        .eq('user_id', user.id)
        .gte('last_contact_date', week_start)
        .lte('last_contact_date', week_end)
        .order('last_contact_date', { ascending: false }),
      supabase
        .from('learning_logs')
        .select('topic, category, minutes, date')
        .eq('user_id', user.id)
        .gte('date', week_start)
        .lte('date', week_end)
        .order('date', { ascending: false }),
      supabase
        .from('projects')
        .select('name, status, priority, next_action')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10),
      supabase
        .from('content_posts')
        .select('title, platform, status, date')
        .eq('user_id', user.id)
        .gte('date', week_start)
        .lte('date', week_end)
        .order('date', { ascending: false }),
    ])

    // Call OpenAI
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = `You are Zelvi AI, ${userName}'s personal operating system coach. You analyze their weekly performance data and provide deep, strategic insights that go far beyond simple summaries.

Your analysis should:
- Identify patterns, trends, and correlations the user might not notice
- Connect different areas of their activity (e.g., "Your learning in X category aligns with your job applications in Y field")
- Provide strategic recommendations based on their actual data
- Highlight both strengths and areas needing attention
- Be specific and actionable, referencing their actual activities when relevant
- Use their name naturally in the summary

Avoid generic advice. Be specific, data-driven, and strategic.`

    // Build detailed context
    const jobsList = jobsData.data?.slice(0, 10).map(j => `${j.role} at ${j.company} (${j.status})`).join(', ') || 'None'
    const recruitersList = recruitersData.data?.slice(0, 10).map(r => `${r.name}${r.company ? ` at ${r.company}` : ''} (${r.status})`).join(', ') || 'None'
    const learningList = learningData.data?.slice(0, 10).map(l => `${l.topic} (${l.category}, ${l.minutes}min)`).join(', ') || 'None'
    const activeProjects = projectsData.data?.filter(p => p.status !== 'done').map(p => `${p.name} (${p.status}, ${p.priority}${p.next_action ? `, next: ${p.next_action}` : ''})`).join(', ') || 'None'
    const contentList = contentData.data?.slice(0, 10).map(c => `${c.title} on ${c.platform} (${c.status})`).join(', ') || 'None'

    const userPrompt = `Analyze ${userName}'s week (${week_start} to ${week_end}):

WEEKLY STATISTICS:
- Jobs: ${stats.jobs.applied} applied, ${stats.jobs.interviews} reached interviews, ${stats.jobs.offers} offers
- Recruiters: ${stats.recruiters.contacts} contacts, ${stats.recruiters.responseRate}% response rate
- Learning: ${stats.learning.totalMinutes} minutes (${Math.round(stats.learning.totalMinutes / 60 * 10) / 10} hours), top category: ${stats.learning.topCategory}
- Content: ${stats.content.published} published
- Tasks: ${stats.tasks.completed} / ${stats.tasks.created} completed (${stats.tasks.created > 0 ? Math.round((stats.tasks.completed / stats.tasks.created) * 100) : 0}% completion rate)
- Goals: ${stats.goals.length} active goals

DETAILED ACTIVITY:
Jobs Applied: ${jobsList}
Recruiters Contacted: ${recruitersList}
Learning Sessions: ${learningList}
Active Projects: ${activeProjects}
Content Created: ${contentList}

USER'S REFLECTION:
- What went well: ${review_text?.wins || 'Not provided'}
- Challenges: ${review_text?.challenges || 'Not provided'}
- Avoided/Procrastinated: ${review_text?.avoided || 'Not provided'}
- Next focus: ${review_text?.next_focus || 'Not provided'}

GOALS PROGRESS:
${goals?.map((g: any) => {
  const progress = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0
  const status = progress >= 100 ? '✅ Complete' : progress >= 75 ? '🟡 On track' : progress >= 50 ? '🟠 Behind' : '🔴 Needs attention'
  return `- ${g.title}: ${g.current}/${g.target} (${progress}%) ${status}${g.deadline ? `, deadline: ${g.deadline}` : ''}`
}).join('\n') || 'None'}

YOUR TASK:
1. Identify patterns and insights ${userName} might not notice (e.g., "Your response rate improved but applications decreased - consider quality over quantity", or "You learned about X but haven't applied it to your projects yet")
2. Connect different areas of activity (e.g., "Your learning in ${stats.learning.topCategory} aligns with your job applications in related fields")
3. Highlight specific strengths and areas for improvement based on actual data
4. Provide 3-5 specific, actionable recommendations for next week that reference their actual activities
5. If goals are behind, suggest concrete steps to catch up
6. Reference specific companies, roles, learning topics, or projects when relevant

Format your response as JSON:
{
  "summary": "2-3 paragraphs with deep insights, patterns, strategic observations, and connections between different areas. Use ${userName}'s name naturally. Reference specific activities when relevant. Not just rephrasing stats - provide real strategic value.",
  "focus_points": ["specific actionable recommendation 1 (be specific, reference their data)", "specific actionable recommendation 2", "specific actionable recommendation 3", "specific actionable recommendation 4", "specific actionable recommendation 5"]
}`

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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      return new Response(JSON.stringify({ success: false, error: error.error?.message || 'OpenAI API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          summary: parsed.summary || 'No summary generated.',
          focus_points: parsed.focus_points || [],
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetAt),
        },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

