'use client'

import * as React from 'react'
import { EFFORT_LEVELS } from '@/lib/uiConfig'
import type { Effort } from '@/lib/types'

interface EffortSelectorProps {
  value: Effort
  onChange: (e: Effort) => void
}

export function EffortSelector({ value, onChange }: EffortSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">مستوى التفكير</span>
      <div className="flex rounded-xl border border-border bg-card p-1">
        {EFFORT_LEVELS.map((lvl) => {
          const active = lvl.id === value
          return (
            <button
              key={lvl.id}
              onClick={() => onChange(lvl.id)}
              aria-pressed={active}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                active ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {lvl.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
