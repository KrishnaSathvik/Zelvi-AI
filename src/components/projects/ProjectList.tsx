import { Project } from '../../hooks/useProjects'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const statusColors: Record<Project['status'], string> = {
  planning: 'bg-gray-500/60 text-white dark:text-white border-gray-600',
  building: 'bg-blue-500/60 text-white dark:text-white border-blue-600',
  polishing: 'bg-yellow-500/60 text-black dark:text-black border-yellow-600',
  deployed: 'bg-green-500/60 text-white dark:text-white border-green-600',
}

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  building: 'Building',
  polishing: 'Polishing',
  deployed: 'Deployed',
}

const categoryLabels: Record<Project['category'], string> = {
  data: 'Data',
  ai: 'AI',
  ml: 'ML',
  rag: 'RAG',
  agents: 'AGENTS',
  saas: 'SaaS',
}

const priorityColors: Record<Project['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

const priorityLabels: Record<Project['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export default function ProjectList({ projects, onEdit, onDelete, isDeleting }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 font-mono text-xs theme-text-main">
        <p>No projects yet. Create your first project to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border-2 p-4 sm:p-5 hover:border-cyan-400 transition-colors rounded-sm backdrop-blur-modern theme-bg-form theme-border"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold font-mono flex-1 break-words theme-text-main">{project.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(project)}
                className="hover:text-cyan-400 transition-colors"
                title="Edit project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete project "${project.name}"?`)) {
                    onDelete(project.id)
                  }
                }}
                disabled={isDeleting}
                className="hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
            <span className="px-2 py-1 text-xs font-medium font-mono border-2 theme-border theme-bg-page">
              {categoryLabels[project.category]}
            </span>
            <span className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${priorityColors[project.priority]}`}>
              {priorityLabels[project.priority]}
            </span>
          </div>

          {project.next_action && (
            <div className="mb-3">
              <p className="text-sm font-mono text-xs mb-1 theme-text-main">Next:</p>
              <p className="text-sm font-mono text-xs theme-text-main">{project.next_action}</p>
            </div>
          )}

          <div className="flex gap-3 mb-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="Live Site"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {project.notes && (
            <div className="mt-3 pt-3 border-t-2 theme-border">
              <p className="text-sm font-mono text-xs line-clamp-2 theme-text-main">{project.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

