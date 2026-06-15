import type { ModelConfig } from './types'

// ============================================================================
//  MODEL CONFIG — the single place to add / remove / reorder models.
//
//  Each entry maps a UI model `id` to a provider and the real API model name:
//    provider : 'openai' | 'anthropic' | 'gemini'
//    apiModel : the exact model id sent to that provider's API
//    vision   : whether the model can accept image input
//    effort   : (Anthropic only) how the reasoning-effort selector is applied
//               'native'   -> output_config.effort   (Opus 4.5 supports this)
//               'thinking' -> extended-thinking budget_tokens (Sonnet 4.5)
//
//  fallbackModelIds : same-provider models to try if a request hits quota.
//
//  NOTE: keep these ids in sync with lib/uiConfig.ts (the client-side list).
// ============================================================================
export const MODELS: ModelConfig[] = [
  {
    id: 'gemini-3.5-flash',
    label: 'Gemini 3.5 Flash',
    provider: 'gemini',
    apiModel: 'gemini-3.5-flash',
    vision: true,
    fallbackModelIds: ['gemini-3.1-flash-lite'],
  },
  {
    id: 'gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash-Lite',
    provider: 'gemini',
    apiModel: 'gemini-3.1-flash-lite',
    vision: true,
  },
  { id: 'gpt-5',             label: 'GPT-5',             provider: 'openai',    apiModel: 'gpt-5',             vision: true },
  { id: 'claude-opus-4-5',   label: 'Claude Opus 4.5',   provider: 'anthropic', apiModel: 'claude-opus-4-5',   vision: true, effort: 'native' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'anthropic', apiModel: 'claude-sonnet-4-5', vision: true, effort: 'thinking' },
  {
    id: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    provider: 'gemini',
    apiModel: 'gemini-2.5-pro',
    vision: true,
    fallbackModelIds: ['gemini-3.5-flash', 'gemini-3.1-flash-lite'],
  },
]

export function getModel(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id)
}

export function getFallbackModels(modelConfig: ModelConfig): ModelConfig[] {
  return (modelConfig.fallbackModelIds ?? []).flatMap((id) => {
    const model = getModel(id)
    return model ? [model] : []
  })
}
