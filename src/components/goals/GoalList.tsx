import { Goal } from '../../hooks/useGoals'

interface GoalListProps {
  goals: Goal[]
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function GoalCard({ goal, onEdit, onDelete, isDeleting }: {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}) {
  return (
    <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex items-start justify-between gap-4">
        <p className="text-lg font-mono theme-text-main flex-1">{goal.title}</p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 hover:text-cyan-400 hover:border-cyan-400 border-2 theme-border transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this goal?')) {
                onDelete(goal.id)
              }
            }}
            disabled={isDeleting}
            className="p-2 hover:text-red-600 hover:border-red-600 border-2 theme-border transition-colors disabled:opacity-50"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GoalList({ goals, onEdit, onDelete, isDeleting }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="border-2 p-8 text-center rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <p className="font-mono text-xs theme-text-main">No goals yet. Create your first goal to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}

