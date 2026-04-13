import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { LanguageProvider, resolveInitialLocale, useI18n } from './index'

function Probe() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div>{t('topbar.tabs.dashboard')}</div>
      <div>{t('commandPalette.noResults', { query: 'abc' })}</div>
      <div>{t('test.onlyInEnglish')}</div>
      <button type="button" onClick={() => setLocale(locale === 'en-US' ? 'zh-CN' : 'en-US')}>
        toggle
      </button>
    </div>
  )
}

describe('i18n locale resolution', () => {
  const originalLanguage = navigator.language

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: originalLanguage,
    })
  })

  it('prefers a stored locale over browser language', () => {
    localStorage.setItem('hud-locale', 'en-US')

    expect(resolveInitialLocale()).toBe('en-US')
  })

  it('uses Chinese when browser language starts with zh', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'zh-CN',
    })

    expect(resolveInitialLocale()).toBe('zh-CN')
  })

  it('falls back to English when browser language is not Chinese', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'en-US',
    })

    expect(resolveInitialLocale()).toBe('en-US')
  })
})

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('updates translations and persists locale changes', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en-US')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('No results for "abc"')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }))

    expect(screen.getByTestId('locale')).toHaveTextContent('zh-CN')
    expect(localStorage.getItem('hud-locale')).toBe('zh-CN')
    expect(screen.getByText('仪表盘')).toBeInTheDocument()
    expect(screen.getByText('没有“abc”的结果')).toBeInTheDocument()
  })

  it('falls back to English when a key is missing from the active locale', () => {
    localStorage.setItem('hud-locale', 'zh-CN')

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )

    expect(screen.getByText('English fallback text')).toBeInTheDocument()
  })
})
