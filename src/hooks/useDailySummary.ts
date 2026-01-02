import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface DailySummary {
  jobsToday: number
  recruitersToday: number
  learningSessionsToday: number
  contentDue: number
  contentPublished: number
  contentTotal: number
  tasksDone: number
  tasksTotal: number
  goalsSnapshot: string // e.g., "Q1 Jobs: 34/150"
}

export function useDailySummary(userId: string | undefined, date: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-summary', userId, date],
    queryFn: async (): Promise<DailySummary> => {
      if (!userId) {
        return {
          jobsToday: 0,
          recruitersToday: 0,
          learningSessionsToday: 0,
          contentDue: 0,
          contentPublished: 0,
          contentTotal: 0,
          tasksDone: 0,
          tasksTotal: 0,
          goalsSnapshot: '',
        }
      }

      // Jobs today
      const { count: jobsToday } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('applied_date', date)

      // Recruiters today
      const { count: recruitersToday } = await supabase
        .from('recruiters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('last_contact_date', date)

      // Learning sessions today
      const { count: learningSessionsToday } = await supabase
        .from('learning_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('date', date)

      // Content due/published
      const { data: contentPosts } = await supabase
        .from('content_posts')
        .select('status, date')
        .eq('user_id', userId)
        .lte('date', date)

      const contentDue = contentPosts?.filter((c) => c.status !== 'published' && c.date <= date).length || 0
      const contentPublished = contentPosts?.filter((c) => c.status === 'published' && c.date === date).length || 0
      const contentTotal = contentPosts?.length || 0

      // Tasks
      const { data: taskStatuses } = await supabase
        .from('daily_task_status')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', date)

      const tasksDone = taskStatuses?.length || 0

      // Get total tasks (we'll compute this from useDailyTasks, but for now approximate)
      // In a real implementation, you might want to combine this with useDailyTasks
      const tasksTotal = tasksDone // Simplified for now

      // Goals snapshot - get first goal
      const { data: activeGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      let goalsSnapshot = ''
      if (activeGoals && activeGoals.length > 0) {
        const goal = activeGoals[0]
        // Simplified goals - just show goal title
        goalsSnapshot = goal.title
      }

      return {
        jobsToday: jobsToday || 0,
        recruitersToday: recruitersToday || 0,
        learningSessionsToday: learningSessionsToday || 0,
        contentDue,
        contentPublished,
        contentTotal,
        tasksDone,
        tasksTotal,
        goalsSnapshot,
      }
    },
    enabled: !!userId,
  })

  return {
    summary: data || {
      jobsToday: 0,
      recruitersToday: 0,
      learningSessionsToday: 0,
      contentDue: 0,
      contentPublished: 0,
      contentTotal: 0,
      tasksDone: 0,
      tasksTotal: 0,
      goalsSnapshot: '',
    },
    isLoading,
    error,
  }
}

