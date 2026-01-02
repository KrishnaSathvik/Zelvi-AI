import { ContentFilters as ContentFiltersType } from '../../hooks/useContent'

interface ContentFiltersProps {
  filters: ContentFiltersType
  onFiltersChange: (filters: ContentFiltersType) => void
}

const platforms: Array<{ value: ContentFiltersType['platform']; label: string }> = [
  { value: undefined, label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'medium', label: 'Medium' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'other', label: 'Other' },
]


export default function ContentFilters({ filters, onFiltersChange }: ContentFiltersProps) {
  const hasActiveFilters = filters.platform || filters.dateFrom || filters.dateTo

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="mb-6 border-2 p-3 sm:p-4 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-end">
      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>Platform</label>
        <select
          value={filters.platform || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              platform: e.target.value ? (e.target.value as ContentFiltersType['platform']) : undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
        >
          {platforms.map((platform) => (
            <option key={platform.value || 'all'} value={platform.value || ''}>
              {platform.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>From Date</label>
        <input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              dateFrom: e.target.value || undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
        />
      </div>

      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-2" style={{ color: 'var(--text-main)' }}>To Date</label>
        <input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              dateTo: e.target.value || undefined,
            })
          }
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
        />
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

