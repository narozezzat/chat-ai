'use client'

import * as React from 'react'
import { getErrorMessage } from '@/utils/error'
import { DEFAULT_MODEL_ID } from '@/lib/uiConfig'
import { streamChat } from '@/lib/chatClient'
import type { UIMessage } from '@/lib/types'
import { useChatStore } from '@/features/chat/hooks/useChatStore'
import { ModelSelector } from '@/features/chat/components/ModelSelector'
import { EffortSelector } from '@/features/chat/components/EffortSelector'
import { MessageList } from '@/features/chat/components/MessageList'
import { ChatInput } from '@/features/chat/components/ChatInput'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatPage(): React.JSX.Element {
  const {
    sessions,
    activeSessionId,
    isStreaming,
    createSession,
    deleteSession,
    selectSession,
    updateSessionMessages,
    updateSessionModel,
    updateSessionEffort,
    setStreaming,
  } = useChatStore()

  const [input, setInput] = React.useState('')
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    if (sessions.length === 0) {
      createSession(DEFAULT_MODEL_ID, 'medium')
    }
  }, [sessions, createSession])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  const handleSend = async (text: string, images: string[]): Promise<void> => {
    const trimmed = text.trim()
    if ((!trimmed && images.length === 0) || isStreaming || !activeSession) return

    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      images,
    }
    const assistantId = crypto.randomUUID()
    const history = [...activeSession.messages, userMsg]

    updateSessionMessages(activeSession.id, [
      ...history,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setInput('')
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamChat({
        model: activeSession.modelId,
        effort: activeSession.effort,
        signal: controller.signal,
        messages: history.map(({ role, content, images: img }) => ({ role, content, images: img })),
        onDelta: (t) => {
          const s = useChatStore.getState().sessions.find((x) => x.id === activeSession.id)
          if (!s) return
          const updated = s.messages.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + t } : m
          )
          updateSessionMessages(activeSession.id, updated)
        },
      })
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        const message = getErrorMessage(err)
        const s = useChatStore.getState().sessions.find((x) => x.id === activeSession.id)
        if (s) {
          const updated = s.messages.map((m) =>
            m.id === assistantId
              ? { ...m, content: (m.content ? m.content + '\n\n' : '') + `> ⚠️ ${message}` }
              : m
          )
          updateSessionMessages(activeSession.id, updated)
        }
      }
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  const handleStop = (): void => {
    abortRef.current?.abort()
    setStreaming(false)
  }

  const handleNewChat = (): void => {
    handleStop()
    createSession(DEFAULT_MODEL_ID, 'medium')
    setInput('')
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-300">
      <PageHeader
        title="استوديو الذكاء الاصطناعي"
        description="تفاعل مع نماذج متعددة بنقرة واحدة واحصل على إجابات فورية معززة بالتفكير الذكي."
      />

      <div className="flex flex-1 gap-6 overflow-hidden rounded-2xl border border-border/60 bg-card/10">
        {/* Left Side: Sessions Sidebar */}
        <div className="hidden w-64 flex-col border-e border-border/60 bg-card/30 md:flex">
          <div className="p-4">
            <Button
              onClick={handleNewChat}
              className="w-full rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span>محادثة جديدة</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            <AnimatePresence initial={false}>
              {sessions.map((s) => {
                const active = s.id === activeSession?.id
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`group flex items-center justify-between gap-1.5 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-all ${
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => selectSession(s.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </div>
                    {sessions.length > 1 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(s.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-0.5"
                        aria-label="Delete session"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Chat Container */}
        <div className="flex flex-1 flex-col overflow-hidden relative bg-card/5">
          {activeSession ? (
            <div className="flex flex-wrap items-center justify-between border-b border-border/40 bg-card/20 px-4 py-3 gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <ModelSelector
                  value={activeSession.modelId}
                  onChange={(id) => updateSessionModel(activeSession.id, id)}
                />
                <EffortSelector
                  value={activeSession.effort}
                  onChange={(e) => updateSessionEffort(activeSession.id, e)}
                />
              </div>
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto">
            {activeSession ? (
              <MessageList
                messages={activeSession.messages}
                isStreaming={isStreaming}
                onSuggest={setInput}
              />
            ) : null}
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}
