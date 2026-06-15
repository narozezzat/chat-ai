'use client'

import ModelSelector from './ModelSelector'
import EffortSelector from './EffortSelector'
import { SparkleIcon, PlusIcon } from './Icons'
import type { Effort } from '@/lib/types'

interface HeaderProps {
  model: string
  onModel: (id: string) => void
  effort: Effort
  onEffort: (e: Effort) => void
  onNewChat: () => void
  hasMessages: boolean
}

export default function Header({ model, onModel, effort, onEffort, onNewChat, hasMessages }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-night/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/30">
            <SparkleIcon className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">AI Studio</div>
            <div className="text-[11px] text-muted">استوديو الذكاء الاصطناعي</div>
          </div>
        </div>

        {/* Controls — pushed to the inline-end */}
        <div className="ms-auto flex flex-wrap items-center gap-2 sm:gap-3">
          <EffortSelector value={effort} onChange={onEffort} />
          <ModelSelector value={model} onChange={onModel} />
          <button
            onClick={onNewChat}
            disabled={!hasMessages}
            title="محادثة جديدة"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:border-accent/60 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">جديدة</span>
          </button>
        </div>
      </div>
    </header>
  )
}
