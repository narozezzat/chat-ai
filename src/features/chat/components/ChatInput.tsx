'use client'

import * as React from 'react'
import { useSpeechRecognition } from '@/features/chat/hooks/useSpeechRecognition'
import { SPEECH_LANGS } from '@/lib/uiConfig'
import { Send, Square, Mic, Paperclip, X, Globe } from 'lucide-react'

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
    <div className="border-t border-border/60 bg-background/55 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">
        {images.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={i} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
                <button
                  onClick={() => setImages((cur) => cur.filter((_, idx) => idx !== i))}
                  className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-muted-foreground shadow ring-1 ring-border transition hover:text-foreground"
                  aria-label="إزالة الصورة"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition-all focus-within:border-primary/60">
          <textarea
            ref={textareaRef}
            dir="auto"
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? 'جارٍ الاستماع…' : 'اكتب رسالتك هنا…'}
            className="max-h-[150px] min-h-[40px] w-full resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
          />

          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="إرفاق صورة"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {micSupported ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMic}
                    title={listening ? 'إيقاف التسجيل' : 'تحدّث'}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      listening
                        ? 'bg-red-500/15 text-red-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
                  >
                    {listening ? (
                      <span className="rec-dot h-2.5 w-2.5 rounded-full bg-red-500" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setLangIndex((i) => (i + 1) % SPEECH_LANGS.length)}
                    title="لغة التحدّث"
                    className="flex h-9 items-center gap-1 rounded-xl px-2 text-[10px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{speechLang.id.split('-')[0]}</span>
                  </button>
                </div>
              ) : null}
            </div>

            {isStreaming ? (
              <button
                onClick={onStop}
                title="إيقاف التوليد"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground transition hover:bg-muted"
                aria-label="Stop generation"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!canSend}
                title="إرسال"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-muted-foreground/50 hidden sm:block">
          اضغط Enter للإرسال · Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  )
}
