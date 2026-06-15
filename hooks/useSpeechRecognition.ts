'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  // `supported` starts false on both server and first client render so
  // hydration always matches. The real value is set after mount in useEffect.
  const [supported, setSupported] = useState(false)
  const ctorRef = useRef<any>(null)

  useEffect(() => {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    ctorRef.current = Ctor || null
    setSupported(Boolean(Ctor))
  }, [])

  const recRef = useRef<any>(null)
  const [listening, setListening] = useState(false)

  const onTextRef = useRef(onText)
  onTextRef.current = onText
  const langRef = useRef(lang)
  langRef.current = lang

  const stop = useCallback(() => {
    try { recRef.current?.stop() } catch { /* ignore */ }
  }, [])

  const start = useCallback(() => {
    if (!ctorRef.current) return
    try { recRef.current?.abort() } catch { /* ignore */ }

    const rec = new ctorRef.current()
    rec.lang = langRef.current
    rec.interimResults = true
    rec.continuous = false

    rec.onresult = (e: any) => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript
      onTextRef.current?.(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)

    recRef.current = rec
    setListening(true)
    rec.start()
  }, [])

  useEffect(() => () => {
    try { recRef.current?.abort() } catch { /* ignore */ }
  }, [])

  return { supported, listening, start, stop }
}
