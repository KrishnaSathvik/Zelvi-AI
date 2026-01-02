import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logTaskCompleted, logContentPublished } from '../lib/activityLog'
import { logActivity } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface DailyTask {
  task_key: string
  task_date: string
  label: string
  type: 'Manual' | 'Learning' | 'Content' | 'Project'
  due_date?: string
  source_id?: string // ID of the source (learning_id, content_id, project_id, etc.)
}

export function useDailyTasks(userId: string | undefined, date: string) {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['daily-tasks', userId, date],
    queryFn: async (): Promise<DailyTask[]> => {
      if (!userId) return []

      const tasks: DailyTask[] = []

      // 1. Manual tasks
      const { data: manualTasks } = await supabase
        .from('daily_custom_tasks')
        .select('*')
        .eq('user_id', userId)
        .lte('due_date', date)

      if (manualTasks) {
        for (const task of manualTasks) {
          const taskKey = `manual:${task.id}`
          tasks.push({
            task_key: taskKey,
            task_date: date,
            label: task.title,
            type: 'Manual',
            due_date: task.due_date,
            source_id: task.id,
          })
        }
      }

      // 2. Learning tasks
      const { data: learningLogs } = await supabase
        .from('learning_logs')
        .select('*')
        .eq('user_id', userId)
        .lte('date', date)

      if (learningLogs) {
        for (const log of learningLogs) {
          const taskKey = `learning:${log.id}`
          tasks.push({
            task_key: taskKey,
            task_date: log.date,
            label: `Learning – ${log.topic} (${log.minutes} min)`,
            type: 'Learning',
            source_id: log.id,
          })
        }
      }

      // 3. Content tasks (include all content, published ones will show as completed)
      const { data: contentPosts } = await supabase
        .from('content_posts')
        .select('*')
        .eq('user_id', userId)
        .lte('date', date)

      if (contentPosts) {
        for (const content of contentPosts) {
          const taskKey = `content:${content.id}`
          tasks.push({
            task_key: taskKey,
            task_date: date,
            label: `Content – ${content.platform}: ${content.title}`,
            type: 'Content',
            source_id: content.id,
          })
        }
      }

      // 4. Project tasks
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'done')
        .not('next_action', 'is', null)

      if (projects) {
        for (const project of projects) {
          const taskKey = `project:${project.id}:${date}`
          tasks.push({
            task_key: taskKey,
            task_date: date,
            label: `Project – ${project.name}: ${project.next_action}`,
            type: 'Project',
            source_id: project.id,
          })
        }
      }

      return tasks
    },
    enabled: !!userId,
  })

  const completeTaskMutation = useMutation({
    mutationFn: async ({ taskKey, taskDate, taskLabel, taskType, sourceId }: { taskKey: string; taskDate: string; taskLabel: string; taskType?: string; sourceId?: string }) => {
      if (!userId) throw new Error('User not authenticated')

      // Insert completion status
      const { error } = await supabase.from('daily_task_status').insert({
        user_id: userId,
        task_key: taskKey,
        task_date: taskDate,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error

      // If this is a Content task, automatically mark the content as published
      if (taskType === 'Content' && sourceId) {
        const { data: contentData, error: contentError } = await supabase
          .from('content_posts')
          .select('*')
          .eq('id', sourceId)
          .eq('user_id', userId)
          .single()

        if (!contentError && contentData && contentData.status !== 'published') {
          // Update content status to published
          const { error: updateError } = await supabase
            .from('content_posts')
            .update({ status: 'published' })
            .eq('id', sourceId)
            .eq('user_id', userId)

          if (!updateError && contentData) {
            // Log content published activity
            await logContentPublished(userId, {
              platform: contentData.platform,
              title: contentData.title || `Content on ${contentData.platform}`,
              date: contentData.date,
            })

            // Track GA4 event
            trackEvent('content_published', { platform: contentData.platform, source: 'task_completion' })
          }
        }
      }

      // Log activity
      await logTaskCompleted(userId, taskKey, taskLabel)

      // Track GA4 event
      trackEvent('task_completed', { task_key: taskKey })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['completed-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['content', userId] })
      queryClient.invalidateQueries({ queryKey: ['analytics', userId] })
    },
  })

  const uncompleteTaskMutation = useMutation({
    mutationFn: async ({ taskKey, taskDate }: { taskKey: string; taskDate: string }) => {
      if (!userId) throw new Error('User not authenticated')

      // Delete completion status
      const { error } = await supabase
        .from('daily_task_status')
        .delete()
        .eq('user_id', userId)
        .eq('task_key', taskKey)
        .eq('task_date', taskDate)

      if (error) throw error

      // Track GA4 event
      trackEvent('task_uncompleted', { task_key: taskKey })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['completed-tasks', userId, date] })
    },
  })

  const createManualTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!userId) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('daily_custom_tasks')
        .insert({
          user_id: userId,
          title,
          due_date: date,
        })
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logActivity(userId, 'task_created', `Created manual task: ${title}`, new Date(date))

      // Track GA4 event
      trackEvent('task_created', { type: 'manual' })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId, date] })
    },
  })

  const updateManualTaskMutation = useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      if (!userId) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('daily_custom_tasks')
        .update({ title: title.trim() })
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logActivity(userId, 'task_updated', `Updated manual task: ${title}`, new Date(date))

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId, date] })
    },
  })

  const deleteManualTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) throw new Error('User not authenticated')

      // Delete task statuses first
      await supabase
        .from('daily_task_status')
        .delete()
        .eq('user_id', userId)
        .eq('task_key', `manual:${taskId}`)

      // Delete task
      const { error } = await supabase
        .from('daily_custom_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId, date] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId, date] })
    },
  })

  return {
    tasks: tasks || [],
    isLoading,
    completeTask: completeTaskMutation.mutate,
    uncompleteTask: uncompleteTaskMutation.mutate,
    createManualTask: createManualTaskMutation.mutate,
    updateManualTask: updateManualTaskMutation.mutate,
    deleteManualTask: deleteManualTaskMutation.mutate,
    isCompleting: completeTaskMutation.isPending || uncompleteTaskMutation.isPending,
    isCreating: createManualTaskMutation.isPending,
    isUpdating: updateManualTaskMutation.isPending,
    isDeleting: deleteManualTaskMutation.isPending,
  }
}

