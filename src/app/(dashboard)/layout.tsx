'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Users, Settings, Sparkles, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'الرئيسية', href: '/', icon: LayoutDashboard },
  { label: 'استوديو الدردشة', href: '/chat', icon: MessageSquare },
  { label: 'إدارة الأعضاء', href: '/users', icon: Users },
  { label: 'الإعدادات', href: '/settings', icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }): React.JSX.Element {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-card/50 backdrop-blur-md border-e border-border/60">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-md">
          <Sparkles className="h-4.5 w-4.5 text-white" aria-hidden="true" />
        </div>
        <span className="text-base font-bold tracking-tight bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent">
          AI Studio
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-border/40 p-4 text-center text-[10px] text-muted-foreground/40">
        استوديو الذكاء الاصطناعي © 2026
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background" dir="rtl">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden w-64 shrink-0 md:block">
        <SidebarContent />
      </aside>

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar header */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-card/30 backdrop-blur-md px-6 md:justify-end">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl md:hidden text-foreground hover:bg-muted"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-64 border-l-0">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-muted-foreground sm:block">
              أهلاً بك، <strong className="text-foreground font-semibold">المسؤول الرئيسي</strong>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary font-bold text-xs shadow-sm">
              أ
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto bg-background/25 px-6 py-6 md:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
