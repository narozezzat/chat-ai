// ============================================================================
//  Shared types used across the app (client + server).
// ============================================================================

export type Role = 'user' | 'assistant'
export type Provider = 'openai' | 'anthropic' | 'gemini'
export type Effort = 'low' | 'medium' | 'high'

/** A single chat message as sent to / from the API. */
export interface ChatMessage {
  role: Role
  content: string
  images?: string[] // data URLs, e.g. "data:image/png;base64,AAAA..."
}

/** A message as held in the UI (adds a stable client-side id). */
export interface UIMessage extends ChatMessage {
  id: string
}

/** Server-side model configuration (see lib/models.ts). */
export interface ModelConfig {
  id: string
  label: string
  provider: Provider
  apiModel: string
  vision: boolean
  /** How the reasoning-effort selector maps onto Anthropic models. */
  effort?: 'native' | 'thinking'
}
