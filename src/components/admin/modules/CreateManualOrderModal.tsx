import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Minus,
  Trash2,
  Printer,
  ShoppingBag,
  User,
  Phone,
  Truck,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react'
import { Dish } from '../../../types/menu'
import { Order, OrderItem, PaymentMethod, OrderStatus } from '../../../types/order'
import {
  RIYADH_DISTRICTS,
  OTHER_DISTRICT_KEY,
  isValidSaudiPhone,
  normalizeSaudiPhone,
} from '../../../data/riyadhDistricts'
import { formatPrice } from '../../../data/menu'
import { saveOrderToSupabase } from '../../../services/orderService'
import { useOrdersStore } from '../../../store/useOrdersStore'
import { KitchenTicket } from '../../kitchen/KitchenTicket'
import { modalBackdropVariants, modalDialogVariants } from '../../../lib/motion'
import { cn } from '../../../lib/utils'

export interface CreateManualOrderModalProps {
  isOpen: boolean
  onClose: () => void
  dishes: Dish[]
  onOrderCreated?: (order: Order) => void
}

interface SelectedLineItem {
  dish: Dish
  quantity: number
}

export const CreateManualOrderModal: React.FC<CreateManualOrderModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onOrderCreated,
}) => {
  const addOrder = useOrdersStore((state) => state.addOrder)

  // Customer Information State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>(RIYADH_DISTRICTS[0])
  const [customDistrict, setCustomDistrict] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [notes, setNotes] = useState('')

  // Dish Picker & Line Items State
  const [selectedItems, setSelectedItems] = useState<SelectedLineItem[]>([])
  const [dishSearchQuery, setDishSearchQuery] = useState('')

  // Financial Breakdown State
  const [deliveryFee, setDeliveryFee] = useState<number>(20)
  const [discount, setDiscount] = useState<number>(0)

  // Payment Method & Status State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('prepaid')
  const [initialStatus, setInitialStatus] = useState<OrderStatus>('processing')

  // Submission & Post-Order Workflow State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [showPrintTicket, setShowPrintTicket] = useState(false)

  // Filter dishes for picker
  const filteredDishes = useMemo(() => {
    if (!dishSearchQuery.trim()) return dishes
    const q = dishSearchQuery.toLowerCase().trim()
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.englishName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    )
  }, [dishes, dishSearchQuery])

  // Financial Totals Calculation
  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.dish.price * item.quantity, 0)
  }, [selectedItems])

  const grandTotal = useMemo(() => {
    const rawTotal = subtotal + Number(deliveryFee || 0) - Number(discount || 0)
    return Math.max(0, rawTotal)
  }, [subtotal, deliveryFee, discount])

  // Line Item Handlers
  const handleAddItem = (dish: Dish) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id)
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { dish, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setSelectedItems((prev) => {
      return prev
        .map((i) => {
          if (i.dish.id === dishId) {
            const nextQty = i.quantity + delta
            return nextQty > 0 ? { ...i, quantity: nextQty } : null
          }
          return i
        })
        .filter(Boolean) as SelectedLineItem[]
    })
  }

  const handleRemoveItem = (dishId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.dish.id !== dishId))
  }

  // Form Validation
  const validateForm = (): boolean => {
    setErrorMessage(null)

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('يرجى إدخال اسم العميل بشكل صحيح')
      return false
    }

    if (!customerPhone.trim()) {
      setErrorMessage('يرجى إدخال رقم الجوال')
      return false
    }

    if (!isValidSaudiPhone(customerPhone)) {
      setErrorMessage('رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 أو +9665 ومكون من 10 أرقام)')
      return false
    }

    const finalDistrict =
      selectedDistrict === OTHER_DISTRICT_KEY ? customDistrict.trim() : selectedDistrict
    if (!finalDistrict) {
      setErrorMessage('يرجى تحديد أو كتابة اسم الحي في الرياض')
      return false
    }

    if (!addressDetails.trim() || addressDetails.trim().length < 3) {
      setErrorMessage('يرجى كتابة تفاصيل العنوان (الشارع والفيلا/المبنى)')
      return false
    }

    if (selectedItems.length === 0) {
      setErrorMessage('يرجى اختيار صنف واحد على الأقل لإتمام الطلب')
      return false
    }

    return true
  }

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrorMessage(null)

    const finalDistrict =
      selectedDistrict === OTHER_DISTRICT_KEY ? customDistrict.trim() : selectedDistrict

    const normalizedPhone = normalizeSaudiPhone(customerPhone)
    const orderNumber = `#HSH-${Math.floor(1000 + Math.random() * 9000)}`
    const orderId = `ord_manual_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`

    const orderItems: OrderItem[] = selectedItems.map((item) => ({
      dishId: item.dish.id,
      dishName: item.dish.name,
      dishImage: item.dish.image,
      unit: item.dish.unit,
      unitPrice: item.dish.price,
      quantity: item.quantity,
      totalPrice: item.dish.price * item.quantity,
    }))

    let finalNotes = notes.trim()
    if (discount > 0) {
      const discountTag = `[خصم يدوي مباشر: -${discount} ر.س]`
      finalNotes = finalNotes ? `${finalNotes} | ${discountTag}` : discountTag
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: {
        name: customerName.trim(),
        phone: normalizedPhone,
        district: finalDistrict,
        addressDetails: addressDetails.trim(),
        notes: finalNotes || undefined,
      },
      items: orderItems,
      subtotal,
      deliveryFee: Number(deliveryFee || 0),
      totalAmount: grandTotal,
      paymentMethod,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // 1. Add to local global state
      addOrder(newOrder)

      // 2. Persist to Supabase cloud
      await saveOrderToSupabase(newOrder)

      if (onOrderCreated) {
        onOrderCreated(newOrder)
      }

      setCreatedOrder(newOrder)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ الطلب في السحابة'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndNew = () => {
    setCustomerName('')
    setCustomerPhone('')
    setSelectedDistrict(RIYADH_DISTRICTS[0])
    setCustomDistrict('')
    setAddressDetails('')
    setNotes('')
    setSelectedItems([])
    setDeliveryFee(20)
    setDiscount(0)
    setPaymentMethod('prepaid')
    setInitialStatus('processing')
    setCreatedOrder(null)
    setErrorMessage(null)
  }

  const modalContent = (
    <>
      <AnimatePresence>
        {createdOrder && (
          <motion.div
            key="created-order-dialog-root"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm"
            dir="rtl"
          >
            <motion.div
              variants={modalDialogVariants}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] rounded-3xl border border-primary/20 bg-card text-foreground shadow-2xl overflow-hidden flex flex-col font-sans text-center"
            >
              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
                  <CheckCircle2 className="size-8" />
                </div>

                <div className="space-y-2">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  تم التسجيل بنجاح في السحابة
                </span>
                <h2 className="text-2xl font-black text-foreground">
                  تم تدوين الطلب اليدوي {createdOrder.orderNumber}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تم إدراج الطلب في خط إنتاج المطبخ وحفظه مباشرة في السجل السحابي للعميل: {createdOrder.customer.name}.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-xs space-y-2 text-right">
                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">رقم الطلب:</span>
                  <span className="font-mono font-bold text-foreground">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">العميل والحي:</span>
                  <span className="font-bold text-foreground">
                    {createdOrder.customer.name} ({createdOrder.customer.district})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">عدد الأطباق:</span>
                  <span className="font-bold text-foreground">{createdOrder.items.length} أصناف</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/60 text-sm font-black text-primary">
                  <span>المجموع الكلي:</span>
                  <span className="text-base">{formatPrice(createdOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrintTicket(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-primary/95 transition-all"
                >
                  <Printer className="size-4" />
                  <span>طباعة بون المطبخ (80mm)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndNew}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-card px-4 py-3.5 text-xs font-bold text-primary hover:bg-secondary transition-all"
                >
                  <Plus className="size-4" />
                  <span>تسجيل طلب آخر</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  إغلاق والعودة لقائمة الطلبات
                </button>
              </div>
            </div>

            {/* 80mm Kitchen Prep Ticket Dialog */}
              {showPrintTicket && (
                <KitchenTicket
                  order={createdOrder}
                  onClose={() => setShowPrintTicket(false)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !createdOrder && (
          <motion.div
            key="manual-order-dialog-root"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm"
            dir="rtl"
          >
            <motion.div
              variants={modalDialogVariants}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl border border-primary/25 bg-card text-foreground shadow-2xl overflow-hidden flex flex-col font-sans"
            >
              {/* Pinned Header */}
              <div className="flex items-center justify-between border-b border-border/80 p-5 sm:p-6 shrink-0 bg-card">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                    <ChefHat className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-foreground">
                      تسجيل وتدوين طلب يدوي جديد
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      تدوين طلبات الاتصال الهاتفي والواتساب ومجالس الضيافة لعملاء الرياض
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                  aria-label="إغلاق النافذة"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Form with inner scrollable body and pinned footer */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
                  {/* Error Feedback */}
                  {errorMessage && (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-50/80 p-3.5 text-xs text-rose-900 flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0 text-rose-700" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Customer & Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary border-b border-primary/10 pb-2">
                <User className="size-4" />
                <span>١. بيانات العميل والتوصيل بالرياض</span>
              </div>

              {/* Full Name */}
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-foreground">
                  اسم العميل / الجهة <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: نورة السبيعي / مجلس آل سعود"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-foreground">
                  رقم الجوال <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none text-left"
                    dir="ltr"
                  />
                  <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground/60 pointer-events-none" />
                </div>
              </div>

              {/* Riyadh District */}
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>حي التوصيل (الرياض) <span className="text-accent">*</span></span>
                  <span className="text-[10px] text-muted-foreground">٢٣ حياً مدعوماً</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none cursor-pointer"
                >
                  {RIYADH_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                  <option value={OTHER_DISTRICT_KEY}>{OTHER_DISTRICT_KEY}</option>
                </select>
              </div>

              {selectedDistrict === OTHER_DISTRICT_KEY && (
                <div className="space-y-1 text-right animate-in fade-in-50">
                  <label className="text-xs font-bold text-foreground">
                    اكتب اسم الحي يدوياً <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حي الوادي أو ظهرة لبن"
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* Detailed Address */}
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-foreground">
                  تفاصيل العنوان (الشارع / الفيلا / المعلم) <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="شارع الأمير سلطان، فيلا 14، بجوار مسجد..."
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Special Instructions & Notes */}
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-foreground">
                  ملاحظات المطبخ والتوصيل الخاصة
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: حامض حلو زيادة، تسليم للضيافة الساعة 5 مساءً..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Dish Picker & Itemized List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <ShoppingBag className="size-4" />
                  <span>٢. قائمة الأصناف والأطباق المختارة</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {selectedItems.length} أطباق
                </span>
              </div>

              {/* Dish Search / Selector */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="ابحث عن طبق لإضافته (ورق عنب، ملفوف، صينية...)"
                    value={dishSearchQuery}
                    onChange={(e) => setDishSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pr-9 pl-3.5 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Quick Add Pills from Catalog */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 max-h-24 [scrollbar-width:none]">
                  {filteredDishes.slice(0, 6).map((dish) => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => handleAddItem(dish)}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="size-3" />
                      <span>{dish.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Line Items Table */}
              <div className="rounded-2xl border border-border bg-background/60 p-3 min-h-[170px] max-h-[220px] overflow-y-auto space-y-2">
                {selectedItems.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center space-y-1 text-muted-foreground">
                    <ShoppingBag className="size-6 text-primary/40" />
                    <p className="text-xs font-bold">لم يتم اختيار أي أصناف بعد</p>
                    <p className="text-[10px]">اختر أطباقاً من القائمة أعلاه لإضافتها للطلب</p>
                  </div>
                ) : (
                  selectedItems.map((item) => (
                    <div
                      key={item.dish.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl bg-card border border-border text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="size-8 rounded-lg object-cover border border-border/80 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{item.dish.name}</p>
                          <span className="text-[10px] text-muted-foreground">
                            {formatPrice(item.dish.price)} · {item.dish.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Stepper */}
                        <div className="flex items-center gap-1 rounded-xl bg-secondary p-0.5 border border-border">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.dish.id, 1)}
                            className="size-6 flex items-center justify-center rounded-lg bg-card text-foreground hover:bg-primary hover:text-white transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                          <span className="min-w-5 text-center font-bold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.dish.id, -1)}
                            className="size-6 flex items-center justify-center rounded-lg bg-card text-foreground hover:bg-primary hover:text-white transition-colors"
                          >
                            <Minus className="size-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="font-black text-primary min-w-[50px] text-left" dir="ltr">
                          {formatPrice(item.dish.price * item.quantity)}
                        </span>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.dish.id)}
                          className="size-6 flex items-center justify-center text-rose-600 hover:text-rose-800 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Financial Engine & Delivery / Discount */}
          <div className="rounded-2xl border border-primary/20 bg-card p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Truck className="size-4 text-primary" />
                <span>٣. الحسابات المالية ورسوم التوصيل والخصم</span>
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                المجموع الفرعي: <strong className="text-foreground">{formatPrice(subtotal)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Fee Configuration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  رسوم التوصيل (ر.س)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'توصيل الرياض (20 ر.س)', value: 20 },
                    { label: 'توصيل مجاني VIP (0)', value: 0 },
                    { label: 'استلام فرع (0)', value: 0 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDeliveryFee(preset.value)}
                      className={cn(
                        'rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-colors',
                        deliveryFee === preset.value
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground"
                />
              </div>

              {/* Custom Discount Deduction */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  خصم يدوي مباشر (ر.س)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 10, 20, 30, 50].map((dVal) => (
                    <button
                      key={dVal}
                      type="button"
                      onClick={() => setDiscount(dVal)}
                      className={cn(
                        'rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-colors',
                        discount === dVal
                          ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      {dVal === 0 ? 'بدون خصم' : `-${dVal} ر.س`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-accent"
                />
              </div>
            </div>

            {/* Live Grand Total Display */}
            <div className="flex items-center justify-between rounded-xl bg-secondary p-3 border border-border/80">
              <span className="text-xs font-bold text-foreground">المجموع النهائي المستحق:</span>
              <span className="text-lg font-black text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Section 4: Payment Method & Initial Operational Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">
                طريقة الدفع المحتسبة
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'prepaid' as PaymentMethod, label: 'مدفوع مسبقاً', icon: CreditCard },
                  { id: 'cod' as PaymentMethod, label: 'دفع عند الاستلام', icon: Banknote },
                  { id: 'bank_transfer' as PaymentMethod, label: 'تحويل بنكي', icon: Send },
                ].map((pm) => {
                  const Icon = pm.icon
                  const isSelected = paymentMethod === pm.id
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all min-h-[64px]',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      <Icon className="size-4 mb-1" />
                      <span className="text-[11px]">{pm.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Initial Kitchen Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">
                الحالة التشغيلية الأولية في المطبخ
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'processing' as OrderStatus,
                    label: 'قيد التحضير بالمطبخ',
                    desc: 'بدء التجهيز الفوري',
                  },
                  {
                    id: 'pending' as OrderStatus,
                    label: 'طلب جديد في الانتظار',
                    desc: 'انتظار التأكيد',
                  },
                ].map((st) => {
                  const isSelected = initialStatus === st.id
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setInitialStatus(st.id)}
                      className={cn(
                        'flex flex-col items-start p-2.5 rounded-2xl border text-right transition-all min-h-[64px]',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      <span className="text-xs">{st.label}</span>
                      <span className="text-[10px] text-muted-foreground">{st.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>
              </div>
            </div>

            {/* Pinned Submit Actions Footer */}
            <div className="border-t border-border/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-card/95">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">إجمالي القيمة:</span>
                <span className="text-base font-black text-primary">{formatPrice(grandTotal)}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>جاري تسجيل الطلب بالسحابة...</span>
                  ) : (
                    <>
                      <Check className="size-4" />
                      <span>تأكيد وتسجيل الطلب في المطبخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
