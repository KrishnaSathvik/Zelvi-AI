import { InputHTMLAttributes, forwardRef } from 'react'
import Input from './Input'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type="search"
          leftIcon="sys-search"
          rightIcon={props.value ? 'sys-close' : undefined}
          onRightIconClick={onClear}
          placeholder={props.placeholder || 'Search...'}
          className={className}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput

