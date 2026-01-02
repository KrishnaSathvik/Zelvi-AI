import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useGoals, Goal } from '../hooks/useGoals'
import GoalList from '../components/goals/GoalList'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'

export default function Goals() {
  const { user } = useAuth()
  const { goals, isLoading, createGoal, updateGoal, deleteGoal, isCreating, isUpdating, isDeleting } = useGoals(user?.id)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [goalText, setGoalText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedText = goalText.trim()
    if (!trimmedText) return

    if (editingGoal) {
      updateGoal({ id: editingGoal.id, data: { title: trimmedText } })
    } else {
      createGoal({ title: trimmedText })
    }
    setGoalText('')
    setEditingGoal(null)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalText(goal.title)
  }

  const handleCancel = () => {
    setGoalText('')
    setEditingGoal(null)
  }

  const handleDelete = (id: string) => {
    deleteGoal(id)
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Goals"
          description="Set your goals"
          count={goals.length}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 p-6 sm:p-8 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <label className="block text-sm font-medium font-mono text-xs uppercase mb-2 theme-text-main">
              {editingGoal ? 'Edit Goal' : 'Add Goal'}
            </label>
            <textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Enter your goal..."
              rows={3}
              className="w-full px-4 py-3 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main resize-none"
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={isCreating || isUpdating || !goalText.trim()}
                className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
              >
                {isCreating || isUpdating ? 'Saving...' : editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
              {editingGoal && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading ? (
            <div className="font-mono text-sm theme-text-main">Loading goals...</div>
          ) : (
            <GoalList goals={goals} onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />
          )}
        </div>
      </div>
    </PageTransition>
  )
}

