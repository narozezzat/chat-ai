'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Download, X, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  src: string
  open: boolean
  onClose: () => void
}

type LoadState = 'loading' | 'loaded' | 'error'

export function ImageLightbox({ src, open, onClose }: ImageLightboxProps): React.JSX.Element {
  const t = useTranslations()
  const [loadState, setLoadState] = React.useState<LoadState>('loading')

  // Reset load state whenever the src changes or the dialog reopens
  React.useEffect(() => {
    if (open) setLoadState('loading')
  }, [src, open])

  const handleDownload = (): void => {
    // Works for both data-URLs (user-attached images) and HTTP URLs (AI-generated)
    const anchor = document.createElement('a')
    anchor.href = src
    const urlPart = src.split('/').pop()?.split('?')[0] ?? ''
    anchor.download = urlPart || `image-${Date.now()}.png`
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />

        {/* Content panel */}
        <DialogPrimitive.Content
          aria-label={t('image.preview')}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'flex flex-col overflow-hidden rounded-xl border border-border/60',
            'bg-background/95 backdrop-blur-xl shadow-2xl',
            // Max dimensions — never overflow the viewport on any device
            'w-[calc(100vw-2rem)] max-w-4xl',
            'max-h-[90dvh]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
          )}
        >
          {/* Visually hidden title required for a11y */}
          <DialogPrimitive.Title className="sr-only">
            {t('image.preview')}
          </DialogPrimitive.Title>

          {/* ── Toolbar ─────────────────────────────────────────── */}
          <div
            className="flex w-full shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5"
            dir="ltr"
          >
            <span className="select-none text-xs font-medium text-muted-foreground">
              {t('image.preview')}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Download button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={loadState !== 'loaded'}
                className="h-8 gap-1.5 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40"
                aria-label={t('image.download')}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t('image.download')}</span>
              </Button>

              {/* Close button */}
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label={t('image.close')}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* ── Image area ──────────────────────────────────────── */}
          <div className="relative flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden bg-secondary/10 p-4">

            {/* Loading spinner */}
            {loadState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-foreground" />
              </div>
            )}

            {/* Error state */}
            {loadState === 'error' && (
              <div className="flex flex-col items-center gap-3 px-6 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
                <p className="text-sm">{t('image.loadError')}</p>
              </div>
            )}

            {/* The image itself — always in DOM so onLoad/onError fire */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={t('image.preview')}
              onLoad={() => setLoadState('loaded')}
              onError={() => setLoadState('error')}
              className={cn(
                'max-h-[calc(90dvh-4rem)] max-w-full rounded-lg object-contain transition-opacity duration-300',
                loadState === 'loaded' ? 'opacity-100' : 'opacity-0 pointer-events-none',
              )}
              draggable={false}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
