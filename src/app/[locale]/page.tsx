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
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from 'next-intl'

export default function RootPage(): React.JSX.Element {
  const t = useTranslations()
  const { dir } = useLanguage()
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

  const getDisplayTitle = (title: string | undefined): string => {
    if (!title) return t('common.newChat')
    const defaultTitles = ['محادثة جديدة', 'New Chat', 'new_chat', 'New chat']
    if (defaultTitles.includes(title)) {
      return t('common.newChat')
    }
    return title
  }

  // Create an initial in-memory session on first mount only.
  // It won't be persisted to localStorage until the user sends a message.
  React.useEffect(() => {
    createSession(DEFAULT_MODEL_ID, 'medium', 'new_chat')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    createSession(DEFAULT_MODEL_ID, 'medium', 'new_chat')
    setInput('')
  }

  return (
    <div className="relative z-10 flex h-dvh overflow-hidden bg-background animate-in fade-in duration-200" dir={dir}>
      {/* Persistent/Collapsible Sidebar drawer */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />

      {/* Main chat window viewport */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Header navbar */}
        <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-md px-3 sm:px-4 shrink-0 gap-2">
          {/* Left: hamburger + session title */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/40 border border-border hover:bg-secondary/80 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label={t('common.openSidebar')}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Session title — truncates when there is not enough room */}
            <span
              dir="auto"
              className="truncate text-sm font-semibold tracking-tight text-foreground"
              title={getDisplayTitle(activeSession?.title)}
            >
              {getDisplayTitle(activeSession?.title)}
            </span>
          </div>

          {/* Right: controls — never shrink */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/80 md:flex hidden"
              onClick={handleNewChat}
              aria-label={t('common.newChat')}
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
