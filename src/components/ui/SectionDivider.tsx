import { HTMLAttributes } from 'react'

type DividerVariant =
  | 'wave'
  | 'tilt'
  | 'steps'
  | 'arrow'
  | 'layers'
  | 'zigzag'
  | 'gradient'

interface SectionDividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant
  height?: number
  className?: string
}

const dividerPaths: Record<DividerVariant, string> = {
  wave: 'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z',
  tilt: 'M1200 120L0 16.48V0h1200V120z',
  steps: 'M0,0v60h200v20h200v20h200v20h200V80h200V60h200V0H0z',
  arrow: 'M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z',
  layers: 'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
  zigzag: 'M0 0 L20 40 L40 0 L60 40 L80 0 L100 40 L120 0 L140 40 L160 0 L180 40 L200 0 L220 40 L240 0 L260 40 L280 0 L300 40 L320 0 L340 40 L360 0 L380 40 L400 0 L420 40 L440 0 L460 40 L480 0 L500 40 L520 0 L540 40 L560 0 L580 40 L600 0 L620 40 L640 0 L660 40 L680 0 L700 40 L720 0 L740 40 L760 0 L780 40 L800 0 L820 40 L840 0 L860 40 L880 0 L900 40 L920 0 L940 40 L960 0 L980 40 L1000 0 L1020 40 L1040 0 L1060 40 L1080 0 L1100 40 L1120 0 L1140 40 L1160 0 L1180 40 L1200 0',
  gradient: '',
}

export default function SectionDivider({
  variant = 'gradient',
  height = 16,
  className = '',
  ...props
}: SectionDividerProps) {
  if (variant === 'gradient') {
    return (
      <div
        className={`w-full relative my-12 md:my-16 ${className}`}
        {...props}
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute inset-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm opacity-50" />
      </div>
    )
  }

  const path = dividerPaths[variant]
  const viewBoxHeight = variant === 'zigzag' ? 40 : 120

  return (
    <div className={`w-full my-12 md:my-16 ${className}`} {...props}>
      <svg
        className="w-full transition-opacity duration-300"
        style={{ height: `${height * 4}px` }}
        preserveAspectRatio="none"
        viewBox={`0 0 1200 ${viewBoxHeight}`}
        fill="none"
      >
        <defs>
          <linearGradient id={`divider-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgb(204, 255, 0)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#divider-gradient-${variant})`}
          className="transition-all duration-300"
        />
      </svg>
    </div>
  )
}

