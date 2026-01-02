import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { useTheme } from '../contexts/ThemeContext'
import Icon from './ui/Icon'
import type { IconName } from './ui/Icon'
import ThemeSwitcher from './ui/ThemeSwitcher'

interface NavItem {
  path: string
  label: string
  icon: IconName
  group?: string
}

const navItems: NavItem[] = [
  { path: '/app', label: 'Dashboard', icon: 'nav-dashboard', group: 'main' },
  { path: '/app/jobs', label: 'Jobs', icon: 'comm-email', group: 'work' },
  { path: '/app/recruiters', label: 'Recruiters', icon: 'nav-team', group: 'work' },
  { path: '/app/projects', label: 'Projects', icon: 'nav-projects', group: 'work' },
  { path: '/app/content', label: 'Content', icon: 'cont-doc', group: 'work' },
  { path: '/app/learning', label: 'Learning', icon: 'cont-code', group: 'growth' },
  { path: '/app/goals', label: 'Goals', icon: 'nav-tasks', group: 'growth' },
  { path: '/app/analytics', label: 'Analytics', icon: 'nav-reports', group: 'insights' },
  { path: '/app/review', label: 'Review', icon: 'stat-info', group: 'insights' },
  { path: '/app/calendar', label: 'Calendar', icon: 'nav-calendar', group: 'tools' },
  { path: '/app/notes', label: 'AI & Notes', icon: 'comm-chat', group: 'tools' },
  { path: '/app/profile', label: 'Profile', icon: 'nav-settings', group: 'settings' },
]

export default function AppLayout() {
  const { user, loading, signOut } = useAuth()
  const { profile } = useUserProfile()
  const { effectiveTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Add robots noindex meta tag for all /app routes
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

  // Redirect to home if user is not authenticated (useEffect to avoid render warning)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-page flex items-center justify-center">
        <div className="font-mono text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen theme-text-main flex transition-theme relative theme-bg-page">
      <div className="grain" />
      {/* Background Pattern Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke='%2300d9ff' stroke-width='0.5'/%3E%3C/svg%3E")`,
      }}></div>
      {/* Decorative Blur Elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-lime/10 rounded-full blur-3xl pointer-events-none z-0 hidden lg:block"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0 hidden lg:block"></div>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 border-b-2 theme-border z-40 flex items-center justify-between px-3 sm:px-4 h-14 sm:h-16 shadow-elevation-2 backdrop-blur-modern theme-bg-card">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/logo.png" alt="Zelvi AI" className="h-5 sm:h-6 w-auto" />
          <div className="text-sm sm:text-base md:text-lg font-bold font-mono text-cyan-400">Zelvi AI</div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 sm:p-2 hover:bg-cyan-400/20 hover:text-cyan-400 transition-smooth border-2 theme-border rounded-sm hover:border-cyan-400/50 hover:shadow-elevation-1 touch-target theme-text-main"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <Icon name="sys-close" size={20} className="sm:w-6 sm:h-6 transition-transform duration-300 rotate-90 theme-text-main" />
          ) : (
            <Icon name="sys-menu" size={20} className="sm:w-6 sm:h-6 transition-transform duration-300 theme-text-main" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 border-r-2 theme-border flex flex-col transform transition-transform duration-300 ease-out shadow-elevation-2 lg:shadow-none backdrop-blur-modern theme-bg-card ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b-2 theme-border bg-gradient-to-br from-cyan-400/10 via-transparent to-cyan-400/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Zelvi AI" className="h-10 w-10 rounded-lg object-contain" />
            <div>
              <div className="text-xl font-bold font-mono text-cyan-400 tracking-tight">Zelvi AI</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Command Center</div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-6 py-4 border-b-2 theme-border theme-bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/30 to-cyan-400/30 flex items-center justify-center border-2 border-cyan-400/30">
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono font-semibold truncate theme-text-main">
                  {profile?.name || user.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                  {user.email || ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {['main', 'work', 'growth', 'insights', 'tools', 'settings'].map((group) => {
              const groupItems = navItems.filter((item) => item.group === group)
              if (groupItems.length === 0) return null

              return (
                <div key={group} className="space-y-1.5">
                  {group !== 'main' && (
                    <div className="px-3 py-1.5 mb-1">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        {group}
                      </span>
                    </div>
                  )}
                  {groupItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left px-3 py-2.5 transition-all duration-200 min-h-[40px] flex items-center gap-3 font-mono text-sm rounded-lg relative group touch-target ${
                          isActive
                            ? 'font-semibold shadow-lime-glow'
                            : 'hover:bg-[var(--text-main)]/8 hover:text-cyan-400 active:bg-[var(--text-main)]/12'
                        }`}
                        style={isActive 
                          ? { 
                              background: 'linear-gradient(135deg, #00d9ff 0%, #00b8d9 100%)',
                              color: effectiveTheme === 'dark' ? '#000000' : '#000000'
                            } 
                          : { color: 'var(--text-main)' }
                        }
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-lime-glow" />
                        )}
                        <Icon
                          name={item.icon}
                          size={18}
                          className={`flex-shrink-0 transition-colors ${
                            isActive ? 'text-black' : 'group-hover:text-cyan-400'
                          }`}
                          style={!isActive ? { color: 'var(--text-main)' } : { color: '#000000' }}
                        />
                        <span className="flex-1 relative z-10 theme-text-main" style={isActive ? { color: '#000000' } : undefined}>{item.label}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-black/60 animate-pulse" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Theme Switcher & Logout */}
          <div className="p-4 border-t-2 theme-border theme-bg-card space-y-2">
            <ThemeSwitcher />
            <button
              onClick={() => {
                signOut()
                navigate('/')
                setMobileMenuOpen(false)
              }}
              className="w-full text-left px-3 py-2.5 transition-all duration-200 min-h-[40px] flex items-center gap-3 font-mono text-sm rounded-lg hover:bg-red-500/10 hover:text-red-400 active:bg-red-500/15 touch-target theme-text-main"
            >
              <Icon name="act-cancel" size={18} className="flex-shrink-0 group-hover:text-red-400 theme-text-main" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0 pb-8 lg:pb-12 relative z-10">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

