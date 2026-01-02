import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Hook for managing realtime subscriptions
 * Provides utilities for subscribing to specific table changes
 */
export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false)
  const [channels, setChannels] = useState<RealtimeChannel[]>([])

  useEffect(() => {
    // Monitor connection status
    const channel = supabase
      .channel('connection-status')
      .on('system', {}, (payload) => {
        if (payload.status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (payload.status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const subscribe = (
    table: string,
    filter: string,
    callback: (payload: any) => void
  ) => {
    const channel = supabase
      .channel(`realtime-${table}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe()

    setChannels((prev) => [...prev, channel])
    return channel
  }

  const unsubscribe = (channel: RealtimeChannel) => {
    supabase.removeChannel(channel)
    setChannels((prev) => prev.filter((c) => c !== channel))
  }

  const unsubscribeAll = () => {
    channels.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    setChannels([])
  }

  useEffect(() => {
    return () => {
      unsubscribeAll()
    }
  }, [])

  return {
    isConnected,
    subscribe,
    unsubscribe,
    unsubscribeAll,
  }
}

