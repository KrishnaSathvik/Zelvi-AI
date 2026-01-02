import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useUserProfile } from '../../hooks/useUserProfile'

export default function ProfileInfo() {
  const { user } = useAuth()
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile()
  const [name, setName] = useState(profile?.name || '')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    }
  }, [profile?.name])

  if (isLoading) {
    return <div className="font-mono text-sm theme-text-main">Loading profile...</div>
  }

  const handleSave = () => {
    if (name.trim()) {
      updateProfile(name.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setName(profile?.name || '')
    setIsEditing(false)
  }

  return (
    <div className="border-2 p-6 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <h2 className="text-xl font-semibold mb-4 font-mono uppercase theme-text-main">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Email</label>
          <div className="font-mono text-sm theme-text-main">
            {user?.email || (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border-2 font-mono theme-bg-card theme-border theme-text-main">
                Guest session
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Name</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border-2 px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
                placeholder="Enter your name"
              />
              <button
                onClick={handleSave}
                disabled={isUpdating || !name.trim()}
                className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="border-2 font-bold transition-smooth font-mono text-xs uppercase py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm theme-text-main">{profile?.name || 'Not set'}</div>
              <button
                onClick={() => {
                  setName(profile?.name || '')
                  setIsEditing(true)
                }}
                className="border-2 font-bold transition-smooth font-mono text-xs uppercase py-1.5 px-3 theme-text-main theme-border theme-bg-card"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>Account Created</label>
          <div className="font-mono text-sm theme-text-main">
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>

      </div>
    </div>
  )
}

