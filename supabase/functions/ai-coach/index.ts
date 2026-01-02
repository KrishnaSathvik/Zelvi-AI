// Supabase Edge Function: ai-coach
// This function handles AI coach chat interactions
// Deploy with: supabase functions deploy ai-coach

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// CORS configuration - restrict to allowed origins in production
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

// Simple rate limiting (in-memory, resets on restart)
// For production, use Redis or database-backed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const maxRequests = 20 // 20 requests per minute for AI endpoints
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
          headers: { 'Content-Type': 'application/json' },
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
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    // Parse request body
    const { mode, message, time_range = 30 } = await req.json()

    if (!mode || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Missing mode or message' }), {
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

    // Fetch relevant data based on mode with rich context
    let contextSummary = ''
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - time_range * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    switch (mode) {
      case 'general': {
        // Aggregate all data with specific details
        const [jobs, recruiters, learning, projects, content, goals] = await Promise.all([
          supabase.from('jobs').select('role, company, status, applied_date').eq('user_id', user.id).gte('applied_date', startDate).lte('applied_date', endDate).order('applied_date', { ascending: false }).limit(20),
          supabase.from('recruiters').select('name, company, status, last_contact_date').eq('user_id', user.id).gte('last_contact_date', startDate).lte('last_contact_date', endDate).order('last_contact_date', { ascending: false }).limit(10),
          supabase.from('learning_logs').select('topic, category, minutes, date').eq('user_id', user.id).gte('date', startDate).lte('date', endDate).order('date', { ascending: false }).limit(15),
          supabase.from('projects').select('name, status, priority, next_action').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('content_posts').select('title, platform, status, date').eq('user_id', user.id).gte('date', startDate).lte('date', endDate).order('date', { ascending: false }).limit(10),
          supabase.from('goals').select('title, current, target, deadline').eq('user_id', user.id).eq('status', 'active').limit(5),
        ])
        
        const recentJobs = jobs.data?.map(j => `${j.role} at ${j.company} (${j.status})`).join(', ') || 'None'
        const recentRecruiters = recruiters.data?.map(r => `${r.name}${r.company ? ` at ${r.company}` : ''} (${r.status})`).join(', ') || 'None'
        const recentLearning = learning.data?.map(l => `${l.topic} (${l.category}, ${l.minutes}min)`).join(', ') || 'None'
        const activeProjects = projects.data?.filter(p => p.status !== 'done').map(p => `${p.name} (${p.status}, ${p.priority} priority${p.next_action ? `, next: ${p.next_action}` : ''})`).join(', ') || 'None'
        const recentContent = content.data?.map(c => `${c.title} on ${c.platform} (${c.status})`).join(', ') || 'None'
        const activeGoals = goals.data?.map(g => `${g.title}: ${g.current}/${g.target}${g.deadline ? ` (deadline: ${g.deadline})` : ''}`).join(', ') || 'None'
        
        const totalLearningMinutes = learning.data?.reduce((sum, l) => sum + (l.minutes || 0), 0) || 0
        
        contextSummary = `User: ${userName}
Time Period: Last ${time_range} days (${startDate} to ${endDate})

Recent Job Applications (${jobs.data?.length || 0}): ${recentJobs}
Recent Recruiter Contacts (${recruiters.data?.length || 0}): ${recentRecruiters}
Learning Activity (${totalLearningMinutes} total minutes): ${recentLearning}
Active Projects (${projects.data?.filter(p => p.status !== 'done').length || 0}): ${activeProjects}
Recent Content Posts (${content.data?.length || 0}): ${recentContent}
Active Goals: ${activeGoals}`
        break
      }
      case 'job': {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('role, company, status, applied_date, job_type, location, notes')
          .eq('user_id', user.id)
          .gte('applied_date', startDate)
          .lte('applied_date', endDate)
          .order('applied_date', { ascending: false })
          .limit(30)
        const { data: recruiters } = await supabase
          .from('recruiters')
          .select('name, company, status, last_contact_date, platform, notes')
          .eq('user_id', user.id)
          .gte('last_contact_date', startDate)
          .lte('last_contact_date', endDate)
          .order('last_contact_date', { ascending: false })
          .limit(20)
        
        const jobsList = jobs?.map(j => 
          `- ${j.role} at ${j.company} (${j.status}, applied ${j.applied_date}, ${j.job_type}${j.location ? `, ${j.location}` : ''}${j.notes ? `, notes: ${j.notes.substring(0, 100)}` : ''})`
        ).join('\n') || 'None'
        
        const recruitersList = recruiters?.map(r => 
          `- ${r.name}${r.company ? ` at ${r.company}` : ''} (${r.status}, last contact ${r.last_contact_date}, via ${r.platform}${r.notes ? `, notes: ${r.notes.substring(0, 100)}` : ''})`
        ).join('\n') || 'None'
        
        const statusBreakdown = jobs?.reduce((acc, j) => {
          acc[j.status] = (acc[j.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        contextSummary = `User: ${userName}
Time Period: Last ${time_range} days (${startDate} to ${endDate})

Job Applications (${jobs?.length || 0}):
${jobsList}

Status Breakdown: ${JSON.stringify(statusBreakdown)}

Recruiter Contacts (${recruiters?.length || 0}):
${recruitersList}`
        break
      }
      case 'learning': {
        const { data: learning } = await supabase
          .from('learning_logs')
          .select('topic, category, minutes, date, resource, takeaways')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })
          .limit(30)
        
        const totalMinutes = learning?.reduce((sum, l) => sum + (l.minutes || 0), 0) || 0
        const categories = learning?.reduce((acc, l) => {
          acc[l.category] = (acc[l.category] || 0) + (l.minutes || 0)
          return acc
        }, {} as Record<string, number>)
        
        const learningList = learning?.map(l => 
          `- ${l.topic} (${l.category}, ${l.minutes}min on ${l.date}${l.resource ? `, resource: ${l.resource}` : ''}${l.takeaways ? `, takeaways: ${l.takeaways.substring(0, 150)}` : ''})`
        ).join('\n') || 'None'
        
        contextSummary = `User: ${userName}
Time Period: Last ${time_range} days (${startDate} to ${endDate})

Total Learning Time: ${totalMinutes} minutes (${Math.round(totalMinutes / 60 * 10) / 10} hours)

Learning Sessions:
${learningList}

Category Breakdown (minutes): ${JSON.stringify(categories)}`
        break
      }
      case 'projects': {
        const { data: projects } = await supabase
          .from('projects')
          .select('name, status, priority, category, next_action, notes, started_at, completed_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)
        
        const projectsList = projects?.map(p => 
          `- ${p.name} (${p.status}, ${p.priority} priority, ${p.category}${p.next_action ? `, next: ${p.next_action}` : ''}${p.started_at ? `, started: ${p.started_at}` : ''}${p.completed_at ? `, completed: ${p.completed_at}` : ''}${p.notes ? `, notes: ${p.notes.substring(0, 100)}` : ''})`
        ).join('\n') || 'None'
        
        const statusBreakdown = projects?.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const activeProjects = projects?.filter(p => p.status !== 'done' && p.next_action) || []
        
        contextSummary = `User: ${userName}

All Projects (${projects?.length || 0}):
${projectsList}

Status Breakdown: ${JSON.stringify(statusBreakdown)}
Active Projects with Next Actions: ${activeProjects.length}
${activeProjects.length > 0 ? activeProjects.map(p => `- ${p.name}: ${p.next_action}`).join('\n') : ''}`
        break
      }
      case 'content': {
        const { data: content } = await supabase
          .from('content_posts')
          .select('title, platform, status, date, content_type, notes')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })
          .limit(20)
        
        const contentList = content?.map(c => 
          `- ${c.title} on ${c.platform} (${c.status}, ${c.date}${c.content_type ? `, type: ${c.content_type}` : ''}${c.notes ? `, notes: ${c.notes.substring(0, 100)}` : ''})`
        ).join('\n') || 'None'
        
        const statusBreakdown = content?.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const platformBreakdown = content?.reduce((acc, c) => {
          acc[c.platform] = (acc[c.platform] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        contextSummary = `User: ${userName}
Time Period: Last ${time_range} days (${startDate} to ${endDate})

Content Posts (${content?.length || 0}):
${contentList}

Status Breakdown: ${JSON.stringify(statusBreakdown)}
Platform Breakdown: ${JSON.stringify(platformBreakdown)}`
        break
      }
    }

    // Call OpenAI
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Build personalized system prompt based on mode
    let systemPrompt = ''
    switch (mode) {
      case 'general':
        systemPrompt = `You are Zelvi AI, ${userName}'s personal operating system coach. You have deep knowledge of their job search, learning, projects, content creation, and goals. 

Your role:
- Provide personalized, actionable advice based on their actual data
- Reference specific jobs, companies, learning topics, projects, and goals when relevant
- Identify patterns and opportunities they might miss
- Be encouraging but honest about areas needing improvement
- Help them prioritize and make strategic decisions
- Use their name naturally in responses when appropriate

Be concise (2-4 sentences typically), specific, and actionable. Reference their actual data when giving advice.`
        break
      case 'job':
        systemPrompt = `You are Zelvi AI, ${userName}'s job search coach. You have detailed information about their job applications, recruiter contacts, and job search activity.

Your role:
- Analyze their job funnel and identify bottlenecks
- Suggest specific improvements to their job search strategy
- Reference actual companies, roles, and recruiters when relevant
- Help them understand their application patterns and response rates
- Provide tactical advice on improving their job search outcomes
- Be specific about which applications or recruiters to focus on

Be strategic, data-driven, and specific. Reference their actual job applications and recruiter contacts.`
        break
      case 'learning':
        systemPrompt = `You are Zelvi AI, ${userName}'s learning coach. You track all their learning activities, topics, categories, and time invested.

Your role:
- Help them plan effective learning paths based on their history
- Identify learning gaps or areas to focus on
- Suggest connections between different learning topics
- Recommend resources or next steps based on what they've learned
- Help them balance learning across different categories
- Reference specific topics they've studied when relevant

Be encouraging, specific, and help them build on their existing knowledge. Reference their actual learning topics and categories.`
        break
      case 'projects':
        systemPrompt = `You are Zelvi AI, ${userName}'s project management coach. You know all their projects, their status, priorities, and next actions.

Your role:
- Help prioritize projects based on status, priority, and deadlines
- Suggest specific next actions for active projects
- Identify projects that might be stuck or need attention
- Help them balance multiple projects effectively
- Reference specific project names and details when giving advice
- Suggest which projects to focus on or potentially pause

Be practical, specific, and help them make progress. Reference their actual project names and next actions.`
        break
      case 'content':
        systemPrompt = `You are Zelvi AI, ${userName}'s content creation coach. You track their content posts, platforms, and publishing activity.

Your role:
- Analyze their content strategy and suggest improvements
- Generate content ideas based on their learning and projects
- Help them plan content across different platforms
- Reference their actual content posts and platforms when relevant
- Suggest topics based on their recent learning or project work
- Help them maintain consistency in content creation

Be creative, specific, and help them create valuable content. Reference their actual posts and platforms.`
        break
    }

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
        max_tokens: 800,
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
          'X-RateLimit-Limit': '20',
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

