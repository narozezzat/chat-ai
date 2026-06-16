'use client'

import * as React from 'react'
import Markdown from '@/components/ui/Markdown'
import { Copy, Check, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
        "mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-xs",
        isUser
          ? "bg-zinc-800 text-zinc-300 border-zinc-700/50"
          : "bg-zinc-900 text-zinc-200 border-border"
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
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
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
    <div className="msg-in group/msg flex w-full gap-4">
      {isUser ? null : <Avatar isUser={false} />}

      <div className={cn("flex max-w-[85%] flex-col", isUser ? "ms-auto items-end" : "items-start")}>
        <div
          className={cn(
            "transition-all",
            isUser
              ? "rounded-lg rounded-te-xs bg-zinc-900 border border-zinc-800/80 px-4 py-2.5 text-foreground shadow-xs text-sm"
              : "px-1 py-1 text-foreground"
          )}
        >
          {images && images.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-28 w-28 rounded-lg object-cover border border-border/80 shadow-xs" />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={copy}
              className="mt-1 h-7 gap-1.5 rounded-md px-2 text-[10px] text-muted-foreground hover:bg-zinc-850 hover:text-foreground opacity-0 group-hover/msg:opacity-100 focus:opacity-100"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </Button>
          ) : null
        )}
      </div>

      {isUser ? <Avatar isUser={true} /> : null}
    </div>
  )
}
