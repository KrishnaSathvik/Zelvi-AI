import { ReactNode } from 'react'

interface ChartBaseProps {
  children: ReactNode
  title?: string
  summary?: string
  className?: string
  height?: number
  icon?: ReactNode
}

export default function ChartBase({
  children,
  title,
  summary,
  className = '',
  height = 300,
  icon,
}: ChartBaseProps) {
  return (
    <div 
      className={`border-2 p-4 md:p-6 backdrop-blur-modern theme-bg-form theme-border rounded-sm ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          {icon && (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-acid/20 flex items-center justify-center border border-acid/30 flex-shrink-0">
              {icon}
            </div>
          )}
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest font-mono theme-text-main">{title}</h3>
        </div>
      )}
      <div style={{ height: `${height}px`, width: '100%' }} className="relative">
        {children}
      </div>
      {summary && (
        <div className="mt-4 text-sm font-mono text-xs theme-text-main opacity-80">
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}

// Utility function to map value to coordinate
export const mapValue = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  // Handle division by zero when input range is zero
  if (inMax === inMin) {
    return outMin
  }
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// Utility function to create bezier path
export const getBezierPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length === 0) return ''
  
  let d = `M ${points[0].x},${points[0].y}`
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cp1x = prev.x + (curr.x - prev.x) * 0.5
    const cp1y = prev.y
    const cp2x = curr.x - (curr.x - prev.x) * 0.5
    const cp2y = curr.y
    
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`
  }
  
  return d
}

