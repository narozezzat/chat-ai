'use client'

import * as React from 'react'
import { MessageItem } from '@/features/chat/components/MessageItem'
import { Sparkles } from 'lucide-react'
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

function EmptyState({ onSuggest }: { onSuggest: (text: string) => void }): React.JSX.Element {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center md:py-0">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-purple-600 shadow-xl shadow-primary/20">
        <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">أهلاً بك في استوديو الدردشة</h1>
      <p className="mt-2.5 max-w-md text-xs text-muted-foreground sm:text-sm">
        تحدّث مع أحدث نماذج الذكاء الاصطناعي — اختر النموذج ومستوى التفكير، وابدأ المحادثة.
      </p>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-2.5 sm:grid sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="flex-1 min-w-[140px] whitespace-normal rounded-xl border border-border bg-card/40 px-3 py-2.5 text-start text-xs text-muted-foreground shadow-sm backdrop-blur-md transition hover:border-primary/50 hover:bg-card hover:text-foreground hover:shadow-md"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export function MessageList({ messages, isStreaming, onSuggest }: MessageListProps): React.JSX.Element {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const last = messages[messages.length - 1]
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, last?.content])

  if (messages.length === 0) {
    return <EmptyState onSuggest={onSuggest} />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      {messages.map((m, i) => (
        <MessageItem
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
