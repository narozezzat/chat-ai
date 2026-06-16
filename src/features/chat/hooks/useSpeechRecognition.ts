'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeechRecognitionResult {
  [index: number]: {
    transcript: string
  }
}

interface SpeechRecognitionEvent {
  results: {
    length: number
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

interface SpeechRecognitionInstance {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: (e: SpeechRecognitionEvent) => void
  onend: () => void
  onerror: () => void
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

interface UseSpeechArgs {
  lang?: string
  onText?: (transcript: string) => void
}

interface UseSpeechResult {
  supported: boolean
  listening: boolean
  start: () => void
  stop: () => void
}

export function useSpeechRecognition({ lang = 'ar-SA', onText }: UseSpeechArgs = {}): UseSpeechResult {
  const [supported, setSupported] = useState(false)
  const ctorRef = useRef<SpeechRecognitionConstructor | null>(null)

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition
    ctorRef.current = Ctor || null
    setSupported(Boolean(Ctor))
  }, [])

  const recRef = useRef<SpeechRecognitionInstance | null>(null)
  const [listening, setListening] = useState(false)

  const onTextRef = useRef(onText)
  onTextRef.current = onText
  const langRef = useRef(lang)
  langRef.current = lang

  const stop = useCallback((): void => {
    try { recRef.current?.stop() } catch { /* ignore */ }
  }, [])

  const start = useCallback((): void => {
    if (!ctorRef.current) return
    try { recRef.current?.abort() } catch { /* ignore */ }

    const rec = new ctorRef.current()
    rec.lang = langRef.current
    rec.interimResults = true
    rec.continuous = false

    rec.onresult = (e: SpeechRecognitionEvent): void => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      onTextRef.current?.(transcript)
    }
    rec.onend = (): void => setListening(false)
    rec.onerror = (): void => setListening(false)

    recRef.current = rec
    setListening(true)
    rec.start()
  }, [])

  useEffect(() => {
    return (): void => {
      try { recRef.current?.abort() } catch { /* ignore */ }
    }
  }, [])

  return { supported, listening, start, stop }
}
