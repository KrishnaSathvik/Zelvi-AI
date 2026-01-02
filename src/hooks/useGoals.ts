import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logActivity } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface Goal {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface GoalFormData {
  title: string
}

export function useGoals(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals', userId],
    queryFn: async (): Promise<Goal[]> => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  const createMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      if (!userId) throw new Error('User not authenticated')

      const { data: goal, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          ...data,
        })
        .select()
        .single()

      if (error) throw error

      await logActivity(userId, 'goal_created', `Created goal: ${data.title}`, new Date())
      trackEvent('goal_created', { title: data.title })

      return goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GoalFormData> }) => {
      if (!userId) throw new Error('User not authenticated')

      const { data: goal, error } = await supabase
        .from('goals')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      trackEvent('goal_updated', { title: goal.title })

      return goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  return {
    goals: goals || [],
    isLoading,
    createGoal: createMutation.mutate,
    updateGoal: updateMutation.mutate,
    deleteGoal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

