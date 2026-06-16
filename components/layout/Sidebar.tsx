'use client'

import { PlusIcon, CloseIcon, SparkleIcon } from '@/components/ui/Icons'
import ModelSelector from '@/components/chat/ModelSelector'
import EffortSelector from '@/components/chat/EffortSelector'
import type { Effort } from '@/lib/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  hasMessages: boolean
  model: string
  onModel: (id: string) => void
  effort: Effort
  onEffort: (e: Effort) => void
}

export default function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  hasMessages,
  model,
  onModel,
  effort,
  onEffort,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-border/70 bg-surface/95 backdrop-blur-2xl transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        dir="rtl"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 shadow-sm">
              <SparkleIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">AI Studio</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink md:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            disabled={!hasMessages}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" />
            محادثة جديدة
          </button>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border/50 bg-night/50 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted/80">
              إعدادات النموذج
            </h3>
            <div className="flex flex-col gap-3">
              <ModelSelector value={model} onChange={onModel} />
              <EffortSelector value={effort} onChange={onEffort} />
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 text-center text-[10px] text-muted/50">
          استوديو الذكاء الاصطناعي © 2026
        </div>
      </div>
    </>
  )
}
