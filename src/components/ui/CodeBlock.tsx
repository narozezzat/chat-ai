import * as React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeBlockProps {
  language: string
  value: string
}

export default function CodeBlock({ language, value }: CodeBlockProps): React.JSX.Element {
  const [copied, setCopied] = React.useState(false)

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div dir="ltr" className="group/code my-3 overflow-hidden rounded-lg border border-border bg-zinc-950/40">
      <div className="flex items-center justify-between border-b border-border bg-zinc-900/60 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono lowercase">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          className="h-7 gap-1 rounded px-2 text-[10px] text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
          <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem',
          fontSize: '0.8rem',
        }}
        codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
