import * as React from 'react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ActionBarProps {
  selectedCount: number
  onClearSelection: () => void
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'outline'
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function ActionBar({
  selectedCount,
  onClearSelection,
  actions,
}: ActionBarProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {selectedCount > 0 ? (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 inset-x-4 z-40 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-md md:inset-x-auto"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-ink hover:bg-muted"
              onClick={onClearSelection}
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              تم تحديد <strong className="text-primary font-bold">{selectedCount}</strong> عنصر
            </span>
          </div>
          <div className="flex items-center gap-2">
            {actions?.map((act, index) => {
              const Icon = act.icon
              return (
                <Button
                  key={index}
                  variant={act.variant || 'outline'}
                  size="sm"
                  onClick={act.onClick}
                  className="rounded-xl flex items-center gap-1.5"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span>{act.label}</span>
                </Button>
              )
            }) || null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
