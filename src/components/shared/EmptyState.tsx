import * as React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/25 p-8 text-center animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm mb-4" aria-hidden="true">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <Button onClick={action.onClick} className="mt-5" size="sm">
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
