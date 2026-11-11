import React, { useState } from 'react'
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Search,
  ExternalLink,
  LogOut,
  Leaf,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Palette,
} from 'lucide-react'
import { AdminTab } from '../../types/admin'
import { cn } from '../../lib/utils'

export interface MerchantSidebarProps {
  activeTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  onOpenStorefront: () => void
  onSignOut: () => void
  isOpenOnMobile?: boolean
  onCloseMobile?: () => void
  activeOrdersCount?: number
  hiddenReviewsCount?: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavItem {
  id: AdminTab
  label: string
  englishLabel: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenStorefront,
  onSignOut,
  isOpenOnMobile = false,
  onCloseMobile,
  activeOrdersCount = 0,
  hiddenReviewsCount = 0,
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggle,
}) => {
  // Local collapse state with localStorage persistence
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hashousha_sidebar_collapsed') === 'true'
    }
    return false
  })

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  const handleToggleCollapse = () => {
    if (controlledToggle) {
      controlledToggle()
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev
        if (typeof window !== 'undefined') {
          localStorage.setItem('hashousha_sidebar_collapsed', String(next))
        }
        return next
      })
    }
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'لوحة التحكم', englishLabel: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'إدارة المنتجات', englishLabel: 'Products', icon: UtensilsCrossed },
    { id: 'categories', label: 'التصنيفات', englishLabel: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'الطلبات والمبيعات', englishLabel: 'Orders', icon: ShoppingBag, badge: activeOrdersCount },
    { id: 'customers', label: 'سجل العملاء', englishLabel: 'Customers', icon: Users },
    { id: 'discounts', label: 'كوبونات الخصم', englishLabel: 'Discounts', icon: Tag },
    { id: 'reviews', label: 'تقييمات العملاء', englishLabel: 'Reviews', icon: Star, badge: hiddenReviewsCount },
    { id: 'site-content', label: 'إدارة المظهر والمحتوى', englishLabel: 'Site Content', icon: Palette },
    { id: 'seo', label: 'إعدادات السيو', englishLabel: 'SEO Settings', icon: Search },
  ]

  // Render navigation item helper
  const renderNavItem = (item: NavItem, collapsed: boolean) => {
    const isActive = activeTab === item.id
    const Icon = item.icon

    if (collapsed) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectTab(item.id)}
          title={`${item.label} (${item.englishLabel})`}
          className={cn(
            'relative flex size-12 items-center justify-center rounded-2xl transition-all mx-auto',
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
          )}
        >
          <Icon className={cn('size-5 shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-mono font-bold shadow-sm">
              {item.badge}
            </span>
          )}
        </button>
      )
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onSelectTab(item.id)
          if (onCloseMobile) onCloseMobile()
        }}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all text-right min-h-[46px]',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={cn('size-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
          <span className="truncate">{item.label}</span>
        </div>

        {item.badge !== undefined && item.badge > 0 && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold',
              isActive ? 'bg-primary-foreground/25 text-primary-foreground' : 'bg-primary/15 text-primary'
            )}
          >
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  // Desktop Sidebar Content
  const desktopContent = (
    <div className="flex h-full flex-col justify-between bg-card text-foreground font-sans">
      {/* Brand Header */}
      <div className={cn('border-b border-border/80 transition-all', isCollapsed ? 'p-3' : 'p-5 space-y-2')}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm"
              title="هشوشة — لوحة الإدارة"
            >
              <Leaf className="size-5 -scale-x-100 rotate-[-30deg]" strokeWidth={1.5} />
            </div>
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="flex size-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
              title="توسيع القائمة الجانبية"
              aria-label="توسيع القائمة الجانبية"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Leaf className="size-5 -scale-x-100 rotate-[-30deg]" strokeWidth={1.5} />
                <span className="font-sans text-2xl font-black tracking-tight">هشوشة</span>
              </div>
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="hidden lg:flex size-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                title="تصغير القائمة الجانبية"
                aria-label="تصغير القائمة الجانبية"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <p className="text-[11px] font-bold text-foreground/75 tracking-wide">
              لوحة الإدارة والتحكم الفاخرة (Merchant Center)
            </p>
          </>
        )}
      </div>

      {/* Navigation Items List */}
      <nav
        className={cn('flex-1 overflow-y-auto space-y-1.5 transition-all', isCollapsed ? 'p-2' : 'p-3')}
        aria-label="أقسام لوحة الإدارة"
      >
        {navItems.map((item) => renderNavItem(item, isCollapsed))}
      </nav>

      {/* Bottom Actions: Storefront Link & Sign Out */}
      <div className={cn('border-t border-border/80 bg-background/50 transition-all', isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-1.5')}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onOpenStorefront ? () => onOpenStorefront() : undefined}
              className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary hover:bg-primary hover:text-white transition-colors"
              title="معاينة المتجر"
            >
              <ExternalLink className="size-4" />
            </a>
            <button
              type="button"
              onClick={onSignOut}
              className="flex size-10 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-50/50 text-rose-700 hover:bg-rose-100 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onOpenStorefront ? () => onOpenStorefront() : undefined}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="size-3.5 text-primary" />
                <span>معاينة المتجر</span>
              </div>
              <span className="text-[10px] text-muted-foreground">الرئيسية</span>
            </a>

            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-50/50 px-3.5 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="size-3.5 text-rose-700" />
              <span>تسجيل الخروج</span>
            </button>
          </>
        )}
      </div>
    </div>
  )

  // Mobile Slide-over Drawer Content (always expanded)
  const mobileContent = (
    <div className="flex h-full flex-col justify-between bg-card text-foreground font-sans">
      <div className="border-b border-border/80 p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="size-5 -scale-x-100 rotate-[-30deg]" strokeWidth={1.5} />
            <span className="font-sans text-2xl font-black tracking-tight">هشوشة</span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              aria-label="إغلاق القائمة"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <p className="text-[11px] font-bold text-foreground/75 tracking-wide">
          لوحة الإدارة والتحكم الفاخرة (Merchant Center)
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="أقسام لوحة الإدارة">
        {navItems.map((item) => renderNavItem(item, false))}
      </nav>

      <div className="border-t border-border/80 p-3 space-y-1.5 bg-background/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (onCloseMobile) onCloseMobile()
            if (onOpenStorefront) onOpenStorefront()
          }}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="size-3.5 text-primary" />
            <span>معاينة المتجر</span>
          </div>
          <span className="text-[10px] text-muted-foreground">الرئيسية</span>
        </a>

        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-50/50 px-3.5 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="size-3.5 text-rose-700" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar with animated width */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 border-l border-border h-screen sticky top-0 bg-card z-20 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {desktopContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-foreground/60 backdrop-blur-sm animate-in fade-in-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-right duration-250">
            {mobileContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  )
}
