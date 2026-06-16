'use client'

import { PlusIcon } from '@/components/ui/Icons'

// Hamburger Icon component
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

interface HeaderProps {
  onOpenSidebar: () => void
  onNewChat?: () => void
}

export default function Header({ onOpenSidebar, onNewChat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-night/70 backdrop-blur-xl md:hidden">
      <div className="flex w-full items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface transition hover:bg-surface-2 md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5 text-ink" />
          </button>
          <div className="text-base font-bold tracking-tight">AI Studio</div>
        </div>
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface transition hover:bg-surface-2 md:hidden"
            aria-label="New conversation"
          >
            <PlusIcon className="h-5 w-5 text-ink" />
          </button>
        )}
      </div>
    </header>
  )
}
