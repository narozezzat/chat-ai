import './globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'AI Studio',
  description: 'A polished, multi-model AI chat studio — GPT-5, Claude & Gemini.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f0a1e',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Direction is set once at the <html> root (RTL by default for Arabic).
  // Message content uses dir="auto" so embedded English renders correctly.
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
