import React, { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { CartProvider } from './components/cart-context'
import { SiteHeader } from './components/storefront/v0/SiteHeader'
import { Hero } from './components/storefront/v0/Hero'
import { MenuSection } from './components/storefront/v0/MenuSection'
import { OrderBar } from './components/storefront/v0/OrderBar'
import { CheckoutModal } from './components/checkout/CheckoutModal'
import { MerchantCenter } from './components/admin/MerchantCenter'
import { AdminLoginPage } from './components/admin/AdminLoginPage'
import { ProductDetailModal } from './components/storefront/v0/ProductDetailModal'
import { ProductLandingPage } from './components/storefront/v0/ProductLandingPage'
import { FloatingWhatsApp } from './components/storefront/v0/FloatingWhatsApp'
import { supabase } from './services/supabase'
import { fetchDishesFromSupabase } from './services/adminService'
import { useStorefrontSeo } from './hooks/useStorefrontSeo'
import { useMenuStore } from './store/useMenuStore'
import { Dish } from './types/menu'

export const App: React.FC = () => {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // In-Store Product Detail Modal State
  const [selectedModalDish, setSelectedModalDish] = useState<Dish | null>(null)
  const [isDetailModalOpen, setDetailModalOpen] = useState(false)

  // Storefront-wide Skeleton Presentation Window (Perceived Performance)
  const [isStorefrontLoading, setIsStorefrontLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStorefrontLoading(false)
    }, 850)
    return () => clearTimeout(timer)
  }, [])

  // Route Detection supporting pathname (/admin, /dish/:slug) and hash (#admin)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        return '/admin'
      }
      return window.location.pathname
    }
    return '/'
  })

  // Synchronize dynamic head metadata with Supabase SEO settings on storefront
  useStorefrontSeo(currentPath)

  // Flag to know whether user initially landed directly on /dish/:slug from Google/External
  const [isDirectLanding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/dish/')
    }
    return false
  })

  // Fetch latest dishes from Supabase to ensure fresh catalog
  useEffect(() => {
    fetchDishesFromSupabase().then((cloudDishes) => {
      if (cloudDishes && cloudDishes.length > 0) {
        useMenuStore.getState().setDishes(cloudDishes)
      }
    })
  }, [])

  // Listen to browser navigation popstate / hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        setCurrentPath('/admin')
      } else {
        const path = window.location.pathname
        setCurrentPath(path)

        // If navigated back to / from /dish/
        if (path === '/') {
          setDetailModalOpen(false)
          setSelectedModalDish(null)
        }
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  // Listen to Supabase Auth session lifecycle
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setAuthLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navigateTo = (path: string) => {
    if (path === '/') {
      window.history.pushState({}, '', '/')
      if (window.location.hash) {
        window.location.hash = ''
      }
    } else {
      window.history.pushState({}, '', path)
    }
    setCurrentPath(path)
  }

  // Handle in-store dish card click (opens modal & pushes /dish/:slug)
  const handleSelectDish = (dish: Dish) => {
    setSelectedModalDish(dish)
    setDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false)
    setSelectedModalDish(null)
    if (window.location.pathname.startsWith('/dish/')) {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
    }
  }

  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath === '/admin/' ||
    currentPath.startsWith('/admin') ||
    (typeof window !== 'undefined' &&
      (window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin') ||
        window.location.hash.startsWith('#/admin')))
  const isDishLandingRoute = currentPath.startsWith('/dish/') && isDirectLanding

  // 1. Protected Admin Route Gate (/admin)
  if (isAdminRoute) {
    if (authLoading) {
      return (
        <div className="min-h-screen linen flex items-center justify-center font-sans" dir="rtl">
          <div className="rounded-2xl border border-primary/20 bg-card p-6 text-center space-y-2 shadow-lg">
            <span className="text-xl font-black text-primary">هشوشة</span>
            <p className="text-xs text-muted-foreground animate-pulse">جاري التحقق من أمان الجلسة...</p>
          </div>
        </div>
      )
    }

    if (!session) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {}}
          onReturnToStorefront={() => navigateTo('/')}
        />
      )
    }

    return (
      <MerchantCenter
        onReturnToStorefront={() => window.open('/', '_blank', 'noopener,noreferrer')}
        onSignOut={async () => {
          await supabase.auth.signOut()
        }}
        userEmail={session.user.email}
      />
    )
  }

  // 2. Standalone Google Landing Page Route (/dish/:slug)
  if (isDishLandingRoute) {
    const slug = currentPath.replace(/^\/dish\//, '').split('/')[0]

    return (
      <CartProvider>
        <ProductLandingPage
          slug={slug}
          onNavigateHome={() => navigateTo('/')}
          onOpenCheckout={() => setCheckoutOpen(true)}
        />
        <OrderBar onOpenCheckout={() => setCheckoutOpen(true)} />
        <FloatingWhatsApp />
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
      </CartProvider>
    )
  }

  // 3. Public Pure Customer Storefront with In-Store Modal
  return (
    <CartProvider>
      <div className="min-h-screen linen font-sans text-foreground selection:bg-primary/20 selection:text-foreground overflow-x-hidden w-full" dir="rtl">
        <SiteHeader isLoading={isStorefrontLoading} />
        <main className="pb-40 sm:pb-48">
          <Hero isLoading={isStorefrontLoading} />
          <MenuSection onSelectDish={handleSelectDish} isLoading={isStorefrontLoading} />
          {isStorefrontLoading ? (
            <footer className="mx-auto mt-14 flex w-full max-w-5xl flex-col items-center gap-2 px-5 text-center" aria-hidden="true">
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              <div className="h-3 w-64 rounded-full skeleton-shimmer" />
            </footer>
          ) : (
            <footer className="mx-auto mt-14 flex w-full max-w-5xl flex-col items-center gap-1.5 px-5 text-center">
              <span className="text-xl font-black text-primary">هشوشة</span>
              <p className="text-xs text-muted-foreground">مطبخ منزلي فاخر · الرياض، المملكة العربية السعودية</p>
            </footer>
          )}
        </main>
        <OrderBar onOpenCheckout={() => setCheckoutOpen(true)} />
        <FloatingWhatsApp />

        {/* In-Store Dish Detail Modal with pushState */}
        <ProductDetailModal
          dish={selectedModalDish}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onOpenCart={() => setCheckoutOpen(true)}
        />

        {/* Native Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
      </div>
    </CartProvider>
  )
}

export default App
