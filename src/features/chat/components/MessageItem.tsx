'use client'

import * as React from 'react'
import Markdown from '@/components/ui/Markdown'
import { Copy, Check, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

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
          ? "bg-secondary text-muted-foreground border-border"
          : "bg-background text-foreground border-border"
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
  const t = useTranslations()
  return (
    <span className="typing inline-flex items-center gap-1 py-1" aria-label={t('message.typing')}>
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
    </span>
  )
}

export function MessageItem({ role, content, images, streaming }: MessageItemProps): React.JSX.Element {
  const t = useTranslations()
  const isUser = role === 'user'
  const [copied, setCopied] = React.useState(false)
  const [lightbox, setLightbox] = React.useState<{ open: boolean; src: string }>({ open: false, src: '' })

  const openLightbox = (src: string): void => setLightbox({ open: true, src })
  const closeLightbox = (): void => setLightbox((prev) => ({ ...prev, open: false }))

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
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group/msg flex w-full gap-4"
    >
      {isUser ? null : <Avatar isUser={false} />}

      <div className={cn("flex max-w-[85%] flex-col", isUser ? "ms-auto items-end" : "items-start")}>
        <div
          className={cn(
            "transition-all",
            isUser
              ? "rounded-lg rounded-te-xs bg-secondary/80 border border-border/50 px-4 py-2.5 text-foreground shadow-xs text-sm"
              : "px-1 py-1 text-foreground"
          )}
        >
          {images && images.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openLightbox(src)}
                  className="group/thumb relative overflow-hidden rounded-lg border border-border/80 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t('image.openPreview')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-28 w-28 object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                  />
                  {/* Hover overlay hint */}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover/thumb:bg-black/25" aria-hidden="true" />
                </button>
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
              className="mt-1 h-7 gap-1.5 rounded-md px-2 text-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground opacity-0 group-hover/msg:opacity-100 focus:opacity-100"
              aria-label={t('message.copyAria')}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{copied ? t('message.copied') : t('message.copy')}</span>
            </Button>
          ) : null
        )}
      </div>

      {isUser ? <Avatar isUser={true} /> : null}

      {/* Lightbox — rendered at message level so it is outside the bubble flow */}
      <ImageLightbox src={lightbox.src} open={lightbox.open} onClose={closeLightbox} />
    </motion.div>
  )
}
