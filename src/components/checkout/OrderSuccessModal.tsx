import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Copy, Check, Sparkles, MapPin, CreditCard, MessageCircle, X } from 'lucide-react'
import { Order } from '../../types/order'
import { formatPrice, WHATSAPP_NUMBER } from '../../data/menu'
import { OrderSuccessSkeleton } from '../storefront/v0/StorefrontSkeletons'
import { useSiteContent } from '../../context/SiteContentContext'
import { cn } from '../../lib/utils'

export interface OrderSuccessModalProps {
  order: Order
  onClose: () => void
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { content, t } = useSiteContent()
  const [copiedCode, setCopiedCode] = useState(false)
  const [isHydrating, setIsHydrating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrating(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2500)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = order.orderNumber
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2500)
    }
  }

  // Preformatted WhatsApp message as backup communication
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.dishName}${item.variantName ? ` [${item.variantName}]` : ''} (${item.unit}) × ${item.quantity} = ${formatPrice(item.totalPrice)}`
    )
    .join('\n')

  const paymentMethodLabel =
    order.paymentMethod === 'cod'
      ? 'الدفع عند الاستلام (شبكة/كاش)'
      : `تحويل بنكي (${content.bankName || 'مصرف الراجحي'})`

  const whatsappMessage = [
    `*طلب جديد من متجر هشوشة الفاخر*`,
    `رقم الطلب: *${order.orderNumber}*`,
    `الاسم: ${order.customer.name}`,
    `الجوال: ${order.customer.phone}`,
    `الحي: ${order.customer.district}`,
    `العنوان: ${order.customer.addressDetails}`,
    order.customer.notes ? `ملاحظات: ${order.customer.notes}` : null,
    `--------------------------`,
    `*الأطباق المطلوبة:*`,
    itemsText,
    `--------------------------`,
    `المجموع الفرعي: ${formatPrice(order.subtotal)}`,
    `رسوم التوصيل: ${formatPrice(order.deliveryFee)}`,
    `*المجموع الكلي: ${formatPrice(order.totalAmount)}*`,
    `طريقة الدفع: ${paymentMethodLabel}`,
    `--------------------------`,
    `أرجو تأكيد بدء التجهيز والتوصيل. شكراً لكم!`,
  ]
    .filter(Boolean)
    .join('\n')

  const targetWaNumber = (content.whatsappNumber || WHATSAPP_NUMBER || '966560602341').replace(/\D/g, '').replace(/^0/, '966')
  const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(whatsappMessage)}`

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] rounded-[2rem] border border-primary/30 bg-card shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors z-20 cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X className="size-5" />
        </button>

        {/* Scrollable inner receipt content */}
        <div className="overflow-y-auto p-6 sm:p-7 flex-1">
          <AnimatePresence mode="wait">
            {isHydrating ? (
            <motion.div
              key="order-success-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <OrderSuccessSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="order-success-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Celebratory Emblem Header */}
              <div className="text-center space-y-3 pt-2 pb-2">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="size-9" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <Sparkles className="size-3.5" />
                    <span>{t('orderSuccess.badge', 'تم استلام طلبك بنجاح')}</span>
                  </div>
                  <h2 id="success-modal-title" className="text-xl font-black text-foreground">
                    {t('orderSuccess.title', 'مطبخ هشوشة بدأ بالتحضير')}
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {t('orderSuccess.subtitle', 'شكراً لثقتك بهشوشة. يتم تحضير أطباقك طازجة باستخدام أرقى المكونات والوصفات المنزلية الأصيلة.')}
                  </p>
                </div>
              </div>

              {/* Order Number Banner with Copy Action */}
              <div className="my-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center space-y-2">
                <span className="text-xs font-semibold text-primary">
                  {t('orderSuccess.trackingLabel', 'رقم تتبع طلبك:')}
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-black text-foreground tracking-wider select-all" dir="ltr">
                    {order.orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer",
                      copiedCode
                        ? "bg-emerald-600 text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                    )}
                    aria-label="نسخ رقم الطلب"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="size-3.5" />
                        <span>{t('orderSuccess.copiedBtn', 'تم النسخ بنجاح')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>{t('orderSuccess.copyBtn', 'نسخ الرمز')}</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Note: Estimated preparation time section is temporarily hidden per owner instruction */}
              </div>

              {/* Order Details Brief */}
              <div className="rounded-2xl border border-border/80 bg-background/80 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{t('orderSuccess.customerLabel', 'العميل الكريم:')}</span>
                  <span className="font-bold text-foreground">{order.customer.name} ({order.customer.phone})</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3.5" />
                    <span>{t('orderSuccess.locationLabel', 'موقع التوصيل:')}</span>
                  </div>
                  <span className="font-semibold text-foreground">حي {order.customer.district}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="size-3.5" />
                    <span>{t('orderSuccess.paymentLabel', 'طريقة الدفع:')}</span>
                  </div>
                  <span className="font-semibold text-foreground">{paymentMethodLabel}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-sm font-black text-foreground">
                  <span>{t('orderSuccess.totalLabel', 'المجموع النهائي (شامل التوصيل):')}</span>
                  <span className="text-base text-primary font-extrabold">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                {/* WhatsApp secondary dispatch link */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all shadow-md"
                >
                  <MessageCircle className="size-4" />
                  <span>{t('orderSuccess.whatsappBtn', 'إرسال نسخة وتأكيد عبر الواتساب')}</span>
                </a>

                {/* Return to Storefront */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-border/80 bg-card py-3 text-sm font-bold text-foreground hover:bg-secondary active:scale-98 transition-all cursor-pointer"
                >
                  العودة للقائمة الرئيسية
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
