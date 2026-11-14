import { useEffect, useState, useCallback } from 'react'
import { SeoSettings } from '../types/admin'
import { fetchSeoSettings, DEFAULT_SEO_SETTINGS } from '../services/adminService'
import {
  injectJsonLd,
  getBakerySchema,
  getFaqPageSchema,
  getBreadcrumbSchema,
  getDefaultStorefrontBreadcrumbs,
} from '../utils/seoSchemas'

export function useStorefrontSeo(currentPath: string = '/') {
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  const applySeoToHead = useCallback((settings: SeoSettings) => {
    if (typeof window === 'undefined') return

    // 0. Google Site Verification Meta Tag (Global ownership verification)
    let gscMeta = document.querySelector('meta[name="google-site-verification"]')
    const verificationCode = settings.googleSiteVerification?.trim()
    if (verificationCode) {
      if (!gscMeta) {
        gscMeta = document.createElement('meta')
        gscMeta.setAttribute('name', 'google-site-verification')
        document.head.appendChild(gscMeta)
      }
      gscMeta.setAttribute('content', verificationCode)
    } else if (gscMeta) {
      gscMeta.remove()
    }

    // Do not overwrite title/description on specific dish landing pages (/dish/:slug)
    const isDishRoute = window.location.pathname.startsWith('/dish/')
    if (isDishRoute) return

    // 1. Document Title
    if (settings.siteTitle) {
      document.title = settings.siteTitle
    }

    // 2. Meta Description
    if (settings.siteDescription) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', settings.siteDescription)
    }

    // 3. Meta Keywords
    if (settings.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', settings.keywords)
    }

    // 4. OpenGraph & Twitter Meta Tags
    const updateOrCreateMeta = (attributeName: 'property' | 'name', attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attributeName, attributeValue)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    if (settings.siteTitle) {
      updateOrCreateMeta('property', 'og:title', settings.siteTitle)
      updateOrCreateMeta('name', 'twitter:title', settings.siteTitle)
    }

    if (settings.siteDescription) {
      updateOrCreateMeta('property', 'og:description', settings.siteDescription)
      updateOrCreateMeta('name', 'twitter:description', settings.siteDescription)
    }

    if (settings.ogImage) {
      const fullOgImage = settings.ogImage.startsWith('http')
        ? settings.ogImage
        : `https://hshosha.com${settings.ogImage.startsWith('/') ? '' : '/'}${settings.ogImage}`
      updateOrCreateMeta('property', 'og:image', fullOgImage)
      updateOrCreateMeta('property', 'og:image:secure_url', fullOgImage)
      updateOrCreateMeta('name', 'twitter:image', fullOgImage)
    }
    updateOrCreateMeta('property', 'og:url', 'https://hshosha.com/')

    // 5. Canonical URL - Hardened against URL parameters and fragments
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', 'https://hshosha.com/')

    // 6. Inject Rich Structured Data (Bakery, FAQPage & Breadcrumbs)
    injectJsonLd('storefront-bakery-schema', getBakerySchema())
    injectJsonLd('storefront-faq-schema', getFaqPageSchema())
    injectJsonLd('storefront-breadcrumb-schema', getBreadcrumbSchema(getDefaultStorefrontBreadcrumbs()))
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchSeoSettings()
      setSeo(data)
      setLoaded(true)
      applySeoToHead(data)
    } catch (err) {
      console.warn('[useStorefrontSeo] Failed to fetch SEO settings from Supabase:', err)
      applySeoToHead(DEFAULT_SEO_SETTINGS)
    }
  }, [applySeoToHead])

  // Initial fetch and route sync
  useEffect(() => {
    loadSettings()
  }, [loadSettings, currentPath])

  // Listen to custom updates dispatched from admin panel or window focus
  useEffect(() => {
    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SeoSettings>
      if (customEvent.detail) {
        setSeo(customEvent.detail)
        applySeoToHead(customEvent.detail)
      } else {
        loadSettings()
      }
    }

    const handleFocus = () => {
      loadSettings()
    }

    window.addEventListener('hashousha_seo_updated', handleCustomUpdate)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('hashousha_seo_updated', handleCustomUpdate)
      window.removeEventListener('focus', handleFocus)
    }
  }, [applySeoToHead, loadSettings])

  return { seo, loaded, refresh: loadSettings }
}
