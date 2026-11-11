import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingBag,
  Truck,
  ChefHat,
  ArrowLeft,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useCart } from '../cart-context'
import { useSiteContent } from '../../context/SiteContentContext'
import { useOrdersStore } from '../../store/useOrdersStore'
import { CustomerDetails, PaymentMethod, Order } from '../../types/order'
import { CustomerForm } from './CustomerForm'
import { PaymentSelector } from './PaymentSelector'
import { OrderSuccessModal } from './OrderSuccessModal'
import { isValidSaudiPhone, normalizeSaudiPhone } from '../../data/riyadhDistricts'
import { formatPrice } from '../../data/menu'
import { saveOrderToSupabase } from '../../services/orderService'
import { validateCouponCode } from '../../services/adminService'
import { AdminDiscount } from '../../types/admin'
import { modalBackdropVariants, modalDialogVariants } from '../../lib/motion'
import { cn } from '../../lib/utils'

export interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (order: Order) => void
}

const DELIVERY_FEE = 20 // Fixed delivery fee for Riyadh districts (20 SAR)

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { lines, totalItems, totalPrice, clearCart } = useCart()
  const { t } = useSiteContent()
  const addOrder = useOrdersStore((state) => state.addOrder)

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    district: '',
    addressDetails: '',
    notes: '',
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  // Coupon Engine State
  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<AdminDiscount | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const grandTotal = Math.max(0, totalPrice - discountAmount) + DELIVERY_FEE

  const handleCustomerChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Coupon Validation Handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCodeInput.trim()) return

    setIsValidatingCoupon(true)
    setCouponFeedback(null)

    try {
      const res = await validateCouponCode(couponCodeInput, totalPrice)
      if (res.valid && res.discount) {
        setAppliedCoupon(res.discount)
        setDiscountAmount(res.discountAmount)
        setCouponFeedback({
          type: 'success',
          message: res.message,
        })
      } else {
        setAppliedCoupon(null)
        setDiscountAmount(0)
        setCouponFeedback({
          type: 'error',
          message: res.message,
        })
      }
    } catch {
      setCouponFeedback({
        type: 'error',
        message: 'حدث خطأ أثناء فحص الكوبون، يرجى المحاولة ثانية',
      })
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCodeInput('')
    setCouponFeedback(null)
  }

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CustomerDetails, string>> = {}

    if (!customer.name.trim() || customer.name.trim().length < 2) {
      nextErrors.name = 'يرجى إدخال اسم العميل بشكل صحيح'
    }

    if (!customer.phone.trim()) {
      nextErrors.phone = 'يرجى إدخال رقم الجوال'
    } else if (!isValidSaudiPhone(customer.phone)) {
      nextErrors.phone = 'رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 أو +9665)'
    }

    if (!customer.district.trim()) {
      nextErrors.district = 'يرجى اختيار أو كتابة حي التوصيل'
    }

    if (!customer.addressDetails.trim() || customer.addressDetails.trim().length < 3) {
      nextErrors.addressDetails = 'يرجى كتابة تفاصيل العنوان (الشارع والفيلا/المبنى)'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (totalItems === 0 || isSubmitting) {
      return
    }

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Generate unique #HSH-XXXX order code
    const orderNumber = `#HSH-${Math.floor(1000 + Math.random() * 9000)}`
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    let finalNotes = customer.notes?.trim() || ''
    if (appliedCoupon) {
      finalNotes = finalNotes
        ? `${finalNotes} | [كوبون ${appliedCoupon.code}: خصم ${discountAmount} ر.س]`
        : `[كوبون ${appliedCoupon.code}: خصم ${discountAmount} ر.س]`
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: {
        ...customer,
        phone: normalizeSaudiPhone(customer.phone),
        name: customer.name.trim(),
        district: customer.district.trim(),
        addressDetails: customer.addressDetails.trim(),
        notes: finalNotes || undefined,
      },
      items: lines.map((l) => ({
        dishId: l.dish.id,
        dishName: l.dish.name,
        variantId: l.variant?.id,
        variantName: l.variant?.name,
        servingInfo: l.variant?.servingInfo || l.dish.servingInfo,
        dishImage: l.dish.image,
        unit: l.variant ? l.variant.name : l.dish.unit,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        totalPrice: l.unitPrice * l.quantity,
      })),
      subtotal: totalPrice,
      deliveryFee: DELIVERY_FEE,
      totalAmount: grandTotal,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Persist order in local store
    addOrder(newOrder)

    // Parallel save to Supabase Cloud Database + perceived confirmation window (950ms)
    try {
      await Promise.all([
        saveOrderToSupabase(newOrder).catch((err) => {
          console.warn('Background Supabase cloud save notice:', err)
        }),
        new Promise((resolve) => setTimeout(resolve, 950)),
      ])
    } catch {
      // Offline fallback ensures order is saved locally
    }

    // Clear active cart to prevent duplicate orders
    clearCart()

    setIsSubmitting(false)
    setCompletedOrder(newOrder)

    if (onSuccess) {
      onSuccess(newOrder)
    }
  }

  return (
    <>
      <AnimatePresence>
        {completedOrder && (
          <OrderSuccessModal
            key="order-success"
            order={completedOrder}
            onClose={() => {
              setCompletedOrder(null)
              onClose()
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !completedOrder && (
          <motion.div
            key="checkout-dialog-root"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            dir="rtl"
          >
            <motion.div
              variants={modalDialogVariants}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-h-[92vh] sm:max-h-[88vh] sm:max-w-xl rounded-t-[2rem] sm:rounded-[2rem] border-t sm:border border-primary/25 bg-card text-foreground shadow-2xl overflow-hidden flex flex-col pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-4 shrink-0 bg-card/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ChefHat className="size-5" />
            </div>
            <div>
              <h2 id="checkout-title" className="text-base font-black text-foreground">
                {t('checkout.modalTitle', 'إتمام الطلب الفاخر')}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {t('checkout.modalSubtitle', 'مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-6 flex-1">
          {/* Order Summary Capsule */}
          <section className="rounded-2xl border border-primary/20 bg-background/90 p-4 space-y-3" aria-label="ملخص السلة">
            <div className="flex items-center justify-between text-xs font-bold text-foreground border-b border-border/50 pb-2">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="size-4 text-primary" />
                <span>{t('checkout.summaryTitle', 'ملخص محتويات الطلب')} ({totalItems.toLocaleString('ar-SA')} أصناف)</span>
              </div>
              <span className="text-primary font-black">{formatPrice(totalPrice)}</span>
            </div>

            <ul className="divide-y divide-border/40 max-h-36 overflow-y-auto text-xs">
              {lines.map(({ lineKey, dish, variant, quantity, unitPrice }) => (
                <li key={lineKey} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="size-7 rounded-lg object-cover border border-border/60 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-medium">{dish.name}</span>
                      {variant && (
                        <span className="text-[10px] text-primary font-semibold">
                          {variant.name} {variant.servingInfo ? `(${variant.servingInfo})` : ''}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground mr-1">×{quantity.toLocaleString('ar-SA')}</span>
                  </div>
                  <span className="font-semibold text-foreground/90 shrink-0">
                    {formatPrice(unitPrice * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-border/50 space-y-2">
              <label htmlFor="coupon-input" className="block text-xs font-bold text-foreground/90 flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                <span>{t('checkout.couponLabel', 'كوبون الخصم:')}</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black tracking-wider">{appliedCoupon.code}</span>
                      <span className="text-[11px] text-emerald-700 mr-2">
                        (-{formatPrice(discountAmount)})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                    title="إزالة الكوبون"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    id="coupon-input"
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder={t('checkout.couponPlaceholder', 'مثال: RAMADAN10 أو HASH20')}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCodeInput.trim()}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {isValidatingCoupon ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <span>{t('checkout.couponApplyBtn', 'تطبيق')}</span>
                    )}
                  </button>
                </div>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className={cn(
                  'text-[11px] flex items-center gap-1',
                  couponFeedback.type === 'success' ? 'text-emerald-600 font-bold' : 'text-red-500'
                )}>
                  {couponFeedback.type === 'success' ? (
                    <CheckCircle2 className="size-3 shrink-0" />
                  ) : (
                    <AlertCircle className="size-3 shrink-0" />
                  )}
                  <span>{couponFeedback.message}</span>
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-border/60 pt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('checkout.subtotalTitle', 'المجموع الفرعي')}:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الكوبون ({appliedCoupon?.code}):</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Truck className="size-3.5 text-primary" />
                  <span>{t('checkout.deliveryFeeTitle', 'رسوم التوصيل السريع (الرياض)')}:</span>
                </span>
                <span>{formatPrice(DELIVERY_FEE)}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-foreground pt-1 border-t border-border/40">
                <span>{t('checkout.totalTitle', 'المجموع الإجمالي')}:</span>
                <span className="text-base text-primary font-extrabold">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </section>

          {/* Customer & Address Details Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <CustomerForm
              values={customer}
              onChange={handleCustomerChange}
              errors={errors}
            />

            <PaymentSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </form>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="border-t border-border/80 p-4 bg-card/95 backdrop-blur-md shrink-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            form="checkout-form"
            disabled={isSubmitting || totalItems === 0}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-extrabold text-accent-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-accent-foreground" />
                <span>جاري تأكيد وتسجيل الطلب...</span>
              </span>
            ) : (
              <>
                <span>{t('checkout.submitOrderBtn', 'تأكيد الطلب')}</span>
                <span className="rounded-full bg-accent-foreground/15 px-2.5 py-0.5 text-xs font-bold">
                  {formatPrice(grandTotal)}
                </span>
                <ArrowLeft className="size-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
</>
)
}
