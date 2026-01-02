import { useState, FormEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t-2 p-4 backdrop-blur-modern theme-border theme-bg-form">
      <div className="flex gap-3 items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          disabled={disabled}
          placeholder={placeholder || 'Ask about your jobs, learning, projects, content, goals.'}
          rows={2}
          className="flex-1 px-4 py-3 theme-bg-page border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none disabled:opacity-50 min-h-[60px] leading-relaxed theme-border theme-text-main"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-3 bg-cyan-400 text-black border-2 theme-border font-bold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-hard shadow-hard-hover shadow-hard-active font-mono text-xs uppercase tracking-wider min-h-[60px]"
        >
          SEND
        </button>
      </div>
    </form>
  )
}

