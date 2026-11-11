import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Tag, Edit2, Trash2, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { AdminDiscount } from '../../../types/admin'
import { saveDiscountToSupabase, deleteDiscountFromSupabase } from '../../../services/adminService'
import { cn } from '../../../lib/utils'

export interface DiscountsModuleProps {
  discounts: AdminDiscount[]
  onUpdateDiscounts: (discounts: AdminDiscount[]) => void
}

export const DiscountsModule: React.FC<DiscountsModuleProps> = ({
  discounts,
  onUpdateDiscounts,
}) => {
  const [editingDiscount, setEditingDiscount] = useState<AdminDiscount | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form fields
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(10)
  const [minOrderAmount, setMinOrderAmount] = useState<number>(100)
  const [isActive, setIsActive] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const openModal = (d?: AdminDiscount) => {
    if (d) {
      setEditingDiscount(d)
      setCode(d.code)
      setDiscountType(d.discountType)
      setDiscountValue(d.discountValue)
      setMinOrderAmount(d.minOrderAmount)
      setIsActive(d.isActive)
    } else {
      setEditingDiscount(null)
      setCode('')
      setDiscountType('percentage')
      setDiscountValue(10)
      setMinOrderAmount(100)
      setIsActive(true)
    }
    setErrorMsg(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setErrorMsg('يرجى إدخال رمز الكوبون')
      return
    }

    if (discountValue <= 0) {
      setErrorMsg('يرجى إدخال قيمة خصم أكبر من صفر')
      return
    }

    const cleanCode = code.trim().toUpperCase()
    const finalId = editingDiscount ? editingDiscount.id : `disc_${Date.now()}`

    const discObj: AdminDiscount = {
      id: finalId,
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      isActive,
      usageCount: editingDiscount ? editingDiscount.usageCount : 0,
    }

    const updated = editingDiscount
      ? discounts.map((d) => (d.id === editingDiscount.id ? discObj : d))
      : [...discounts, discObj]

    onUpdateDiscounts(updated)
    setEditingDiscount(undefined)

    await saveDiscountToSupabase(discObj)
  }

  const handleDelete = async (id: string) => {
    const updated = discounts.filter((d) => d.id !== id)
    onUpdateDiscounts(updated)
    setDeletingId(null)
    await deleteDiscountFromSupabase(id)
  }

  const handleToggleActive = async (d: AdminDiscount) => {
    const toggled = { ...d, isActive: !d.isActive }
    const updated = discounts.map((item) => (item.id === d.id ? toggled : item))
    onUpdateDiscounts(updated)
    await saveDiscountToSupabase(toggled)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <Tag className="size-5 text-primary" />
            <span>إدارة كوبونات الخصم والعروض</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            إنشاء أكواد خصم بنسب مئوية أو مبالغ ثابتة مع تحديد الحد الأدنى لتفعيل الكوبون عند الدفع.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98"
        >
          <Plus className="size-4" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      {/* Discounts Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-secondary/60 text-muted-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3 px-4">كود الكوبون</th>
              <th className="py-3 px-4">نوع الخصم</th>
              <th className="py-3 px-4">قيمة الخصم</th>
              <th className="py-3 px-4">الحد الأدنى للطلب</th>
              <th className="py-3 px-4">مرات الاستخدام</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  لا توجد كوبونات خصم منشأة حالياً
                </td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-black text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                      {d.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-foreground/80">
                    {d.discountType === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت (ر.س)'}
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    {d.discountType === 'percentage' ? `${d.discountValue}%` : `${d.discountValue} ر.س`}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {d.minOrderAmount} ر.س
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    {d.usageCount || 0}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(d)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border',
                        d.isActive
                          ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-800 border-rose-500/30'
                      )}
                    >
                      {d.isActive ? (
                        <>
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          <span>مفعّل</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3 text-rose-600" />
                          <span>موقوف</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openModal(d)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Edit2 className="size-4 text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(d.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {editingDiscount !== undefined &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingDiscount(undefined)
            }}
          >
          <div
            className="rounded-[2rem] border border-primary/25 bg-card p-6 shadow-2xl max-w-md w-full space-y-4 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">
                {editingDiscount ? 'تعديل كوبون الخصم' : 'إنشاء كود خصم جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDiscount(undefined)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 p-2.5 text-xs text-rose-900 flex items-center gap-2">
                <AlertCircle className="size-4 text-rose-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">رمز الكود (مثال: HSH10)</label>
                <input
                  type="text"
                  required
                  placeholder="HSH10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">نوع الخصم</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">قيمة الخصم</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">الحد الأدنى لقيمة السلة (ر.س)</label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-primary focus:ring-primary size-4"
                  />
                  <span>تفعيل الكوبون فورياً</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDiscount(undefined)}
                    className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    حفظ الكوبون
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation */}
      {deletingId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingId(null)
            }}
          >
            <div
              className="rounded-2xl border border-rose-500/30 bg-card p-6 shadow-2xl max-w-sm w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-bold text-foreground">تأكيد حذف الكوبون</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هل أنت متأكد من رغبتك في حذف كود الخصم هذا؟ لن يتمكن العملاء من استخدامه بعد ذلك.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-foreground hover:bg-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingId)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
