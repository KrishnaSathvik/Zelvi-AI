import { useState, useEffect } from 'react'
import { WeeklyReviewFormData, WeeklyReview } from '../../hooks/useWeeklyReview'

interface ReviewFormProps {
  initialData?: {
    wins: string | null
    challenges: string | null
    avoided: string | null
    next_focus: string | null
  }
  onSave: (data: WeeklyReviewFormData) => void
  isSaving: boolean
  lastWeekReview?: WeeklyReview | null
}

export default function ReviewForm({ initialData, onSave, isSaving, lastWeekReview }: ReviewFormProps) {
  // Pre-populate next_focus with last week's next_focus if current is empty
  const getInitialNextFocus = () => {
    if (initialData?.next_focus) return initialData.next_focus
    if (lastWeekReview?.next_focus) {
      return `[Last week's focus: ${lastWeekReview.next_focus}]\n\n`
    }
    return ''
  }

  const [formData, setFormData] = useState<WeeklyReviewFormData>({
    wins: initialData?.wins || '',
    challenges: initialData?.challenges || '',
    avoided: initialData?.avoided || '',
    next_focus: getInitialNextFocus(),
  })

  useEffect(() => {
    if (initialData) {
      const nextFocus = initialData.next_focus || (lastWeekReview?.next_focus ? `[Last week's focus: ${lastWeekReview.next_focus}]\n\n` : '')
      setFormData({
        wins: initialData.wins || '',
        challenges: initialData.challenges || '',
        avoided: initialData.avoided || '',
        next_focus: nextFocus,
      })
    } else if (lastWeekReview?.next_focus) {
      // If no initial data but we have last week's focus, pre-populate
      setFormData(prev => {
        if (prev.next_focus) return prev // Don't overwrite if user already typed something
        return {
          ...prev,
          next_focus: `[Last week's focus: ${lastWeekReview.next_focus}]\n\n`,
        }
      })
    }
  }, [initialData, lastWeekReview])

  const handleChange = (field: keyof WeeklyReviewFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const hasLastWeekData = lastWeekReview && (lastWeekReview.wins || lastWeekReview.challenges || lastWeekReview.next_focus)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {hasLastWeekData && (
        <div className="mb-6 p-4 border-2 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
          <div className="text-xs font-mono uppercase mb-2 text-cyan-400">Last Week's Reflection</div>
          {lastWeekReview.wins && (
            <div className="mb-3">
              <div className="text-xs font-mono uppercase mb-1 theme-text-main">Wins:</div>
              <div className="text-sm font-mono whitespace-pre-wrap theme-text-main">{lastWeekReview.wins}</div>
            </div>
          )}
          {lastWeekReview.challenges && (
            <div className="mb-3">
              <div className="text-xs font-mono uppercase mb-1 theme-text-main">Challenges:</div>
              <div className="text-sm font-mono whitespace-pre-wrap theme-text-main">{lastWeekReview.challenges}</div>
            </div>
          )}
          {lastWeekReview.next_focus && (
            <div>
              <div className="text-xs font-mono uppercase mb-1 theme-text-main">Next Focus:</div>
              <div className="text-sm font-mono whitespace-pre-wrap theme-text-main">{lastWeekReview.next_focus}</div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>
          What went well this week?
        </label>
        <textarea
          value={formData.wins}
          onChange={(e) => handleChange('wins', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="List your wins, achievements, and positive moments..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>
          What didn't move / where did I get stuck?
        </label>
        <textarea
          value={formData.challenges}
          onChange={(e) => handleChange('challenges', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Identify blockers, challenges, or areas that need attention..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>
          What did I avoid or procrastinate on?
        </label>
        <textarea
          value={formData.avoided}
          onChange={(e) => handleChange('avoided', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Be honest about what you put off or avoided..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>
          What will I focus on next week?
        </label>
        <textarea
          value={formData.next_focus}
          onChange={(e) => handleChange('next_focus', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder={
            lastWeekReview?.next_focus 
              ? `Last week you planned: "${lastWeekReview.next_focus.substring(0, 50)}..."\n\nSet your priorities and focus areas for the upcoming week...`
              : "Set your priorities and focus areas for the upcoming week..."
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
        >
          {isSaving ? 'Saving...' : 'Save Review'}
        </button>
        {isSaving && (
          <span className="text-sm font-mono text-xs theme-text-main">Auto-saving...</span>
        )}
      </div>
    </form>
  )
}

