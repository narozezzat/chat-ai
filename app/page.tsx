'use client'

import { useRef, useState } from 'react'
import { DEFAULT_MODEL_ID } from '@/lib/uiConfig'
import { streamChat } from '@/lib/chatClient'
import type { Effort, UIMessage } from '@/lib/types'
import Header from '@/components/Header'
import MessageList from '@/components/MessageList'
import ChatInput from '@/components/ChatInput'

export default function Page() {
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID)
  const [effort, setEffort] = useState<Effort>('medium')
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSend(text: string, images: string[]) {
    const trimmed = text.trim()
    if ((!trimmed && images.length === 0) || isStreaming) return

    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      images,
    }
    const assistantId = crypto.randomUUID()
    const history = [...messages, userMsg]

    setMessages([...history, { id: assistantId, role: 'assistant', content: '' }])
    setInput('')
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamChat({
        model,
        effort,
        signal: controller.signal,
        messages: history.map(({ role, content, images }) => ({ role, content, images })),
        onDelta: (t) =>
          setMessages((cur) =>
            cur.map((m) => (m.id === assistantId ? { ...m, content: m.content + t } : m)),
          ),
      })
    } catch (err) {
      // Ignore aborts (user pressed Stop); surface real errors inside the bubble.
      if ((err as Error)?.name !== 'AbortError') {
        const message = (err as Error)?.message || 'حدث خطأ غير متوقع'
        setMessages((cur) =>
          cur.map((m) =>
            m.id === assistantId
              ? { ...m, content: (m.content ? m.content + '\n\n' : '') + `> ⚠️ ${message}` }
              : m,
          ),
        )
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  function handleStop() {
    abortRef.current?.abort()
  }

  function handleNewChat() {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
  }

  return (
    <div className="relative z-10 flex h-dvh flex-col">
      <Header
        model={model}
        onModel={setModel}
        effort={effort}
        onEffort={setEffort}
        onNewChat={handleNewChat}
        hasMessages={messages.length > 0}
      />

      <main className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isStreaming={isStreaming} onSuggest={setInput} />
      </main>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
      />
    </div>
  )
}
