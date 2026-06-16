'use client'

import * as React from 'react'
import { EFFORT_LEVELS } from '@/lib/uiConfig'
import type { Effort } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface EffortSelectorProps {
  value: Effort
  onChange: (e: Effort) => void
}

export function EffortSelector({ value, onChange }: EffortSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground/60">مستوى التفكير</span>
      <div className="flex rounded-lg border border-border bg-secondary/40 p-1 gap-1">
        {EFFORT_LEVELS.map((lvl) => {
          const active = lvl.id === value
          return (
            <Button
              key={lvl.id}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onChange(lvl.id)}
              aria-pressed={active}
              className={`flex-1 rounded-md py-1 h-7 text-[11px] font-medium transition-all ${
                active
                  ? 'bg-background text-foreground shadow-xs border border-border/50 font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80 dark:hover:bg-secondary/80'
              }`}
            >
              {lvl.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
