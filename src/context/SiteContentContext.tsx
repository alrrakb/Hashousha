import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SiteContentSettings, DEFAULT_SITE_CONTENT, DEFAULT_UI_STRINGS } from '../types/admin'
import { fetchSiteContent } from '../services/adminService'

interface SiteContentContextType {
  content: SiteContentSettings
  loading: boolean
  reload: () => Promise<void>
  updateContentLocally: (updater: SiteContentSettings | ((prev: SiteContentSettings) => SiteContentSettings)) => void
  t: (key: string, fallback?: string) => string
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
  reload: async () => {},
  updateContentLocally: () => {},
  t: (key: string, fallback?: string) => fallback || DEFAULT_UI_STRINGS[key] || key,
})

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentSettings>(DEFAULT_SITE_CONTENT)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await fetchSiteContent()
      setContent(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateContentLocally = useCallback(
    (updater: SiteContentSettings | ((prev: SiteContentSettings) => SiteContentSettings)) => {
      setContent((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        return next
      })
    },
    []
  )

  useEffect(() => {
    reload()
  }, [reload])

  // Real-time listener for content update events across tabs / modules
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentSettings>
      if (customEvent.detail) {
        setContent(customEvent.detail)
      } else {
        reload()
      }
    }

    window.addEventListener('hashousha_content_updated', handleUpdate)
    return () => {
      window.removeEventListener('hashousha_content_updated', handleUpdate)
    }
  }, [reload])

  // Dynamic CSS Variable Injector for Light and Dark Modes
  useEffect(() => {
    if (!content.themeColors) return
    const styleId = 'hashousha-custom-theme-vars'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    const { light, dark } = content.themeColors
    styleEl.textContent = `
      :root {
        --background: ${light.background};
        --foreground: ${light.foreground};
        --card: ${light.card};
        --card-foreground: ${light.cardForeground};
        --popover: ${light.card};
        --popover-foreground: ${light.cardForeground};
        --primary: ${light.primary};
        --primary-foreground: ${light.primaryForeground};
        --border: ${light.border};
        --input: ${light.border};
        --ring: ${light.primary};
      }
      .dark {
        --background: ${dark.background};
        --foreground: ${dark.foreground};
        --card: ${dark.card};
        --card-foreground: ${dark.cardForeground};
        --popover: ${dark.card};
        --popover-foreground: ${dark.cardForeground};
        --primary: ${dark.primary};
        --primary-foreground: ${dark.primaryForeground};
        --border: ${dark.border};
        --input: ${dark.border};
        --ring: ${dark.primary};
      }
    `
  }, [content.themeColors])

  // Dynamic Favicon Synchronization in Document Head
  useEffect(() => {
    if (!content.favicon) return
    const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
    if (iconLinks.length > 0) {
      iconLinks.forEach((link) => {
        link.href = content.favicon
      })
    } else {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = content.favicon
      document.head.appendChild(link)
    }
  }, [content.favicon])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (
        content.uiStrings &&
        content.uiStrings[key] !== undefined &&
        content.uiStrings[key].trim() !== ''
      ) {
        return content.uiStrings[key]
      }
      if (fallback !== undefined) return fallback
      return DEFAULT_UI_STRINGS[key] || key
    },
    [content.uiStrings]
  )

  return (
    <SiteContentContext.Provider value={{ content, loading, reload, updateContentLocally, t }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export const useSiteContent = () => useContext(SiteContentContext)
