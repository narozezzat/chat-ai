import * as React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  onApply?: () => void
  onReset?: () => void
}

export function FilterDrawer({
  open,
  onOpenChange,
  children,
  onApply,
  onReset,
}: FilterDrawerProps): React.JSX.Element {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-card border-border/80 flex flex-col p-6">
        <SheetHeader className="pb-4 border-b border-border/60">
          <SheetTitle className="text-lg font-bold">تصفية النتائج</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground mt-1">
            اختر خيارات التصفية لعرض النتائج المناسبة.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {children}
        </div>
        <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
          {onReset ? (
            <Button variant="outline" onClick={onReset} className="rounded-xl flex-1 sm:flex-initial">
              إعادة تعيين
            </Button>
          ) : null}
          <Button onClick={onApply} className="rounded-xl flex-1 sm:flex-initial">
            تطبيق الفلاتر
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
