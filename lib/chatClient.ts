import type { ChatMessage, Effort } from './types'

// ============================================================================
//  Client helper: calls /api/chat and reads the streamed NDJSON response.
//
//  The server streams one JSON object per line, e.g. {"type":"delta","text":"Hi"}.
//  We read the response body as a stream, split on newlines, and call `onDelta`
//  for each chunk of text so the UI can render it token-by-token.
// ============================================================================

interface StreamChatArgs {
  messages: ChatMessage[]
  model: string
  effort: Effort
  signal: AbortSignal
  onDelta: (text: string) => void
}

interface StreamEvent {
  type: 'delta' | 'done' | 'error'
  text?: string
  error?: string
}

export async function streamChat({ messages, model, effort, signal, onDelta }: StreamChatArgs): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model, effort }),
    signal,
  })

  // Non-2xx responses come back as plain JSON with an `error` field.
  if (!res.ok || !res.body) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as { error?: string }
    throw new Error(err.error || `Request failed (${res.status})`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Process every complete line currently in the buffer.
    let nl: number
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim()
      buffer = buffer.slice(nl + 1)
      if (!line) continue

      const evt = JSON.parse(line) as StreamEvent
      if (evt.type === 'delta' && evt.text) onDelta(evt.text)
      else if (evt.type === 'error') throw new Error(evt.error)
      // evt.type === 'done' -> nothing to do; loop ends when the stream closes
    }
  }
}
