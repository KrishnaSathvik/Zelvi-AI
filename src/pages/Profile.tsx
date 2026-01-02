import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileInfo from '../components/profile/ProfileInfo'
import GuestUpgrade from '../components/profile/GuestUpgrade'
import DataControls from '../components/profile/DataControls'
import { trackEvent } from '../lib/analytics'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'

export default function Profile() {
  const { user } = useAuth()

  useEffect(() => {
    trackEvent('profile_view')
  }, [])

  if (!user) {
    return null
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Profile"
          description="Manage your account settings and preferences"
        />

        <div className="space-y-8">
          <ProfileInfo />
          <GuestUpgrade />
          <DataControls />
        </div>
      </div>
    </PageTransition>
  )
}

