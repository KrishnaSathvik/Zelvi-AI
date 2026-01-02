import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}. Please check your .env file.`)
}

import { logger } from './logger'

// Validate API key format (Supabase anon keys typically start with 'eyJ')
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  logger.warn('Warning: Supabase anon key format looks incorrect. Make sure you\'re using the "anon public" key from Supabase Dashboard > Settings > API, not the service_role key.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

