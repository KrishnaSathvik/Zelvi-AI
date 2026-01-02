import { useEffect, useRef, useState } from 'react'
import ChartBase, { mapValue, getBezierPath } from './ChartBase'

interface LineData {
  dataKey: string
  color: string
  label: string
}

interface MultiLineChartProps {
  data: Array<{ [key: string]: string | number }>
  lines: LineData[]
  xKey: string
  height?: number
  title?: string
  summary?: string
  showGrid?: boolean
  animate?: boolean
  showDots?: boolean
  icon?: React.ReactNode
}

export default function MultiLineChart({
  data,
  lines,
  xKey,
  height = 300,
  title,
  summary,
  showGrid = true,
  animate = true,
  icon,
  showDots = false,
}: MultiLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
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

  if (data.length === 0 || lines.length === 0) {
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

  // Get all values from all lines
  const allValues: number[] = []
  lines.forEach((line) => {
    data.forEach((d) => {
      const value = Number(d[line.dataKey])
      if (!isNaN(value)) {
        allValues.push(value)
      }
    })
  })

  // Handle case where all values are missing or invalid
  if (allValues.length === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="flex items-center justify-center h-full text-dim font-mono text-sm">
          No valid data available
        </div>
      </ChartBase>
    )
  }

  const minValue = Math.min(...allValues, 0)
  const maxValue = Math.max(...allValues) || 1
  
  // Ensure there's always a visible range (at least 10% padding from min to max)
  // This makes small values more visible
  const valueRange = maxValue - minValue
  const paddingAmount = Math.max(valueRange * 0.1, 0.5) // At least 0.5 units of padding
  const adjustedMin = Math.max(0, minValue - paddingAmount)
  const adjustedMax = maxValue + paddingAmount

  // Handle single data point case to avoid division by zero
  const xRange = data.length > 1 ? data.length - 1 : 1

  const linePoints = lines.map((line) =>
    data.map((d, i) => ({
      x: mapValue(i, 0, xRange, padding, dimensions.width - padding),
      y: mapValue(Number(d[line.dataKey]), adjustedMin, adjustedMax, dimensions.height - padding, padding),
      value: Number(d[line.dataKey]),
      label: String(d[xKey]),
    }))
  )

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Find closest point index
    const closestIndex = linePoints[0].reduce((prev, curr, i) => {
      return Math.abs(curr.x - x) < Math.abs(linePoints[0][prev].x - x) ? i : prev
    }, 0)

    const values = lines.map((line, lineIndex) => ({
      label: line.label,
      value: linePoints[lineIndex][closestIndex].value,
      color: line.color,
    }))

    setTooltip({
      x: e.clientX,
      y: e.clientY,
      values,
      xLabel: linePoints[0][closestIndex].label,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <ChartBase title={title} summary={summary} height={height} icon={icon}>
      <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
        >
          <defs>
            {lines.map((line, i) => (
              <linearGradient key={i} id={`lineGradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={line.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={line.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

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

          {/* Area fills and lines */}
          {linePoints.map((points, lineIndex) => {
            const line = lines[lineIndex]
            const pathD = getBezierPath(points)

            return (
              <g key={lineIndex}>
                {/* Area fill */}
                <path
                  d={`${pathD} L ${dimensions.width - padding},${dimensions.height - padding} L ${padding},${dimensions.height - padding} Z`}
                  fill={`url(#lineGradient-${lineIndex})`}
                  className={animate ? 'fade-in' : ''}
                />

                {/* Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="2"
                  className={animate ? 'draw-path' : ''}
                  style={
                    animate
                      ? {
                          strokeDasharray: 1000,
                          strokeDashoffset: 1000,
                          animationDelay: `${lineIndex * 0.2}s`,
                        }
                      : {}
                  }
                />

                {/* Data points - only show when enabled and value > 0 */}
                {showDots && points.map((point, i) => 
                  point.value > 0 ? (
                    <circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#0a0a0a"
                      stroke={line.color}
                      strokeWidth="2"
                      className={animate ? 'fade-in' : ''}
                      style={
                        animate
                          ? { animationDelay: `${0.5 + lineIndex * 0.2 + i * 0.1}s` }
                          : {}
                      }
                    />
                  ) : null
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-50 bg-black/95 backdrop-blur-md border border-cyan-400/30 px-4 py-3 rounded-sm shadow-lg font-mono text-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 50}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-white mb-2 text-sm">{tooltip.xLabel}</div>
            {tooltip.values.map((v, i) => (
              <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-gray-300">{v.label}:</span>
                <span className="text-cyan-400 font-semibold">{v.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/30"></div>
          </div>
        )}
      </div>
    </ChartBase>
  )
}

