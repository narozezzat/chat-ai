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
      <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-medium shadow-none outline-hidden transition hover:bg-secondary/80 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <SelectValue placeholder="اختر نموذج" />
        </div>
      </SelectTrigger>
      <SelectContent className="w-full min-w-(--radix-select-trigger-width) max-h-[300px] overflow-y-auto rounded-lg border border-border bg-popover shadow-md">
        {MODELS.map((m) => (
          <SelectItem
            key={m.id}
            value={m.id}
            className="cursor-pointer text-xs"
          >
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
