import { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  lines?: number
  animated?: boolean
}

export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animated = true,
  className = '',
  ...props
}: SkeletonProps) {
  const baseClasses = `bg-[var(--text-main)]/10 ${animated ? 'animate-pulse' : ''}`
  
  const variantClasses = {
    text: 'rounded-sm h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    card: 'rounded-sm theme-bg-card border-2 theme-border p-4',
  }
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              width: i === lines - 1 && width ? '80%' : width || '100%',
              height: height || undefined,
            }}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: width || (variant === 'circular' ? height || '40px' : undefined),
        height: height || (variant === 'circular' ? width || '40px' : '20px'),
      }}
      {...props}
    />
  )
}

