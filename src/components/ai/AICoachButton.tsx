import { useState } from 'react'
import { AICoachMode } from '../../hooks/useAICoach'
import AICoachDrawer from './AICoachDrawer'
import Icon from '../ui/Icon'

interface AICoachButtonProps {
  initialMode?: AICoachMode
  initialMessage?: string
}

export default function AICoachButton({ initialMode, initialMessage }: AICoachButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 theme-bg-card border-2 theme-border shadow-hard shadow-hard-hover shadow-hard-active transition-all duration-200 flex flex-col items-center justify-center z-30 group px-4 py-3 gap-2 min-w-[80px]"
        aria-label="Open AI Coach"
      >
        <Icon name="comm-bot" size={32} className="theme-text-main" />
        <span className="font-mono text-xs uppercase theme-text-main font-medium tracking-wide whitespace-nowrap">
          Chat with AI
        </span>
      </button>

      <AICoachDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialMode={initialMode}
        initialMessage={initialMessage}
      />
    </>
  )
}

