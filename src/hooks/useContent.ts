import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logContentCreated, logContentPublished } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface Content {
  id: string
  user_id: string
  date: string
  platform: 'instagram' | 'youtube' | 'linkedin' | 'medium' | 'pinterest' | 'other'
  content_type: 'post' | 'reel' | 'short' | 'story' | 'article' | 'pin'
  status: 'idea' | 'draft' | 'assets_ready' | 'scheduled' | 'published'
  notes?: string
  created_at: string
  updated_at: string
}

export interface ContentFormData {
  date: string
  platform: 'instagram' | 'youtube' | 'linkedin' | 'medium' | 'pinterest' | 'other'
  content_type: 'post' | 'reel' | 'short' | 'story' | 'article' | 'pin'
  notes?: string
}

export interface ContentFilters {
  platform?: Content['platform']
  dateFrom?: string
  dateTo?: string
}

export function useContent(userId: string | undefined, filters?: ContentFilters) {
  const queryClient = useQueryClient()

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', userId, filters],
    queryFn: async (): Promise<Content[]> => {
      if (!userId) return []

      let query = supabase
        .from('content_posts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (filters?.platform) {
        query = query.eq('platform', filters.platform)
      }
      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      // Map database fields to application fields
      return (data || []).map((item: any) => ({
        ...item,
        notes: item.body || undefined,
        status: item.status || 'idea',
      })) as Content[]
    },
    enabled: !!userId,
  })

  const createContentMutation = useMutation({
    mutationFn: async (formData: ContentFormData) => {
      if (!userId) throw new Error('User not authenticated')

      const contentData: any = {
        user_id: userId,
        date: formData.date,
        platform: formData.platform,
        content_type: formData.content_type,
        title: '', // Required by DB schema, but not used in UI
        body: formData.notes?.trim() || null,
        status: 'idea', // Required by DB schema, but not used in UI
        post_url: null,
      }

      const { data, error } = await supabase
        .from('content_posts')
        .insert(contentData)
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logContentCreated(userId, {
        platform: data.platform,
        date: data.date,
      })

      // Track GA4 event
      trackEvent('content_post_created', { platform: data.platform })

      // Map database fields to application fields
      return {
        ...data,
        notes: data.body || undefined,
        status: data.status || 'idea',
      } as Content
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ContentFormData }) => {
      if (!userId) throw new Error('User not authenticated')

      const updateData: any = {
        date: formData.date,
        platform: formData.platform,
        content_type: formData.content_type,
        title: '', // Required by DB schema, but not used in UI
        body: formData.notes?.trim() || null,
        status: 'idea', // Required by DB schema, but not used in UI
        post_url: null,
      }

      const { data, error } = await supabase
        .from('content_posts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Track GA4 event
      trackEvent('content_status_updated', { platform: data.platform })

      // Map database fields to application fields
      return {
        ...data,
        notes: data.body || undefined,
        status: data.status || 'idea',
      } as Content
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('content_posts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  const markAsPublishedMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')

      // Get content first to get title for activity log
      const { error: fetchError } = await supabase
        .from('content_posts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      // Update status to published
      const { data, error } = await supabase
        .from('content_posts')
        .update({ status: 'published' })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Mark the corresponding task as completed in daily_task_status
      // Task key format is: content:${content.id}
      const taskKey = `content:${id}`
      const today = new Date().toISOString().split('T')[0]
      
      // Mark as completed for today (the date being viewed)
      // This ensures it shows as completed when viewing today's tasks
      await supabase
        .from('daily_task_status')
        .upsert({
          user_id: userId,
          task_key: taskKey,
          task_date: today,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,task_key,task_date'
        })

      // Also mark as completed for the content's original date if different from today
      // This ensures it shows as completed when viewing that date's tasks
      if (data.date !== today) {
        await supabase
          .from('daily_task_status')
          .upsert({
            user_id: userId,
            task_key: taskKey,
            task_date: data.date,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,task_key,task_date'
          })
      }

      // Log activity
      await logContentPublished(userId, {
        platform: data.platform,
        title: data.title || `Content on ${data.platform}`,
        date: data.date,
      })

      // Track GA4 event
      trackEvent('content_published', { platform: data.platform })

      // Map database fields to application fields
      return {
        ...data,
        notes: data.body || undefined,
        status: data.status,
      } as Content
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
      queryClient.invalidateQueries({ queryKey: ['analytics', userId] })
      queryClient.invalidateQueries({ queryKey: ['completed-tasks', userId] })
    },
  })

  return {
    content: content || [],
    isLoading,
    createContent: createContentMutation.mutate,
    updateContent: updateContentMutation.mutate,
    deleteContent: deleteContentMutation.mutate,
    markAsPublished: markAsPublishedMutation.mutate,
    isCreating: createContentMutation.isPending,
    isUpdating: updateContentMutation.isPending,
    isDeleting: deleteContentMutation.isPending,
    isMarkingPublished: markAsPublishedMutation.isPending,
  }
}

