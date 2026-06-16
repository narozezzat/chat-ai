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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 inset-s-0 z-50 flex w-72 flex-col border-e border-border bg-background/85 backdrop-blur-xl transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
          }`}
      >
        {/* Sidebar Header branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary shadow-xs">
              <Sparkles className="h-4 w-4 text-foreground" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">AI Studio</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="إغلاق القائمة"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Sidebar Body */}
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
          {/* New Chat Action Button */}
          <Button
            variant="outline"
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full rounded-lg flex items-center justify-center gap-1.5 border-border bg-secondary/40 text-foreground shadow-xs hover:bg-secondary/80 hover:text-foreground"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>محادثة جديدة</span>
          </Button>

          {/* Conversations History List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin">
            <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-2.5 pb-1">
              تاريخ المحادثات
            </div>
            <AnimatePresence initial={false}>
              {sessions.map((s) => {
                const active = s.id === activeSession?.id
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`group flex items-center justify-between gap-1.5 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-all border ${active
                        ? 'bg-secondary text-secondary-foreground border-border/80'
                        : 'text-muted-foreground border-transparent hover:bg-secondary/50 hover:text-foreground'
                      }`}
                    onClick={() => {
                      selectSession(s.id)
                      onClose()
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span dir="auto" className="truncate">{s.title}</span>
                    </div>
                    {sessions.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(s.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:bg-transparent hover:text-destructive transition-opacity h-5 w-5 rounded [&_svg]:size-3.5"
                        aria-label="حذف المحادثة"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    ) : null}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Settings Dial Section */}
          {activeSession ? (
            <div className="border-t border-border/40 pt-4 mt-auto flex flex-col gap-3 shrink-0">
              <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-2.5">
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
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm('هل أنت متأكد من رغبتك في حذف كافة المحادثات؟')) {
                clearAll()
              }
            }}
            className="flex items-center gap-1 h-auto p-1 text-[10px] text-muted-foreground/50 hover:bg-transparent hover:text-destructive transition-colors [&_svg]:size-3"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            <span>مسح السجل بالكامل</span>
          </Button>
          <div className="text-[10px] text-muted-foreground/35 font-mono">v1.2.0</div>
        </div>
      </div>
    </>
  )
}
