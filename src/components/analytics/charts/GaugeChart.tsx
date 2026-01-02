import { useEffect, useRef, useState } from 'react'
import ChartBase, { mapValue } from './ChartBase'

interface GaugeChartProps {
  value: number
  max?: number
  height?: number
  title?: string
  summary?: string
  color?: string
  animate?: boolean
}

export default function GaugeChart({
  value,
  max = 100,
  height = 200,
  title,
  summary,
  color = '#ff3300',
  animate = true,
}: GaugeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
        }
      }
    }

    // Use requestAnimationFrame to ensure DOM is laid out
    const rafId = requestAnimationFrame(() => {
      updateDimensions()
    })

    // Use ResizeObserver for better dimension tracking
    let resizeObserver: ResizeObserver | null = null
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', updateDimensions)
    
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateDimensions)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  // Wait for dimensions to be set before rendering
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height}>
        <div className="w-full h-full flex items-end justify-center pb-4" ref={containerRef} style={{ minHeight: `${height}px` }} />
      </ChartBase>
    )
  }

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const centerX = dimensions.width / 2
  const centerY = dimensions.height - 10
  const radius = dimensions.height - 20

  // Gauge arc goes from Math.PI (left) to 0 (right)
  const angle = mapValue(percentage, 0, 100, Math.PI, 0)
  const x = centerX + radius * Math.cos(angle)
  const y = centerY - radius * Math.sin(angle)

  const pathData = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${x} ${y}`

  return (
    <ChartBase title={title} summary={summary} height={height}>
      <div ref={containerRef} className="w-full h-full flex items-end justify-center pb-4" style={{ minHeight: `${height}px` }}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible theme-text-main"
          style={{ color: 'var(--text-main)' }}
        >
          {/* Background arc */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
            fill="none"
            stroke="#171717"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Value arc */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            className={animate ? 'draw-path' : ''}
            style={
              animate
                ? {
                    strokeDasharray: 1000,
                    strokeDashoffset: 1000,
                    animation: 'dash 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }
                : {}
            }
          />

          {/* Value text */}
          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            fill="currentColor"
            fontFamily="JetBrains Mono"
            fontSize="24"
            className="font-mono font-bold"
          >
            {Math.round(percentage)}
          </text>
        </svg>
      </div>
    </ChartBase>
  )
}

