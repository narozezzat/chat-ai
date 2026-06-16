// Minimal ambient types for react-syntax-highlighter (the package ships no
// types of its own and we only use a tiny part of its surface).
declare module 'react-syntax-highlighter' {
  import type { ComponentType, ReactNode, CSSProperties } from 'react'

  export interface SyntaxHighlighterProps {
    language?: string
    style?: { [key: string]: CSSProperties }
    customStyle?: CSSProperties
    codeTagProps?: { style?: CSSProperties }
    wrapLongLines?: boolean
    children?: ReactNode
    [key: string]: unknown
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>
  export const Light: ComponentType<SyntaxHighlighterProps>
  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>
  export default SyntaxHighlighter
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  import type { CSSProperties } from 'react'
  export const oneDark: { [key: string]: CSSProperties }
  const styles: { [key: string]: { [key: string]: CSSProperties } }
  export default styles
}
