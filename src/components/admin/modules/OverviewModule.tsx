import React from 'react'
import {
  Banknote,
  ChefHat,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { Order } from '../../../types/order'
import { ORDER_STATUS_MAP } from '../../../types/kitchen'
import { formatPrice } from '../../../data/menu'
import { cn } from '../../../lib/utils'

export interface OverviewModuleProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  onNavigateToTab: (tab: 'orders' | 'products' | 'customers') => void
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  orders,
  onSelectOrder,
  onNavigateToTab,
}) => {
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalRevenue = nonCancelledOrders.reduce((acc, o) => acc + o.totalAmount, 0)
  const totalOrders = orders.length
  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'confirmed', 'shipped'].includes(o.status)
  ).length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length
  const averageOrderValue = nonCancelledOrders.length > 0
    ? Math.round(totalRevenue / nonCancelledOrders.length)
    : 0

  // Top Dishes Calculation
  const dishCounts = new Map<string, { name: string; image: string; count: number; totalRev: number }>()
  for (const order of nonCancelledOrders) {
    for (const item of order.items) {
      const existing = dishCounts.get(item.dishName)
      if (!existing) {
        dishCounts.set(item.dishName, {
          name: item.dishName,
          image: item.dishImage,
          count: item.quantity,
          totalRev: item.totalPrice,
        })
      } else {
        existing.count += item.quantity
        existing.totalRev += item.totalPrice
      }
    }
  }

  const topDishes = Array.from(dishCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-[2rem] border border-primary/25 bg-gradient-to-l from-primary/10 via-card to-card p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-foreground">
            أهلاً بكم في المركز التجاري لهشوشة
          </h2>
          <p className="text-xs text-muted-foreground">
            متابعة دقيقة للأداء المالي، تدفق الطلبات الحية، وتوفر أطباق الضيافة الفاخرة بالرياض.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <span>المتجر نشط ويستقبل الطلبات</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-primary/25 bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">إجمالي المبيعات</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Banknote className="size-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">{formatPrice(totalRevenue)}</p>
          <p className="text-[10px] text-muted-foreground">صافي إيرادات الطلبات المعتمدة</p>
        </div>

        <div className="rounded-2xl border border-amber-500/25 bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">الطلبات النشطة بالمطبخ</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ChefHat className="size-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {activeOrdersCount.toLocaleString('ar-SA')}
          </p>
          <p className="text-[10px] text-muted-foreground">قيد التحضير أو مع مندوب التوصيل</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">الطلبات المسلّمة</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {deliveredCount.toLocaleString('ar-SA')}
          </p>
          <p className="text-[10px] text-muted-foreground">من أصل {totalOrders} إجمالي الطلبات</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">متوسط قيمة الطلب</span>
            <div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-foreground">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {formatPrice(averageOrderValue)}
          </p>
          <p className="text-[10px] text-muted-foreground">متوسط إنفاق سلة العميل</p>
        </div>
      </div>

      {/* Two Column Layout: Top Dishes & Recent Orders Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dishes Column */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">الأطباق الأكثر طلباً بالرياض</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('products')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>الكتالوج</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          {topDishes.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">لا توجد بيانات مبيعات بعد</p>
          ) : (
            <ul className="divide-y divide-border/40 space-y-1">
              {topDishes.map((dish, idx) => (
                <li key={dish.name} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-black text-primary size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="size-9 rounded-lg object-cover border border-border/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{dish.name}</p>
                      <p className="text-[11px] text-muted-foreground">{dish.count.toLocaleString('ar-SA')} طلب</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-foreground shrink-0">{formatPrice(dish.totalRev)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Orders Stream */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">آخر الطلبات الواردة</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('orders')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>كل الطلبات</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">لا توجد طلبات مسجلة بعد</p>
          ) : (
            <ul className="divide-y divide-border/40 space-y-1">
              {recentOrders.map((order) => {
                const statusMeta = ORDER_STATUS_MAP[order.status]
                return (
                  <li
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="flex items-center justify-between py-2.5 text-xs hover:bg-secondary/40 rounded-xl px-2 cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{order.orderNumber}</span>
                        <span className="font-bold text-foreground">{order.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="size-3 text-primary" />
                        <span>حي {order.customer.district}</span>
                      </div>
                    </div>

                    <div className="text-left space-y-1">
                      <p className="font-black text-foreground">{formatPrice(order.totalAmount)}</p>
                      <span
                        className={cn(
                          'inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border',
                          statusMeta.badgeClass
                        )}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
