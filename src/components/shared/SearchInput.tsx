'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function SearchInput({ className, ...props }: SearchInputProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (document.activeElement !== inputRef.current) {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return (): void => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        ref={inputRef}
        type="search"
        className="ps-9 pe-12 bg-background border-border/80 rounded-xl"
        {...props}
      />
      <div className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 pointer-events-none select-none text-[10px] text-muted-foreground/60 border border-border/80 bg-muted px-1.5 py-0.5 rounded-md">
        <span className="text-xs">⌘</span>
        <span>K</span>
      </div>
    </div>
  )
}
