import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface UserProfile {
  id: string
  user_id: string
  name: string | null
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  const { user, session } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null

      // Try to get profile, create if doesn't exist
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            name: user.email?.split('@')[0] || 'User',
          })
          .select()
          .single()

        if (createError) throw createError
        return newProfile
      }

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const updateMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ name })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] })
    },
  })

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      if (!session?.access_token) throw new Error('Not authenticated')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to export data')
      }

      const { data } = await response.json()
      return data.export
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: async (confirm: string) => {
      if (!session?.access_token) throw new Error('Not authenticated')
      if (confirm !== 'DELETE') throw new Error('Confirmation required')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }

      return await response.json()
    },
  })

  const upgradeGuestMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!session?.access_token) throw new Error('Not authenticated')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upgrade-guest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upgrade account')
      }

      const { data } = await response.json()
      return data
    },
  })

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    exportData: exportDataMutation.mutateAsync,
    isExporting: exportDataMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeleting: deleteAccountMutation.isPending,
    upgradeGuest: upgradeGuestMutation.mutateAsync,
    isUpgrading: upgradeGuestMutation.isPending,
    isGuest: user?.is_anonymous || false,
  }
}

