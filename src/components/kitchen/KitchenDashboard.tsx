import React, { useState, useEffect } from 'react'
import {
  ChefHat,
  ShoppingBag,
  UtensilsCrossed,
  ArrowRight,
  LogOut,
  BellRing,
} from 'lucide-react'
import { useOrdersStore } from '../../store/useOrdersStore'
import { Order, OrderStatus } from '../../types/order'
import { KitchenStats } from './KitchenStats'
import { OrdersPipeline } from './OrdersPipeline'
import { OrderDetailsDrawer } from './OrderDetailsDrawer'
import { StockManager } from './StockManager'
import { supabase } from '../../services/supabase'
import {
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
} from '../../services/orderService'
import { playKitchenChime } from '../../utils/audioChime'
import { cn } from '../../lib/utils'

export interface KitchenDashboardProps {
  isOpen: boolean
  onClose: () => void
  onSignOut?: () => void
}

type DashboardTab = 'orders' | 'stock'

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({
  isOpen,
  onClose,
  onSignOut,
}) => {
  const orders = useOrdersStore((state) => state.orders)
  const setOrders = useOrdersStore((state) => state.setOrders)
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus)

  const [activeTab, setActiveTab] = useState<DashboardTab>('orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [realtimeConnected, setRealtimeConnected] = useState(false)

  // 1. Initial Cloud Sync on Mount
  useEffect(() => {
    let isMounted = true

    fetchOrdersFromSupabase().then((cloudOrders) => {
      if (isMounted && cloudOrders.length > 0) {
        setOrders(cloudOrders)
      }
    })

    return () => {
      isMounted = false
    }
  }, [setOrders])

  // 2. Supabase Realtime Subscription for Live Orders & Audio Chime
  useEffect(() => {
    const channel = supabase
      .channel('kitchen-orders-realtime-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async () => {
          // Play culinary audio chime immediately
          playKitchenChime()

          // Refresh orders from cloud
          const refreshed = await fetchOrdersFromSupabase()
          if (refreshed.length > 0) {
            setOrders(refreshed)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as { id: string; status: OrderStatus }
          if (updated && updated.id && updated.status) {
            updateOrderStatus(updated.id, updated.status)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setOrders, updateOrderStatus])

  if (!isOpen) return null

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
    updateOrderStatusInSupabase(orderId, status).catch((err) => {
      console.warn('Order status Supabase sync notice:', err)
    })

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null))
    }
  }

  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'confirmed', 'shipped'].includes(o.status)
  ).length

  return (
    <div
      className="fixed inset-0 z-50 bg-background text-foreground overflow-y-auto flex flex-col font-sans"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="لوحة تحكم وإدارة المطبخ"
    >
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ChefHat className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-foreground">
                  لوحة تحكم وإدارة المطبخ
                </h1>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary">
                  هشوشة
                </span>
                {realtimeConnected && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                    <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>بث سحابي مباشر</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                متابعة حركة الطلبات، إدارة توفر الأطباق، وإصدار بونات التحضير والتغليف
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-background/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all min-h-[38px]',
                activeTab === 'orders'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/80 hover:bg-secondary'
              )}
            >
              <ShoppingBag className="size-3.5" />
              <span>طلبات المطبخ</span>
              {activeOrdersCount > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                    activeTab === 'orders' ? 'bg-primary-foreground/25 text-primary-foreground' : 'bg-primary/15 text-primary'
                  )}
                >
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs font-bold transition-all min-h-[38px]',
                activeTab === 'stock'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/80 hover:bg-secondary'
              )}
            >
              <UtensilsCrossed className="size-3.5" />
              <span>توفر الأطباق</span>
            </button>
          </div>

          {/* Action Buttons: Chime Test, Sign Out, Close & Return */}
          <div className="flex items-center gap-2">
            {/* Chime Sound Test Button */}
            <button
              type="button"
              onClick={() => playKitchenChime()}
              title="تجربة رنين التنبيه الصوتي"
              aria-label="تجربة رنين التنبيه الصوتي"
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <BellRing className="size-3.5 text-primary" />
              <span>تجربة الجرس</span>
            </button>

            {/* Sign Out Button */}
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="تسجيل الخروج من لوحة المطبخ"
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-50/60 px-3 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="size-3.5 text-rose-700" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            )}

            {/* Return / Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 sm:px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              aria-label="العودة للمتجر"
            >
              <span className="hidden sm:inline">العودة للمتجر</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Statistics */}
        <KitchenStats orders={orders} />

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          <OrdersPipeline
            orders={orders}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <StockManager />
        )}
      </main>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
