import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logLearningCreated } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface LearningLog {
  id: string
  user_id: string
  date: string
  category: 'de' | 'ai_ml' | 'genai' | 'rag' | 'system_design' | 'interview' | 'other'
  topic: string
  minutes: number | null
  resource?: string
  takeaways?: string
  created_at: string
  updated_at: string
}

export interface LearningFormData {
  date: string
  category: LearningLog['category']
  topic: string
  minutes?: number | null
  resource?: string
  takeaways?: string
}

export function useLearning(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['learning', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('learning_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as LearningLog[]
    },
    enabled: !!userId,
  })

  const createMutation = useMutation({
    mutationFn: async (formData: LearningFormData) => {
      if (!userId) throw new Error('User not authenticated')
      const { data, error } = await supabase
        .from('learning_logs')
        .insert({
          user_id: userId,
          ...formData,
        })
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logLearningCreated(userId, {
        topic: formData.topic,
        minutes: formData.minutes || 0,
        category: formData.category,
        date: formData.date,
      })

      // Track GA4 event
      trackEvent('learning_session_created', {
        category: formData.category,
        minutes: formData.minutes || 0,
      })

      return data as LearningLog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: LearningFormData }) => {
      if (!userId) throw new Error('User not authenticated')
      const { data, error } = await supabase
        .from('learning_logs')
        .update(formData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data as LearningLog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')
      const { error } = await supabase
        .from('learning_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  return {
    learningLogs: data || [],
    isLoading,
    error,
    createLearningLog: createMutation.mutate,
    updateLearningLog: updateMutation.mutate,
    deleteLearningLog: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

