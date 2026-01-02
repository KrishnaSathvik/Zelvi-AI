interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 border-2 theme-border ${
          isUser
            ? 'bg-cyan-400 text-black'
            : 'theme-bg-card'
        }`}
      >
        <p className="whitespace-pre-wrap font-mono text-sm">{content}</p>
      </div>
    </div>
  )
}

