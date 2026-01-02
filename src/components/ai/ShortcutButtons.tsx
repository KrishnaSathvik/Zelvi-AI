interface ShortcutButtonsProps {
  mode: 'general' | 'job' | 'learning' | 'projects' | 'content'
  onShortcut: (message: string) => void
}

const shortcuts: Record<ShortcutButtonsProps['mode'], string[]> = {
  general: [
    'Summarize my last 7 days',
    'Give me a 5-day action plan',
    'What are my top 3 priorities today?',
    'Write a weekly update draft',
  ],
  job: [
    'Analyze my job funnel',
    'Suggest changes to my job search strategy',
  ],
  learning: [
    'Plan my next 2 weeks of learning',
  ],
  projects: [
    'Help me prioritize my projects',
  ],
  content: [
    'Generate 3 post ideas based on my recent learning',
  ],
}

export default function ShortcutButtons({ mode, onShortcut }: ShortcutButtonsProps) {
  const modeShortcuts = shortcuts[mode] || []

  return (
    <div className="flex flex-wrap gap-2">
      {modeShortcuts.map((shortcut, index) => (
        <button
          key={index}
          onClick={() => onShortcut(shortcut)}
          className="px-3 py-1.5 text-sm theme-bg-page border-2 theme-border font-mono text-xs hover:border-cyan-400 transition-colors whitespace-nowrap"
        >
          {shortcut}
        </button>
      ))}
    </div>
  )
}

