import { HTMLAttributes } from 'react'

type AccentVariant =
  | 'sparkle'
  | 'asterisk'
  | 'curly-arrow'
  | 'brackets'
  | 'marker-circle'
  | 'crosshair'
  | 'corner'
  | 'swoosh'
  | 'quote'
  | 'tri-points'

interface DecorativeAccentProps extends HTMLAttributes<HTMLDivElement> {
  variant: AccentVariant
  size?: number
  color?: string
  className?: string
  animated?: boolean
}

export default function DecorativeAccent({
  variant,
  size = 24,
  color = 'currentColor',
  className = '',
  animated = false,
  ...props
}: DecorativeAccentProps) {
  const baseClasses = `inline-flex items-center justify-center ${className}`

  const variants: Record<AccentVariant, JSX.Element> = {
    sparkle: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        className={animated ? 'animate-pulse' : ''}
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
    ),
    asterisk: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        className={animated ? 'animate-spin-slow' : ''}
      >
        <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" />
      </svg>
    ),
    'curly-arrow': (
      <svg
        width={size * 1.5}
        height={size}
        viewBox="0 0 100 20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M20 10 Q 50 0 80 10" strokeDasharray="4 4" />
        <path d="M70 5 L 80 10 L 85 15" />
      </svg>
    ),
    brackets: (
      <div className="flex gap-1">
        <svg
          width={size * 0.4}
          height={size}
          viewBox="0 0 20 60"
          fill="none"
          stroke={color}
          strokeWidth="3"
        >
          <path d="M15 1 L 5 10 L 5 50 L 15 59" />
        </svg>
        <svg
          width={size * 0.4}
          height={size}
          viewBox="0 0 20 60"
          fill="none"
          stroke={color}
          strokeWidth="3"
        >
          <path d="M5 1 L 15 10 L 15 50 L 5 59" />
        </svg>
      </div>
    ),
    'marker-circle': (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path
          d="M50 10 C 20 10 10 40 10 50 C 10 80 30 90 50 90 C 80 90 90 60 90 50 C 90 45 88 20 55 15"
          strokeDasharray="300"
          strokeDashoffset="0"
        />
      </svg>
    ),
    crosshair: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        stroke={color}
        strokeWidth="1"
      >
        <path d="M20 0v40M0 20h40" />
        <circle cx="20" cy="20" r="10" />
        <circle cx="20" cy="20" r="2" fill={color} />
      </svg>
    ),
    corner: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        stroke={color}
        strokeWidth="3"
      >
        <path d="M0 10 V0 H10" />
        <path d="M30 0 H40 V10" strokeWidth="1" opacity="0.5" />
        <path d="M40 30 V40 H30" />
        <path d="M10 40 H0 V30" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    swoosh: (
      <svg
        width={size * 2}
        height={size * 0.3}
        viewBox="0 0 100 20"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M5 15 Q 50 5 95 15" />
      </svg>
    ),
    quote: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
      </svg>
    ),
    'tri-points': (
      <div className="flex gap-1 items-center">
        <div
          className="rounded-full animate-bounce"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            backgroundColor: color,
            animationDelay: '0s',
          }}
        />
        <div
          className="rounded-full animate-bounce"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            backgroundColor: color,
            opacity: 0.7,
            animationDelay: '0.1s',
          }}
        />
        <div
          className="rounded-full animate-bounce"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            backgroundColor: color,
            opacity: 0.4,
            animationDelay: '0.2s',
          }}
        />
      </div>
    ),
  }

  return (
    <div className={baseClasses} {...props}>
      {variants[variant]}
    </div>
  )
}

