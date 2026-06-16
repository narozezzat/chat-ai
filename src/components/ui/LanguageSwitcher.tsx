'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import { Globe } from 'lucide-react'

export function LanguageSwitcher(): React.JSX.Element {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="h-9 gap-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/80 text-foreground px-3 text-xs font-medium"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التحويل إلى اللغة الإنجليزية'}
    >
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  )
}
