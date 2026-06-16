import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '../config/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(locales as readonly string[]).includes(locale)) {
    locale = 'en'
  }

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default
    return {
      locale,
      messages,
    }
  } catch (err) {
    console.error('[getRequestConfig] Error loading messages:', err)
    notFound()
  }
})
