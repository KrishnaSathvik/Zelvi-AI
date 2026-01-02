import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Support() {
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
          Support
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>How do I get started?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                You can start immediately with guest mode (no signup required) or create an account. 
                Navigate to any section and start logging your activities. Your dashboard will automatically 
                show your daily to-do list.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Is my data secure?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Yes. All data is encrypted and stored securely. We don't sell or share your data. 
                You can export or delete your data at any time from your profile settings.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>What happens in guest mode?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Guest mode stores your data locally in your browser. It's perfect for trying out Zelvi AI, 
                but your data will be cleared when you close your browser. To save your data permanently, 
                sign up for an account.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>How does the AI coach work?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                The AI coach analyzes your actual data—jobs, learning, projects, goals—and provides 
                personalized recommendations. Access it from the AI Chat section to ask questions and 
                get insights about your progress.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Can I export my data?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Yes. You can export all your data in JSON format from your profile settings. Your data 
                is yours, and you can take it with you at any time.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>What features are available?</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                All features are available to all users. You can track jobs, recruiters, learning, 
                projects, content, and goals with full access to analytics and the AI coach.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Common Issues</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Data not saving in guest mode</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Guest mode stores data locally. Make sure you haven't cleared your browser cache or 
                are using incognito/private mode. For permanent storage, sign up for an account.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Can't access AI coach</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Make sure you have some data logged in at least one section (jobs, learning, projects, etc.). 
                The AI coach needs data to provide insights.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Analytics not showing</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Analytics are generated from your logged activities. Make sure you've added data to the 
                relevant sections. Analytics update in real-time as you add more data.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Contact Us</h2>
          <div className="p-8 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Need help that's not covered here? Check our documentation or reach out through the platform.
            </p>
          </div>
        </section>

        <section className="p-8 border-2 rounded-sm backdrop-blur-modern" style={{ 
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase text-center" style={{ color: '#ffffff' }}>Resources</h2>
          <p className="font-mono text-sm text-center mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Check out our documentation for detailed guides and tutorials.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/documentation')}
              className="px-6 py-3 border-2 font-bold transition-all font-mono text-sm uppercase"
              style={{ 
                color: '#ededed',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(9, 9, 11, 0.8)'
              }}
            >
              View Documentation
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

