import { DailyTask } from '../../hooks/useDailyTasks'

type TaskType = DailyTask['type'] | 'All'

interface TaskFiltersProps {
  selectedFilter: TaskType
  onFilterChange: (filter: TaskType) => void
}

const filters: TaskType[] = ['All', 'Manual', 'Learning', 'Content', 'Project']

export default function TaskFilters({ selectedFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors border-2 ${
            selectedFilter === filter
              ? 'bg-cyan-400 text-black shadow-hard theme-border'
              : 'text-white hover:border-cyan-400 hover:text-cyan-400 theme-bg-card theme-border theme-text-main'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

