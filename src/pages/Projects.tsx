import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProjects, Project, ProjectFilters } from '../hooks/useProjects'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectList from '../components/projects/ProjectList'
import ProjectFiltersComponent from '../components/projects/ProjectFilters'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'

export default function Projects() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<ProjectFilters>({})
  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProjects(user?.id, filters)

  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (formData: Parameters<typeof createProject>[0]) => {
    if (editingProject) {
      updateProject({ id: editingProject.id, formData })
      setEditingProject(undefined)
      setShowForm(false)
    } else {
      createProject(formData)
      setShowForm(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingProject(undefined)
    setShowForm(false)
  }

  const handleAddProject = () => {
    setEditingProject(undefined)
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
          title="Projects"
          description="Manage your projects and track progress with next actions"
          count={projects.length}
          action={
            <button
              onClick={handleAddProject}
              className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth flex items-center gap-2 w-full sm:w-auto theme-text-main theme-border theme-bg-card"
            >
              <Icon name="act-add" size={18} />
              Add project
            </button>
          }
        />

        <div className="space-y-4">
          <ProjectFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        {(showForm || editingProject) && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">
              {editingProject ? 'Edit Project' : 'Add Project'}
            </h2>
            <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
              <ProjectForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingProject}
                isLoading={isCreating || isUpdating}
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={deleteProject}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </PageTransition>
  )
}

