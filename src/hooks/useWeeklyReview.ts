import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logActivity } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface WeeklyReview {
  id: string
  user_id: string
  week_start: string
  week_end: string
  wins: string | null
  challenges: string | null
  avoided: string | null
  next_focus: string | null
  ai_summary: string | null
  ai_focus_points: string[] | null
  created_at: string
  updated_at: string
}

export interface WeeklyReviewFormData {
  wins: string
  challenges: string
  avoided: string
  next_focus: string
}

export function useWeeklyReview(userId: string | undefined, weekStart: string) {
  const queryClient = useQueryClient()

  const { data: review, isLoading } = useQuery({
    queryKey: ['weekly-review', userId, weekStart],
    queryFn: async (): Promise<WeeklyReview | null> => {
      if (!userId) return null

      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!userId && !!weekStart,
  })

  const saveMutation = useMutation({
    mutationFn: async (formData: WeeklyReviewFormData) => {
      if (!userId) throw new Error('User not authenticated')

      const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('weekly_reviews')
        .upsert(
          {
            user_id: userId,
            week_start: weekStart,
            week_end: weekEnd,
            wins: formData.wins || null,
            challenges: formData.challenges || null,
            avoided: formData.avoided || null,
            next_focus: formData.next_focus || null,
          },
          {
            onConflict: 'user_id,week_start',
          }
        )
        .select()
        .single()

      if (error) throw error

      await logActivity(userId, 'weekly_review_saved', `Saved weekly review for week starting ${weekStart}`, new Date(weekStart))
      trackEvent('weekly_review_saved', { week_start: weekStart })

      return data as WeeklyReview
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-review', userId, weekStart] })
    },
  })

  const generateAISummaryMutation = useMutation({
    mutationFn: async (payload: {
      weekStart: string
      weekEnd: string
      stats: any
      reviewText: WeeklyReviewFormData
      goals: any[]
    }) => {
      if (!userId) throw new Error('User not authenticated')

      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) throw new Error('Not authenticated')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-weekly-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          week_start: payload.weekStart,
          week_end: payload.weekEnd,
          stats: payload.stats,
          review_text: payload.reviewText,
          goals: payload.goals,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate AI summary')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate AI summary')
      }

      // Save AI summary to review
      const weekEnd = new Date(new Date(payload.weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('weekly_reviews')
        .upsert(
          {
            user_id: userId,
            week_start: payload.weekStart,
            week_end: weekEnd,
            ai_summary: result.data.summary,
            ai_focus_points: result.data.focus_points,
          },
          {
            onConflict: 'user_id,week_start',
          }
        )
        .select()
        .single()

      if (error) throw error

      trackEvent('weekly_review_ai_generated', { week_start: payload.weekStart })

      return data as WeeklyReview
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-review', userId, weekStart] })
    },
  })

  return {
    review,
    isLoading,
    saveReview: saveMutation.mutate,
    generateAISummary: generateAISummaryMutation.mutate,
    isSaving: saveMutation.isPending,
    isGenerating: generateAISummaryMutation.isPending,
  }
}

