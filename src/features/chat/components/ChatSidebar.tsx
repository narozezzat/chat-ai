'use client'

import * as React from 'react'
import { Plus, MessageSquare, Trash2, X, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModelSelector } from '@/features/chat/components/ModelSelector'
import { EffortSelector } from '@/features/chat/components/EffortSelector'
import { useChatStore } from '@/features/chat/hooks/useChatStore'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
}

export function ChatSidebar({ isOpen, onClose, onNewChat }: ChatSidebarProps): React.JSX.Element {
  const {
    sessions,
    activeSessionId,
    deleteSession,
    selectSession,
    updateSessionModel,
    updateSessionEffort,
    clearAll,
  } = useChatStore()

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-border/60 bg-card/85 backdrop-blur-xl transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-md">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">AI Studio</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
          {/* New Chat Action Button */}
          <Button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>محادثة جديدة</span>
          </Button>

          {/* Conversations History List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin">
            <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-2.5 pb-1">
              تاريخ المحادثات
            </div>
            <AnimatePresence initial={false}>
              {sessions.map((s) => {
                const active = s.id === activeSession?.id
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`group flex items-center justify-between gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer transition-all ${
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                    onClick={() => {
                      selectSession(s.id)
                      onClose()
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <span dir="auto" className="truncate">{s.title}</span>
                    </div>
                    {sessions.length > 1 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(s.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-0.5"
                        aria-label="حذف المحادثة"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Settings Dial Section */}
          {activeSession ? (
            <div className="border-t border-border/40 pt-4 mt-auto flex flex-col gap-3 shrink-0">
              <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-2.5">
                إعدادات المحادثة الحالية
              </div>
              <ModelSelector
                value={activeSession.modelId}
                onChange={(id) => updateSessionModel(activeSession.id, id)}
              />
              <EffortSelector
                value={activeSession.effort}
                onChange={(e) => updateSessionEffort(activeSession.id, e)}
              />
            </div>
          ) : null}
        </div>

        {/* Footer Area */}
        <div className="mt-auto border-t border-border/40 p-4 shrink-0 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (confirm('هل أنت متأكد من رغبتك في حذف كافة المحادثات؟')) {
                clearAll()
              }
            }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors"
          >
            <AlertCircle className="h-3 w-3" />
            <span>مسح السجل بالكامل</span>
          </button>
          <div className="text-[10px] text-muted-foreground/40 font-mono">v1.2.0</div>
        </div>
      </div>
    </>
  )
}
