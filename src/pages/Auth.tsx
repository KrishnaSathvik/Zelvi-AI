import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { trackEvent } from '../lib/analytics'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { user, signIn, signUp, signInAnonymously, resendVerificationEmail, checkVerificationStatus } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      // Fix Issue 9: Check if already verified
      if (user.email_confirmed_at) {
        navigate('/app')
      } else {
        // User exists but not verified - show verification message
        setNeedsVerification(true)
      }
    }
  }, [user, navigate])

  // Fix Issue 1, 3, 7, 10: Handle verification from URL on mount
  useEffect(() => {
    const handleVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      
      const error = urlParams.get('error') || hashParams.get('error')
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description')
      const type = urlParams.get('type') || hashParams.get('type')
      
      // Fix Issue 1: Handle expired/invalid token
      if (error) {
        setVerifying(false)
        if (error.includes('expired') || error.includes('invalid')) {
          setError('Verification link has expired. Please request a new verification email.')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        } else {
          setError(errorDescription || 'Verification failed. Please try again.')
        }
        return
      }

      // Fix Issue 10: Show loading state during verification
      if (type === 'signup' || type === 'email_change' || type === 'recovery') {
        setVerifying(true)
        setError(null)
        
        // Wait a bit for session to be created
        setTimeout(async () => {
          const { verified } = await checkVerificationStatus()
          if (verified) {
            setSuccess('Email verified successfully! Redirecting...')
            setTimeout(() => {
              navigate('/app')
            }, 1500)
          } else {
            setVerifying(false)
            // Session might still be creating, wait a bit more
            setTimeout(async () => {
              const { verified: verifiedAgain } = await checkVerificationStatus()
              if (!verifiedAgain) {
                setError('Verification may have failed. Please try signing in or request a new verification email.')
              }
            }, 2000)
          }
        }, 1000)
      }
    }

    handleVerification()
  }, [checkVerificationStatus, navigate])

  // Fix Issue 4: Detect in-app browser
  useEffect(() => {
    const isInAppBrowser = 
      (window.navigator as any).standalone === false &&
      (/iPhone|iPad|iPod/.test(navigator.userAgent)) &&
      !(window as any).MSStream

    if (isInAppBrowser && !localStorage.getItem('inAppBrowserWarningShown')) {
      // Show warning once
      localStorage.setItem('inAppBrowserWarningShown', 'true')
      // Could show a toast/banner here
      console.log('In-app browser detected. For best experience, open this link in Safari.')
    }
  }, [])

  // Fix Issue 6: Check for private browsing (iOS Safari)
  useEffect(() => {
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
    } catch (e) {
      // Private browsing mode - localStorage blocked
      console.warn('Private browsing detected. Some features may not work correctly.')
    }
  }, [])

  // Add robots noindex meta tag
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.setAttribute('name', 'robots')
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute('content', 'noindex, nofollow')

    return () => {
      // Remove on unmount
      if (metaRobots && metaRobots.parentNode) {
        metaRobots.parentNode.removeChild(metaRobots)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    setNeedsVerification(false)

    if (isSignUp) {
      trackEvent('signup_start')
      const { error, data } = await signUp(email, password)
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        trackEvent('signup_success')
        
        // Fix Issue 2: Check if email verification is required
        if (data?.user && !data.user.email_confirmed_at) {
          setNeedsVerification(true)
          setSuccess('Account created! Please check your email to verify your account. Check your spam folder if you don\'t see it.')
          setLoading(false)
        } else {
          // Email auto-confirmed or verification disabled
          navigate('/app')
        }
      }
    } else {
      // Fix Issue 10: Check network before sign in
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.')
        setLoading(false)
        return
      }

      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        trackEvent('login_success')
        navigate('/app')
      }
    }
  }

  // Fix Issue 1 & 2: Resend verification email with cooldown
  const handleResendVerification = async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown} seconds before requesting another email.`)
      return
    }

    if (!email) {
      setError('Please enter your email address first.')
      return
    }

    setError(null)
    setLoading(true)

    const { error } = await resendVerificationEmail(email)
    
    if (error) {
      setError(error.message || 'Failed to resend verification email. Please try again.')
      setLoading(false)
    } else {
      setSuccess('Verification email sent! Please check your inbox and spam folder.')
      setLoading(false)
      
      // Set cooldown (3 minutes = 180 seconds)
      setResendCooldown(180)
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleGuestMode = async () => {
    setError(null)
    setLoading(true)
    trackEvent('guest_mode_start')
    const { error } = await signInAnonymously()
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      trackEvent('guest_mode_success')
      navigate('/app')
    }
  }

  return (
    <div className="min-h-screen theme-bg-page flex flex-col lg:flex-row">
      {/* Marketing/Info Section - Top on mobile, Left on desktop */}
      <div className="w-full lg:w-2/3 relative overflow-hidden" style={{ backgroundColor: '#09090b' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)'
        }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke='%2300d9ff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-lime/10 rounded-full blur-3xl hidden lg:block"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl hidden lg:block"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16" style={{ color: '#ffffff' }}>
          <div>
            <div className="flex items-center gap-2 mb-4 lg:mb-8">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-lime"></div>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span className="text-sm font-mono text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {isSignUp ? 'Welcome' : 'Welcome Back'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 font-display leading-tight" style={{ color: '#ffffff' }}>
              {isSignUp 
                ? 'Start building your career command center' 
                : 'Continue building your career command center'}
            </h1>
            
            <p className="text-base sm:text-lg lg:text-lg xl:text-xl mb-6 lg:mb-12 font-mono text-sm max-w-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {isSignUp
                ? 'Sign up to access your dashboard, job tracking, learning progress, and personalized AI insights.'
                : 'Sign in to access your dashboard, job tracking, learning progress, and personalized AI insights.'}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 lg:space-y-6 mt-8 lg:mt-16">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-lime/20 flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 font-mono text-xs uppercase text-lime">AI-POWERED</h3>
                  <p className="text-xs lg:text-sm font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Smart insights and coaching based on your data</p>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-lime/20 flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 font-mono text-xs uppercase text-lime">UNIFIED TRACKING</h3>
                  <p className="text-xs lg:text-sm font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Jobs, recruiters, learning, projects, and goals in one place</p>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4">
                <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-lime/20 flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 font-mono text-xs uppercase text-lime">SECURE & PRIVATE</h3>
                  <p className="text-xs lg:text-sm font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Your data is encrypted and stays private</p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Visual Element - Hidden on mobile */}
          <div className="mt-auto pt-8 hidden lg:block">
            <div className="relative">
              <svg width="400" height="200" viewBox="0 0 400 200" className="w-full max-w-md opacity-20">
                {/* Career path illustration */}
                <path d="M20 180 Q100 100, 200 120 T380 80" stroke="currentColor" strokeWidth="2" fill="none" className="text-lime" />
                <circle cx="20" cy="180" r="8" fill="currentColor" className="text-lime" />
                <circle cx="200" cy="120" r="8" fill="currentColor" className="text-lime" />
                <circle cx="380" cy="80" r="8" fill="currentColor" className="text-lime" />
                {/* Job icons */}
                <rect x="50" y="150" width="30" height="30" rx="4" fill="currentColor" className="text-lime/30" />
                <rect x="150" y="100" width="30" height="30" rx="4" fill="currentColor" className="text-lime/30" />
                <rect x="300" y="60" width="30" height="30" rx="4" fill="currentColor" className="text-lime/30" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Bottom on mobile, Right on desktop */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="border-2 p-8 lg:p-10 shadow-elevation-3 rounded-lg backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 className="text-3xl font-bold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className="text-sm mb-8 font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {isSignUp 
                ? 'Create your account to start tracking your career journey'
                : 'Sign in to continue your career journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 font-mono text-xs uppercase" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 theme-bg-page border-2 focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 font-mono text-sm transition-all"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 font-mono text-xs uppercase" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 theme-bg-page border-2 focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 font-mono text-sm transition-all"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff'
                  }}
                />
              </div>

              {/* Fix Issue 10: Show verifying state */}
              {verifying && (
                <div className="text-lime text-sm font-mono bg-lime/10 border border-lime/20 px-4 py-3 rounded flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying your email...
                </div>
              )}

              {/* Fix Issue 2: Show verification needed message */}
              {needsVerification && !verifying && (
                <div className="bg-lime/10 border border-lime/20 px-4 py-3 rounded space-y-3">
                  <div className="text-lime text-sm font-mono">
                    {success || 'Please verify your email to continue.'}
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    We sent a verification email to <strong>{email}</strong>. Click the link in the email to verify your account.
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
                  </div>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={loading || resendCooldown > 0}
                    className="w-full px-4 py-2 border-2 border-lime/30 hover:bg-lime/10 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs uppercase transition-all"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, '0')}`
                      : 'Resend Verification Email'
                    }
                  </button>
                </div>
              )}

              {success && !needsVerification && (
                <div className="text-lime text-sm font-mono bg-lime/10 border border-lime/20 px-4 py-2 rounded">
                  {success}
                </div>
              )}

              {error && (
                <div className="text-error text-sm font-mono bg-error/10 border border-error/20 px-4 py-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-lime text-black border-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-elevation-2 hover:shadow-lime-glow hover:scale-[1.02] active:scale-[0.98] font-mono text-sm uppercase transition-all flex items-center justify-center gap-2"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 backdrop-blur-modern font-mono" style={{ 
                    backgroundColor: 'rgba(9, 9, 11, 0.6)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>OR</span>
                </div>
              </div>

              <button
                onClick={handleGuestMode}
                disabled={loading}
                className="w-full mt-6 px-4 py-3 border-2 hover:bg-text/5 disabled:opacity-50 disabled:cursor-not-allowed font-medium font-mono text-sm uppercase transition-all"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                Continue as Guest
              </button>
              
              <p className="mt-3 text-xs font-mono text-center" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                No email needed! Your data will be saved in this browser session
              </p>
            </div>

            <div className="mt-8 text-center space-y-3">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-mono text-xs hover:text-lime transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                {isSignUp ? (
                  <>Already have an account? <span className="text-lime font-semibold">Sign in</span></>
                ) : (
                  <>Don't have an account? <span className="text-lime font-semibold">Sign up</span></>
                )}
              </button>
              <div>
                <a
                  href="/"
                  className="text-sm font-mono text-xs hover:text-lime transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  ← Back to landing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

