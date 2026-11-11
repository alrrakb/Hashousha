import React, { useState, useEffect, useCallback } from 'react'
import {
  Menu,
  ExternalLink,
  LogOut,
  RefreshCw,
} from 'lucide-react'
import { AdminTab, AdminCategory, AdminDiscount, SeoSettings } from '../../types/admin'
import { Dish } from '../../types/menu'
import { OrderStatus } from '../../types/order'
import { dishes as defaultDishes } from '../../data/menu'
import {
  fetchDishesFromSupabase,
  fetchCategoriesFromSupabase,
  fetchDiscountsFromSupabase,
  fetchSeoSettings,
  DEFAULT_ADMIN_CATEGORIES,
  DEFAULT_DISCOUNTS,
  DEFAULT_SEO_SETTINGS,
} from '../../services/adminService'
import {
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
} from '../../services/orderService'
import { supabase } from '../../services/supabase'
import { useOrdersStore } from '../../store/useOrdersStore'
import { playKitchenChime } from '../../utils/audioChime'
import { MerchantSidebar } from './MerchantSidebar'
import { OverviewModule } from './modules/OverviewModule'
import { ProductsModule } from './modules/ProductsModule'
import { CategoriesModule } from './modules/CategoriesModule'
import { OrdersModule } from './modules/OrdersModule'
import { CustomersModule } from './modules/CustomersModule'
import { DiscountsModule } from './modules/DiscountsModule'
import { ReviewsModule } from './modules/ReviewsModule'
import { SeoModule } from './modules/SeoModule'
import { SiteContentModule } from './modules/SiteContentModule'
import { ThemeToggle } from '../common/ThemeToggle'
import { cn } from '../../lib/utils'

const VALID_TABS: AdminTab[] = [
  'overview',
  'products',
  'categories',
  'orders',
  'customers',
  'discounts',
  'reviews',
  'site-content',
  'seo',
]

const ADMIN_TAB_STORAGE_KEY = 'hashousha_admin_active_tab'

