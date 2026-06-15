# AI Studio 🟣

A polished, **ChatGPT-style multi-model chat app** built with **Next.js (App Router) + TypeScript + Tailwind CSS**. One app, one command — the API keys live only on the server (Next.js Route Handler), never in the browser.

![stack](https://img.shields.io/badge/Next.js-latest-black) ![ts](https://img.shields.io/badge/TypeScript-strict-blue) ![tailwind](https://img.shields.io/badge/Tailwind-v4-7C3AED)

## ✨ Features

- **Streaming chat** — assistant replies appear token-by-token, with a **Stop** button.
- **4 models, one dropdown** — GPT-5, Claude Opus 4.5, Claude Sonnet 4.5, Gemini 2.5 Pro.
- **Reasoning effort** selector (مستوى التفكير): Low / Medium / High, mapped to each provider's reasoning parameter.
- **Vision** — attach one or more images and ask about them (sent as base64 to vision-capable models).
- **Speech-to-text** — microphone button using the browser's Web Speech API (Arabic `ar-SA` by default, switchable to English), with a pulsing recording indicator.
- **Markdown rendering** — code blocks with syntax highlighting, plus a **copy button** on every assistant message and every code block.
- **Dark, premium, RTL-ready UI** — deep purple-black theme with purple accents, fully responsive.

## 🧱 Project structure

```
ai-studio/
├── app/
│   ├── api/chat/route.ts   # secure streaming proxy to the providers
│   ├── layout.tsx          # <html dir="rtl"> root + metadata
│   ├── page.tsx            # the chat page (state, streaming, stop)
│   └── globals.css         # Tailwind v4 + brand theme tokens
├── components/             # Header, ModelSelector, EffortSelector,
│                           # MessageList, Message, Markdown, CodeBlock,
│                           # ChatInput, Icons
├── hooks/useSpeechRecognition.ts
├── lib/
│   ├── models.ts           # ← MODEL CONFIG (edit to add/remove models)
│   ├── providers.ts        # OpenAI + Anthropic SDK adapters (streaming)
│   ├── uiConfig.ts         # UI model list + effort levels + mic languages
│   ├── chatClient.ts       # client-side streaming fetch reader
│   └── types.ts            # shared TypeScript types
└── .env.example            # the keys you need
```

## 🚀 Run it locally (3 steps)

> Requires **Node.js 20+**. Examples use `npm`; `pnpm` / `yarn` work too.

### 1. Install dependencies

```bash
npm install
```

### 2. Add your API keys

Copy the example env file and fill in the keys for the models you want to use
(you only need the keys for the providers you'll actually demo):

```bash
cp .env.example .env.local
```

Then open **`.env.local`** and paste your keys:

```
OPENAI_API_KEY=sk-...        # for GPT-5
ANTHROPIC_API_KEY=sk-ant-... # for Claude Opus 4.5 & Sonnet 4.5
GEMINI_API_KEY=...           # for Gemini 2.5 Pro
```

| Key | Get it from |
| --- | --- |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |

### 3. Start the app

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

That's it — front-end and back-end are the same Next.js app, so a single command runs everything.

### Production build (optional)

```bash
npm run build
npm run start
```

## 🛠️ Customizing

- **Add / remove a model:** edit the array in `lib/models.ts` (server: provider + real API model id) and `lib/uiConfig.ts` (the label shown in the dropdown). Keep the `id`s in sync.
- **Change the theme:** the brand colors are CSS variables in the `@theme` block of `app/globals.css` (`--color-base`, `--color-accent`, …).
- **Reasoning effort mapping:** see `lib/providers.ts` — OpenAI/Gemini use `reasoning_effort`; Anthropic Opus 4.5 uses `output_config.effort` while Sonnet 4.5 uses an extended-thinking `budget_tokens` (the effort param isn't supported on Sonnet 4.5).

## 📝 Notes for the demo

- **Microphone** needs a Chromium-based browser (Chrome / Edge) and a secure context — `http://localhost` counts as secure, so it works in local dev. Click the 🌐 toggle next to the mic to switch between Arabic and English.
- **Keys are server-only.** They're read inside `app/api/chat/route.ts` and never prefixed with `NEXT_PUBLIC_`, so they're never shipped to the browser.
- If a model errors (e.g. a missing key or no access), the error is shown inline in the chat so the demo never hard-crashes.
