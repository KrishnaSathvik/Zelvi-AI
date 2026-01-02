import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative border-t-2 theme-border py-8 sm:py-12 px-4 sm:px-6 bg-gradient-overlay" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Zelvi AI" className="h-8 sm:h-10 w-auto" />
              <div className="text-xl font-semibold font-mono" style={{ color: '#ffffff' }}>Zelvi AI</div>
            </div>
            <p className="font-mono text-xs max-w-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Your AI-powered operating system. Built for your career reset.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase mb-4 font-semibold" style={{ color: '#ffffff' }}>Pages</h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link 
                  to="/about" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/comparison" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-mono text-xs uppercase mb-4 font-semibold" style={{ color: '#ffffff' }}>Resources</h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link 
                  to="/documentation" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Support
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="hover:text-cyan-400 transition-colors inline-block"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 theme-border pt-6" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p className="font-mono text-xs text-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} Zelvi AI. Built for your career reset. Guest mode available.
          </p>
        </div>
      </div>
    </footer>
  )
}

