import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRecruiters, Recruiter, RecruiterFilters } from '../hooks/useRecruiters'
import RecruiterForm from '../components/recruiters/RecruiterForm'
import RecruiterList from '../components/recruiters/RecruiterList'
import RecruiterFiltersComponent from '../components/recruiters/RecruiterFilters'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'

export default function Recruiters() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<RecruiterFilters>({})
  const {
    recruiters,
    isLoading,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRecruiters(user?.id, filters)

  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (formData: Parameters<typeof createRecruiter>[0]) => {
    if (editingRecruiter) {
      updateRecruiter({ id: editingRecruiter.id, formData })
      setEditingRecruiter(undefined)
      setShowForm(false)
    } else {
      createRecruiter(formData)
      setShowForm(false)
    }
  }

  const handleEdit = (recruiter: Recruiter) => {
    setEditingRecruiter(recruiter)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingRecruiter(undefined)
    setShowForm(false)
  }

  const handleAddRecruiter = () => {
    setEditingRecruiter(undefined)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-sm text-muted">Loading...</div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Recruiters"
          description="Manage your recruiter contacts and track your networking pipeline"
          count={recruiters.length}
          action={
            <button
              onClick={handleAddRecruiter}
              className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth flex items-center gap-2 w-full sm:w-auto theme-text-main theme-border theme-bg-card"
            >
              <Icon name="act-add" size={18} />
              Add recruiter
            </button>
          }
        />

        <div className="space-y-4">
          <RecruiterFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        {(showForm || editingRecruiter) && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">
              {editingRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}
            </h2>
            <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
              <RecruiterForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingRecruiter}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <RecruiterList
          recruiters={recruiters}
          onEdit={handleEdit}
          onDelete={deleteRecruiter}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </PageTransition>
  )
}

