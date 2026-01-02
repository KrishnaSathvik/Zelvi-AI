import { AnalyticsFilters as Filters } from '../../hooks/useAnalytics'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

interface AnalyticsFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function AnalyticsFilters({ filters, onChange }: AnalyticsFiltersProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const today = new Date()
  
  const handlePreset = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    onChange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    })
    setShowCustomPicker(false)
  }

  const handleCustom = () => {
    setShowCustomPicker(!showCustomPicker)
  }

  const isPresetActive = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)
    return (
      filters.startDate === startDate.toISOString().split('T')[0] &&
      filters.endDate === endDate.toISOString().split('T')[0]
    )
  }

  const isCustomActive = !isPresetActive(7) && !isPresetActive(30) && !isPresetActive(90) && !isPresetActive(180) && !isPresetActive(365)

  return (
    <div className="border-2 p-3 sm:p-4 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handlePreset(7)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
              isPresetActive(7)
                ? 'bg-acid/20 text-acid border-acid/50'
                : 'bg-surface text-dim border-border hover:border-acid/30'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => handlePreset(30)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
              isPresetActive(30)
                ? 'bg-acid/20 text-acid border-acid/50'
                : 'bg-surface text-dim border-border hover:border-acid/30'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => handlePreset(90)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
              isPresetActive(90)
                ? 'bg-acid/20 text-acid border-acid/50'
                : 'bg-surface text-dim border-border hover:border-acid/30'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => handlePreset(365)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
              isPresetActive(365)
                ? 'bg-acid/20 text-acid border-acid/50'
                : 'bg-surface text-dim border-border hover:border-acid/30'
            }`}
          >
            1 Year
          </button>
          <button
            onClick={handleCustom}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all flex items-center gap-1.5 ${
              isCustomActive || showCustomPicker
                ? 'bg-acid/20 text-acid border-acid/50'
                : 'bg-surface text-dim border-border hover:border-acid/30'
            }`}
          >
            <Calendar className="w-3 h-3" />
            Custom
          </button>
        </div>

        {(showCustomPicker || isCustomActive) && (
          <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row gap-3 p-4 bg-surface border border-border rounded-sm w-full">
            <div className="flex-1">
              <label className="block text-[10px] md:text-xs font-mono uppercase tracking-wider text-dim mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
                max={today.toISOString().split('T')[0]}
                className="px-3 py-1 text-sm border-2 font-mono text-xs focus:outline-none focus:border-cyan-400 w-full date-input-calendar theme-bg-card theme-border theme-text-main"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] md:text-xs font-mono uppercase tracking-wider text-dim mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                max={today.toISOString().split('T')[0]}
                className="px-3 py-1 text-sm border-2 font-mono text-xs focus:outline-none focus:border-cyan-400 w-full date-input-calendar theme-bg-card theme-border theme-text-main"
              />
            </div>
          </div>
        )}
      </div>
      <style>{`
        body.dark .date-input-calendar::-webkit-calendar-picker-indicator,
        body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.8;
          cursor: pointer;
        }
        body.dark .date-input-calendar::-webkit-calendar-picker-indicator:hover,
        body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        body.light .date-input-calendar::-webkit-calendar-picker-indicator {
          filter: none;
          opacity: 0.8;
          cursor: pointer;
        }
        body.light .date-input-calendar::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

