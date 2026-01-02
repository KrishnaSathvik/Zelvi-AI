import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { trackEvent } from '../../lib/analytics'

export default function GuestUpgrade() {
  const { user } = useAuth()
  const { upgradeGuest, isUpgrading } = useUserProfile()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!user?.is_anonymous) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    trackEvent('upgrade_guest_start')
    try {
      await upgradeGuest({ email, password })
      trackEvent('upgrade_guest_success')
      setSuccess(true)
      // The upgrade function should handle signing in the new user
      // Reload the page to refresh auth state
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade account')
    }
  }

  return (
    <div className="border-2 p-6 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <h2 className="text-xl font-semibold mb-2 font-mono uppercase theme-text-main">You're in Guest Mode</h2>
      <p className="font-mono text-xs mb-4 theme-text-main">
        Upgrade to a full account to keep your data safe and access it from any device. Your current data will be
        migrated automatically.
      </p>

      {success ? (
        <div className="border-2 p-4 font-mono text-sm rounded-sm backdrop-blur-modern theme-bg-form theme-border theme-text-main">
          Account upgraded successfully! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="border-2 border-red-600 p-3 text-red-600 font-mono text-xs rounded-sm backdrop-blur-modern theme-bg-form">{error}</div>
          )}

          <button
            type="submit"
            disabled={isUpgrading}
            className="w-full px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
          >
            {isUpgrading ? 'Upgrading...' : 'Upgrade and migrate data'}
          </button>
        </form>
      )}
    </div>
  )
}

