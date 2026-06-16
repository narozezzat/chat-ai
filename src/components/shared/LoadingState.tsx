import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton-grid' | 'skeleton-list'
  count?: number
  className?: string
}

export function LoadingState({
  variant = 'spinner',
  count = 3,
  className,
}: LoadingStateProps): React.JSX.Element {
  if (variant === 'spinner') {
    return (
      <div className={cn("flex min-h-[200px] items-center justify-center", className)}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (variant === 'skeleton-grid') {
    return (
      <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-8 w-1/2 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-4/5 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 space-x-reverse rounded-xl border border-border bg-card p-4 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
