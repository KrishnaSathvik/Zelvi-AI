import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="font-mono text-xs mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Your Privacy Matters</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            At Zelvi AI, we believe your data belongs to you. This privacy policy explains how we collect, 
            use, and protect your information when you use our service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Information We Collect</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Data You Provide</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                We collect information you directly provide when using Zelvi AI:
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Account information (email, password)</li>
                <li>Job applications, recruiter contacts, learning progress</li>
                <li>Projects, content, goals, and notes</li>
                <li>Any other data you choose to log in the platform</li>
              </ul>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Usage Data</h3>
              <p className="font-mono text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                We collect minimal usage data to improve our service:
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Page views and feature usage (anonymized)</li>
                <li>Error logs for debugging</li>
                <li>Browser type and device information</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>How We Use Your Data</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <ul className="font-mono text-xs space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>To provide and improve our service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>To power your AI coach with personalized insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>To generate analytics and reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>To send important service updates (account-related only)</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>What We Don't Do</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <ul className="font-mono text-xs space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>We don't sell your data to third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>We don't use your data to train other AI models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>We don't share your data with advertisers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>We don't track you across other websites</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Data Security</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            We use industry-standard encryption to protect your data in transit and at rest. All data 
            is stored securely and access is restricted to authorized personnel only.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Your Rights</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              You have full control over your data:
            </p>
            <ul className="font-mono text-xs space-y-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Export your data at any time (JSON format)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Delete your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Access and update your information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>Opt out of non-essential communications</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Guest Mode</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            When using guest mode, your data is stored locally in your browser. It's not sent to our 
            servers and will be cleared when you close your browser. For permanent storage, sign up 
            for an account.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Changes to This Policy</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            We may update this privacy policy from time to time. We'll notify you of any significant 
            changes via email or through the platform. Continued use of Zelvi AI after changes 
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Contact Us</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              If you have questions about this privacy policy or how we handle your data, please contact us through the platform.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

