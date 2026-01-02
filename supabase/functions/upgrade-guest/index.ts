// Supabase Edge Function: upgrade-guest
// This function upgrades a guest/anonymous user to a full account
// Deploy with: supabase functions deploy upgrade-guest

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

    // Parse request body
    const { email, password } = await req.json()
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Email and password are required' }), {
        status: 400,
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

    // Verify guest user - try getUser first, if it fails decode JWT and use admin API
    const token = authHeader.replace('Bearer ', '')
    
    let guestUser
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
        
        guestUser = adminUser.user
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } else {
      guestUser = getUserResult
    }

    if (!guestUser.is_anonymous) {
      return new Response(JSON.stringify({ success: false, error: 'User is not a guest account' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const guestUserId = guestUser.id

    // Create new auth user with email/password
    const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (createError) {
      return new Response(JSON.stringify({ success: false, error: `Failed to create account: ${createError.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const newUserId = newUserData.user.id

    // Migrate all data from guest user to new user
    const tables = [
      'user_profiles',
      'jobs',
      'recruiters',
      'learning_logs',
      'projects',
      'content_posts',
      'daily_custom_tasks',
      'daily_task_status',
      'goals',
      'weekly_reviews',
      'activity_log',
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).update({ user_id: newUserId }).eq('user_id', guestUserId)
      if (error) {
        console.error(`Error migrating ${table}:`, error)
        // Continue with other tables even if one fails
      }
    }

    // Delete guest user (optional - you might want to keep it for audit)
    // await supabase.auth.admin.deleteUser(guestUserId)

    // Create a session for the new user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          new_user_id: newUserId,
          message: 'Account upgraded successfully. Please sign in with your new credentials.',
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

