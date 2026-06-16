// ============================================================================
//  Provider adapters (server-only — imported solely by the /api/chat route).
//
//  Every provider is wrapped in an async generator that yields plain text
//  chunks as they stream in. The route handler consumes these and forwards
//  each chunk to the browser. Adding a new provider = write one `streamX`
//  generator and wire it up in `streamChat` below.
//
//  Gemini is reached through the OpenAI SDK pointed at Google's
//  OpenAI-compatible endpoint, so we only need two SDKs total.
//
//  Note on `any`: the request/response shapes of the two SDKs are large unions
//  that also evolve between versions. We keep our OWN domain types strict
//  (ChatMessage / ModelConfig / Effort) and use small, contained casts only at
//  the SDK call boundary so the glue stays robust across SDK updates.
// ============================================================================
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage, Effort, ModelConfig } from './types'

// --- Lazily-created clients (so nothing breaks if some keys are missing) ---
let _openai: OpenAI | undefined
let _gemini: OpenAI | undefined
let _anthropic: Anthropic | undefined

function openaiClient(): OpenAI {
  return (_openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))
}
function geminiClient(): OpenAI {
  return (_gemini ??= new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  }))
}
function anthropicClient(): Anthropic {
  return (_anthropic ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }))
}

const SYSTEM_PROMPT =
  'You are AI Studio, a helpful, friendly AI assistant. Answer clearly and concisely. ' +
  'Use Markdown for formatting, and fenced code blocks with a language tag for any code. ' +
  'Always reply in the same language the user writes in.'

// Map the UI effort level -> Anthropic extended-thinking token budget (Sonnet 4.5).
const THINKING_BUDGET: Record<Effort, number> = { low: 2000, medium: 6000, high: 12000 }

// --- Convert our generic message shape into each provider's expected format ---

function toOpenAIMessages(messages: ChatMessage[]): unknown[] {
  const out: unknown[] = [{ role: 'system', content: SYSTEM_PROMPT }]
  for (const m of messages) {
    if (m.role === 'user' && m.images?.length) {
      // Multimodal content: text + one image_url block per image.
      out.push({
        role: 'user',
        content: [
          ...(m.content ? [{ type: 'text', text: m.content }] : []),
          ...m.images.map((url) => ({ type: 'image_url', image_url: { url } })),
        ],
      })
    } else {
      out.push({ role: m.role, content: m.content })
    }
  }
  return out
}

function toAnthropicMessages(messages: ChatMessage[]): unknown[] {
  return messages.map((m) => {
    if (m.role === 'user' && m.images?.length) {
      return {
        role: 'user',
        content: [
          ...(m.content ? [{ type: 'text', text: m.content }] : []),
          ...m.images.map((url) => {
            // Split "data:image/png;base64,AAAA" -> media_type + base64 data
            const [meta, data] = url.split(',')
            const media_type = meta.slice(meta.indexOf(':') + 1, meta.indexOf(';'))
            return { type: 'image', source: { type: 'base64', media_type, data } }
          }),
        ],
      }
    }
    return { role: m.role, content: m.content }
  })
}

// --- Streaming generators (async generators that yield text chunks) -------

// OpenAI + Gemini share the exact same shape (Gemini via the compat endpoint).
async function* streamOpenAICompatible(
  client: OpenAI,
  model: string,
  messages: ChatMessage[],
  effort: Effort,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const stream = (await client.chat.completions.create(
    {
      model,
      messages: toOpenAIMessages(messages),
      stream: true,
      reasoning_effort: effort, // 'low' | 'medium' | 'high'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    { signal },
  )) as unknown as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content
    if (delta) yield delta
  }
}

async function* streamAnthropic(
  modelConfig: ModelConfig,
  messages: ChatMessage[],
  effort: Effort,
  signal: AbortSignal,
): AsyncGenerator<string> {
  // Built loosely: `output_config` / `thinking` are newer fields that may not be
  // in every SDK's static types, so we assemble the body as a plain object.
  const body: Record<string, unknown> = {
    model: modelConfig.apiModel,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: toAnthropicMessages(messages),
  }

  // Apply the reasoning-effort selector. Opus 4.5 supports the native effort
  // parameter; Sonnet 4.5 does not, so we use an extended-thinking budget there.
  if (modelConfig.effort === 'native') {
    body.output_config = { effort } // 'low' | 'medium' | 'high'
  } else if (modelConfig.effort === 'thinking') {
    body.thinking = { type: 'enabled', budget_tokens: THINKING_BUDGET[effort] }
  }

  const stream = anthropicClient().messages.stream(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body as any,
    { signal },
  ) as AsyncIterable<unknown>

  for await (const event of stream) {
    // Forward only the final answer text, not the model's internal thinking.
    const e = event as { type?: string; delta?: { type?: string; text?: string } }
    if (e.type === 'content_block_delta' && e.delta?.type === 'text_delta' && e.delta.text) {
      yield e.delta.text
    }
  }
}

// --- Public entry point: dispatch to the right provider -------------------
export async function* streamChat({
  modelConfig,
  messages,
  effort,
  signal,
}: {
  modelConfig: ModelConfig
  messages: ChatMessage[]
  effort: Effort
  signal: AbortSignal
}): AsyncGenerator<string> {
  switch (modelConfig.provider) {
    case 'openai':
      yield* streamOpenAICompatible(openaiClient(), modelConfig.apiModel, messages, effort, signal)
      break
    case 'gemini':
      yield* streamOpenAICompatible(geminiClient(), modelConfig.apiModel, messages, effort, signal)
      break
    case 'anthropic':
      yield* streamAnthropic(modelConfig, messages, effort, signal)
      break
    default:
      throw new Error(`Unknown provider: ${modelConfig.provider}`)
  }
}
