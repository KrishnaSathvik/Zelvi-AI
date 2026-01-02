import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data?: any }>
  signInAnonymously: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<{ error: any }>
  checkVerificationStatus: () => Promise<{ verified: boolean; error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Fix Issue 3: Manual session extraction fallback (if detectSessionInUrl fails)
    const handleSessionFromUrl = async () => {
      try {
        // Check URL hash for session tokens (Supabase redirect format)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        // Check URL search params (alternative format)
        const searchParams = new URLSearchParams(window.location.search)
        const searchAccessToken = searchParams.get('access_token')
        const searchRefreshToken = searchParams.get('refresh_token')
        const searchError = searchParams.get('error')

        // Handle errors from URL
        if (error || searchError) {
          const errorMsg = errorDescription || searchParams.get('error_description') || error || searchError
          logger.warn('Auth error in URL:', errorMsg)
          
          // Fix Issue 1: Handle expired token
          if (errorMsg && (errorMsg.includes('expired') || errorMsg.includes('invalid'))) {
            // Will be handled in Auth.tsx
            return
          }
        }

        // Extract tokens from either location
        const token = accessToken || searchAccessToken
        const refresh = refreshToken || searchRefreshToken

        if (token && refresh) {
          logger.log('Extracting session from URL (fallback)')
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh,
          })

          if (sessionError) {
            logger.error('Failed to set session from URL:', sessionError)
          } else if (data.session) {
            setSession(data.session)
            setUser(data.session.user)
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        }
      } catch (err) {
        logger.error('Error handling session from URL:', err)
      }
    }

    // Run session extraction on mount
    handleSessionFromUrl()

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    // Log detailed error information for debugging
    if (error) {
      logger.error('Signup error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        fullError: error,
      })
      
      // Provide more helpful error messages
      if (error.status === 401) {
        error.message = 'Signup is disabled. Please check your Supabase project settings or contact support.'
      }
    }
    
    return { error, data }
  }

  const signInAnonymously = async () => {
    try {
      // Try anonymous sign-in
      const { data, error } = await supabase.auth.signInAnonymously()
      
      if (error) {
        // Log the full error for debugging
        logger.error('Anonymous sign-in error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
          code: (error as any).code,
          fullError: error,
        })
        
        // Check for specific error conditions
        const errorMessage = error.message?.toLowerCase() || ''
        
        // Check for invalid API key first
        if (errorMessage.includes('invalid api key') || errorMessage.includes('invalid key')) {
          const helpfulError = {
            ...error,
            message: 'Invalid Supabase API key. Please check your VITE_SUPABASE_ANON_KEY in your .env file. Get your key from Supabase Dashboard > Settings > API > anon public key.',
          }
          return { error: helpfulError }
        }
        
        // Check if anonymous auth is disabled (but not for invalid API key)
        const isDisabled = 
          (error.status === 401 && !errorMessage.includes('invalid api key') && !errorMessage.includes('invalid key')) ||
          error.status === 403 ||
          errorMessage.includes('disabled') ||
          errorMessage.includes('not enabled') ||
          errorMessage.includes('anonymous') && errorMessage.includes('not available') ||
          (error as any).code === 'anonymous_disabled'
        
        if (isDisabled) {
          const helpfulError = {
            ...error,
            message: 'Anonymous authentication is disabled in your Supabase project. Please enable it in Authentication > Providers > Anonymous in your Supabase dashboard, or use the regular sign-up option.',
          }
          return { error: helpfulError }
        }
        
        // For other errors, return with original message
        return { error }
      }
      
      // Success - verify the user was created
      if (data?.user) {
        logger.log('Anonymous sign-in successful:', {
          userId: data.user.id,
          isAnonymous: data.user.is_anonymous,
        })
      }
      
      return { error: null }
    } catch (err: any) {
      logger.error('Unexpected error during anonymous sign-in:', err)
      return { 
        error: {
          message: err.message || 'An unexpected error occurred. Please try again.',
          status: err.status || 500,
        }
      }
    }
  }

  // Fix Issue 1 & 2: Resend verification email
  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      
      if (error) {
        logger.error('Resend verification email error:', error)
      } else {
        logger.log('Verification email resent successfully')
      }
      
      return { error }
    } catch (err: any) {
      logger.error('Unexpected error resending verification email:', err)
      return {
        error: {
          message: err.message || 'Failed to resend verification email. Please try again.',
          status: err.status || 500,
        },
      }
    }
  }

  // Fix Issue 9: Check verification status
  const checkVerificationStatus = async () => {
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      
      if (error) {
        return { verified: false, error }
      }
      
      const verified = currentUser?.email_confirmed_at !== null
      return { verified, error: null }
    } catch (err: any) {
      logger.error('Error checking verification status:', err)
      return {
        verified: false,
        error: {
          message: err.message || 'Failed to check verification status',
          status: err.status || 500,
        },
      }
    }
  }

  const signOut = async () => {
    const isAnonymous = user?.is_anonymous
    
    if (isAnonymous) {
      // Anonymous users can't call the logout API at all (403 error)
      // We need to manually clear local storage and state
      try {
        // Get the Supabase URL to construct the storage key
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        if (supabaseUrl) {
          // Supabase stores auth in localStorage with key: `sb-${projectRef}-auth-token`
          // We'll clear all Supabase-related keys
          const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
          const authKey = `sb-${projectRef}-auth-token`
          localStorage.removeItem(authKey)
          
          // Also clear any other Supabase storage keys
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
              localStorage.removeItem(key)
            }
          })
        }
        
        // Clear state immediately
        setSession(null)
        setUser(null)
        
        // Force a refresh of the auth state by getting a new session
        // This will return null since we cleared storage
        await supabase.auth.getSession()
      } catch (error: any) {
        logger.warn('Error clearing anonymous session:', error)
        // Still clear state even if storage clearing fails
        setSession(null)
        setUser(null)
      }
    } else {
      // Regular users can use the normal signOut API
      try {
        await supabase.auth.signOut()
      } catch (error: any) {
        logger.warn('SignOut error:', error)
        // Fallback: clear state even if API call fails
        setSession(null)
        setUser(null)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signInAnonymously,
        signOut,
        resendVerificationEmail,
        checkVerificationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