function getInitialAdminTab(): AdminTab {
  if (typeof window !== 'undefined') {
    // 1. Check URL query param ?tab=...
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab') as AdminTab
    if (tabParam && VALID_TABS.includes(tabParam)) {
      return tabParam
    }

    // 2. Check hash #orders or #tab=orders
    const cleanHash = window.location.hash.replace(/^#\/?/, '').replace(/^tab=/, '') as AdminTab
    if (cleanHash && VALID_TABS.includes(cleanHash)) {
      return cleanHash
    }

    // 3. Check localStorage
    try {
      const stored = localStorage.getItem(ADMIN_TAB_STORAGE_KEY) as AdminTab
      if (stored && VALID_TABS.includes(stored)) {
        return stored
      }
    } catch {
      // ignore
    }
  }
  return 'overview'
}

export interface MerchantCenterProps {
  onReturnToStorefront: () => void
  onSignOut: () => Promise<void>
  userEmail?: string
}

export const MerchantCenter: React.FC<MerchantCenterProps> = ({
  onReturnToStorefront,
  onSignOut,
  userEmail = 'admin@hashousha.com',
}) => {
  // Navigation State with persistent tab memory
  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialAdminTab)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleSelectTab = useCallback((tab: AdminTab) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADMIN_TAB_STORAGE_KEY, tab)
        const url = new URL(window.location.href)
        url.searchParams.set('tab', tab)
        window.history.replaceState({}, '', url.toString())
      } catch (e) {
        console.warn('Could not persist tab state:', e)
      }
    }
  }, [])

  // Sync active tab to URL on load and listen to popstate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href)
        if (url.searchParams.get('tab') !== activeTab) {
          url.searchParams.set('tab', activeTab)
          window.history.replaceState({}, '', url.toString())
        }
      } catch {
        // ignore
      }
    }

    const handlePopState = () => {
      const currentTab = getInitialAdminTab()
      setActiveTab(currentTab)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [activeTab])

  // Orders State (synced with global store)
  const orders = useOrdersStore((state) => state.orders)
  const setOrders = useOrdersStore((state) => state.setOrders)
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus)

  // Catalog & Settings State
  const [dishes, setDishes] = useState<Dish[]>(defaultDishes)
  const [categories, setCategories] = useState<AdminCategory[]>(DEFAULT_ADMIN_CATEGORIES)
  const [discounts, setDiscounts] = useState<AdminDiscount[]>(DEFAULT_DISCOUNTS)
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS)
  const [hiddenReviewsCount, setHiddenReviewsCount] = useState<number>(0)

  // System & Connection State
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeConnected, setRealtimeConnected] = useState(false)

  // Load All Cloud Data
  const loadCloudData = useCallback(async () => {
    try {
      const [cloudDishes, cloudCategories, cloudDiscounts, cloudSeo, cloudOrders] =
        await Promise.all([
          fetchDishesFromSupabase(),
          fetchCategoriesFromSupabase(),
          fetchDiscountsFromSupabase(),
          fetchSeoSettings(),
          fetchOrdersFromSupabase(),
        ])

      if (cloudDishes && cloudDishes.length > 0) {
        setDishes(cloudDishes)
      }
      if (cloudCategories && cloudCategories.length > 0) {
        setCategories(cloudCategories)
      }
      if (cloudDiscounts && cloudDiscounts.length > 0) {
        setDiscounts(cloudDiscounts)
      }
      if (cloudSeo) {
        setSeoSettings(cloudSeo)
      }
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders)
      }
    } catch (err) {
      console.warn('Merchant Center cloud sync warning:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [setOrders])

  useEffect(() => {
    loadCloudData()
  }, [loadCloudData])

  // Realtime Orders Subscription with Culinary Chime
  useEffect(() => {
    const channel = supabase
      .channel('merchant-center-realtime-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async () => {
          playKitchenChime()
          const refreshed = await fetchOrdersFromSupabase()
          if (refreshed.length > 0) {
            setOrders(refreshed)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        async () => {
          const refreshed = await fetchOrdersFromSupabase()
          if (refreshed.length > 0) {
            setOrders(refreshed)
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setOrders])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await loadCloudData()
  }

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
    updateOrderStatusInSupabase(orderId, status).catch((err) => {
      console.warn('Update order status notice:', err)
    })
  }

  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'confirmed', 'shipped'].includes(o.status)
  ).length

  // Tab Titles Map
  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'لوحة التحكم والتحليلات',
      subtitle: 'نظرة شاملة على مبيعات وأداء بوتيك هشوشة بالرياض',
    },
    products: {
      title: 'إدارة المنتجات والأطباق',
      subtitle: 'كتالوج الأطباق الفاخرة، رفع الصور السحابية، وضبط الأسعار والسيو',
    },
    categories: {
      title: 'إدارة التصنيفات والأقسام',
      subtitle: 'ترتيب وتخصيص تبويبات قائمة الطعام المعروضة في المتجر',
    },
    orders: {
      title: 'الطلبات والمبيعات',
      subtitle: 'إدارة مراحل التجهيز والشحن، التواصل المباشر مع العملاء، وبونات الطباعة',
    },
    customers: {
      title: 'سجل عملاء هشوشة',
      subtitle: 'بيانات العملاء في الرياض، إجمالي الطلبات، والتواصل السريع',
    },
    discounts: {
      title: 'كوبونات الخصم والولاء',
      subtitle: 'إنشاء وإدارة أكواد الخصم الثابتة والنسب المئوية',
    },
    reviews: {
      title: 'تقييمات ومراجعات العملاء',
      subtitle: 'مراقبة آراء وتجارب ذواقة الرياض وإدارة نشر وحجب التقييمات',
    },
    'site-content': {
      title: 'إدارة المظهر والمحتوى',
      subtitle: 'تخصيص صور الهيرو والشعارات والعبارات التسويقية المعروضة في المتجر',
    },
    seo: {
      title: 'إعدادات محركات البحث (SEO)',
      subtitle: 'تهيئة الكلمات المفتاحية لأحياء الرياض ومعاينة نتائج بحث Google',
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex antialiased" dir="rtl">
      {/* Responsive Sidebar (Handles desktop persistent layout & mobile drawer internally) */}
      <MerchantSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          handleSelectTab(tab)
          setMobileSidebarOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenStorefront={onReturnToStorefront}
        onSignOut={onSignOut}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeOrdersCount={activeOrdersCount}
        hiddenReviewsCount={hiddenReviewsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Luxury Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/80 bg-card/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="افتح القائمة الجانبية"
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                {tabTitles[activeTab].title}
              </h1>
              <p className="hidden sm:block text-[11px] text-muted-foreground">
                {tabTitles[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Realtime Live Pulse */}
            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors',
                realtimeConnected
                  ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
                  : 'border-amber-500/30 bg-amber-50 text-amber-700'
              )}
              title={realtimeConnected ? 'متصل بالسحابة عبر Supabase Realtime' : 'جاري الاتصال بالسحابة...'}
            >
              <span
                className={cn(
                  'size-2 rounded-full',
                  realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                )}
              />
              <span className="hidden sm:inline">
                {realtimeConnected ? 'بث سحابي مباشر' : 'جاري الاتصال'}
              </span>
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={cn(
                'rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all',
                isRefreshing && 'opacity-50'
              )}
              title="تحديث البيانات من السحابة"
            >
              <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin text-primary')} />
            </button>

            {/* Hotel-Grade Dark/Light Mode Toggle */}
            <ThemeToggle variant="rect" />

            {/* View Storefront Button (Opens in new tab/window) */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">معاينة المتجر</span>
            </a>

            {/* Admin Profile & Sign Out */}
            <div className="hidden md:flex items-center gap-2 border-r border-border pr-3">
              <span className="text-xs font-medium text-muted-foreground" dir="ltr">
                {userEmail}
              </span>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Module Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                جاري مزامنة بيانات مركز التجار من السحابة...
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'overview' && (
                <OverviewModule
                  orders={orders}
                  onSelectOrder={() => handleSelectTab('orders')}
                  onNavigateToTab={(tab) => handleSelectTab(tab)}
                />
              )}

              {activeTab === 'products' && (
                <ProductsModule
                  dishes={dishes}
                  categories={categories}
                  onUpdateDishes={setDishes}
                />
              )}

              {activeTab === 'categories' && (
                <CategoriesModule
                  categories={categories}
                  onUpdateCategories={setCategories}
                  dishes={dishes}
                  onUpdateDishes={setDishes}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersModule
                  orders={orders}
                  dishes={dishes}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                />
              )}

              {activeTab === 'customers' && (
                <CustomersModule orders={orders} />
              )}

              {activeTab === 'discounts' && (
                <DiscountsModule
                  discounts={discounts}
                  onUpdateDiscounts={setDiscounts}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsModule onCountChange={setHiddenReviewsCount} />
              )}

              {activeTab === 'site-content' && (
                <SiteContentModule />
              )}

              {activeTab === 'seo' && (
                <SeoModule
                  seoSettings={seoSettings}
                  onUpdateSeoSettings={setSeoSettings}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
