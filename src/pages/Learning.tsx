import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLearning, LearningLog } from '../hooks/useLearning'
import LearningForm from '../components/learning/LearningForm'
import LearningList from '../components/learning/LearningList'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'

export default function Learning() {
  const { user } = useAuth()
  const {
    learningLogs,
    isLoading,
    createLearningLog,
    updateLearningLog,
    deleteLearningLog,
    isCreating,
    isUpdating,
    isDeleting,
  } = useLearning(user?.id)

  const [editingLog, setEditingLog] = useState<LearningLog | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (formData: Parameters<typeof createLearningLog>[0]) => {
    if (editingLog) {
      updateLearningLog({ id: editingLog.id, formData })
      setEditingLog(undefined)
      setShowForm(false)
    } else {
      createLearningLog(formData)
      setShowForm(false)
    }
  }

  const handleEdit = (log: LearningLog) => {
    setEditingLog(log)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingLog(undefined)
    setShowForm(false)
  }

  const handleAddLearning = () => {
    setEditingLog(undefined)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-sm theme-text-main">Loading...</div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Learning"
          description="Track your learning sessions and build your knowledge base"
          count={learningLogs.length}
          action={
            <button
              onClick={handleAddLearning}
              className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth flex items-center gap-2 w-full sm:w-auto theme-text-main theme-border theme-bg-card"
            >
              <Icon name="act-add" size={18} />
              Add learning
            </button>
          }
        />

        {(showForm || editingLog) && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">
              {editingLog ? 'Edit Learning Log' : 'Add Learning Log'}
            </h2>
            <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
              <LearningForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingLog}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <LearningList
            learningLogs={learningLogs}
            onEdit={handleEdit}
            onDelete={deleteLearningLog}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </PageTransition>
  )
}

