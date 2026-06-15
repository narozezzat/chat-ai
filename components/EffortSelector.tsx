'use client'

import { EFFORT_LEVELS } from '@/lib/uiConfig'
import type { Effort } from '@/lib/types'

interface EffortSelectorProps {
  value: Effort
  onChange: (e: Effort) => void
}

// Segmented control for the reasoning-effort level ("مستوى التفكير").
export default function EffortSelector({ value, onChange }: EffortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-muted sm:inline">مستوى التفكير</span>
      <div className="flex rounded-xl border border-border bg-surface p-1">
        {EFFORT_LEVELS.map((lvl) => {
          const active = lvl.id === value
          return (
            <button
              key={lvl.id}
              onClick={() => onChange(lvl.id)}
              aria-pressed={active}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active ? 'bg-accent text-white shadow' : 'text-muted hover:text-ink'
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
