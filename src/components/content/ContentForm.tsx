import { useState, useEffect } from 'react'
import { ContentFormData, Content } from '../../hooks/useContent'

interface ContentFormProps {
  onSubmit: (data: ContentFormData) => void
  onCancel?: () => void
  initialData?: Content
  isLoading?: boolean
}

const platforms: ContentFormData['platform'][] = ['instagram', 'youtube', 'linkedin', 'medium', 'pinterest', 'other']
const platformLabels: Record<ContentFormData['platform'], string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  medium: 'Medium',
  pinterest: 'Pinterest',
  other: 'Other',
}

const contentTypes: ContentFormData['content_type'][] = ['post', 'reel', 'short', 'story', 'article', 'pin']
const contentTypeLabels: Record<ContentFormData['content_type'], string> = {
  post: 'Post',
  reel: 'Reel',
  short: 'Short',
  story: 'Story',
  article: 'Article',
  pin: 'Pin',
}


export default function ContentForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: ContentFormProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    date: new Date().toISOString().split('T')[0],
    platform: 'linkedin',
    content_type: 'post',
    notes: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        platform: initialData.platform,
        content_type: initialData.content_type,
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date) return

    const cleanedData = {
      ...formData,
      notes: formData.notes?.trim() || undefined,
    }

    onSubmit(cleanedData)
    if (!initialData) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        platform: 'linkedin',
        content_type: 'post',
        notes: '',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Date <span className="text-red-600">*</span>
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
            Platform <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as ContentFormData['platform'] })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platformLabels[platform]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Content Type <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.content_type}
            onChange={(e) => setFormData({ ...formData, content_type: e.target.value as ContentFormData['content_type'] })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {contentTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Write your content notes..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.date}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Content' : 'Create Content'}
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

