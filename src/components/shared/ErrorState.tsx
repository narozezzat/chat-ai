import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  retry?: {
    label?: string
    onRetry: () => void
  }
  className?: string
}

export function ErrorState({
  title = "حدث خطأ ما",
  message,
  retry,
  className,
}: ErrorStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-destructive-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      {retry ? (
        <Button onClick={retry.onRetry} className="mt-5" variant="outline" size="sm">
          {retry.label || "إعادة المحاولة"}
        </Button>
      ) : null}
    </div>
  )
}
