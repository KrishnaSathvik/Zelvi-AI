import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logRecruiterContacted } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface Recruiter {
  id: string
  user_id: string
  name: string
  company?: string
  platform: 'LinkedIn' | 'Email' | 'WhatsApp' | 'Other'
  role?: string
  status: 'messaged' | 'replied' | 'call' | 'submitted' | 'ghosted'
  last_contact_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RecruiterFormData {
  name: string
  company?: string
  platform: Recruiter['platform']
  role?: string
  status: Recruiter['status']
  last_contact_date: string
  notes?: string
}

export interface RecruiterFilters {
  status?: Recruiter['status']
  platform?: Recruiter['platform']
}

export function useRecruiters(userId: string | undefined, filters?: RecruiterFilters) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['recruiters', userId, filters],
    queryFn: async () => {
      if (!userId) return []
      let query = supabase
        .from('recruiters')
        .select('*')
        .eq('user_id', userId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.platform) {
        query = query.eq('platform', filters.platform)
      }

      const { data, error } = await query
        .order('last_contact_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Recruiter[]
    },
    enabled: !!userId,
  })

  const createMutation = useMutation({
    mutationFn: async (formData: RecruiterFormData) => {
      if (!userId) throw new Error('User not authenticated')
      const { data, error } = await supabase
        .from('recruiters')
        .insert({
          user_id: userId,
          ...formData,
        })
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logRecruiterContacted(userId, {
        name: formData.name,
        platform: formData.platform,
        role: formData.role,
        last_contact_date: formData.last_contact_date,
      })

      // Track GA4 event
      trackEvent('recruiter_created', {
        platform: formData.platform,
        status: formData.status,
      })

      return data as Recruiter
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: RecruiterFormData }) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Check if status changed
      const { data: oldRecruiter } = await supabase
        .from('recruiters')
        .select('status')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      const { data, error } = await supabase
        .from('recruiters')
        .update(formData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log activity if status changed or contact date updated
      if (
        (oldRecruiter && oldRecruiter.status !== formData.status) ||
        formData.last_contact_date
      ) {
        await logRecruiterContacted(userId, {
          name: formData.name,
          platform: formData.platform,
          role: formData.role,
          last_contact_date: formData.last_contact_date,
        })

        if (oldRecruiter && oldRecruiter.status !== formData.status) {
          trackEvent('recruiter_status_updated', {
            old_status: oldRecruiter.status,
            new_status: formData.status,
          })
        }
      }

      return data as Recruiter
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')
      const { error } = await supabase
        .from('recruiters')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  return {
    recruiters: data || [],
    isLoading,
    error,
    createRecruiter: createMutation.mutate,
    updateRecruiter: updateMutation.mutate,
    deleteRecruiter: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

