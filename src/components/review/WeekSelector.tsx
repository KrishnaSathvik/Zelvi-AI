import { useState } from 'react'

interface WeekSelectorProps {
  weekStart: string
  onWeekChange: (weekStart: string) => void
}

export default function WeekSelector({ weekStart, onWeekChange }: WeekSelectorProps) {
  const [showCustom, setShowCustom] = useState(false)

  const getWeekStart = (date: Date): string => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
    const monday = new Date(d.setDate(diff))
    return monday.toISOString().split('T')[0]
  }

  const handleThisWeek = () => {
    onWeekChange(getWeekStart(new Date()))
    setShowCustom(false)
  }

  const handleCustomDate = (date: string) => {
    onWeekChange(getWeekStart(new Date(date)))
    setShowCustom(false)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={handleThisWeek}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
        >
          This Week
        </button>
        {showCustom ? (
        <input
          type="date"
          className="px-4 py-2 border-2 font-mono text-xs focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
          onChange={(e) => handleCustomDate(e.target.value)}
          onBlur={() => setShowCustom(false)}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setShowCustom(true)}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
        >
          Custom Date
        </button>
        )}
      </div>
      <div className="text-sm font-mono text-xs theme-text-main">
        {new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
        {new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </div>
      <style>{`
        body.dark .date-input-calendar::-webkit-calendar-picker-indicator,
        body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.8;
          cursor: pointer;
        }
        body.dark .date-input-calendar::-webkit-calendar-picker-indicator:hover,
        body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        body.light .date-input-calendar::-webkit-calendar-picker-indicator {
          filter: none;
          opacity: 0.8;
          cursor: pointer;
        }
        body.light .date-input-calendar::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

