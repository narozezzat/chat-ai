// ============================================================================
//  POST /api/chat  — the secure server-side proxy to the model providers.
//
//  The browser sends { messages, model, effort }. This route adds the secret
//  API key (from .env.local, server-only) and streams the model's reply back
//  as newline-delimited JSON (NDJSON): one {"type","text"} object per line.
// ============================================================================
import { getFallbackModels, getModel } from '@/lib/models'
import { streamChat } from '@/lib/providers'
import type { ChatMessage, Effort, Provider } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Which env var each provider needs (used for a clean "missing key" error).
const KEY_FOR: Record<Provider, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  gemini: 'GEMINI_API_KEY',
}

function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function errorMessage(err: unknown): string {
  return (
    (err as { error?: { message?: string }; message?: string })?.error?.message ||
    (err as Error)?.message ||
    'Unexpected server error'
  )
}

function isRateLimitError(err: unknown): boolean {
  const e = err as {
    status?: number
    code?: string
    type?: string
    error?: { code?: string; message?: string; type?: string }
    message?: string
  }
  const haystack = [
    e.status,
    e.code,
    e.type,
    e.error?.code,
    e.error?.type,
    e.error?.message,
    e.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return (
    e.status === 429 ||
    haystack.includes('rate limit') ||
    haystack.includes('quota') ||
    haystack.includes('resource_exhausted') ||
    haystack.includes('too many requests')
  )
}

interface ChatRequest {
  messages?: ChatMessage[]
  model?: string
  effort?: Effort
}

export async function POST(req: Request): Promise<Response> {
  let body: ChatRequest
  try {
    body = (await req.json()) as ChatRequest
  } catch {
    return jsonError('Invalid JSON body')
  }

  const { messages, model, effort = 'medium' } = body ?? {}

  // ---- Validate everything up front, so errors come back as clean JSON ----
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonError('messages must be a non-empty array')
  }
  const modelConfig = getModel(model ?? '')
  if (!modelConfig) {
    return jsonError(`Unknown model: ${model}`)
  }
  const keyName = KEY_FOR[modelConfig.provider]
  if (!process.env[keyName]) {
    return jsonError(`${keyName} is not set. Add it to .env.local`, 500)
  }

  // ---- Stream the response as NDJSON ----
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'))
      const modelsToTry = [modelConfig, ...getFallbackModels(modelConfig)]
      let emittedText = false
      let lastError: unknown

      try {
        for (let index = 0; index < modelsToTry.length; index += 1) {
          const currentModel = modelsToTry[index]
          try {
            for await (const text of streamChat({
              modelConfig: currentModel,
              messages,
              effort,
              signal: req.signal, // aborts when the browser hits "Stop"
            })) {
              emittedText = true
              send({ type: 'delta', text })
            }
            send({ type: 'done' })
            return
          } catch (err) {
            lastError = err
            if (req.signal.aborted) return

            const nextModel = modelsToTry[index + 1]
            const canTryFallback =
              Boolean(nextModel) &&
              !emittedText &&
              currentModel.provider === 'gemini' &&
              isRateLimitError(err)
            if (!canTryFallback) break

            console.warn(
              `[chat] ${currentModel.id} hit a Gemini quota limit; trying ${nextModel.id}.`,
            )
          }
        }

        throw lastError ?? new Error('Unexpected server error')
      } catch (err) {
        // If the client aborted, just close quietly.
        if (!req.signal.aborted) {
          console.error('[chat] error:', err)
          send({ type: 'error', error: errorMessage(err) })
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
