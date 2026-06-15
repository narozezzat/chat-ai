'use client'

import { useEffect, useRef } from 'react'
import Message from './Message'
import { SparkleIcon } from './Icons'
import type { UIMessage } from '@/lib/types'

interface MessageListProps {
  messages: UIMessage[]
  isStreaming: boolean
  onSuggest: (text: string) => void
}

const SUGGESTIONS = [
  'اشرح لي الحوسبة الكمومية ببساطة',
  'اكتب دالة بايثون لترتيب قائمة',
  'أعطني أفكاراً لمشروع تخرج في الذكاء الاصطناعي',
  'لخّص لي فوائد الذكاء الاصطناعي في التعليم',
]

function EmptyState({ onSuggest }: { onSuggest: (text: string) => void }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/30">
        <SparkleIcon className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">أهلاً بك في AI Studio</h1>
      <p className="mt-2 max-w-md text-muted">
        تحدّث مع أحدث نماذج الذكاء الاصطناعي — اختر النموذج ومستوى التفكير، وابدأ المحادثة.
      </p>

      <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-start text-sm text-muted transition hover:border-accent/60 hover:bg-surface hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MessageList({ messages, isStreaming, onSuggest }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const last = messages[messages.length - 1]
  // Re-scroll as the count changes AND as the last message grows while streaming.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, last?.content])

  if (messages.length === 0) {
    return <EmptyState onSuggest={onSuggest} />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      {messages.map((m, i) => (
        <Message
          key={m.id}
          role={m.role}
          content={m.content}
          images={m.images}
          streaming={isStreaming && i === messages.length - 1 && m.role === 'assistant'}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
