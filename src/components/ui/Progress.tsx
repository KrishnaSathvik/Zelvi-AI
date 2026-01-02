import { HTMLAttributes } from 'react'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  variant?: 'default' | 'lime' | 'accent' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Progress({
  value,
  max = 100,
  showLabel = false,
  variant = 'default',
  size = 'md',
  animated = true,
  className = '',
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const variantClasses = {
    default: 'bg-cyan-400',
    lime: 'bg-gradient-lime',
    accent: 'bg-gradient-accent',
    success: 'bg-success',
    error: 'bg-error',
  }
  
  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Progress</span>
          <span className="text-sm font-mono font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} theme-bg-page rounded-full overflow-hidden`}>
        <div
          className={`h-full ${variantClasses[variant]} transition-all duration-500 ease-out rounded-full ${
            animated ? 'animate-fade-in-scale' : ''
          }`}
          style={{
            width: `${percentage}%`,
            transition: animated ? 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        />
      </div>
    </div>
  )
}
