import { createContext, useContext, useState, type ReactNode } from 'react'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

export type Locale = 'zh-CN' | 'en-US'

type TranslationParams = Record<string, string | number>
type Dictionary = Record<string, string>

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslationParams) => string
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
  formatTime: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
  formatNumber: (value: number) => string
}

const STORAGE_KEY = 'hud-locale'

const DICTIONARIES: Record<Locale, Dictionary> = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

const DEFAULT_CONTEXT: I18nContextValue = {
  locale: 'en-US',
  setLocale: () => {},
  t: (key) => DICTIONARIES['en-US'][key] ?? key,
  formatDate: (value, options) => new Intl.DateTimeFormat('en-US', options).format(new Date(value)),
  formatTime: (value, options) => new Intl.DateTimeFormat('en-US', options).format(new Date(value)),
  formatNumber: (value) => new Intl.NumberFormat('en-US').format(value),
}

const I18nContext = createContext<I18nContextValue>(DEFAULT_CONTEXT)

function isLocale(value: string | null): value is Locale {
  return value === 'zh-CN' || value === 'en-US'
}

function interpolate(template: string, params?: TranslationParams) {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}

function getBrowserLocale() {
  if (typeof window === 'undefined') return 'en-US'

  const preferred = window.navigator.language || window.navigator.languages?.[0] || 'en-US'
  return preferred.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

export function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en-US'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) {
    return stored
  }

  return getBrowserLocale()
}

function translate(locale: Locale, key: string, params?: TranslationParams) {
  const template = DICTIONARIES[locale][key] ?? DICTIONARIES['en-US'][key] ?? key
  return interpolate(template, params)
}

function formatWithLocale(locale: Locale, value: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale)

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    }
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: (key, params) => translate(locale, key, params),
    formatDate: (input, options) => formatWithLocale(locale, input, options),
    formatTime: (input, options) => formatWithLocale(locale, input, options),
    formatNumber: (value) => new Intl.NumberFormat(locale).format(value),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
