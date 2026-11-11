import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useSiteContent } from './SiteContentContext'

export type ThemeMode = 'light' | 'dark'

export interface ThemeContextValue {
  theme: ThemeMode
  isDark: boolean
  darkModeEnabled: boolean
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const THEME_STORAGE_KEY = 'hashousha_theme'
const THEME_CHANNEL_NAME = 'hashousha_theme_channel'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'dark') {
        return 'dark'
      }
    } catch {
      // localStorage may be unavailable in restricted environments
    }
  }
  return 'light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { content } = useSiteContent()
  const darkModeEnabled = content.darkModeEnabled ?? true

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const initial = getInitialTheme()
    return darkModeEnabled ? initial : 'light'
  })

  // Synchronize document DOM root & localStorage whenever theme or darkModeEnabled changes
  useEffect(() => {
    const root = document.documentElement
    if (darkModeEnabled && theme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkModeEnabled ? theme : 'light')
    } catch {
      // ignore storage failure
    }

    // Broadcast instant real-time update to all other open tabs/windows
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel(THEME_CHANNEL_NAME)
        bc.postMessage({ theme: darkModeEnabled ? theme : 'light' })
        bc.close()
      }
    } catch {
      // ignore broadcast failure
    }
  }, [theme, darkModeEnabled])

  // Active DOM shielding via MutationObserver when Dark Mode is deactivated
  useEffect(() => {
    if (darkModeEnabled) return
    const root = document.documentElement
    root.classList.remove('dark')
    root.style.colorScheme = 'light'

    const observer = new MutationObserver(() => {
      if (root.classList.contains('dark')) {
        root.classList.remove('dark')
      }
      if (root.style.colorScheme !== 'light') {
        root.style.colorScheme = 'light'
      }
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] })
    return () => observer.disconnect()
  }, [darkModeEnabled])

  // Cross-tab real-time synchronization listeners (BroadcastChannel + StorageEvent)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. High-speed BroadcastChannel listener (Instant zero-delay sync across tabs)
    let channel: BroadcastChannel | null = null
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(THEME_CHANNEL_NAME)
        channel.onmessage = (e: MessageEvent) => {
          if (e.data && (e.data.theme === 'light' || e.data.theme === 'dark')) {
            if (darkModeEnabled) {
              setThemeState(e.data.theme)
            }
          }
        }
      }
    } catch {
      // BroadcastChannel unavailable
    }

    // 2. Standard browser StorageEvent listener (Fallback cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (darkModeEnabled) {
          setThemeState(e.newValue as ThemeMode)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (channel) {
        channel.close()
      }
    }
  }, [darkModeEnabled])

  // Listen to OS system preference changes if no manual preference is saved in localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia || !darkModeEnabled) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (!stored) {
          setThemeState(e.matches ? 'dark' : 'light')
        }
      } catch {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [darkModeEnabled])

  const toggleTheme = () => {
    if (!darkModeEnabled) return
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme: ThemeMode) => {
    if (!darkModeEnabled && newTheme === 'dark') return
    setThemeState(newTheme)
  }

  const value = useMemo(
    () => ({
      theme: darkModeEnabled ? theme : 'light',
      isDark: darkModeEnabled && theme === 'dark',
      darkModeEnabled,
      toggleTheme,
      setTheme,
    }),
    [theme, darkModeEnabled]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
