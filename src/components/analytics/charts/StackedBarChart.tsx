import { useEffect, useRef, useState } from 'react'
import ChartBase, { mapValue } from './ChartBase'

interface StackedBarData {
  dataKey: string
  color: string
  label: string
}

interface StackedBarChartProps {
  data: Array<{ [key: string]: string | number }>
  stacks: StackedBarData[]
  xKey: string
  height?: number
  title?: string
  summary?: string
  showGrid?: boolean
  animate?: boolean
  icon?: React.ReactNode
}

export default function StackedBarChart({
  data,
  stacks,
  xKey,
  height = 300,
  title,
  summary,
  showGrid = true,
  animate = true,
  icon,
}: StackedBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    values: Array<{ label: string; value: number; color: string }>
    xLabel: string
  } | null>(null)

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

  if (data.length === 0 || stacks.length === 0) {
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
        <div className="w-full h-full" ref={containerRef} style={{ minHeight: `${height}px` }} />
      </ChartBase>
    )
  }

  const padding = 40
  const chartWidth = dimensions.width - padding * 2
  const chartHeight = dimensions.height - padding * 2

  // Calculate totals for each x value
  const totals = data.map((d) =>
    stacks.reduce((sum, stack) => sum + Number(d[stack.dataKey]), 0)
  )
  const maxTotal = Math.max(...totals) || 1

  const barWidth = (chartWidth / data.length) * 0.6
  const spacing = chartWidth / data.length

  const handleBarHover = (index: number, e: React.MouseEvent<SVGRectElement>) => {
    setHoveredIndex(index)
    const rect = e.currentTarget.getBoundingClientRect()
    const values = stacks.map((stack) => ({
      label: stack.label,
      value: Number(data[index][stack.dataKey]),
      color: stack.color,
    }))

    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      values,
      xLabel: String(data[index][xKey]),
    })
  }

  const handleBarLeave = () => {
    setHoveredIndex(null)
    setTooltip(null)
  }

  return (
    <ChartBase title={title} summary={summary} height={height} icon={icon}>
      <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = mapValue(ratio, 0, 1, dimensions.height - padding, padding)
                return (
                  <line
                    key={ratio}
                    x1={padding}
                    y1={y}
                    x2={dimensions.width - padding}
                    y2={y}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )
              })}
            </g>
          )}

          {/* Stacked bars */}
          {data.map((item, i) => {
            const x = padding + i * spacing + spacing / 2 - barWidth / 2
            let currentY = dimensions.height - padding
            const isHovered = hoveredIndex === i

            return (
              <g key={i}>
                {stacks.map((stack, stackIndex) => {
                  const value = Number(item[stack.dataKey])
                  const barHeight = mapValue(value, 0, maxTotal, 0, chartHeight)
                  const y = currentY - barHeight

                  const rect = (
                    <rect
                      key={stackIndex}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={isHovered ? stack.color : stack.color}
                      opacity={isHovered ? 1 : 0.9}
                      className={animate ? 'grow-bar' : ''}
                      style={
                        animate
                          ? {
                              animationDelay: `${(i * stacks.length + stackIndex) * 0.05}s`,
                              transformOrigin: 'bottom',
                            }
                          : {}
                      }
                      onMouseEnter={(e) => handleBarHover(i, e)}
                      onMouseLeave={handleBarLeave}
                    />
                  )

                  currentY = y
                  return rect
                })}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-50 bg-black/90 backdrop-blur-sm border border-white/20 px-3 py-2 rounded font-mono text-xs text-white"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 40}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold mb-1">{tooltip.xLabel}</div>
            {tooltip.values.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span>{v.label}:</span>
                <span className="text-cyan-400">{v.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartBase>
  )
}

