import { useEffect, useRef, useState } from 'react'
import ChartBase from './ChartBase'

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  height?: number
  title?: string
  summary?: string
  colors?: string[]
  animate?: boolean
  icon?: React.ReactNode
}

const DEFAULT_COLORS = ['#404040', '#ffffff', '#ff3300', '#84cc16', '#6b7280']

export default function DonutChart({
  data,
  height = 300,
  title,
  summary,
  colors = DEFAULT_COLORS,
  animate = true,
  icon,
}: DonutChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        if (width > 0 && height > 0) {
          const size = Math.min(width, height)
          setDimensions({ width: size, height: size })
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

  if (data.length === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="flex items-center justify-center h-full text-dim font-mono text-sm">
          No data available
        </div>
      </ChartBase>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="flex items-center justify-center h-full text-dim font-mono text-sm">
          No data available
        </div>
      </ChartBase>
    )
  }

  // Wait for dimensions to be set before rendering
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="w-full h-full flex items-center justify-center" ref={containerRef} style={{ minHeight: `${height}px` }} />
      </ChartBase>
    )
  }

  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2
  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 20
  const holeRadius = radius * 0.6

  let currentAngle = -Math.PI / 2

  const slices = data.map((item, i) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle

    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    const largeArc = sliceAngle > Math.PI ? 1 : 0

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`,
    ].join(' ')

    const slice = {
      pathData,
      color: item.color || colors[i % colors.length],
      percentage: Math.round((item.value / total) * 100),
      name: item.name,
      value: item.value,
      startAngle,
      endAngle,
    }

    currentAngle += sliceAngle
    return slice
  })

  return (
    <ChartBase title={title} summary={summary} height={height} icon={icon}>
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" style={{ minHeight: `${height}px` }}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible"
        >
          {/* Slices */}
          {slices.map((slice, i) => {
            const isHovered = hoveredIndex === i
            const scale = isHovered ? 1.05 : 1
            const midAngle = (slice.startAngle + slice.endAngle) / 2
            const transformX = centerX + (isHovered ? Math.cos(midAngle) * 5 : 0)
            const transformY = centerY + (isHovered ? Math.sin(midAngle) * 5 : 0)

            return (
              <g
                key={i}
                transform={`translate(${transformX - centerX}, ${transformY - centerY}) scale(${scale})`}
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              >
                <path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#0a0a0a"
                  strokeWidth="2"
                  className={animate ? 'fade-in' : ''}
                  style={animate ? { animationDelay: `${i * 0.1}s` } : {}}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            )
          })}

          {/* Hole */}
          <circle
            cx={centerX}
            cy={centerY}
            r={holeRadius}
            fill="#0a0a0a"
          />

          {/* Center text */}
          <text
            x={centerX}
            y={centerY + 5}
            textAnchor="middle"
            fill="#e5e5e5"
            fontFamily="JetBrains Mono"
            fontSize="14"
            className="font-mono"
          >
            TOTAL
          </text>
        </svg>
      </div>
    </ChartBase>
  )
}

