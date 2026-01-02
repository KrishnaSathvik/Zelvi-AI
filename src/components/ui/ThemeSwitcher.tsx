import { useTheme } from '../../contexts/ThemeContext'
import Icon from './Icon'

export default function ThemeSwitcher() {
  const { theme, setTheme, effectiveTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const getThemeIcon = () => {
    if (theme === 'system') {
      return 'sys-settings'
    }
    return effectiveTheme === 'dark' ? 'sys-moon' : 'sys-sun'
  }

  const getThemeLabel = () => {
    if (theme === 'system') {
      return 'System'
    }
    return effectiveTheme === 'dark' ? 'Dark' : 'Light'
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full text-left px-3 py-2.5 transition-all duration-200 min-h-[40px] flex items-center gap-3 font-mono text-sm rounded-lg hover:bg-[var(--text-main)]/8 hover:text-cyan-400 active:bg-[var(--text-main)]/12 touch-target"
      style={{ color: 'var(--text-main)' }}
      title={`Theme: ${getThemeLabel()}`}
    >
      <Icon 
        name={getThemeIcon()} 
        size={18} 
        className="flex-shrink-0" 
        style={{ color: 'var(--text-main)' }} 
      />
      <span className="flex-1">Theme: {getThemeLabel()}</span>
    </button>
  )
}

