import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <div className="font-mono text-xs mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Agreement to Terms</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            By accessing or using Zelvi AI, you agree to be bound by these Terms of Service. If you 
            disagree with any part of these terms, you may not access or use our service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Use of Service</h2>
          <div className="space-y-4">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Eligibility</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                You must be at least 13 years old to use Zelvi AI. By using the service, you represent 
                that you meet this age requirement.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Account Responsibility</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                You are responsible for maintaining the confidentiality of your account credentials. 
                You are responsible for all activities that occur under your account.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Acceptable Use</h3>
              <p className="font-mono text-xs mb-2">
                You agree not to:
              </p>
              <ul className="font-mono text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Share your account with others</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Service Availability</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            We strive to provide reliable service but do not guarantee uninterrupted access. The service 
            may be unavailable due to maintenance, updates, or circumstances beyond our control. We 
            are not liable for any loss or damage resulting from service unavailability.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>User Content</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              You retain ownership of all data and content you upload to Zelvi AI. By using the service, 
              you grant us a license to store, process, and display your content solely for the purpose 
              of providing the service.
            </p>
            <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              You are responsible for ensuring you have the right to upload any content you provide. 
              You agree not to upload content that violates any laws or infringes on others' rights.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Intellectual Property</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Zelvi AI, including its design, features, and functionality, is owned by us and protected by 
            intellectual property laws. You may not copy, modify, or create derivative works of the 
            service without our written permission.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Limitation of Liability</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            To the maximum extent permitted by law, Zelvi AI is provided "as is" without warranties of 
            any kind. We are not liable for any indirect, incidental, or consequential damages arising 
            from your use of the service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Termination</h2>
          <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
            backgroundColor: 'rgba(9, 9, 11, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}>
            <p className="font-mono text-xs mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              You may delete your account at any time from your profile settings. We reserve the right 
              to suspend or terminate accounts that violate these terms or engage in harmful activities.
            </p>
            <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Upon termination, you may export your data. We will delete your account and data within 
              30 days of termination, unless required to retain it by law.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Changes to Terms</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            We may update these Terms of Service from time to time. We'll notify you of significant 
            changes via email or through the platform. Continued use of Zelvi AI after changes 
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Governing Law</h2>
          <p className="font-mono text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            These terms are governed by and construed in accordance with applicable laws. Any disputes 
            will be resolved through binding arbitration or in the appropriate courts.
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
              If you have questions about these Terms of Service, please contact us through the platform.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

