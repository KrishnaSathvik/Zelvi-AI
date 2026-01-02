import { InputHTMLAttributes, forwardRef } from 'react'
import Icon from './Icon'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-5 h-5 border-2 transition-all duration-200 flex items-center justify-center ${
                error
                  ? 'border-error bg-error/10'
                  : 'border-dim bg-surface peer-checked:bg-cyan-400 peer-checked:border-cyan-400 group-hover:border-cyan-400'
              }`}
            >
              <Icon
                name="stat-success"
                size={14}
                className="text-black transform scale-0 transition-transform duration-200 peer-checked:scale-100"
              />
            </div>
          </div>
          {label && (
            <span
              className={`text-sm font-mono text-xs transition-colors ${
                error
                  ? 'text-red-600'
                  : ''
              }`}
              style={!error ? { color: 'var(--text-main)' } : undefined}
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

Checkbox.displayName = 'Checkbox'

export default Checkbox

