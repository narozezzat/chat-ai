import * as React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface TableFilterConfig {
  columnId: string
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

interface DataTableFiltersProps {
  filters: TableFilterConfig[]
}

export function DataTableFilters({ filters }: DataTableFiltersProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <div key={filter.columnId} className="flex items-center gap-1.5">
          <Select
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="h-8 w-[140px] rounded-lg border-border/80 text-xs">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent className="border-border bg-card">
              <SelectItem value="ALL">كل {filter.label}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}
