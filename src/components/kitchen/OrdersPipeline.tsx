import React, { useState, useMemo } from 'react'
import {
  Search,
  Clock,
  MapPin,
  ChevronLeft,
  Filter,
  CheckCircle2,
  XCircle,
  Truck,
  ChefHat,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react'
import { Order, OrderStatus } from '../../types/order'
import { ORDER_STATUS_MAP } from '../../types/kitchen'
import { formatPrice } from '../../data/menu'
import { cn } from '../../lib/utils'

export interface OrdersPipelineProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

type FilterStatus = 'all' | OrderStatus

const FILTER_TABS: { id: FilterStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'الكل', icon: ShoppingBag },
  { id: 'pending', label: 'جديد', icon: Clock },
  { id: 'processing', label: 'قيد التحضير', icon: ChefHat },
  { id: 'confirmed', label: 'جاهز للتوصيل', icon: PackageCheck },
  { id: 'shipped', label: 'جاري التوصيل', icon: Truck },
  { id: 'delivered', label: 'تم التوصيل', icon: CheckCircle2 },
  { id: 'cancelled', label: 'ملغي', icon: XCircle },
]

export const OrdersPipeline: React.FC<OrdersPipelineProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false
      }

      // Search filter (number, customer name, phone, district)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matchNumber = order.orderNumber.toLowerCase().includes(query)
        const matchName = order.customer.name.toLowerCase().includes(query)
        const matchPhone = order.customer.phone.includes(query)
        const matchDistrict = order.customer.district.toLowerCase().includes(query)
        return matchNumber || matchName || matchPhone || matchDistrict
      }

      return true
    })
  }, [orders, activeTab, searchQuery])

  // Count per status tab
  const getTabCount = (tabId: FilterStatus): number => {
    if (tabId === 'all') return orders.length
    return orders.filter((o) => o.status === tabId).length
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="البحث برقم الطلب #HSH، اسم العميل، رقم الجوال أو الحي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 pr-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-sm"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Status Filter Tabs */}
      <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 min-w-max">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const count = getTabCount(tab.id)
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap min-h-[40px]',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border border-border/80 text-foreground/80 hover:bg-secondary'
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center space-y-2">
          <Filter className="mx-auto size-8 text-muted-foreground/60" />
          <p className="text-sm font-bold text-foreground">لا توجد طلبات تطابق هذا التصنيف</p>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? 'جرب البحث بكلمات أخرى أو مسح حقل البحث' : 'لا توجد طلبات مسجلة بهذه الحالة حالياً.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredOrders.map((order) => {
            const statusMeta = ORDER_STATUS_MAP[order.status]
            const formattedTime = new Date(order.createdAt).toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between gap-3 text-right group"
              >
                {/* Card Top: Order Number, Time, Status Badge */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-primary select-all">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formattedTime}</span>
                    </span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-bold border',
                      statusMeta.badgeClass
                    )}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Card Body: Customer & Dishes Preview */}
                <div
                  className="space-y-1.5 cursor-pointer"
                  onClick={() => onSelectOrder(order)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{order.customer.name}</span>
                    <span className="font-mono text-muted-foreground text-[11px]" dir="ltr">
                      {order.customer.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span className="truncate">حي {order.customer.district}</span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-foreground/90 bg-background/60 p-2 rounded-xl space-y-0.5 border border-border/40">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      المحتويات ({order.items.reduce((s, i) => s + i.quantity, 0)} قطع):
                    </p>
                    <p className="line-clamp-2 text-xs font-medium">
                      {order.items.map((i) => `${i.dishName}${i.variantName ? ` (${i.variantName})` : ''} ×${i.quantity}`).join('، ')}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Total, Details link & One-Click Status Advancement */}
                <div className="flex items-center justify-between pt-1 border-t border-border/50 gap-2">
                  <div className="text-right">
                    <span className="text-xs font-black text-foreground">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {order.paymentMethod === 'cod' ? 'عند الاستلام' : 'تحويل بنكي'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick next-status button */}
                    {statusMeta.nextStatus && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onUpdateStatus(order.id, statusMeta.nextStatus!)
                        }}
                        className="rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/25 px-2.5 py-1.5 text-[11px] font-bold transition-all shadow-sm"
                      >
                        {statusMeta.nextActionLabel}
                      </button>
                    )}

                    {/* Open drawer details */}
                    <button
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className="rounded-xl border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="عرض تفاصيل الطلب"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
