'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from '@/components/ui/CodeBlock'

// Renders assistant messages as Markdown (GitHub-flavored), with code fences
// upgraded to highlighted, copyable code blocks.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // `node` is provided by react-markdown but is not a valid DOM prop,
          // so we destructure it out before spreading the rest onto <code>.
          code({ node, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || '')
            const value = String(children).replace(/\n$/, '')
            // Treat anything with a language tag OR a newline as a block.
            const isBlock = match || value.includes('\n')
            if (isBlock) {
              return <CodeBlock language={match ? match[1] : 'text'} value={value} />
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            )
          },
          a({ node, children, ...rest }) {
            return (
              <a target="_blank" rel="noreferrer" {...rest}>
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
