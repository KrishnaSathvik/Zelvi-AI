import { InputHTMLAttributes, forwardRef } from 'react'
import Icon from './Icon'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`relative w-12 h-6 border-2 transition-all duration-300 ${
              error
                ? 'border-error bg-error/10'
                : 'border-dim bg-surface peer-checked:border-cyan-400 peer-checked:bg-cyan-400/10'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 transition-all duration-300 flex items-center justify-center ${
                error
                  ? 'bg-error'
                  : 'bg-dim peer-checked:bg-cyan-400 peer-checked:translate-x-6'
              }`}
            >
              <Icon
                name="stat-success"
                size={8}
                className="text-black opacity-0 peer-checked:opacity-100 transition-opacity"
              />
            </div>
          </div>
          {label && (
            <span
              className={`ml-3 text-sm font-mono text-xs transition-colors ${
                error ? 'text-error' : 'text-dim'
              }`}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <div className="mt-1 text-xs text-error font-mono animate-fade">
            {error}
          </div>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

export default Toggle

