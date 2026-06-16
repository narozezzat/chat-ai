import * as React from 'react'
import { MessageItem } from '@/features/chat/components/MessageItem'
import { Sparkles } from 'lucide-react'
import type { UIMessage } from '@/lib/types'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface MessageListProps {
  messages: UIMessage[]
  isStreaming: boolean
  onSuggest: (text: string) => void
}

function EmptyState(): React.JSX.Element {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center px-4 py-20 text-center md:py-0"
    >
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/35 shadow-sm transition-all hover:scale-105 hover:bg-secondary/60 duration-300 group">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 blur-md transition-opacity group-hover:opacity-100 duration-300" />
        <Sparkles className="h-6 w-6 text-foreground/80 transition-transform group-hover:rotate-12 duration-300" aria-hidden="true" />
      </div>

      <h1 className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
        {t('emptyState.welcome')}
      </h1>

      <p className="mt-2 text-xs text-muted-foreground/75 leading-relaxed max-w-xs">
        {t('emptyState.description')}
      </p>

      <div className="mt-8 flex items-center justify-center gap-1.5 w-full max-w-[120px]">
        <div className="h-px flex-1 bg-border/50" />
        <div className="h-1.5 w-1.5 rounded-full bg-border" />
        <div className="h-px flex-1 bg-border/50" />
      </div>
    </motion.div>
  )
}

export function MessageList({ messages, isStreaming, onSuggest }: MessageListProps): React.JSX.Element {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  const last = messages[messages.length - 1]
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, last?.content])

  if (messages.length === 0) {
    return <EmptyState />
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
