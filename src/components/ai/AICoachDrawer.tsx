import { useState, useEffect, useRef } from 'react'
import { useAICoach, AICoachMode } from '../../hooks/useAICoach'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ShortcutButtons from './ShortcutButtons'
import { trackEvent } from '../../lib/analytics'
import Icon from '../ui/Icon'
import LoadingState from '../ui/LoadingState'

interface AICoachDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AICoachMode
  initialMessage?: string
}

export default function AICoachDrawer({ isOpen, onClose, initialMode = 'general', initialMessage }: AICoachDrawerProps) {
  const [mode, setMode] = useState<AICoachMode>(initialMode)
  const { messages, isLoading, sendMessage, sendShortcut, clearMessages } = useAICoach(mode)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      trackEvent('ai_chat_open', { mode })
      if (initialMessage) {
        sendMessage(initialMessage)
      }
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (message: string) => {
    sendMessage(message)
  }

  const handleShortcut = (message: string) => {
    sendShortcut(message)
  }

  const handleModeChange = (newMode: AICoachMode) => {
    setMode(newMode)
    clearMessages()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] theme-bg-card border-l-2 theme-border z-50 flex flex-col shadow-hard">
        {/* Header */}
        <div className="p-4 border-b-2 theme-border flex items-center justify-between">
          <h2 className="text-lg font-semibold font-mono uppercase">AI Coach</h2>
          <button
            onClick={onClose}
            className="hover:text-cyan-400 transition-colors"
          >
            <Icon name="sys-close" size={24} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b-2 theme-border overflow-x-auto">
          {(['general', 'job', 'learning', 'projects', 'content'] as AICoachMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors font-mono text-xs uppercase ${
                mode === m
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent hover:border-cyan-400'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Shortcut Buttons */}
        <ShortcutButtons mode={mode} onShortcut={handleShortcut} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 theme-bg-page">
          {messages.length === 0 && (
            <div className="text-center font-mono text-xs py-8">
              <p className="mb-2">Ask me anything about your progress!</p>
              <p className="text-xs">Try a shortcut above or type your question.</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="theme-bg-card border-2 theme-border px-4 py-3 rounded">
                <LoadingState variant="typing" size={32} color="#84cc16" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </>
  )
}

