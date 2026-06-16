'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'

export function ThemeToggle(): React.JSX.Element {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/80 text-foreground"
        aria-label="تغيير المظهر"
      >
        <Sun className="h-4 w-4 text-muted-foreground opacity-50" aria-hidden="true" />
      </Button>
    )
  }

  return (
    <DropdownMenuPrimitive.Root dir="rtl">
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/80 text-foreground focus-visible:ring-0"
          aria-label="تغيير المظهر"
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : theme === 'dark' ? (
            <Moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Monitor className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={8}
          className="z-50 min-w-[120px] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 slide-in-from-top-1"
        >
          <DropdownMenuPrimitive.Item
            onClick={() => setTheme('light')}
            className="relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-xs outline-hidden transition hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              <span>فاتح</span>
            </div>
            {theme === 'light' ? <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" /> : null}
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Item
            onClick={() => setTheme('dark')}
            className="relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-xs outline-hidden transition hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>داكن</span>
            </div>
            {theme === 'dark' ? <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" /> : null}
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Item
            onClick={() => setTheme('system')}
            className="relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-xs outline-hidden transition hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
              <span>تلقائي</span>
            </div>
            {theme === 'system' ? <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" /> : null}
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}
