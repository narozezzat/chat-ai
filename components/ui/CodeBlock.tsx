'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyIcon, CheckIcon } from '@/components/ui/Icons'

interface CodeBlockProps {
  language: string
  value: string
}

// A fenced code block with syntax highlighting + a copy button.
// Forced LTR (dir="ltr") because code is always read left-to-right, even on
// an RTL page.
export default function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div dir="ltr" className="group/code my-3 overflow-hidden rounded-xl border border-border bg-[#0c0a16]">
      <div className="flex items-center justify-between border-b border-border bg-[#120e22] px-3 py-1.5 text-xs text-muted">
        <span className="font-mono lowercase">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-white/5 hover:text-ink"
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem',
          fontSize: '0.85rem',
        }}
        codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
