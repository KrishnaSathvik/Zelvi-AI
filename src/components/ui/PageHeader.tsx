import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  count?: number
}

export default function PageHeader({ title, description, action, count }: PageHeaderProps) {
  return (
    <div className="space-y-3 animate-slide-in-up">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight theme-text-main">
              {title}
            </h1>
            {count !== undefined && (
              <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 border-2 border-cyan-400/50 rounded-lg font-mono text-sm font-semibold">
                {count}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm font-mono text-caption max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

