import { useMemo, useState } from 'react'
import { DailyTask } from '../../hooks/useDailyTasks'
import TaskRow from './TaskRow'
import { getTodayLocal, formatDateLocal, parseDateLocal } from '../../lib/dateUtils'

interface ActionListProps {
  tasks: DailyTask[]
  completedTaskKeys: Set<string>
  onCompleteTask: (task: DailyTask) => void
  onUncompleteTask: (task: DailyTask) => void
  onEditTask?: (taskId: string, newTitle: string) => void
  onDeleteTask?: (task: DailyTask) => void
  onCreateManualTask: (title: string) => void
  isCompleting?: boolean
  isEditing?: boolean
  isDeleting?: boolean
  isCreating?: boolean
}

export default function ActionList({
  tasks,
  completedTaskKeys,
  onCompleteTask,
  onUncompleteTask,
  onEditTask,
  onDeleteTask,
  onCreateManualTask,
  isCompleting = false,
  isEditing = false,
  isDeleting = false,
  isCreating = false,
}: ActionListProps) {
  const [newTaskInput, setNewTaskInput] = useState('')
  const today = getTodayLocal()

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskInput.trim()) {
      onCreateManualTask(newTaskInput.trim())
      setNewTaskInput('')
    }
  }

  // Group tasks by date (use due_date for manual tasks, task_date for others)
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, DailyTask[]>()
    
    tasks.forEach((task) => {
      // Use due_date if available (for manual tasks), otherwise use task_date
      const dateKey = task.due_date || task.task_date
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(task)
    })

    // Sort dates (oldest first)
    return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])))
  }, [tasks])

  const formatDate = (dateString: string) => {
    const date = parseDateLocal(dateString)
    const todayDate = parseDateLocal(today)
    const yesterdayDate = new Date(todayDate)
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterdayStr = formatDateLocal(yesterdayDate)

    if (dateString === today) {
      return 'Today'
    } else if (dateString === yesterdayStr) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== todayDate.getFullYear() ? 'numeric' : undefined })
    }
  }

  const formatTodayDate = () => {
    const date = parseDateLocal(today)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="border-2 p-4 sm:p-6 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold font-mono uppercase theme-text-main">Today's Tasks List</h2>
        <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{formatTodayDate()}</div>
      </div>

      <form onSubmit={handleCreateTask} className="mb-4">
        <input
          type="text"
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          placeholder="Add anything to do today…"
          className="w-full px-3 sm:px-4 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          disabled={isCreating}
        />
      </form>

      <div className="space-y-4">
        {tasksByDate.size === 0 ? (
          <div className="text-center py-8 font-mono text-xs theme-text-main">
            No tasks for today.
          </div>
        ) : (
          Array.from(tasksByDate.entries()).map(([dateKey, dateTasks]) => {
            const isToday = dateKey === today
            return (
              <div key={dateKey} className="space-y-2">
                {!isToday && (
                  <div className="text-xs font-mono uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(dateKey)}
                  </div>
                )}
                {dateTasks.map((task) => {
                  const isCompleted = completedTaskKeys.has(task.task_key)
                  return (
                    <div key={task.task_key} className="stagger-item">
                      <TaskRow
                        task={task}
                        isCompleted={isCompleted}
                        onToggle={() => {
                          if (isCompleted) {
                            onUncompleteTask(task)
                          } else {
                            onCompleteTask(task)
                          }
                        }}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask ? () => onDeleteTask(task) : undefined}
                        isCompleting={isCompleting}
                        isEditing={isEditing}
                        isDeleting={isDeleting}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

