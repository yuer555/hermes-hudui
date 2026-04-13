import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDur, timeAgo } from './utils'

describe('localized utility formatting', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-13T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders relative time in Chinese when locale is zh-CN', () => {
    expect(timeAgo('2026-04-13T11:58:00.000Z', 'zh-CN')).toBe('2分钟前')
  })

  it('renders duration in Chinese when locale is zh-CN', () => {
    expect(formatDur(125, 'zh-CN')).toBe('2小时5分')
  })
})
