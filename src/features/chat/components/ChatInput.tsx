'use client'

import * as React from 'react'
import { useSpeechRecognition } from '@/features/chat/hooks/useSpeechRecognition'
import { SPEECH_LANGS } from '@/lib/uiConfig'
import { Send, Square, Mic, Paperclip, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  value: string
  onChange: (text: string) => void
  onSend: (text: string, images: string[]) => void
  onStop: () => void
  isStreaming: boolean
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ChatInput({ value, onChange, onSend, onStop, isStreaming }: ChatInputProps): React.JSX.Element {
  const [images, setImages] = React.useState<string[]>([])
  const [langIndex, setLangIndex] = React.useState(0)
  const speechLang = SPEECH_LANGS[langIndex]

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const baseTextRef = React.useRef('')

  const { supported: micSupported, listening, start, stop } = useSpeechRecognition({
    lang: speechLang.id,
    onText: (transcript) => {
      const base = baseTextRef.current
      onChange(base ? `${base} ${transcript}` : transcript)
    },
  })

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const canSend = (value.trim().length > 0 || images.length > 0) && !isStreaming

  const handleSend = (): void => {
    if (!canSend) return
    onSend(value, images)
    setImages([])
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFiles = async (files: FileList | null): Promise<void> => {
    if (!files) return
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const urls = await Promise.all(imageFiles.map(fileToDataUrl))
    setImages((cur) => [...cur, ...urls])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleMic = (): void => {
    if (listening) {
      stop()
    } else {
      baseTextRef.current = value
      start()
    }
  }

  return (
    <div className="border-t border-border bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">
        {images.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={i} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
                <Button
                  onClick={() => setImages((cur) => cur.filter((_, idx) => idx !== i))}
                  variant="outline"
                  size="icon"
                  className="absolute -inset-e-1.5 -top-1.5 h-5 w-5 rounded-full bg-background text-muted-foreground shadow-xs transition hover:text-foreground [&_svg]:size-3"
                  aria-label="إزالة الصورة"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-zinc-900/40 p-2 shadow-xs transition-all focus-within:border-zinc-700">
          <Textarea
            ref={textareaRef}
            dir="auto"
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? 'جارٍ الاستماع…' : 'اكتب رسالتك هنا…'}
            className="max-h-[150px] min-h-[40px] w-full resize-none bg-transparent border-0 px-2 py-2 text-sm leading-relaxed text-foreground outline-hidden shadow-none focus-visible:ring-0"
          />

          <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="إرفاق صورة"
                className="h-8 w-8 rounded-md text-muted-foreground transition hover:bg-zinc-800 hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" aria-hidden="true" />
              </Button>

              {micSupported ? (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={listening ? "destructive" : "ghost"}
                    size="icon"
                    onClick={toggleMic}
                    title={listening ? 'إيقاف التسجيل' : 'تحدّث'}
                    className={`h-8 w-8 rounded-md transition ${
                      listening
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'text-muted-foreground hover:bg-zinc-800 hover:text-foreground'
                    }`}
                    aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
                  >
                    {listening ? (
                      <span className="rec-dot h-2 w-2 rounded-full bg-red-500" />
                    ) : (
                      <Mic className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLangIndex((i) => (i + 1) % SPEECH_LANGS.length)}
                    title="لغة التحدّث"
                    className="h-8 items-center gap-1 rounded-md px-2 text-[10px] text-muted-foreground transition hover:bg-zinc-800 hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{speechLang.id.split('-')[0]}</span>
                  </Button>
                </div>
              ) : null}
            </div>

            {isStreaming ? (
              <Button
                variant="secondary"
                size="icon"
                onClick={onStop}
                title="إيقاف التوليد"
                className="h-8 w-8 rounded-md bg-zinc-800 text-foreground transition hover:bg-zinc-700"
                aria-label="Stop generation"
              >
                <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="icon"
                onClick={handleSend}
                disabled={!canSend}
                title="إرسال"
                className="h-8 w-8 rounded-md bg-foreground text-background shadow-xs transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/45 hidden sm:block">
          اضغط Enter للإرسال · Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  )
}
