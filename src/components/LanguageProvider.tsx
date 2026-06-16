'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/config/navigation'

export interface LanguageContextType {
  language: 'en' | 'ar'
  locale: 'en' | 'ar'
  setLanguage: (lang: 'en' | 'ar') => void
  toggleLanguage: () => void
  dir: 'ltr' | 'rtl'
  isRtl: boolean
}

export const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const locale = useLocale() as 'en' | 'ar'
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = React.useCallback(
    (newLocale: 'en' | 'ar') => {
      router.replace(pathname, { locale: newLocale })
    },
    [router, pathname]
  )

  const toggleLanguage = React.useCallback(() => {
    setLanguage(locale === 'en' ? 'ar' : 'en')
  }, [locale, setLanguage])

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'
  const isRtl = dir === 'rtl'

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = dir
    }
  }, [locale, dir])

  const value = React.useMemo(
    () => ({
      language: locale,
      locale,
      setLanguage,
      toggleLanguage,
      dir,
      isRtl,
    }),
    [locale, setLanguage, toggleLanguage, dir, isRtl]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
