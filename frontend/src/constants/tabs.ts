export const TABS = [
  { id: 'dashboard', labelKey: 'topbar.tabs.dashboard', key: '1' },
  { id: 'memory', labelKey: 'topbar.tabs.memory', key: '2' },
  { id: 'skills', labelKey: 'topbar.tabs.skills', key: '3' },
  { id: 'sessions', labelKey: 'topbar.tabs.sessions', key: '4' },
  { id: 'cron', labelKey: 'topbar.tabs.cron', key: '5' },
  { id: 'projects', labelKey: 'topbar.tabs.projects', key: '6' },
  { id: 'health', labelKey: 'topbar.tabs.health', key: '7' },
  { id: 'agents', labelKey: 'topbar.tabs.agents', key: '8' },
  { id: 'chat', labelKey: 'topbar.tabs.chat', key: '9' },
  { id: 'profiles', labelKey: 'topbar.tabs.profiles', key: '0' },
  { id: 'token-costs', labelKey: 'topbar.tabs.tokenCosts', key: null },
  { id: 'corrections', labelKey: 'topbar.tabs.corrections', key: null },
  { id: 'patterns', labelKey: 'topbar.tabs.patterns', key: null },
] as const

export type TabId = typeof TABS[number]['id']
