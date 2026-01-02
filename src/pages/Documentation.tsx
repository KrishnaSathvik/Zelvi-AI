import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Documentation() {
  const navigate = useNavigate()

  const handleSignUp = () => {
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight uppercase font-mono" style={{ color: '#ffffff' }}>
          Documentation
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Getting Started</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Quick Start</h3>
              <ol className="font-mono text-xs space-y-2 list-decimal list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Sign up or try guest mode</li>
                <li>Navigate to any section (Jobs, Learning, Projects, etc.)</li>
                <li>Start logging your activities</li>
                <li>Check your dashboard daily for your to-do list</li>
                <li>Review analytics weekly with your AI coach</li>
              </ol>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Guest Mode</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Guest mode lets you try Zelvi AI without creating an account. Your data is stored locally and will be cleared when you close your browser.
              </p>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                To save your data permanently, sign up for an account.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Features Guide</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Jobs Tracker</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track job applications and manage your job search pipeline. Set status for each application.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Add job applications with company name, role, and date</li>
                <li>Update status: Applied, Interview, Offer, Rejected</li>
                <li>View all applications in one dashboard</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Recruiters Network</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Manage your recruiter relationships and networking contacts.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Add recruiter contacts with company and role</li>
                <li>Track interaction history</li>
                <li>Set follow-up dates</li>
                <li>Monitor relationship strength</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Learning Hub</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Organize courses, tutorials, and track your learning progress.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Add courses with platform and completion date</li>
                <li>Track hours spent learning</li>
                <li>Set learning goals</li>
                <li>Monitor skill development</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Projects Manager</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Track personal and professional projects with milestones.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Create projects with name, description, and timeline</li>
                <li>Set milestones and track progress</li>
                <li>Add resources and notes</li>
                <li>Monitor project status</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Content Creator</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Plan, create, and publish content across platforms.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Create content calendar</li>
                <li>Schedule publishing dates</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Goals & Analytics</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Set goals and track progress with real-time analytics.
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Set short-term and long-term goals</li>
                <li>Track progress across all areas</li>
                <li>View analytics dashboard</li>
                <li>Get weekly review insights</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>AI Coach</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Your AI coach analyzes your data and provides personalized recommendations. Access it from the AI Chat section.
            </p>
            <ul className="font-mono text-xs space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Ask questions about your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Get personalized recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Review weekly insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Identify patterns in your activities</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="p-8 border-2 rounded-sm backdrop-blur-modern" style={{ 
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase text-center" style={{ color: '#ffffff' }}>Need More Help?</h2>
          <p className="font-mono text-sm text-center mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Check out our Support page or contact us directly.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/support')}
              className="px-6 py-3 border-2 font-bold transition-all font-mono text-sm uppercase"
              style={{ 
                color: '#ededed',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(9, 9, 11, 0.8)'
              }}
            >
              Visit Support
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

