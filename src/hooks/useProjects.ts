import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logProjectCreated, logProjectStatusUpdated, logProjectActionUpdated } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface Project {
  id: string
  user_id: string
  name: string
  category: 'data' | 'ai' | 'ml' | 'rag' | 'agents' | 'saas'
  status: 'planning' | 'building' | 'polishing' | 'deployed'
  priority: 'high' | 'medium' | 'low'
  github_url?: string
  live_url?: string
  next_action?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  name: string
  category: 'data' | 'ai' | 'ml' | 'rag' | 'agents' | 'saas'
  status: 'planning' | 'building' | 'polishing' | 'deployed'
  priority: 'high' | 'medium' | 'low'
  github_url?: string
  live_url?: string
  next_action?: string
  notes?: string
}

export interface ProjectFilters {
  status?: Project['status']
  priority?: Project['priority']
  category?: Project['category']
}

export function useProjects(userId: string | undefined, filters?: ProjectFilters) {
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', userId, filters],
    queryFn: async (): Promise<Project[]> => {
      if (!userId) return []

      let query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  const createProjectMutation = useMutation({
    mutationFn: async (formData: ProjectFormData) => {
      if (!userId) throw new Error('User not authenticated')

      const projectData: any = {
        user_id: userId,
        name: formData.name.trim(),
        category: formData.category,
        status: formData.status,
        priority: formData.priority,
        github_url: formData.github_url?.trim() || null,
        live_url: formData.live_url?.trim() || null,
        next_action: formData.next_action?.trim() || null,
        notes: formData.notes?.trim() || null,
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logProjectCreated(userId, {
        name: data.name,
      })

      // Track GA4 event
      trackEvent('project_created', { category: data.category, status: data.status })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: ProjectFormData }) => {
      if (!userId) throw new Error('User not authenticated')

      // Get existing project to check for status/action changes
      const { data: existing } = await supabase
        .from('projects')
        .select('status, next_action')
        .eq('id', id)
        .single()

      const updateData: any = {
        name: formData.name.trim(),
        category: formData.category,
        status: formData.status,
        priority: formData.priority,
        github_url: formData.github_url?.trim() || null,
        live_url: formData.live_url?.trim() || null,
        next_action: formData.next_action?.trim() || null,
        notes: formData.notes?.trim() || null,
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log activity for status changes
      if (existing && existing.status !== formData.status) {
        await logProjectStatusUpdated(userId, {
          name: data.name,
          oldStatus: existing.status,
          newStatus: formData.status,
        })
      }

      // Log activity for next_action changes
      if (existing && existing.next_action !== formData.next_action) {
        await logProjectActionUpdated(userId, {
          name: data.name,
        })
      }

      // Track GA4 event
      trackEvent('project_status_updated', { status: formData.status })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-tasks', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  return {
    projects: projects || [],
    isLoading,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
  }
}

