import { useState, useEffect } from 'react'
import { LearningFormData, LearningLog } from '../../hooks/useLearning'

interface LearningFormProps {
  onSubmit: (data: LearningFormData) => void
  onCancel?: () => void
  initialData?: LearningLog
  isLoading?: boolean
}

const categories: LearningFormData['category'][] = [
  'de',
  'ai_ml',
  'genai',
  'rag',
  'system_design',
  'interview',
  'other',
]

const categoryLabels: Record<LearningFormData['category'], string> = {
  de: 'Data Engineering',
  ai_ml: 'AI/ML',
  genai: 'GenAI',
  rag: 'RAG',
  system_design: 'System Design',
  interview: 'Interview Prep',
  other: 'Other',
}

export default function LearningForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: LearningFormProps) {
  const [formData, setFormData] = useState<LearningFormData>({
    date: new Date().toISOString().split('T')[0],
    category: 'de',
    topic: '',
    minutes: undefined,
    resource: '',
    takeaways: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        category: initialData.category,
        topic: initialData.topic,
        minutes: initialData.minutes,
        resource: initialData.resource || '',
        takeaways: initialData.takeaways || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.topic.trim()) return
    onSubmit(formData)
    if (!initialData) {
      // Reset form if creating new
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'de',
        topic: '',
        minutes: undefined,
        resource: '',
        takeaways: '',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as LearningFormData['category'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Topic <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          placeholder="e.g., Vector databases"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Minutes (optional)
        </label>
        <input
          type="number"
          min="1"
          value={formData.minutes || ''}
          onChange={(e) =>
            setFormData({ ...formData, minutes: e.target.value ? parseInt(e.target.value) || null : null })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Resource (URL or description)
        </label>
        <input
          type="text"
          value={formData.resource}
          onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Takeaways
        </label>
        <textarea
          value={formData.takeaways}
          onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Optional"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.topic.trim()}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
          >
            Cancel
          </button>
        )}
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
    </form>
  )
}

