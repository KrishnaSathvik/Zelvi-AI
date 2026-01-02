import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface TimelineEntry {
  id: string
  occurred_at: string
  description: string
  event_type: string
}

export function useTodayTimeline(userId: string | undefined, date: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['timeline', userId, date],
    queryFn: async (): Promise<TimelineEntry[]> => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .eq('event_date', date)
        .order('occurred_at', { ascending: false })

      if (error) throw error
      return (data || []) as TimelineEntry[]
    },
    enabled: !!userId,
  })

  return {
    timeline: data || [],
    isLoading,
    error,
  }
}

