'use client'

import * as React from 'react'
import { getErrorMessage } from '@/utils/error'
import { DEFAULT_MODEL_ID } from '@/lib/uiConfig'
import { streamChat } from '@/lib/chatClient'
import type { UIMessage } from '@/lib/types'
import { useChatStore } from '@/features/chat/hooks/useChatStore'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar'
import { MessageList } from '@/features/chat/components/MessageList'
import { ChatInput } from '@/features/chat/components/ChatInput'
import { Menu, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RootPage(): React.JSX.Element {
  const {
    sessions,
    activeSessionId,
    isStreaming,
    createSession,
    updateSessionMessages,
    setStreaming,
  } = useChatStore()

  const [input, setInput] = React.useState('')
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
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
    <div className="relative z-10 flex h-dvh overflow-hidden bg-background" dir="rtl">
      {/* Persistent/Collapsible Sidebar drawer */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      {/* Main chat window viewport */}
      <div className="flex flex-1 flex-col overflow-hidden relative animate-in fade-in duration-300">
        {/* Top Header navbar */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/40 bg-zinc-950/20 backdrop-blur-md px-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/30 border border-border hover:bg-zinc-800 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="افتح القائمة الجانبية"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-2">
              <span dir="auto" className="text-sm font-semibold tracking-tight text-foreground md:text-base">
                {activeSession?.title || 'محادثة جديدة'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg border border-border bg-zinc-900/30 hover:bg-zinc-800 md:flex hidden"
              onClick={handleNewChat}
              aria-label="محادثة جديدة"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* Dynamic chat thread bubble scroll area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {activeSession ? (
            <MessageList
              messages={activeSession.messages}
              isStreaming={isStreaming}
              onSuggest={setInput}
            />
          ) : null}
        </main>

        {/* Input box */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}
