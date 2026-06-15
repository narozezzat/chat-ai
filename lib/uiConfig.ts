import type { Effort } from './types'

// ============================================================================
//  Client-side UI config — edit these arrays to change the controls.
//  The model `id`s here must match lib/models.ts (the server-side config).
//  This file is safe to import in client components (no secrets, no SDKs).
// ============================================================================

export interface UIModel {
  id: string
  label: string
}

export const MODELS: UIModel[] = [
  { id: 'gpt-5', label: 'GPT-5' },
  { id: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
]

// Reasoning-effort levels (Arabic labels to match the "مستوى التفكير" control)
export const EFFORT_LEVELS: { id: Effort; label: string }[] = [
  { id: 'low', label: 'منخفض' },
  { id: 'medium', label: 'متوسط' },
  { id: 'high', label: 'عالي' },
]

// Speech-to-text languages
export interface SpeechLang {
  id: string
  label: string
}

export const SPEECH_LANGS: SpeechLang[] = [
  { id: 'ar-SA', label: 'العربية' },
  { id: 'en-US', label: 'English' },
]
