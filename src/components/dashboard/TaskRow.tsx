import { useState } from 'react'
import { DailyTask } from '../../hooks/useDailyTasks'

interface TaskRowProps {
  task: DailyTask
  isCompleted: boolean
  onToggle: () => void
  onEdit?: (taskId: string, newTitle: string) => void
  onDelete?: () => void
  isCompleting?: boolean
  isEditing?: boolean
  isDeleting?: boolean
}

export default function TaskRow({
  task,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  isCompleting = false,
  isEditing = false,
  isDeleting = false,
}: TaskRowProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(task.label)

  const handleSave = () => {
    if (onEdit && task.source_id && editTitle.trim()) {
      onEdit(task.source_id, editTitle.trim())
      setIsEditMode(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.label)
    setIsEditMode(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setIsEditMode(false)
    }
  }

  if (isEditMode && task.type === 'Manual') {
    return (
      <div className="p-3 border-2 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 mb-2 theme-bg-card theme-border theme-text-main"
          autoFocus
          disabled={isEditing}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isEditing || !editTitle.trim()}
            className="px-3 py-1.5 text-xs font-mono uppercase border-2 theme-border theme-text-main hover:border-cyan-400 hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            disabled={isEditing}
            className="px-3 py-1.5 text-xs font-mono uppercase border-2 theme-border theme-text-main hover:border-cyan-400 hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isEditing}
            className="px-3 py-1.5 text-xs font-mono uppercase border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 border-2 rounded-sm transition-elevation hover:shadow-card-hover backdrop-blur-modern theme-bg-form theme-border ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
        disabled={isCompleting}
        className="w-5 h-5 border-2 text-cyan-400 focus:ring-2 focus:ring-cyan-400 theme-bg-card theme-border"
      />
      <div className="flex-1">
        <div className={`font-mono text-sm ${isCompleted ? 'line-through' : ''} theme-text-main`}>{task.label}</div>
      </div>
      {task.type === 'Manual' && onEdit && (
        <button
          onClick={() => setIsEditMode(true)}
          disabled={isCompleting}
          className="p-1 theme-text-main hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

