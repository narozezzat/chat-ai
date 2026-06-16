import * as React from 'react'
import { MessageItem } from '@/features/chat/components/MessageItem'
import { Sparkles } from 'lucide-react'
import type { UIMessage } from '@/lib/types'
import { Button } from '@/components/ui/button'

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
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center md:py-0">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-zinc-900/60 shadow-xs">
        <Sparkles className="h-5 w-5 text-zinc-200" aria-hidden="true" />
      </div>
      <h1 className="text-lg font-semibold tracking-tight text-foreground">أهلاً بك في استوديو الدردشة</h1>
      <p className="mt-2 max-w-sm text-xs text-muted-foreground/80 leading-relaxed">
        تحدّث مع أحدث نماذج الذكاء الاصطناعي — اختر النموذج ومستوى التفكير، وابدأ المحادثة.
      </p>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-2.5 sm:grid sm:grid-cols-2 max-w-md">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            variant="outline"
            onClick={() => onSuggest(s)}
            className="h-auto whitespace-normal rounded-lg border border-border bg-zinc-900/20 px-3.5 py-3 text-start text-xs text-muted-foreground hover:bg-zinc-800/40 hover:text-foreground hover:border-zinc-700 transition-all flex justify-start items-center"
          >
            {s}
          </Button>
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
