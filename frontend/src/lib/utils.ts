/** Shared formatting utilities */

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith('zh')
}

export function timeAgo(iso: string | null | undefined, locale = 'en-US'): string {
  const isChinese = isChineseLocale(locale)
  if (!iso) return isChinese ? '从未' : 'never'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return isChinese ? '从未' : 'never'
  const now = new Date()
  const secs = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (secs < 0) return isChinese ? '刚刚' : 'just now'
  if (secs < 60) return isChinese ? `${secs}秒前` : `${secs}s ago`
  if (secs < 3600) return isChinese ? `${Math.floor(secs / 60)}分钟前` : `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    if (isChinese) {
      return m ? `${h}小时${m}分前` : `${h}小时前`
    }
    return m ? `${h}h${m}m ago` : `${h}h ago`
  }
  const days = Math.floor(secs / 86400)
  if (days < 30) return isChinese ? `${days}天前` : `${days}d ago`
  return isChinese ? `${Math.floor(days / 30)}个月前` : `${Math.floor(days / 30)}mo ago`
}

export function formatDur(mins: number | null | undefined, locale = 'en-US'): string {
  const isChinese = isChineseLocale(locale)
  if (!mins) return ''
  if (mins < 1) return isChinese ? '<1分' : '<1m'
  if (mins < 60) return isChinese ? `${Math.floor(mins)}分` : `${Math.floor(mins)}m`
  const h = Math.floor(mins / 60)
  const m = Math.floor(mins % 60)
  if (isChinese) return m ? `${h}小时${m}分` : `${h}小时`
  return m ? `${h}h${m}m` : `${h}h`
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1048576).toFixed(1)}MB`
}

export function truncate(str: string, len: number): string {
  if (!str) return ''
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}
