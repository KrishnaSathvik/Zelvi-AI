import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function About() {
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
          About Zelvi AI
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Our Mission</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Zelvi AI was built to solve a fundamental problem: professionals juggle too many tools, 
            spreadsheets, and apps to manage their careers. We believe your career journey should 
            be unified, intelligent, and actionable—not fragmented across dozens of disconnected tools.
          </p>
          <p className="font-mono text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Our mission is to provide one command center where you can track everything that matters: 
            job applications, recruiter relationships, learning progress, projects, content creation, 
            and personal goals—all with AI-powered insights to help you make better decisions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>What Makes Us Different</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>All-in-One Platform</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Instead of switching between job boards, learning platforms, project managers, and 
                goal trackers, everything lives in one place. Your daily dashboard shows you exactly 
                what needs attention today.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>AI That Knows Your Data</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Our AI coach doesn't give generic advice. It analyzes your actual progress, identifies 
                patterns, and provides personalized recommendations based on your unique situation and goals.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Truthful Analytics</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                No vanity metrics. We show you real insights from your data—how many applications 
                you've actually sent, how much time you've spent learning, which projects are moving 
                forward, and where you're falling behind.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Privacy First</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Your data is yours. We don't sell it, share it, or use it for training other models. 
                Everything is encrypted, and you can export or delete your data at any time.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>How It Started</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Zelvi AI was born from frustration. As professionals navigating career transitions, 
            we found ourselves drowning in spreadsheets, sticky notes, and half-forgotten to-do lists. 
            Job applications got lost. Learning goals were forgotten. Projects stalled without visibility.
          </p>
          <p className="font-mono text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            We built Zelvi AI to be the operating system we wish we had—a place where everything 
            important lives, where AI helps you stay on track, and where analytics tell you the truth 
            about your progress. No fluff, no hype, just a tool that actually helps you move forward.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Built for Modern Professionals</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            The world of work is changing. Remote work, career pivots, continuous learning, and 
            side projects are the new normal. Traditional tools weren't built for this reality.
          </p>
          <p className="font-mono text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Zelvi AI is designed for professionals who want to take control of their career journey. 
            Whether you're job searching, upskilling, building projects, or 
            creating content, we give you the visibility and intelligence to make better decisions.
          </p>
        </section>

        <section className="p-8 border-2 rounded-sm backdrop-blur-modern" style={{ 
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase text-center" style={{ color: '#ffffff' }}>Ready to Get Started?</h2>
          <p className="font-mono text-sm text-center mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Join professionals who are taking control of their career journey with Zelvi AI.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 border-2 font-bold transition-all font-mono text-sm uppercase"
              style={{ 
                color: '#ededed',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(9, 9, 11, 0.8)'
              }}
            >
              Sign Up
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

