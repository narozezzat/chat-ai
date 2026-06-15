'use client'

import { useState } from 'react'
import Markdown from './Markdown'
import { CopyIcon, CheckIcon, SparkleIcon, UserIcon } from './Icons'

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
  streaming?: boolean
}

function Avatar({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow ${
        isUser
          ? 'bg-surface-2 text-accent-2'
          : 'bg-gradient-to-br from-accent to-accent-2 text-white'
      }`}
    >
      {isUser ? <UserIcon className="h-4 w-4" /> : <SparkleIcon className="h-4 w-4" />}
    </div>
  )
}

function Typing() {
  return (
    <span className="typing inline-flex items-center gap-1 py-1">
      <span className="h-2 w-2 rounded-full bg-accent-2" />
      <span className="h-2 w-2 rounded-full bg-accent-2" />
      <span className="h-2 w-2 rounded-full bg-accent-2" />
    </span>
  )
}

export default function Message({ role, content, images, streaming }: MessageProps) {
  const isUser = role === 'user'
  const [copied, setCopied] = useState(false)

  const copy = async () => {
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
      {!isUser && <Avatar isUser={false} />}

      {/* `ms-auto` pushes user messages to the inline-end (works in RTL & LTR) */}
      <div className={`flex max-w-[82%] flex-col ${isUser ? 'ms-auto items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isUser
              ? 'rounded-tr-sm bg-accent text-white'
              : 'rounded-tl-sm border border-border bg-surface'
          }`}
        >
          {images && images.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-28 w-28 rounded-lg object-cover" />
              ))}
            </div>
          )}

          {isUser ? (
            content ? (
              <p dir="auto" className="whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            ) : null
          ) : content ? (
            <div dir="auto">
              <Markdown>{content}</Markdown>
            </div>
          ) : (
            <Typing />
          )}
        </div>

        {/* Copy button for finished assistant messages */}
        {!isUser && content && !streaming && (
          <button
            onClick={copy}
            className="mt-1 flex items-center gap-1 self-start rounded-md px-2 py-1 text-xs text-muted opacity-0 transition hover:bg-white/5 hover:text-ink group-hover/msg:opacity-100 focus:opacity-100"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            {copied ? 'تم النسخ' : 'نسخ'}
          </button>
        )}
      </div>

      {isUser && <Avatar isUser={true} />}
    </div>
  )
}
