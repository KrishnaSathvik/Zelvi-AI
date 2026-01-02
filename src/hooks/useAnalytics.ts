import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateGoalAchievement, calculateWeeklyPatterns } from '../lib/analyticsUtils'
import { Goal } from './useGoals'

export interface AnalyticsFilters {
  startDate: string
  endDate: string
}

export interface JobFunnelData {
  applied: number
  screener: number
  tech: number
  offer: number
  rejected: number
}

export interface RecruiterData {
  week: string
  contacts: number
  responses: number
}

export interface LearningData {
  category: string
  count: number
}

export interface ProjectData {
  status: string
  count: number
}

export interface ContentData {
  platform: string
  published: number
  inPipeline: number
}

export interface TaskData {
  date: string
  created: number
  completed: number
}

export interface JobTimelineData {
  date: string
  applications: number
}


export interface GoalProgressData {
  goal: Goal
  current: number
  percentage: number
  status: 'on_track' | 'behind'
  daysLeft: number
}

export interface AnalyticsData {
  jobFunnel: JobFunnelData
  jobTimeline: JobTimelineData[]
  recruiters: RecruiterData[]
  learning: LearningData[]
  projects: ProjectData[]
  content: ContentData[]
  tasks: TaskData[]
  learningStreak: number
  summaryStats: {
    totalApplications: number
    totalInterviews: number
    totalOffers: number
    interviewRate: number
    offerRate: number
    totalLearningSessions: number
    totalTasksCompleted: number
    totalTasksCreated: number
    responseRate: number
  }
  trends: {
    applications?: number | null
    learning?: number | null
    tasks?: number | null
  }
  goalAchievements?: {
    jobs?: ReturnType<typeof calculateGoalAchievement>
    learning?: ReturnType<typeof calculateGoalAchievement>
    tasks?: ReturnType<typeof calculateGoalAchievement>
  }
  weeklyPatterns?: {
    jobs?: ReturnType<typeof calculateWeeklyPatterns>
    learning?: ReturnType<typeof calculateWeeklyPatterns>
    tasks?: ReturnType<typeof calculateWeeklyPatterns>
  }
  activeGoals?: GoalProgressData[]
}

