'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { SPEECH_LANGS } from '@/lib/uiConfig'
import {
  SendIcon,
  StopIcon,
  MicIcon,
  PaperclipIcon,
  CloseIcon,
  GlobeIcon,
} from './Icons'

interface ChatInputProps {
  value: string
  onChange: (text: string) => void
  onSend: (text: string, images: string[]) => void
  onStop: () => void
  isStreaming: boolean
}

// Read a File into a base64 data URL (so we can preview + send it as JSON).
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ChatInput({ value, onChange, onSend, onStop, isStreaming }: ChatInputProps) {
  const [images, setImages] = useState<string[]>([])
  const [langIndex, setLangIndex] = useState(0)
  const speechLang = SPEECH_LANGS[langIndex]

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const baseTextRef = useRef('') // text present when recording started

  // Speech-to-text — fills the input as the user speaks.
  const { supported: micSupported, listening, start, stop } = useSpeechRecognition({
    lang: speechLang.id,
    onText: (transcript) => {
      const base = baseTextRef.current
      onChange(base ? `${base} ${transcript}` : transcript)
    },
  })

  // Auto-grow the textarea to fit its content (capped).
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const canSend = (value.trim().length > 0 || images.length > 0) && !isStreaming

  const handleSend = () => {
    if (!canSend) return
    onSend(value, images)
    setImages([])
    // Reset textarea height after clearing.
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const urls = await Promise.all(imageFiles.map(fileToDataUrl))
    setImages((cur) => [...cur, ...urls])
    if (fileInputRef.current) fileInputRef.current.value = '' // allow re-selecting
  }

  const toggleMic = () => {
    if (listening) {
      stop()
    } else {
      baseTextRef.current = value
      start()
    }
  }

  return (
    <div className="border-t border-border/70 bg-night/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">
        {/* Image preview strip */}
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={i} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
                <button
                  onClick={() => setImages((cur) => cur.filter((_, idx) => idx !== i))}
                  className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-night text-muted shadow ring-1 ring-border transition hover:text-ink"
                  aria-label="إزالة الصورة"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 shadow-lg transition focus-within:border-accent/60">
          {/* Attach image */}
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-white/5 hover:text-ink"
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>

          {/* Mic + language toggle */}
          {micSupported && (
            <div className="flex shrink-0 items-center">
              <button
                onClick={toggleMic}
                title={listening ? 'إيقاف التسجيل' : 'تحدّث'}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  listening
                    ? 'bg-red-500/15 text-red-400'
                    : 'text-muted hover:bg-white/5 hover:text-ink'
                }`}
              >
                {listening ? (
                  <span className="rec-dot h-3 w-3 rounded-full bg-red-500" />
                ) : (
                  <MicIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setLangIndex((i) => (i + 1) % SPEECH_LANGS.length)}
                title="لغة التحدّث"
                className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] text-muted transition hover:text-ink"
              >
                <GlobeIcon className="h-3.5 w-3.5" />
                {speechLang.id.split('-')[0]}
              </button>
            </div>
          )}

          {/* Text area */}
          <textarea
            ref={textareaRef}
            dir="auto"
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? 'جارٍ الاستماع…' : 'اكتب رسالتك هنا…'}
            className="max-h-[200px] flex-1 resize-none bg-transparent px-1 py-2.5 leading-relaxed text-ink outline-none placeholder:text-muted/70"
          />

          {/* Send / Stop */}
          {isStreaming ? (
            <button
              onClick={onStop}
              title="إيقاف التوليد"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink transition hover:bg-white/10"
            >
              <StopIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              title="إرسال"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="mt-2 text-center text-[11px] text-muted/70">
          اضغط Enter للإرسال · Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  )
}
