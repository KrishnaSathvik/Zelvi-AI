import { HTMLAttributes } from 'react'
import Icon from './Icon'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '', ...props }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center text-sm font-mono ${className}`} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <Icon
                name="sys-chevron-right"
                size={16}
                className="text-dim mx-2"
              />
            )}
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-dim hover:text-white transition-colors"
              >
                {item.label.toUpperCase()}
              </a>
            ) : (
              <span className={isLast ? 'text-cyan-400' : 'text-dim'}>
                {item.label.toUpperCase()}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

