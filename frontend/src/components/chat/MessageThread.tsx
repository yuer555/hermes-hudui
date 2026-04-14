import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../hooks/useChat'
import MessageBubble from './MessageBubble'
import ToolCallCard from './ToolCallCard'
import ReasoningBlock from './ReasoningBlock'
import { useI18n } from '../../i18n'

interface MessageThreadProps {
  messages: ChatMessage[]
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const { t } = useI18n()
  const bottomRef = useRef<HTMLDivElement>(null)
  const previousStateRef = useRef<{ count: number; lastMessageId: string | null }>({
    count: 0,
    lastMessageId: null,
  })

  // New messages can animate into view, but streaming updates should scroll instantly.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    const previousState = previousStateRef.current
    const isNewMessage =
      messages.length > previousState.count || lastMessage?.id !== previousState.lastMessageId

    bottomRef.current?.scrollIntoView({ behavior: isNewMessage ? 'smooth' : 'auto' })

    previousStateRef.current = {
      count: messages.length,
      lastMessageId: lastMessage?.id ?? null,
    }
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center" style={{ color: 'var(--hud-text-dim)' }}>
            <div className="text-[14px] mb-1">{t('chat.messages.none')}</div>
            <div className="text-[12px]">{t('chat.messages.startBelow')}</div>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            {/* Reasoning block (if assistant message has reasoning) */}
            {message.role === 'assistant' && message.reasoning && (
              <ReasoningBlock content={message.reasoning} />
            )}

            {/* Tool calls (if any) */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="my-1">
                {message.toolCalls.map((tool) => (
                  <ToolCallCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}

            {/* Main message bubble */}
            <MessageBubble
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              isStreaming={message.isStreaming}
            />
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
