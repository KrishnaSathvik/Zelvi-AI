import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface WeeklyStats {
  jobs: {
    applied: number
    interviews: number
    offers: number
  }
  recruiters: {
    contacts: number
    responseRate: number
  }
  learning: {
    totalMinutes: number
    topCategory: string
  }
  content: {
    published: number
  }
  tasks: {
    created: number
    completed: number
  }
  goals: Array<{
    id: string
    title: string
    current: number
    target: number
  }>
}

export function useWeeklyStats(userId: string | undefined, weekStart: string, weekEnd: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weekly-stats', userId, weekStart, weekEnd],
    queryFn: async (): Promise<WeeklyStats> => {
      if (!userId) {
        return {
          jobs: { applied: 0, interviews: 0, offers: 0 },
          recruiters: { contacts: 0, responseRate: 0 },
          learning: { totalMinutes: 0, topCategory: '' },
          content: { published: 0 },
          tasks: { created: 0, completed: 0 },
          goals: [],
        }
      }

      // Jobs: applied, reached interviews (screener + tech), offers
      const { data: jobs } = await supabase
        .from('jobs')
        .select('status, applied_date')
        .eq('user_id', userId)
        .gte('applied_date', weekStart)
        .lte('applied_date', weekEnd)

      const jobsApplied = jobs?.length || 0
      const jobsInterviews = jobs?.filter((j) => ['screener', 'tech'].includes(j.status)).length || 0
      const jobsOffers = jobs?.filter((j) => j.status === 'offer').length || 0

      // Recruiters: contacts and responses
      const { data: recruiters } = await supabase
        .from('recruiters')
        .select('status, last_contact_date')
        .eq('user_id', userId)
        .gte('last_contact_date', weekStart)
        .lte('last_contact_date', weekEnd)

      const recruiterContacts = recruiters?.length || 0
      const recruiterResponses = recruiters?.filter((r) => ['replied', 'call', 'submitted'].includes(r.status)).length || 0
      const recruiterResponseRate = recruiterContacts > 0 ? (recruiterResponses / recruiterContacts) * 100 : 0

      // Learning: total minutes and top category
      const { data: learningLogs } = await supabase
        .from('learning_logs')
        .select('minutes, category, date')
        .eq('user_id', userId)
        .gte('date', weekStart)
        .lte('date', weekEnd)

      const learningTotalMinutes = learningLogs?.reduce((sum, log) => sum + (log.minutes || 0), 0) || 0
      const categoryCounts: Record<string, number> = {}
      learningLogs?.forEach((log) => {
        if (log.category) {
          categoryCounts[log.category] = (categoryCounts[log.category] || 0) + (log.minutes || 0)
        }
      })
      const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

      // Content: published
      const { count: contentPublished } = await supabase
        .from('content_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'published')
        .gte('date', weekStart)
        .lte('date', weekEnd)

      // Tasks: created and completed
      const { data: taskStatuses } = await supabase
        .from('daily_task_status')
        .select('task_date')
        .eq('user_id', userId)
        .gte('task_date', weekStart)
        .lte('task_date', weekEnd)

      const tasksCompleted = taskStatuses?.length || 0

      // Get tasks created (from daily_custom_tasks)
      const { data: customTasks } = await supabase
        .from('daily_custom_tasks')
        .select('due_date')
        .eq('user_id', userId)
        .gte('due_date', weekStart)
        .lte('due_date', weekEnd)

      const tasksCreated = customTasks?.length || 0

      // Goals: active goals overlapping the week
      const { data: activeGoals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      const overlappingGoals = activeGoals?.filter((goal) => {
        const goalStart = new Date(goal.start_date)
        const goalEnd = new Date(goal.end_date)
        const weekStartDate = new Date(weekStart)
        const weekEndDate = new Date(weekEnd)
        return goalStart <= weekEndDate && goalEnd >= weekStartDate
      }) || []

      // Calculate progress for each goal
      const goalsWithProgress = await Promise.all(
        overlappingGoals.map(async (goal) => {
          let current = 0
          switch (goal.type) {
            case 'job_applications': {
              const { count } = await supabase
                .from('jobs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .gte('applied_date', goal.start_date)
                .lte('applied_date', goal.end_date)
              current = count || 0
              break
            }
            case 'recruiter_contacts': {
              const { count } = await supabase
                .from('recruiters')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .gte('last_contact_date', goal.start_date)
                .lte('last_contact_date', goal.end_date)
              current = count || 0
              break
            }
            case 'learning_minutes': {
              const { data } = await supabase
                .from('learning_logs')
                .select('minutes')
                .eq('user_id', userId)
                .gte('date', goal.start_date)
                .lte('date', goal.end_date)
              current = data?.reduce((sum, log) => sum + (log.minutes || 0), 0) || 0
              break
            }
            case 'content_posts': {
              const { count } = await supabase
                .from('content_posts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'published')
                .gte('date', goal.start_date)
                .lte('date', goal.end_date)
              current = count || 0
              break
            }
            case 'projects_completed': {
              const { count } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'done')
                .not('completed_at', 'is', null)
                .gte('completed_at', goal.start_date)
                .lte('completed_at', goal.end_date)
              current = count || 0
              break
            }
          }
          return {
            id: goal.id,
            title: goal.title,
            current,
            target: goal.target_value,
          }
        })
      )

      return {
        jobs: {
          applied: jobsApplied,
          interviews: jobsInterviews,
          offers: jobsOffers,
        },
        recruiters: {
          contacts: recruiterContacts,
          responseRate: Math.round(recruiterResponseRate * 10) / 10,
        },
        learning: {
          totalMinutes: learningTotalMinutes,
          topCategory,
        },
        content: {
          published: contentPublished || 0,
        },
        tasks: {
          created: tasksCreated,
          completed: tasksCompleted,
        },
        goals: goalsWithProgress,
      }
    },
    enabled: !!userId && !!weekStart && !!weekEnd,
  })

  return {
    stats: data || {
      jobs: { applied: 0, interviews: 0, offers: 0 },
      recruiters: { contacts: 0, responseRate: 0 },
      learning: { totalMinutes: 0, topCategory: '' },
      content: { published: 0 },
      tasks: { created: 0, completed: 0 },
      goals: [],
    },
    isLoading,
    error,
  }
}

