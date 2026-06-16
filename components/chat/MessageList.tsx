'use client'

import { useEffect, useRef } from 'react'
import Message from '@/components/chat/Message'
import { SparkleIcon } from '@/components/ui/Icons'
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
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center md:py-0">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-accent to-accent-2 shadow-xl shadow-accent/20">
        <SparkleIcon className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-[1.25rem] font-bold tracking-tight sm:text-3xl">أهلاً بك في AI Studio</h1>
      <p className="mt-3 max-w-md text-[0.8rem] text-muted sm:text-base">
        تحدّث مع أحدث نماذج الذكاء الاصطناعي — اختر النموذج ومستوى التفكير، وابدأ المحادثة.
      </p>

      {/* Responsive suggestions grid/scroll */}
      <div className="mt-8 flex w-full flex-wrap justify-center gap-2.5 sm:grid sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="flex-1 min-w-[140px] whitespace-normal rounded-2xl border border-border/60 bg-surface/40 px-3 py-2.5 text-start text-[0.75rem] sm:px-4 sm:py-3 sm:text-sm text-muted shadow-sm backdrop-blur-md transition hover:border-accent/50 hover:bg-surface hover:text-ink hover:shadow-md"
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