export function useAnalytics(userId: string | undefined, filters: AnalyticsFilters) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', userId, filters],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!userId) throw new Error('User not authenticated')

      // Job Funnel
      const { data: jobs } = await supabase
        .from('jobs')
        .select('status, applied_date')
        .eq('user_id', userId)
        .gte('applied_date', filters.startDate)
        .lte('applied_date', filters.endDate)

      const jobFunnel: JobFunnelData = {
        applied: jobs?.filter((j) => j.status === 'applied').length || 0,
        screener: jobs?.filter((j) => j.status === 'screener').length || 0,
        tech: jobs?.filter((j) => j.status === 'tech').length || 0,
        offer: jobs?.filter((j) => j.status === 'offer').length || 0,
        rejected: jobs?.filter((j) => j.status === 'rejected').length || 0,
      }

      // Job Timeline (applications over time)
      const jobTimelineMap = new Map<string, number>()
      jobs?.forEach((j) => {
        if (j.applied_date) {
          const date = j.applied_date
          const existing = jobTimelineMap.get(date) || 0
          jobTimelineMap.set(date, existing + 1)
        }
      })
      const jobTimeline: JobTimelineData[] = Array.from(jobTimelineMap.entries())
        .map(([date, applications]) => ({ date, applications }))
        .sort((a, b) => a.date.localeCompare(b.date))

      // Recruiters (grouped by week)
      const { data: recruitersData } = await supabase
        .from('recruiters')
        .select('last_contact_date, status')
        .eq('user_id', userId)
        .gte('last_contact_date', filters.startDate)
        .lte('last_contact_date', filters.endDate)

      const recruiterMap = new Map<string, { contacts: number; responses: number }>()
      recruitersData?.forEach((r) => {
        const week = getWeekStart(r.last_contact_date)
        const existing = recruiterMap.get(week) || { contacts: 0, responses: 0 }
        existing.contacts++
        if (r.status !== 'messaged') {
          existing.responses++
        }
        recruiterMap.set(week, existing)
      })

      const recruiters: RecruiterData[] = Array.from(recruiterMap.entries())
        .map(([week, data]) => ({ week, contacts: data.contacts, responses: data.responses }))
        .sort((a, b) => a.week.localeCompare(b.week))

      // Learning (by category - count sessions)
      const { data: learningData } = await supabase
        .from('learning_logs')
        .select('category, date')
        .eq('user_id', userId)
        .gte('date', filters.startDate)
        .lte('date', filters.endDate)

      const learningMap = new Map<string, number>()
      learningData?.forEach((l) => {
        const existing = learningMap.get(l.category) || 0
        learningMap.set(l.category, existing + 1)
      })

      const learning: LearningData[] = Array.from(learningMap.entries()).map(([category, count]) => ({
        category,
        count,
      }))

      // Learning streak
      const learningStreak = calculateLearningStreak(learningData || [])

      // Projects (by status)
      const { data: projectsData } = await supabase
        .from('projects')
        .select('status')
        .eq('user_id', userId)

      const projectMap = new Map<string, number>()
      projectsData?.forEach((p) => {
        const existing = projectMap.get(p.status) || 0
        projectMap.set(p.status, existing + 1)
      })

      const projects: ProjectData[] = Array.from(projectMap.entries()).map(([status, count]) => ({
        status,
        count,
      }))

      // Content (by platform)
      const { data: contentData } = await supabase
        .from('content_posts')
        .select('platform, status')
        .eq('user_id', userId)
        .gte('date', filters.startDate)
        .lte('date', filters.endDate)

      const contentMap = new Map<string, { published: number; inPipeline: number }>()
      contentData?.forEach((c) => {
        const existing = contentMap.get(c.platform) || { published: 0, inPipeline: 0 }
        if (c.status === 'published') {
          existing.published++
        } else {
          existing.inPipeline++
        }
        contentMap.set(c.platform, existing)
      })

      const content: ContentData[] = Array.from(contentMap.entries()).map(([platform, data]) => ({
        platform,
        ...data,
      }))

      // Tasks (by date) - Count all available tasks and completed ones
      // We need to count tasks that would have been available each day
      const { data: tasksData } = await supabase
        .from('daily_task_status')
        .select('task_date, completed_at, task_key')
        .eq('user_id', userId)
        .gte('task_date', filters.startDate)
        .lte('task_date', filters.endDate)
        .not('completed_at', 'is', null) // Only get completed tasks

      // Get all task sources
      const { data: customTasksData } = await supabase
        .from('daily_custom_tasks')
        .select('due_date')
        .eq('user_id', userId)
        .lte('due_date', filters.endDate)

      const { data: learningTasksData } = await supabase
        .from('learning_logs')
        .select('date')
        .eq('user_id', userId)
        .lte('date', filters.endDate)

      const { data: contentTasksData } = await supabase
        .from('content_posts')
        .select('date, status')
        .eq('user_id', userId)
        .lte('date', filters.endDate)
        .neq('status', 'published')

      const { data: projectTasksData } = await supabase
        .from('projects')
        .select('id, status, next_action')
        .eq('user_id', userId)
        .neq('status', 'done')
        .not('next_action', 'is', null)

      // Build date range
      const dateRange: string[] = []
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateRange.push(d.toISOString().split('T')[0])
      }

      const taskMap = new Map<string, { created: number; completed: number }>()
      
      // For each date, count available tasks
      dateRange.forEach((date) => {
        let created = 0
        let completed = 0

        // Count custom tasks (due on or before this date)
        const customCount = customTasksData?.filter((t) => t.due_date <= date).length || 0
        created += customCount

        // Count learning tasks (on this date)
        const learningCount = learningTasksData?.filter((l) => l.date === date).length || 0
        created += learningCount

        // Count content tasks (due on or before this date, not published)
        const contentCount = contentTasksData?.filter((c) => c.date && c.date <= date).length || 0
        created += contentCount

        // Count project tasks (active projects generate tasks every day)
        const projectCount = projectTasksData?.length || 0
        created += projectCount

        // Count completed tasks for this date
        // Note: tasksData already filtered for completed tasks only
        const completedCount = tasksData?.filter((t) => t.task_date === date).length || 0
        completed = completedCount

        // Always include dates with completed tasks, even if created is 0
        // This ensures completed tasks show up even if they weren't "created" in the date range
        if (created > 0 || completed > 0) {
          taskMap.set(date, { created, completed })
        }
      })

      const tasks: TaskData[] = Array.from(taskMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))

      // Calculate summary stats
      const totalApplications = jobFunnel.applied
      const totalInterviews = jobFunnel.screener + jobFunnel.tech
      const totalOffers = jobFunnel.offer
      const interviewRate = totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0
      const offerRate = totalApplications > 0 ? Math.round((totalOffers / totalApplications) * 100) : 0
      const totalLearningSessions = learning.reduce((sum, l) => sum + l.count, 0)
      const totalTasksCompleted = tasks.reduce((sum, t) => sum + t.completed, 0)
      const totalTasksCreated = tasks.reduce((sum, t) => sum + t.created, 0)
      const totalRecruiterContacts = recruiters.reduce((sum, r) => sum + r.contacts, 0)
      const totalRecruiterResponses = recruiters.reduce((sum, r) => sum + r.responses, 0)
      const responseRate = totalRecruiterContacts > 0 ? Math.round((totalRecruiterResponses / totalRecruiterContacts) * 100) : 0

      // Calculate trends (compare last period vs previous period)
      const sortedJobs = [...(jobs || [])].sort((a, b) => 
        (a.applied_date || '').localeCompare(b.applied_date || '')
      )
      // sortedLearning removed - unused variable
      
      const applicationTrend = sortedJobs.length >= 2 
        ? sortedJobs.slice(-7).length - sortedJobs.slice(-14, -7).length
        : null
      // Count learning sessions per day for trend calculation
      const learningByDate = new Map<string, number>()
      learningData?.forEach((l) => {
        const existing = learningByDate.get(l.date) || 0
        learningByDate.set(l.date, existing + 1)
      })
      const sortedLearningCounts = Array.from(learningByDate.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
      
      const learningTrend = sortedLearningCounts.length >= 2
        ? (sortedLearningCounts[sortedLearningCounts.length - 1]?.count || 0) - (sortedLearningCounts[sortedLearningCounts.length - 2]?.count || 0)
        : null
      const tasksTrend = tasks.length >= 2
        ? tasks[tasks.length - 1].completed - tasks[tasks.length - 2].completed
        : null

      // Calculate goal achievements (using reasonable targets)
      const jobGoalAchievement = calculateGoalAchievement(
        jobs?.map((j) => ({ date: j.applied_date || '', value: 1 })) || [],
        1, // Target: 1 application per day
        0.8
      )
      const learningGoalAchievement = calculateGoalAchievement(
        learningData?.map((l) => ({ date: l.date, value: 1 })) || [],
        1, // Target: 1 session per day
        0.8
      )
      const taskGoalAchievement = calculateGoalAchievement(
        tasks.map((t) => ({ date: t.date, value: t.completed })),
        totalTasksCreated / Math.max(tasks.length, 1), // Average tasks per day
        0.8
      )

      // Calculate weekly patterns
      const jobPatterns = calculateWeeklyPatterns(
        jobs?.map((j) => ({ date: j.applied_date || '', value: 1 })) || []
      )
      const learningPatterns = calculateWeeklyPatterns(
        learningData?.map((l) => ({ date: l.date, value: 1 })) || []
      )
      const taskPatterns = calculateWeeklyPatterns(
        tasks.map((t) => ({ date: t.date, value: t.completed }))
      )

      // Goals are now simplified to text-only, so no progress calculation needed
      const activeGoals: GoalProgressData[] = []

      return {
        jobFunnel,
        jobTimeline,
        recruiters,
        learning,
        projects,
        content,
        tasks,
        learningStreak,
        summaryStats: {
          totalApplications,
          totalInterviews,
          totalOffers,
          interviewRate,
          offerRate,
          totalLearningSessions,
          totalTasksCompleted,
          totalTasksCreated,
          responseRate,
        },
        trends: {
          applications: applicationTrend,
          learning: learningTrend,
          tasks: tasksTrend,
        },
        goalAchievements: {
          jobs: jobGoalAchievement.totalDays > 0 ? jobGoalAchievement : undefined,
          learning: learningGoalAchievement.totalDays > 0 ? learningGoalAchievement : undefined,
          tasks: taskGoalAchievement.totalDays > 0 ? taskGoalAchievement : undefined,
        },
        weeklyPatterns: {
          jobs: jobPatterns.bestDay ? jobPatterns : undefined,
          learning: learningPatterns.bestDay ? learningPatterns : undefined,
          tasks: taskPatterns.bestDay ? taskPatterns : undefined,
        },
        activeGoals: activeGoals.length > 0 ? activeGoals : undefined,
      }
    },
    enabled: !!userId,
  })

  return {
    analytics: data,
    isLoading,
  }
}

function getWeekStart(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday
  const monday = new Date(date.setDate(diff))
  return monday.toISOString().split('T')[0]
}

function calculateLearningStreak(learningData: Array<{ date: string }>): number {
  if (learningData.length === 0) return 0

  const dates = new Set(learningData.map((l) => l.date).sort().reverse())
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]

    if (dates.has(dateStr)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

