'use client'

import * as React from 'react'
import Markdown from '@/components/ui/Markdown'
import { Copy, Check, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  streaming?: boolean
}

function Avatar({ isUser }: { isUser: boolean }): React.JSX.Element {
  return (
    <div
      className={cn(
        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow",
        isUser
          ? "bg-secondary text-primary"
          : "bg-linear-to-br from-primary to-purple-600 text-white"
      )}
    >
      {isUser ? (
        <User className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sparkles className="h-4 w-4" aria-hidden="true" />
      )}
    </div>
  )
}

function Typing(): React.JSX.Element {
  return (
    <span className="typing inline-flex items-center gap-1 py-1" aria-label="جاري الكتابة">
      <span className="h-2 w-2 rounded-full bg-primary/80" />
      <span className="h-2 w-2 rounded-full bg-primary/80" />
      <span className="h-2 w-2 rounded-full bg-primary/80" />
    </span>
  )
}

export function MessageItem({ role, content, images, streaming }: MessageItemProps): React.JSX.Element {
  const isUser = role === 'user'
  const [copied, setCopied] = React.useState(false)

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="msg-in group/msg flex w-full gap-3">
      {isUser ? null : <Avatar isUser={false} />}

      <div className={cn("flex max-w-[85%] flex-col", isUser ? "ms-auto items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground font-medium"
              : "rounded-tl-sm border border-border bg-card text-foreground"
          )}
        >
          {images && images.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-28 w-28 rounded-lg object-cover border border-border/80 shadow-sm" />
              ))}
            </div>
          ) : null}

          {isUser ? (
            content ? (
              <p dir="auto" className="whitespace-pre-wrap leading-relaxed text-sm">
                {content}
              </p>
            ) : null
          ) : content ? (
            <div dir="auto" className="text-sm">
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <Typing />
          )}
        </div>

        {isUser ? null : (
          content && !streaming ? (
            <button
              onClick={copy}
              className="mt-1 flex items-center gap-1.5 self-start rounded-lg px-2 py-1 text-xs text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover/msg:opacity-100 focus:opacity-100"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          ) : null
        )}
      </div>

      {isUser ? <Avatar isUser={true} /> : null}
    </div>
  )
}
