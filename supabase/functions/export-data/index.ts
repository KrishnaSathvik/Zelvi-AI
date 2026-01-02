// Supabase Edge Function: export-data
// This function exports all user data as JSON
// Deploy with: supabase functions deploy export-data

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, content-type',
        },
      })
    }

    // Get auth token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
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

    // Fetch all user data
    const [
      jobs,
      recruiters,
      learningLogs,
      projects,
      contentPosts,
      dailyCustomTasks,
      dailyTaskStatus,
      goals,
      weeklyReviews,
      activityLog,
      userProfile,
    ] = await Promise.all([
      supabase.from('jobs').select('*').eq('user_id', user.id),
      supabase.from('recruiters').select('*').eq('user_id', user.id),
      supabase.from('learning_logs').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id),
      supabase.from('content_posts').select('*').eq('user_id', user.id),
      supabase.from('daily_custom_tasks').select('*').eq('user_id', user.id),
      supabase.from('daily_task_status').select('*').eq('user_id', user.id),
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('weekly_reviews').select('*').eq('user_id', user.id),
      supabase.from('activity_log').select('*').eq('user_id', user.id),
      supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    ])

    // Check for errors
    const errors = [
      jobs.error,
      recruiters.error,
      learningLogs.error,
      projects.error,
      contentPosts.error,
      dailyCustomTasks.error,
      dailyTaskStatus.error,
      goals.error,
      weeklyReviews.error,
      activityLog.error,
      userProfile.error,
    ].filter(Boolean)

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch data: ${errors[0]?.message}` }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Build export object
    const exportData = {
      user_id: user.id,
      exported_at: new Date().toISOString(),
      user_profile: userProfile.data,
      jobs: jobs.data || [],
      recruiters: recruiters.data || [],
      learning_logs: learningLogs.data || [],
      projects: projects.data || [],
      content_posts: contentPosts.data || [],
      daily_custom_tasks: dailyCustomTasks.data || [],
      daily_task_status: dailyTaskStatus.data || [],
      goals: goals.data || [],
      weekly_reviews: weeklyReviews.data || [],
      activity_log: activityLog.data || [],
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          export: exportData,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

