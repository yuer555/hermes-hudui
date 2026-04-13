import { useState, useEffect } from 'react'
import { useTheme, THEMES } from '../hooks/useTheme'
import { useI18n } from '../i18n'
import { TABS, type TabId } from '../constants/tabs'

interface TopBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function TopBar({ activeTab, onTabChange }: TopBarProps) {
  const { theme, setTheme, scanlines, setScanlines } = useTheme()
  const { locale, setLocale, t, formatTime } = useI18n()
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      // 1-9 for tabs (only tabs with numeric keys)
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const tab = TABS.find(t => t.key === String(num))
        if (tab) {
          onTabChange(tab.id)
          return
        }
      }
      // 0 for Profiles (10th tab with key '0')
      if (e.key === '0') {
        onTabChange('profiles')
        return
      }
      // T to toggle theme picker
      if (e.key === 't') {
        setShowThemePicker(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onTabChange])

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b"
         style={{ borderColor: 'var(--hud-border)', background: 'var(--hud-bg-surface)' }}>
      {/* Logo */}
      <span className="gradient-text font-bold text-[13px] mr-3 tracking-wider cursor-pointer shrink-0"
            onClick={() => onTabChange('dashboard')}>☤ HERMES</span>

      {/* Tabs */}
      <div className="flex gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-2 py-1.5 text-[13px] tracking-widest uppercase transition-all duration-150 shrink-0 cursor-pointer"
            style={{
              color: activeTab === tab.id ? 'var(--hud-primary)' : 'var(--hud-text-dim)',
              background: activeTab === tab.id ? 'var(--hud-bg-panel)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--hud-primary)' : '2px solid transparent',
              textShadow: activeTab === tab.id ? '0 0 8px var(--hud-primary-glow)' : 'none',
              minHeight: '32px',
            }}
          >
            {tab.key && <span className="opacity-40 mr-1">{tab.key}</span>}
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2" aria-label={t('topbar.language.label')}>
        <button
          type="button"
          onClick={() => setLocale('zh-CN')}
          className="px-2 py-1 text-[11px] cursor-pointer"
          style={{
            background: locale === 'zh-CN' ? 'var(--hud-primary)' : 'transparent',
            color: locale === 'zh-CN' ? 'var(--hud-bg-deep)' : 'var(--hud-text-dim)',
            border: '1px solid var(--hud-border)',
          }}
        >
          {t('topbar.language.zhCN')}
        </button>
        <button
          type="button"
          onClick={() => setLocale('en-US')}
          className="px-2 py-1 text-[11px] cursor-pointer"
          style={{
            background: locale === 'en-US' ? 'var(--hud-primary)' : 'transparent',
            color: locale === 'en-US' ? 'var(--hud-bg-deep)' : 'var(--hud-text-dim)',
            border: '1px solid var(--hud-border)',
          }}
        >
          {t('topbar.language.english')}
        </button>
      </div>

      {/* Theme picker */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowThemePicker(p => !p)}
          className="px-2 py-1.5 text-[13px] tracking-wider uppercase cursor-pointer"
          style={{ color: 'var(--hud-text-dim)', minHeight: '32px' }}
          title={t('topbar.themeButtonTitle')}
        >
          ◆
        </button>
        {showThemePicker && (
          <div className="absolute right-0 top-full mt-1 z-50 py-1 min-w-[180px]"
               style={{ background: 'var(--hud-bg-panel)', border: '1px solid var(--hud-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setShowThemePicker(false) }}
                className="block w-full text-left px-3 py-2 text-[13px] transition-colors cursor-pointer"
                style={{
                  color: theme === t.id ? 'var(--hud-primary)' : 'var(--hud-text)',
                  background: theme === t.id ? 'var(--hud-bg-hover)' : 'transparent',
                  minHeight: '36px',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <div className="border-t my-1" style={{ borderColor: 'var(--hud-border)' }} />
            <button
              onClick={() => setScanlines(!scanlines)}
              className="block w-full text-left px-3 py-2 text-[13px] cursor-pointer"
              style={{ color: 'var(--hud-text-dim)', minHeight: '36px' }}
            >
              {scanlines ? '▣' : '□'} {t('topbar.scanlines')}
            </button>
          </div>
        )}
      </div>

      {/* Clock */}
      <span className="text-[13px] ml-2 tabular-nums shrink-0 hidden sm:inline" style={{ color: 'var(--hud-text-dim)' }}>
        {formatTime(time, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </span>
    </div>
  )
}
