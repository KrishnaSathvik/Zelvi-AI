import { HTMLAttributes } from 'react'
import Icon from './Icon'

interface Step {
  label: string
  status: 'completed' | 'active' | 'pending'
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  className?: string
}

export default function Stepper({ steps, className = '', ...props }: StepperProps) {
  return (
    <div className={`flex items-center w-full ${className}`} {...props}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === 'completed'
        const isActive = step.status === 'active'

        return (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 border-2 flex items-center justify-center rounded-full z-10 transition-all ${
                  isCompleted
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : isActive
                    ? 'border-white bg-black shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                    : 'border-dim bg-black'
                }`}
              >
                {isCompleted ? (
                  <Icon name="stat-success" size={16} className="text-cyan-400" />
                ) : isActive ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ) : (
                  <span className="text-xs text-dim">{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute top-10 text-[10px] font-bold uppercase ${
                  isCompleted
                    ? 'text-cyan-400'
                    : isActive
                    ? 'text-white'
                    : 'text-dim'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={`flex-1 h-[1px] mx-2 transition-colors ${
                  isCompleted ? 'bg-cyan-400' : 'bg-dim'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

