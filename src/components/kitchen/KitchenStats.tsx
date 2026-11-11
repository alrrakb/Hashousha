import React from 'react'
import { Banknote, ChefHat, CheckCircle2, ShoppingBag } from 'lucide-react'
import { Order } from '../../types/order'
import { formatPrice } from '../../data/menu'

export interface KitchenStatsProps {
  orders: Order[]
}

export const KitchenStats: React.FC<KitchenStatsProps> = ({ orders }) => {
  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'confirmed', 'shipped'].includes(o.status)
  ).length

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Revenue */}
      <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">إجمالي المبيعات</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Banknote className="size-4" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-black text-foreground">{formatPrice(totalRevenue)}</p>
        <p className="text-[10px] text-muted-foreground">باستثناء الطلبات الملغاة</p>
      </div>

      {/* Active Orders */}
      <div className="rounded-2xl border border-amber-500/25 bg-card p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">الطلبات النشطة بالمطبخ</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ChefHat className="size-4" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-black text-foreground">
          {activeOrdersCount.toLocaleString('ar-SA')}
        </p>
        <p className="text-[10px] text-muted-foreground">قيد التحضير أو التوصيل</p>
      </div>

      {/* Delivered Orders */}
      <div className="rounded-2xl border border-emerald-500/25 bg-card p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">تم التوصيل بنجاح</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-black text-foreground">
          {deliveredCount.toLocaleString('ar-SA')}
        </p>
        <p className="text-[10px] text-muted-foreground">طلبات سلمت للعملاء</p>
      </div>

      {/* Total Orders */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold">إجمالي الطلبات</span>
          <div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-foreground">
            <ShoppingBag className="size-4" />
          </div>
        </div>
        <p className="text-lg sm:text-xl font-black text-foreground">
          {orders.length.toLocaleString('ar-SA')}
        </p>
        <p className="text-[10px] text-muted-foreground">سجل الطلبات الكلي</p>
      </div>
    </div>
  )
}
