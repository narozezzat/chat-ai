'use client'

import { useEffect, useRef, useState } from 'react'
import { MODELS } from '@/lib/uiConfig'
import { ChevronDownIcon, CheckIcon, SparkleIcon } from '@/components/ui/Icons'

interface ModelSelectorProps {
  value: string
  onChange: (id: string) => void
}

// A polished custom dropdown (nicer than a native <select> on a dark theme).
export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0]

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:border-accent/60 hover:bg-surface-2"
      >
        <SparkleIcon className="h-4 w-4 text-accent-2" />
        <span>{current.label}</span>
        <ChevronDownIcon className={`h-4 w-4 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface-2 p-1 shadow-2xl shadow-black/50 inset-e-0">
          {MODELS.map((m) => {
            const active = m.id === value
            return (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${active ? 'bg-accent/15 text-ink' : 'text-muted hover:bg-white/5 hover:text-ink'
                  }`}
              >
                <span>{m.label}</span>
                {active && <CheckIcon className="h-4 w-4 text-accent-2" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
