import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '../i18n'

const HERMES_ASCII = [
  ' ██╗  ██╗███████╗██████╗ ███╗   ███╗███████╗███████╗',
  ' ██║  ██║██╔════╝██╔══██╗████╗ ████║██╔════╝██╔════╝',
  ' ███████║█████╗  ██████╔╝██╔████╔██║█████╗  ███████╗',
  ' ██╔══██║██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══╝  ╚════██║',
  ' ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║███████╗███████║',
  ' ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝',
]

interface BootScreenProps {
  onComplete: () => void
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const { t } = useI18n()
  const [visibleLines, setVisibleLines] = useState(0)
  const [asciiVisible, setAsciiVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [skipped, setSkipped] = useState(false)

  const bootLines = useMemo(() => [
    { text: '☤ HERMES HUD v0.3.1', tone: 'primary' },
    { text: '', tone: 'default' },
    { text: t('boot.initializingMonitor'), tone: 'default' },
    { text: t('boot.readStateDb'), tone: 'default' },
    { text: t('boot.scanningMemoryBanks'), tone: 'default' },
    { text: t('boot.indexingSkillLibrary'), tone: 'default' },
    { text: t('boot.checkingServiceHealth'), tone: 'default' },
    { text: t('boot.profilingAgentProcesses'), tone: 'default' },
    { text: '', tone: 'default' },
    { text: t('boot.quote'), tone: 'accent' },
    { text: '', tone: 'default' },
    { text: t('boot.ready'), tone: 'success' },
  ], [t])

  useEffect(() => {
    const asciiTimer = setTimeout(() => setAsciiVisible(true), 200)
    const lineTimers = bootLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 600 + i * 100)
    )
    const fadeTimer = setTimeout(() => setFadeOut(true), 600 + bootLines.length * 100 + 400)
    const completeTimer = setTimeout(onComplete, 600 + bootLines.length * 100 + 800)

    return () => {
      clearTimeout(asciiTimer)
      lineTimers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [bootLines, onComplete])

  const handleSkip = () => {
    if (!skipped) {
      setSkipped(true)
      onComplete()
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-500 cursor-pointer select-none"
      style={{
        background: 'var(--hud-bg-deep)',
        opacity: fadeOut ? 0 : 1,
      }}
      onClick={handleSkip}
    >
      {/* ASCII logo — hidden on very narrow screens */}
      <pre
        className="gradient-text text-[8px] sm:text-[13px] leading-tight mb-4 sm:mb-6 transition-opacity duration-300 text-center overflow-hidden"
        style={{
          opacity: asciiVisible ? 1 : 0,
          maxWidth: '90vw',
          whiteSpace: 'pre',
        }}
      >
        {HERMES_ASCII.join('\n')}
      </pre>

      {/* Boot text */}
      <div className="text-[13px] w-[90vw] max-w-[400px] px-4">
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="py-0.5" style={{
            color: line.tone === 'accent' ? 'var(--hud-accent)' :
                   line.tone === 'primary' ? 'var(--hud-primary)' :
                   line.tone === 'success' ? 'var(--hud-success)' :
                   'var(--hud-text-dim)',
            fontStyle: line.tone === 'accent' ? 'italic' : 'normal',
          }}>
            {line.text}
            {i === visibleLines - 1 && (
              <span className="animate-pulse" style={{ color: 'var(--hud-primary)' }}>█</span>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 text-[13px]" style={{ color: 'var(--hud-text-dim)' }}>
        {t('boot.tapToSkip')}
      </div>
    </div>
  )
}
