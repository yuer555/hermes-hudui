import { useState } from 'react'
import { useI18n } from '../../i18n'

interface ReasoningBlockProps {
  content: string
}

export default function ReasoningBlock({ content }: ReasoningBlockProps) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="my-2"
      style={{
        borderLeft: '2px solid var(--hud-warning)',
        background: 'var(--hud-bg-surface)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-2 py-1.5 flex items-center gap-2 cursor-pointer text-left"
      >
        <span style={{ color: 'var(--hud-warning)' }}>🧠</span>
        <span style={{ color: 'var(--hud-warning)', fontSize: '12px' }}>
          {expanded ? t('chat.reasoning.expanded') : t('chat.reasoning.collapsed')}
        </span>
        <span style={{ color: 'var(--hud-text-dim)', fontSize: '11px' }} className="ml-auto">
          {expanded ? '▼' : '▶'}
        </span>
      </button>

      {expanded && (
        <div className="px-2 pb-2">
          <div
            className="p-2 text-[12px] leading-relaxed"
            style={{
              color: 'var(--hud-text-dim)',
              whiteSpace: 'pre-wrap',
              fontStyle: 'italic',
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  )
}
