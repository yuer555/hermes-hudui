import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import { ThemeProvider } from '../hooks/useTheme'
import { LanguageProvider } from '../i18n'
import TopBar from './TopBar'

describe('TopBar locale switcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders translated tabs and lets the user switch languages', () => {
    window.localStorage.setItem('hud-locale', 'zh-CN')

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TopBar activeTab="dashboard" onTabChange={() => {}} />
        </ThemeProvider>
      </LanguageProvider>,
    )

    expect(screen.getByRole('button', { name: /仪表盘/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument()
    expect(window.localStorage.getItem('hud-locale')).toBe('en-US')
  })
})
