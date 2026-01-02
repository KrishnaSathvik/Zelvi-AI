import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Comparison() {
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/auth')
  }

  const comparisons = [
    {
      category: 'Job Tracking',
      zelvi: 'Built-in job application tracker with status, interviews, and follow-ups',
      competitors: {
        'LinkedIn': 'Basic job search, no application tracking',
        'Indeed': 'Job search only, no tracking system',
        'Spreadsheets': 'Manual tracking, no automation',
      }
    },
    {
      category: 'Recruiter Management',
      zelvi: 'Dedicated recruiter network tracker with interaction history',
      competitors: {
        'LinkedIn': 'Basic contact management, no relationship tracking',
        'CRM Tools': 'Overkill for job search, expensive',
        'Spreadsheets': 'Manual entry, no insights',
      }
    },
    {
      category: 'Learning & Skills',
      zelvi: 'Integrated learning hub with course tracking and progress monitoring',
      competitors: {
        'Coursera/Udemy': 'Course platform only, no career integration',
        'Notion': 'Manual tracking, no automation',
        'Spreadsheets': 'No progress insights',
      }
    },
    {
      category: 'Project Management',
      zelvi: 'Project tracker with milestones, integrated with career goals',
      competitors: {
        'Trello/Asana': 'Project-focused, not career-integrated',
        'Notion': 'Manual setup, no career context',
        'Spreadsheets': 'No project insights',
      }
    },
    {
      category: 'Content Creation',
      zelvi: 'Content calendar and publishing schedule',
      competitors: {
        'Buffer/Hootsuite': 'Social media only, no career context',
        'Notion': 'Manual calendar, no insights',
        'Spreadsheets': 'No automation',
      }
    },
    {
      category: 'Goals & Analytics',
      zelvi: 'AI-powered analytics with weekly reviews and personalized insights',
      competitors: {
        'Notion': 'Manual dashboards, no AI insights',
        'Spreadsheets': 'No analytics or AI',
        'Other Tools': 'Fragmented data, no unified view',
      }
    },
    {
      category: 'AI Coach',
      zelvi: 'Personalized AI coach that knows your data and provides actionable advice',
      competitors: {
        'ChatGPT': 'Generic advice, no context about your progress',
        'Other Tools': 'No AI coach feature',
        'Spreadsheets': 'No AI assistance',
      }
    },
    {
      category: 'Unified Dashboard',
      zelvi: 'One daily command center showing all your activities and priorities',
      competitors: {
        'Multiple Tools': 'Switch between 5-10 different apps',
        'Notion': 'Requires manual setup, no automation',
        'Spreadsheets': 'No unified view',
      }
    },
  ]

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
      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight uppercase font-mono" style={{ color: '#ffffff' }}>
            Zelvi AI vs. Other Tools
          </h1>
          <p className="font-mono text-sm text-xl max-w-3xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            See how Zelvi AI compares to the fragmented tools you're probably using today.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <th className="text-left p-4 font-mono text-xs uppercase font-semibold" style={{ color: '#ffffff' }}>Feature</th>
                <th className="text-left p-4 font-mono text-xs uppercase font-semibold bg-cyan-400/20" style={{ color: '#ffffff' }}>Zelvi AI</th>
                <th className="text-left p-4 font-mono text-xs uppercase font-semibold" style={{ color: '#ffffff' }}>Other Tools</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr key={index} className="border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <td className="p-4 font-mono text-xs font-semibold uppercase align-top" style={{ color: '#ffffff' }}>
                    {item.category}
                  </td>
                  <td className="p-4 font-mono text-xs bg-cyan-400/10 align-top" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {item.zelvi}
                  </td>
                  <td className="p-4 font-mono text-xs align-top" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <ul className="space-y-2">
                      {Object.entries(item.competitors).map(([tool, description]) => (
                        <li key={tool}>
                          <span className="font-semibold">{tool}:</span> {description}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Advantages */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center font-mono uppercase" style={{ color: '#ffffff' }}>Why Choose Zelvi AI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>One Platform, Not Ten</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Stop switching between LinkedIn, job boards, learning platforms, project managers, 
                and spreadsheets. Everything you need is in one place.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>AI That Actually Helps</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Unlike generic AI assistants, our AI coach knows your actual progress and provides 
                personalized recommendations based on your data.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Real Analytics</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Get insights from your actual data—not vanity metrics. See where you're making 
                progress and where you need to focus.
              </p>
            </div>
            <div className="p-6 border-2 rounded-sm backdrop-blur-modern" style={{ 
              backgroundColor: 'rgba(9, 9, 11, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-semibold mb-3 font-mono uppercase" style={{ color: '#ffffff' }}>Easy to Start</h3>
              <p className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Try guest mode to get started immediately. 
                Start organizing your career journey today.
              </p>
            </div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="mb-12 p-8 border-2 rounded-sm backdrop-blur-modern" style={{ 
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-semibold mb-6 font-mono uppercase text-center" style={{ color: '#ffffff' }}>Cost Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Using Multiple Tools</h3>
              <p className="font-mono text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>$50-100+/mo</p>
              <ul className="font-mono text-xs space-y-1 text-left" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>• LinkedIn Premium: $30/mo</li>
                <li>• Project Management: $10-20/mo</li>
                <li>• Learning Platform: $10-30/mo</li>
                <li>• Content Tools: $10-20/mo</li>
                <li>• Plus your time switching between tools</li>
              </ul>
            </div>
            <div className="text-center border-2 p-4" style={{ borderColor: 'rgba(0, 217, 255, 0.5)' }}>
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Zelvi AI</h3>
              <p className="font-mono text-2xl font-bold mb-2 text-cyan-400">All-in-One</p>
              <ul className="font-mono text-xs space-y-1 text-left" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>• All features included</li>
                <li>• Guest mode available</li>
                <li>• One unified platform</li>
                <li>• AI coach included</li>
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 font-mono uppercase" style={{ color: '#ffffff' }}>Time Saved</h3>
              <p className="font-mono text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>5-10 hrs/week</p>
              <ul className="font-mono text-xs space-y-1 text-left" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <li>• No tool switching</li>
                <li>• Automated tracking</li>
                <li>• AI-powered insights</li>
                <li>• Unified dashboard</li>
                <li>• Focus on what matters</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 border-2 rounded-sm backdrop-blur-modern text-center" style={{ 
          backgroundColor: 'rgba(9, 9, 11, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-semibold mb-4 font-mono uppercase" style={{ color: '#ffffff' }}>Ready to Consolidate Your Tools?</h2>
          <p className="font-mono text-sm mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Stop juggling multiple apps. Start with Zelvi AI today.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-4 border-2 font-bold transition-all font-mono text-sm uppercase"
              style={{ 
                color: '#ededed',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(9, 9, 11, 0.8)'
              }}
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

