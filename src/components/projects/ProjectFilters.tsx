import { ProjectFilters as ProjectFiltersType } from '../../hooks/useProjects'

interface ProjectFiltersProps {
  filters: ProjectFiltersType
  onFiltersChange: (filters: ProjectFiltersType) => void
}

const statuses: Array<{ value: ProjectFiltersType['status']; label: string }> = [
  { value: undefined, label: 'All Statuses' },
  { value: 'planning', label: 'Planning' },
  { value: 'building', label: 'Building' },
  { value: 'polishing', label: 'Polishing' },
  { value: 'deployed', label: 'Deployed' },
]

const priorities: Array<{ value: ProjectFiltersType['priority']; label: string }> = [
  { value: undefined, label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const categories: Array<{ value: ProjectFiltersType['category']; label: string }> = [
  { value: undefined, label: 'All Categories' },
  { value: 'data', label: 'Data' },
  { value: 'ai', label: 'AI' },
  { value: 'ml', label: 'ML' },
  { value: 'rag', label: 'RAG' },
  { value: 'agents', label: 'AGENTS' },
  { value: 'saas', label: 'SaaS' },
]

export default function ProjectFilters({ filters, onFiltersChange }: ProjectFiltersProps) {
  const hasActiveFilters = filters.status || filters.priority || filters.category

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="mb-6 border-2 p-3 sm:p-4 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>Status</label>
        <select
          value={filters.status || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value ? (e.target.value as ProjectFiltersType['status']) : undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
        >
          {statuses.map((status) => (
            <option key={status.value || 'all'} value={status.value || ''}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>Priority</label>
        <select
          value={filters.priority || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              priority: e.target.value ? (e.target.value as ProjectFiltersType['priority']) : undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
        >
          {priorities.map((priority) => (
            <option key={priority.value || 'all'} value={priority.value || ''}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              category: e.target.value ? (e.target.value as ProjectFiltersType['category']) : undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
        >
          {categories.map((category) => (
            <option key={category.value || 'all'} value={category.value || ''}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-mono text-xs hover:text-cyan-400 transition-colors w-full sm:w-auto"
          style={{ color: 'var(--text-main)' }}
        >
          Clear all
        </button>
      )}
      </div>
    </div>
  )
}

