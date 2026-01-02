import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { formatDateLocal } from '../lib/dateUtils'

export interface CalendarFilters {
  year: number
  month: number
  categories: {
    jobs: boolean
    recruiters: boolean
    learning: boolean
    content: boolean
    tasks: boolean
  }
}

export interface DayActivity {
  date: string
  jobs: number
  recruiters: number
  learning: number
  content: number
  tasks: number
  activities: Array<{
    time: string
    description: string
  }>
}

export interface CalendarData {
  activities: DayActivity[]
}

export function useCalendarData(userId: string | undefined, filters: CalendarFilters) {
  const { data, isLoading } = useQuery({
    queryKey: ['calendar', userId, filters],
    queryFn: async (): Promise<CalendarData> => {
      if (!userId) throw new Error('User not authenticated')

      const startDate = new Date(filters.year, filters.month - 1, 1)
      // filters.month is 1-12, Date constructor uses 0-11
      // new Date(year, month, 0) gives last day of (month-1)
      // So for filters.month=1 (Jan), we need month=2 to get last day of month 1 (Jan 31)
      const endDate = new Date(filters.year, filters.month + 1, 0)

      const startDateStr = formatDateLocal(startDate)
      const endDateStr = formatDateLocal(endDate)

      const activitiesMap = new Map<string, DayActivity>()

      // Initialize all days in the month
      for (let day = 1; day <= endDate.getDate(); day++) {
        const date = new Date(filters.year, filters.month - 1, day)
        const dateStr = formatDateLocal(date)
        activitiesMap.set(dateStr, {
          date: dateStr,
          jobs: 0,
          recruiters: 0,
          learning: 0,
          content: 0,
          tasks: 0,
          activities: [],
        })
      }

      // Jobs
      if (filters.categories.jobs) {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('applied_date')
          .eq('user_id', userId)
          .not('applied_date', 'is', null)
          .gte('applied_date', startDateStr)
          .lte('applied_date', endDateStr)

        jobs?.forEach((job) => {
          const day = activitiesMap.get(job.applied_date)
          if (day) {
            day.jobs++
          }
        })
      }

      // Recruiters
      if (filters.categories.recruiters) {
        const { data: recruiters } = await supabase
          .from('recruiters')
          .select('last_contact_date')
          .eq('user_id', userId)
          .not('last_contact_date', 'is', null)
          .gte('last_contact_date', startDateStr)
          .lte('last_contact_date', endDateStr)

        recruiters?.forEach((recruiter) => {
          const day = activitiesMap.get(recruiter.last_contact_date)
          if (day) {
            day.recruiters++
          }
        })
      }

      // Learning
      if (filters.categories.learning) {
        const { data: learning } = await supabase
          .from('learning_logs')
          .select('date, minutes')
          .eq('user_id', userId)
          .gte('date', startDateStr)
          .lte('date', endDateStr)

        learning?.forEach((log) => {
          const day = activitiesMap.get(log.date)
          if (day) {
            day.learning += log.minutes || 0
          }
        })
      }

      // Content
      if (filters.categories.content) {
        const { data: content } = await supabase
          .from('content_posts')
          .select('date')
          .eq('user_id', userId)
          .gte('date', startDateStr)
          .lte('date', endDateStr)

        content?.forEach((post) => {
          const day = activitiesMap.get(post.date)
          if (day) {
            day.content++
          }
        })
      }

      // Tasks
      if (filters.categories.tasks) {
        const { data: tasks } = await supabase
          .from('daily_task_status')
          .select('task_date, completed_at')
          .eq('user_id', userId)
          .gte('task_date', startDateStr)
          .lte('task_date', endDateStr)
          .not('completed_at', 'is', null)

        tasks?.forEach((task) => {
          const day = activitiesMap.get(task.task_date)
          if (day) {
            day.tasks++
          }
        })
      }

      // Activity log entries for timeline
      const { data: activityLogs } = await supabase
        .from('activity_log')
        .select('event_date, occurred_at, description')
        .eq('user_id', userId)
        .gte('event_date', startDateStr)
        .lte('event_date', endDateStr)
        .order('occurred_at', { ascending: false })

      activityLogs?.forEach((log) => {
        const day = activitiesMap.get(log.event_date)
        if (day) {
          const time = new Date(log.occurred_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
          day.activities.push({
            time,
            description: log.description,
          })
        }
      })

      return {
        activities: Array.from(activitiesMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      }
    },
    enabled: !!userId,
  })

  return {
    calendarData: data,
    isLoading,
  }
}

