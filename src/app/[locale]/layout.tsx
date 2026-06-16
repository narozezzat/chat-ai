import '../globals.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Cairo } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { LanguageProvider } from '@/components/LanguageProvider'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'AI Studio',
  description: 'A polished, multi-model AI chat studio — GPT-5, Claude & Gemini.',
}

export const viewport: Viewport = {
  themeColor: '#09090b',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable}`} suppressHydrationWarning>
      <body className="font-sans font-medium">
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
