import { useState, useEffect } from 'react'
import { RecruiterFormData, Recruiter } from '../../hooks/useRecruiters'
import Input from '../ui/Input'

interface RecruiterFormProps {
  onSubmit: (data: RecruiterFormData) => void
  onCancel?: () => void
  initialData?: Recruiter
  isLoading?: boolean
}

const platforms: RecruiterFormData['platform'][] = ['LinkedIn', 'Email', 'WhatsApp', 'Other']
const statuses: RecruiterFormData['status'][] = ['messaged', 'replied', 'call', 'submitted', 'ghosted']
const statusLabels: Record<RecruiterFormData['status'], string> = {
  messaged: 'Messaged',
  replied: 'Replied',
  call: 'Call Scheduled',
  submitted: 'Submitted',
  ghosted: 'Ghosted',
}

export default function RecruiterForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: RecruiterFormProps) {
  const [formData, setFormData] = useState<RecruiterFormData>({
    name: '',
    company: '',
    platform: 'LinkedIn',
    role: '',
    status: 'messaged',
    last_contact_date: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        company: initialData.company || '',
        platform: initialData.platform,
        role: initialData.role || '',
        status: initialData.status,
        last_contact_date: initialData.last_contact_date,
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const validateField = (name: string, value: string) => {
    if (name === 'name' && !value.trim()) {
      return 'Name is required'
    }
    return ''
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    const error = validateField(field, formData[field as keyof RecruiterFormData] as string)
    if (error) {
      setErrors({ ...errors, [field]: error })
    } else {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (touched[field]) {
      const error = validateField(field, value)
      if (error) {
        setErrors({ ...errors, [field]: error })
      } else {
        const newErrors = { ...errors }
        delete newErrors[field]
        setErrors(newErrors)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ name: true })
      // Shake animation on error
      const form = e.currentTarget
      form.classList.add('animate-shake')
      setTimeout(() => form.classList.remove('animate-shake'), 500)
      return
    }
    
    // Clean up empty strings to undefined
    const cleanedData = {
      ...formData,
      company: formData.company?.trim() || undefined,
      role: formData.role?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    }
    
    onSubmit(cleanedData)
    
    if (!initialData) {
      // Reset form if creating new
      setFormData({
        name: '',
        company: '',
        platform: 'LinkedIn',
        role: '',
        status: 'messaged',
        last_contact_date: new Date().toISOString().split('T')[0],
        notes: '',
      })
      setTouched({})
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          leftIcon="nav-team"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={errors.name}
          showSuccess={touched.name && !errors.name && !!formData.name}
          placeholder="e.g., John Smith"
          required
        />

        <Input
          label="Company"
          value={formData.company || ''}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="e.g., Tech Recruiting Inc"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) =>
              setFormData({ ...formData, platform: e.target.value as RecruiterFormData['platform'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Role
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="Role they're hiring for"
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Status <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as RecruiterFormData['status'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Last Contact Date <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          value={formData.last_contact_date}
          onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
          >
            Cancel
          </button>
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
    </form>
  )
}

