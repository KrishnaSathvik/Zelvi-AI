import { useEffect, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

interface RealtimeProviderProps {
  children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('user-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const table = payload.table
          // eventType available for future use
          void payload.eventType

          // Invalidate relevant queries based on table
          switch (table) {
            case 'jobs':
              queryClient.invalidateQueries({ queryKey: ['jobs', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'recruiters':
              queryClient.invalidateQueries({ queryKey: ['recruiters', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'learning_logs':
              queryClient.invalidateQueries({ queryKey: ['learning', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-tasks', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'projects':
              queryClient.invalidateQueries({ queryKey: ['projects', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-tasks', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'content_posts':
              queryClient.invalidateQueries({ queryKey: ['content', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-tasks', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'daily_custom_tasks':
              queryClient.invalidateQueries({ queryKey: ['daily-tasks', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              break

            case 'daily_task_status':
              queryClient.invalidateQueries({ queryKey: ['daily-tasks', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              queryClient.invalidateQueries({ queryKey: ['timeline', user.id] })
              queryClient.invalidateQueries({ queryKey: ['analytics', user.id] })
              break

            case 'goals':
              queryClient.invalidateQueries({ queryKey: ['goals', user.id] })
              queryClient.invalidateQueries({ queryKey: ['goal-progress', user.id] })
              queryClient.invalidateQueries({ queryKey: ['daily-summary', user.id] })
              break

            case 'weekly_reviews':
              queryClient.invalidateQueries({ queryKey: ['weekly-review', user.id] })
              break

            case 'notes':
              queryClient.invalidateQueries({ queryKey: ['notes', user.id] })
              break

            case 'activity_log':
              queryClient.invalidateQueries({ queryKey: ['timeline', user.id] })
              queryClient.invalidateQueries({ queryKey: ['calendar', user.id] })
              break

            case 'user_profiles':
              queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] })
              break

            default:
              // For any other table changes, invalidate all queries
              queryClient.invalidateQueries()
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.log('Realtime subscription active')
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Realtime channel error')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  return <>{children}</>
}

