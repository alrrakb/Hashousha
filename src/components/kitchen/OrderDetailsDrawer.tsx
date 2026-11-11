import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Phone,
  MessageCircle,
  Printer,
  Clock,
  CreditCard,
  ChefHat,
  AlertCircle,
} from 'lucide-react'
import { Order, OrderStatus } from '../../types/order'
import { ORDER_STATUS_MAP } from '../../types/kitchen'
import { formatPrice } from '../../data/menu'
import { KitchenTicket } from './KitchenTicket'
import { cn } from '../../lib/utils'

export interface OrderDetailsDrawerProps {
  order: Order | null
  onClose: () => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const [showPrintTicket, setShowPrintTicket] = useState(false)

  if (!order) return null

  const statusMeta = ORDER_STATUS_MAP[order.status]
  const phoneCallUrl = `tel:${order.customer.phone}`
  const phoneClean = order.customer.phone.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/966${phoneClean.startsWith('0') ? phoneClean.slice(1) : phoneClean}`

  const paymentLabel =
    order.paymentMethod === 'cod' ? 'الدفع عند الاستلام (شبكة/كاش)' : 'تحويل بنكي (مصرف الراجحي)'

  const formattedDate = new Date(order.createdAt).toLocaleString('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const drawerNode = (
    <>
      <div
        className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        dir="rtl"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div
          className="relative w-full max-w-lg bg-card text-foreground shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-5 py-4 shrink-0 bg-card/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-primary">{order.orderNumber}</span>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-bold border',
                  statusMeta.badgeClass
                )}
              >
                {statusMeta.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPrintTicket(true)}
                className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                <Printer className="size-3.5" />
                <span>بون المطبخ</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="إغلاق الدرج"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Quick Status Action Banner */}
            {statusMeta.nextStatus && (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">الحالة التالية للطلب:</p>
                  <p className="text-[11px] text-muted-foreground">
                    تحديث مسار الطلب بضغطة واحدة لتنبيه الفريق
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order.id, statusMeta.nextStatus!)}
                  className="shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  {statusMeta.nextActionLabel}
                </button>
              </div>
            )}

            {/* Customer & Direct Contact */}
            <section className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-xs font-bold text-foreground">بيانات العميل والتوصيل</h3>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الاسم:</span>
                  <span className="font-bold text-foreground">{order.customer.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">رقم الجوال:</span>
                  <span className="font-mono font-bold text-foreground" dir="ltr">
                    {order.customer.phone}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">حي التوصيل:</span>
                  <span className="font-bold text-foreground text-left">
                    حي {order.customer.district}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">تفاصيل العنوان:</span>
                  <span className="text-foreground text-left">
                    {order.customer.addressDetails}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Phone & WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                <a
                  href={phoneCallUrl}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                >
                  <Phone className="size-3.5 text-primary" />
                  <span>اتصال هاتفي</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600/10 border border-emerald-600/30 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-600/20 transition-colors"
                >
                  <MessageCircle className="size-3.5 text-emerald-600" />
                  <span>محادثة واتساب</span>
                </a>
              </div>
            </section>

            {/* Special Notes (If Any) */}
            {order.customer.notes && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                  <AlertCircle className="size-4 text-amber-700" />
                  <span>الملاحظات:</span>
                </div>
                <p className="text-xs font-semibold text-amber-950 leading-relaxed">
                  {order.customer.notes}
                </p>
              </div>
            )}

            {/* Order Items Table */}
            <section className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <ChefHat className="size-4 text-primary" />
                  <span>أصناف الطلب ({order.items.length})</span>
                </div>
                <span className="text-xs text-muted-foreground">الكمية</span>
              </div>

              <ul className="divide-y divide-border/40 space-y-1">
                {order.items.map((item) => (
                  <li key={item.dishId} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.dishImage}
                        alt={item.dishName}
                        className="size-9 rounded-lg object-cover border border-border/60 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {item.dishName}
                          {item.variantName && (
                            <span className="text-primary text-xs font-bold mr-1.5">[{item.variantName}]</span>
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{item.servingInfo ? `${item.servingInfo} • ` : ''}{item.unit}</p>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="font-mono text-sm font-black text-foreground">
                        ×{item.quantity}
                      </span>
                      <p className="text-[11px] text-muted-foreground">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Financial Summary */}
            <section className="rounded-2xl border border-border/80 bg-background/70 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>رسوم التوصيل:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-foreground border-t border-border/60 pt-2">
                <span>الإجمالي الكلي:</span>
                <span className="text-base text-primary font-extrabold">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
                <CreditCard className="size-3.5" />
                <span>طريقة الدفع: {paymentLabel}</span>
              </div>
            </section>

            {/* Manual Status Selector Dropdown */}
            <div className="space-y-1.5 pt-2">
              <label htmlFor="order-status-select" className="text-xs font-bold text-foreground">
                تعديل حالة الطلب يدوياً:
              </label>
              <select
                id="order-status-select"
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="pending">جديد</option>
                <option value="processing">قيد التحضير في المطبخ</option>
                <option value="confirmed">جاهز للتوصيل</option>
                <option value="shipped">جاري التوصيل مع المندوب</option>
                <option value="delivered">تم التوصيل بنجاح</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Ticket Overlay */}
      {showPrintTicket && (
        <KitchenTicket order={order} onClose={() => setShowPrintTicket(false)} />
      )}
    </>
  )

  return typeof document !== 'undefined' ? createPortal(drawerNode, document.body) : drawerNode
}
