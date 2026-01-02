import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { trackEvent } from '../lib/analytics'

export type AICoachMode = 'general' | 'job' | 'learning' | 'projects' | 'content'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useAICoach(mode: AICoachMode) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (message: string, timeRange: number = 30) => {
    if (!user) throw new Error('User not authenticated')

    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) throw new Error('Not authenticated')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          mode,
          message,
          time_range: timeRange,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get AI response')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to get AI response')
      }

      // Add AI response
      const aiMessage: ChatMessage = { role: 'assistant', content: result.data.response }
      setMessages((prev) => [...prev, aiMessage])

      trackEvent('ai_chat_message_sent', { mode })

      return result.data.response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response'
      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
      }
      setMessages((prev) => [...prev, errorChatMessage])
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const sendShortcut = (message: string) => {
    trackEvent('ai_chat_shortcut_used', { mode, shortcut: message })
    return sendMessage(message)
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isLoading,
    sendMessage,
    sendShortcut,
    clearMessages,
  }
}

