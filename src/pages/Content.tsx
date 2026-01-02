import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useContent, type Content, type ContentFilters } from '../hooks/useContent'
import ContentForm from '../components/content/ContentForm'
import ContentList from '../components/content/ContentList'
import ContentFiltersComponent from '../components/content/ContentFilters'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'

export default function Content() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<ContentFilters>({})
  const {
    content,
    isLoading,
    createContent,
    updateContent,
    deleteContent,
    markAsPublished,
    isCreating,
    isUpdating,
    isDeleting,
    isMarkingPublished,
  } = useContent(user?.id, filters)

  const [editingContent, setEditingContent] = useState<Content | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (formData: Parameters<typeof createContent>[0]) => {
    if (editingContent) {
      updateContent({ id: editingContent.id, formData })
      setEditingContent(undefined)
      setShowForm(false)
    } else {
      createContent(formData)
      setShowForm(false)
    }
  }

  const handleEdit = (contentItem: Content) => {
    setEditingContent(contentItem)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingContent(undefined)
    setShowForm(false)
  }

  const handleAddContent = () => {
    setEditingContent(undefined)
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
          title="Content"
          description="Plan and track your content across different platforms"
          count={content.length}
          action={
            <button
              onClick={handleAddContent}
              className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth flex items-center gap-2 w-full sm:w-auto theme-text-main theme-border theme-bg-card"
            >
              <Icon name="act-add" size={18} />
              Add content
            </button>
          }
        />

        <div className="space-y-4">
          <ContentFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        {(showForm || editingContent) && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">
              {editingContent ? 'Edit Content' : 'Add Content'}
            </h2>
            <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
              <ContentForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingContent}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <ContentList
            content={content}
            onEdit={handleEdit}
            onDelete={deleteContent}
            onMarkAsPublished={markAsPublished}
            isDeleting={isDeleting}
            isMarkingPublished={isMarkingPublished}
          />
        </div>
      </div>
    </PageTransition>
  )
}

