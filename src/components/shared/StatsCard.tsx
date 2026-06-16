import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label?: string
    direction: 'up' | 'down'
  }
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
}: StatsCardProps): React.JSX.Element {
  return (
    <Card className={cn("overflow-hidden border-border/80 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/30", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary" aria-hidden="true">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>
        <div className="mt-2.5">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          {trend || description ? (
            <div className="mt-2 flex items-center gap-2">
              {trend ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                    trend.direction === 'up'
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  )}
                >
                  {trend.direction === 'up' ? (
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-3 w-3" aria-hidden="true" />
                  )}
                  {trend.value}%
                </span>
              ) : null}
              {description ? (
                <span className="text-xs text-muted-foreground">{description}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
