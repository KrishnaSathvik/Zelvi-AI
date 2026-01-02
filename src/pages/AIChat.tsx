import { useState, useEffect, useRef } from 'react'
import { useAICoach, AICoachMode } from '../hooks/useAICoach'
import ChatMessage from '../components/ai/ChatMessage'
import ChatInput from '../components/ai/ChatInput'
import ShortcutButtons from '../components/ai/ShortcutButtons'
import Icon from '../components/ui/Icon'
import LoadingState from '../components/ui/LoadingState'

export default function AIChat() {
  const [mode, setMode] = useState<AICoachMode>('general')
  const { messages, isLoading, sendMessage, sendShortcut, clearMessages } = useAICoach(mode)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col theme-bg-page -mt-16 lg:mt-0">
      {/* Header */}
      <div className="border-b-2 theme-border theme-bg-card">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono uppercase tracking-tight mb-3 sm:mb-4">
            AI Coach
          </h1>
        </div>
        
        {/* Mode Tabs */}
        <div className="border-b-2 theme-border overflow-x-auto">
          <div className="max-w-4xl mx-auto flex">
            {(['general', 'job', 'learning', 'projects', 'content'] as AICoachMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition-colors font-mono text-xs uppercase whitespace-nowrap ${
                  mode === m
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent hover:border-cyan-400'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcut Buttons */}
      <div className="border-b-2 theme-border theme-bg-card">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <ShortcutButtons mode={mode} onShortcut={handleShortcut} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center font-mono text-xs py-12">
              <Icon name="comm-bot" size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-2 text-lg">Ask me anything about your progress!</p>
              <p className="text-xs opacity-75">Try a shortcut above or type your question.</p>
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
      </div>

      {/* Input */}
      <div className="border-t-2 theme-border theme-bg-card">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  )
}

