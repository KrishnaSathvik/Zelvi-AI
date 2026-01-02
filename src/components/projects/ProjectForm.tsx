import { useState, useEffect } from 'react'
import { ProjectFormData, Project } from '../../hooks/useProjects'

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void
  onCancel?: () => void
  initialData?: Project
  isLoading?: boolean
}

const categories: ProjectFormData['category'][] = ['data', 'ai', 'ml', 'rag', 'agents', 'saas']
const categoryLabels: Record<ProjectFormData['category'], string> = {
  data: 'Data',
  ai: 'AI',
  ml: 'ML',
  rag: 'RAG',
  agents: 'AGENTS',
  saas: 'SaaS',
}

const statuses: ProjectFormData['status'][] = ['planning', 'building', 'polishing', 'deployed']
const statusLabels: Record<ProjectFormData['status'], string> = {
  planning: 'Planning',
  building: 'Building',
  polishing: 'Polishing',
  deployed: 'Deployed',
}

const priorities: ProjectFormData['priority'][] = ['high', 'medium', 'low']
const priorityLabels: Record<ProjectFormData['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function ProjectForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    category: 'data',
    status: 'planning',
    priority: 'medium',
    github_url: '',
    live_url: '',
    next_action: '',
    notes: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        status: initialData.status,
        priority: initialData.priority,
        github_url: initialData.github_url || '',
        live_url: initialData.live_url || '',
        next_action: initialData.next_action || '',
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const cleanedData = {
      ...formData,
      github_url: formData.github_url?.trim() || undefined,
      live_url: formData.live_url?.trim() || undefined,
      next_action: formData.next_action?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    }

    onSubmit(cleanedData)
    if (!initialData) {
      setFormData({
        name: '',
        category: 'data',
        status: 'planning',
        priority: 'medium',
        github_url: '',
        live_url: '',
        next_action: '',
        notes: '',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Category <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectFormData['category'] })}
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

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Status <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectFormData['status'] })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Priority <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectFormData['priority'] })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Live URL
          </label>
          <input
            type="url"
            value={formData.live_url}
            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Next Action
        </label>
        <input
          type="text"
          value={formData.next_action}
          onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          placeholder="What's the next step for this project?"
        />
        <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
          Projects with a next action will generate daily tasks
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Additional notes about this project..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
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
    </form>
  )
}

