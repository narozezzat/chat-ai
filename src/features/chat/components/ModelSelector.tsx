'use client'

import * as React from 'react'
import { MODELS } from '@/lib/uiConfig'
import { Sparkles } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ModelSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps): React.JSX.Element {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium shadow-none outline-none transition hover:border-primary/40 hover:bg-muted/30 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
          <SelectValue placeholder="اختر نموذج" />
        </div>
      </SelectTrigger>
      <SelectContent className="w-full min-w-(--radix-select-trigger-width) max-h-[300px] overflow-y-auto rounded-xl border border-border bg-popover shadow-2xl">
        {MODELS.map((m) => (
          <SelectItem
            key={m.id}
            value={m.id}
            className="cursor-pointer"
          >
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
