import { ReactNode } from 'react'
import Icon from './Icon'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}

const variantStyles: Record<AlertVariant, { icon: string; border: string; bg: string; text: string }> = {
  success: {
    icon: 'stat-success',
    border: 'border-l-4 border-success',
    bg: 'bg-success/10',
    text: 'text-success',
  },
  error: {
    icon: 'stat-error',
    border: 'border-l-4 border-error',
    bg: 'bg-error/10',
    text: 'text-error',
  },
  warning: {
    icon: 'stat-warning',
    border: 'border-l-4 border-warning',
    bg: 'bg-warning/10',
    text: 'text-warning',
  },
  info: {
    icon: 'stat-info',
    border: 'border-l-4 border-cyan-400',
    bg: 'bg-cyan-400/10',
    text: 'text-cyan-400',
  },
}

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={`${styles.border} ${styles.bg} p-4 flex items-start gap-4 ${className}`}
    >
      <Icon name={styles.icon as any} size={20} className={`${styles.text} mt-0.5 shrink-0`} />
      <div className="flex-1">
        {title && (
          <h4 className={`${styles.text} font-bold text-xs uppercase tracking-wide mb-1`}>
            {title}
          </h4>
        )}
        <p className="text-dim text-xs font-mono">{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:text-white transition-colors shrink-0"
          aria-label="Close alert"
        >
          <Icon name="sys-close" size={16} />
        </button>
      )}
    </div>
  )
}

