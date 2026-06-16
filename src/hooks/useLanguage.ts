'use client'

import * as React from 'react'
import { LanguageContext, LanguageContextType } from '@/components/LanguageProvider'

export function useLanguage(): LanguageContextType {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
export type { LanguageContextType }
