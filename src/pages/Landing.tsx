import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { trackEvent } from '../lib/analytics'
import Footer from '../components/Footer'

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/app')
    }
  }, [user, navigate])

  const handleSignUp = () => {
    trackEvent('cta_click', { variant: 'hero_signup' })
    navigate('/auth')
  }

  return (
    <div className="min-h-screen theme-text-main transition-theme relative overflow-hidden" style={{ 
      backgroundColor: '#09090b',
      background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)'
    }}>
      <div className="grain" />
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke='%2300d9ff' stroke-width='0.5'/%3E%3C/svg%3E")`,
      }}></div>
      {/* Decorative Blur Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-lime/10 rounded-full blur-3xl pointer-events-none z-0 hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0 hidden lg:block"></div>
      
      {/* Header */}
      <header className="relative z-10 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center border-b-2 theme-border backdrop-blur-modern" style={{ 
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity" style={{ color: '#ededed' }}>
          <img src="/logo.png" alt="Zelvi AI" className="h-6 sm:h-7 md:h-8 w-auto" />
          <div className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold font-mono" style={{ color: '#ededed' }}>Zelvi AI</div>
        </Link>
        <div className="flex gap-1.5 sm:gap-2 md:gap-3">
          <button
            onClick={handleSignUp}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-2 font-bold transition-smooth font-mono text-[10px] sm:text-xs md:text-sm uppercase touch-target whitespace-nowrap"
            style={{ 
              color: '#ededed',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(9, 9, 11, 0.8)'
            }}
          >
            <span className="hidden md:inline">Log in / Sign up</span>
            <span className="md:hidden">Sign up</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight uppercase" style={{ color: '#ffffff' }}>
            Your AI-powered operating system.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-mono text-sm max-w-3xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Zelvi AI turns your jobs, recruiters, learning, projects, content, and goals into one daily command center with analytics and an AI coach.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
            <button
              onClick={handleSignUp}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 font-bold transition-smooth font-mono text-xs sm:text-sm uppercase touch-target"
              style={{ 
                color: '#ededed',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(9, 9, 11, 0.8)'
              }}
            >
              Get started
            </button>
          </div>
        </div>

        {/* Core Features */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center font-mono uppercase" style={{ color: '#ffffff' }}>Core Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Jobs Tracker</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track applications and manage your job search pipeline. Never lose track of opportunities.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Application status tracking</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Recruiters Network</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your recruiter relationships and networking contacts.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Contact management</li>
                <li>• Interaction history</li>
                <li>• Relationship tracking</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Learning Hub</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Organize courses, tutorials, and skill development progress.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Course tracking</li>
                <li>• Progress monitoring</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Projects Manager</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track personal and professional projects with milestones.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Project timelines</li>
                <li>• Milestone tracking</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Content Creator</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Plan, create, and publish content across platforms.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Content calendar</li>
                <li>• Publishing schedule</li>
              </ul>
            </div>
            <div className="p-4 sm:p-6 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation stagger-item backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Goals & Analytics</h3>
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Set goals and track progress with real-time analytics.
              </p>
              <ul className="font-mono text-xs space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <li>• Goal setting & tracking</li>
                <li>• Performance analytics</li>
                <li>• Weekly reviews</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16 sm:mb-20">
          <div className="p-6 sm:p-8 border-2 rounded-sm shadow-card backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 font-mono uppercase text-center" style={{ color: '#ffffff' }}>How it works</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-400 border-2 flex items-center justify-center mx-auto mb-4 shadow-hard font-mono text-2xl font-bold text-black" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>1</div>
                <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Log Everything</h3>
                <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Log your jobs, learning, projects, content, and goals in one place.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-400 border-2 flex items-center justify-center mx-auto mb-4 shadow-hard font-mono text-2xl font-bold text-black" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>2</div>
                <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Daily Dashboard</h3>
                <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Your daily dashboard builds a rolling to-do list from all your activities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-400 border-2 flex items-center justify-center mx-auto mb-4 shadow-hard font-mono text-2xl font-bold text-black" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>3</div>
                <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>AI Insights</h3>
                <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Analytics + AI coach help you review and adjust weekly for better outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Coach Section */}
        <section className="mb-16 sm:mb-20">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="animate-slide-in-up">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>AI Coach</h2>
              <p className="font-mono text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Your personal AI coach that knows your data and provides personalized guidance based on your actual progress.
              </p>
              <ul className="font-mono text-xs space-y-2 mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Personalized recommendations based on your goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Weekly review insights and suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Real-time chat support for questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Pattern recognition in your activities</span>
                </li>
              </ul>
            </div>
            <div className="p-6 sm:p-8 border-2 rounded-sm shadow-card hover:shadow-card-hover transition-elevation animate-slide-in-up backdrop-blur-modern" style={{ 
              animationDelay: '0.1s',
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Analytics Dashboard</h3>
              <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Get real insights from your actual data. Track progress across all areas of your professional life.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span>Job Applications</span>
                  <span className="font-bold" style={{ color: '#ffffff' }}>24</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span>Learning Hours</span>
                  <span className="font-bold" style={{ color: '#ffffff' }}>120h</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span>Active Projects</span>
                  <span className="font-bold" style={{ color: '#ffffff' }}>8</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span>Goals Completed</span>
                  <span className="font-bold" style={{ color: '#ffffff' }}>12/15</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

