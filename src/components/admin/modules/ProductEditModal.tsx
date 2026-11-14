import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  UtensilsCrossed,
  Layers,
  Plus,
  Trash2,
  Tag,
} from 'lucide-react'
import { Dish, BadgeKind, DishVariant } from '../../../types/menu'
import { AdminCategory, AdminBadge } from '../../../types/admin'
import { uploadDishImage } from '../../../services/adminService'
import { optimizeImageToWebp, OPTIMIZER_PRESETS, formatFileSize } from '../../../utils/imageOptimizer'
import { getBadges, getBadgeIcon, BADGE_CHANNEL_NAME } from '../../../services/badgeService'
import { useSiteContent } from '../../../context/SiteContentContext'
import { cn } from '../../../lib/utils'

export interface ProductEditModalProps {
  dish?: Dish | null
  categories: AdminCategory[]
  isOpen: boolean
  onClose: () => void
  onSave: (dish: Dish) => Promise<void>
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  dish,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(dish?.name || '')
  const [slug, setSlug] = useState(dish?.slug || '')
  const [description, setDescription] = useState(dish?.description || '')
  const [longDescription, setLongDescription] = useState(dish?.longDescription || '')
  const [servingInfo, setServingInfo] = useState(dish?.servingInfo || '')
  const [price, setPrice] = useState<number>(dish?.price || 120)
  const [unit, setUnit] = useState(dish?.unit || 'صينية ٥٠ حبة')
  const [image, setImage] = useState(dish?.image || '/images/warak-enab.png')
  const [imageAlt, setImageAlt] = useState(dish?.imageAlt || '')
  const [badges, setBadges] = useState<BadgeKind[]>(dish?.badges || ['tangy'])
  const [inStock, setInStock] = useState(dish ? dish.inStock : true)
  const [seoTitle, setSeoTitle] = useState(dish?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(dish?.seoDescription || '')
  const [seoKeywords, setSeoKeywords] = useState<string[]>(dish?.seoKeywords || [])
  const [keywordInput, setKeywordInput] = useState('')

  const { t } = useSiteContent()

  // Preparation & Serving Tip (طريقة التحضير والتقديم المقترحة)
  const [showPreparationTip, setShowPreparationTip] = useState<boolean>(
    dish?.showPreparationTip !== undefined ? dish.showPreparationTip : true
  )
  const [preparationTip, setPreparationTip] = useState<string>(
    dish?.preparationTip || ''
  )

  // 4 Culinary Highlights Checkbox State
  const [highlights, setHighlights] = useState<string[]>(() => {
    if (Array.isArray(dish?.highlights)) {
      return dish.highlights
    }
    if (dish?.id && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`hashousha_dish_highlights_${dish.id}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed)) return parsed
        }
      } catch {}
    }
    // Default for new dish or dishes without explicit highlights array: all 4 checked
    return ['fresh', 'ingredients', 'packaging', 'delivery']
  })

  const handleToggleHighlight = (key: string) => {
    setHighlights((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const highlightOptions = [
    {
      key: 'fresh',
      label: t('dishModal.highlightFresh', 'تحضير طازج يومياً بالرياض'),
      hint: 'يؤكد للعميل أن المخبوزات والطبق يُحضّر طازجاً في نفس يوم الطلب',
    },
    {
      key: 'ingredients',
      label: t('dishModal.highlightIngredients', 'زيت زيتون بكر ودبس رمان أصلي'),
      hint: 'أبرز مكونات التحضير الفاخرة للطبق (مناسب للأصناف المالحة والتقليدية)',
    },
    {
      key: 'packaging',
      label: t('dishModal.highlightPackaging', 'تغليف حراري مخصص للجمعات'),
      hint: 'يظهر ميزة الصواني والبوكسات الحرارية الحافظة للحرارة والطراوة',
    },
    {
      key: 'delivery',
      label: t('dishModal.highlightDelivery', 'توصيل فوري بسيارات مجهزة'),
      hint: 'ضمان وصول الطلب بحالته المثالية عبر أسطول النقل المجهز بالرياض',
    },
  ]

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().replace(/^#/, '')
    if (!trimmed) return
    if (seoKeywords.includes(trimmed)) {
      setKeywordInput('')
      return
    }
    if (seoKeywords.length >= 8) {
      setErrorMsg('الحد الأقصى الموصى به للكلمات المفتاحية هو 8 كلمات.')
      return
    }
    setSeoKeywords((prev) => [...prev, trimmed])
    setKeywordInput('')
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setSeoKeywords((prev) => prev.filter((k) => k !== keywordToRemove))
  }

  // Multi-Size Variants State
  const [hasVariants, setHasVariants] = useState<boolean>(
    Boolean(dish?.variants && dish.variants.length > 0)
  )
  const [variants, setVariants] = useState<DishVariant[]>(
    dish?.variants && dish.variants.length > 0 ? dish.variants : []
  )

  const handleAddVariant = () => {
    const newVariant: DishVariant = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: 'حجم جديد',
      price: price || 20,
      servingInfo: 'تكفي شخص واحد',
      inStock: true,
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const handleUpdateVariant = (idx: number, patch: Partial<DishVariant>) => {
    setVariants((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...patch }
      return next
    })
  }

  const handleRemoveVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx))
  }

  const [uploadingImage, setUploadingImage] = useState(false)
  const [compressionBadge, setCompressionBadge] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [availableBadges, setAvailableBadges] = useState<AdminBadge[]>(() => getBadges())

  useEffect(() => {
    const handleBadgesUpdate = () => {
      setAvailableBadges(getBadges())
    }
    window.addEventListener('hashousha_badges_updated', handleBadgesUpdate)
    let bc: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(BADGE_CHANNEL_NAME)
      bc.onmessage = (event) => {
        if (event.data?.type === 'BADGES_UPDATE') {
          setAvailableBadges(getBadges())
        }
      }
    }
    return () => {
      window.removeEventListener('hashousha_badges_updated', handleBadgesUpdate)
      bc?.close()
    }
  }, [])

  if (!isOpen) return null

  const handleNameChange = (val: string) => {
    setName(val)
    if (!dish && !slug) {
      const generated = `dish-${Date.now().toString(36)}`
      setSlug(generated)
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrorMsg(null)
    setCompressionBadge(null)

    try {
      // 1. Client-side WebP optimization
      const opt = await optimizeImageToWebp(file, OPTIMIZER_PRESETS.dish)
      if (opt.savingsPercent > 0 || opt.optimizedSize > 0) {
        setCompressionBadge(
          `✨ تم تحويل وضغط الصورة تلقائياً لـ WebP: ${formatFileSize(opt.originalSize)} ← ${formatFileSize(opt.optimizedSize)} (توفير ${opt.savingsPercent}%)`
        )
      }

      // 2. Upload WebP file to Supabase
      const publicUrl = await uploadDishImage(opt.file)
      setImage(publicUrl)
    } catch {
      setErrorMsg('تعذر رفع الصورة، تم استخدام مسار المعاينة المحلي.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleBadgeToggle = (badgeId: BadgeKind) => {
    setBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((b) => b !== badgeId) : [...prev, badgeId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم الصنف بالعربية')
      return
    }

    if (price <= 0) {
      setErrorMsg('يرجى تحديد سعر صحيح أكبر من صفر')
      return
    }

    setSaving(true)

    const finalSlug = slug.trim() || `dish-${Date.now()}`
    const finalId = dish?.id || `dish_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`

    const updatedDish: Dish = {
      id: finalId,
      name: name.trim(),
      englishName: dish?.englishName || name.trim(),
      slug: finalSlug,
      description: description.trim(),
      longDescription: longDescription.trim() || undefined,
      servingInfo: servingInfo.trim() || undefined,
      price: Number(price),
      unit: unit.trim(),
      category: dish?.category || (dish?.categories?.[0] || 'plain-dough-babka'),
      categories: dish?.categories || (dish?.category ? [dish.category] : ['plain-dough-babka']),
      image,
      imageAlt: imageAlt.trim() || undefined,
      badges,
      inStock,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      seoKeywords: seoKeywords.length > 0 ? seoKeywords : undefined,
      variants: hasVariants && variants.length > 0 ? variants : undefined,
      highlights,
      showPreparationTip,
      preparationTip: preparationTip.trim() || undefined,
    }

    try {
      await onSave(updatedDish)
      onClose()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'تعذر حفظ الصنف')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl border border-primary/25 bg-card text-foreground shadow-2xl flex flex-col overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="flex items-center justify-between border-b border-border/80 p-5 sm:p-6 shrink-0 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground">
                {dish ? 'تعديل بيانات الطبق' : 'إضافة طبق جديد'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {dish ? `تعديل الصنف: ${dish.name}` : 'إدخال تفاصيل الطبق وسعره وصورته باللغة العربية'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 p-3 text-xs text-rose-900 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-700" />
              <span>{errorMsg}</span>
            </div>
          )}
          {/* Row 1: Dish Name (Arabic only) */}
          <div className="space-y-1 text-right">
            <label htmlFor="dish-name" className="text-xs font-bold text-foreground">
              اسم الصنف بالعربية <span className="text-accent">*</span>
            </label>
            <input
              id="dish-name"
              type="text"
              required
              placeholder="مثال: ورق عنب حامض حلو بدبس الرمان"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
            />
          </div>

          {/* Row 2: Linked Categories (Full Width Independent Row) */}
          <div className="space-y-1.5 text-right w-full bg-secondary/20 border border-primary/20 rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>التصنيفات المرتبطة بالمنتج</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-medium">
                تتم إدارة وربط التصنيفات عبر صفحة «إدارة التصنيفات»
              </span>
            </div>
            <div
              className="min-h-[38px] w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 flex flex-wrap items-center gap-1.5"
              title="تتم إدارة تصنيفات المنتج عبر قسم إدارة التصنيفات"
            >
              {(() => {
                const dishCats =
                  Array.isArray(dish?.categories) && dish?.categories.length > 0
                    ? dish.categories
                    : dish?.category
                    ? [dish.category]
                    : []
                const linked = categories.filter((c) => dishCats.includes(c.id))

                if (linked.length === 0) {
                  return (
                    <span className="text-[11px] text-muted-foreground font-medium">
                      لم يتم ربط أي تصنيف بهذا المنتج حتى الآن (يمكنك ربطه بسهولة عبر قسم إدارة التصنيفات)
                    </span>
                  )
                }

                return linked.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-[11px] font-bold text-primary shadow-xs"
                  >
                    {c.name}
                  </span>
                ))
              })()}
            </div>
          </div>

          {/* Row 2.5: Price, Unit & Serving Info (Strict Horizontal Line Alignment) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-1 text-right">
              <label
                htmlFor="dish-price"
                className="min-h-[2.25rem] flex items-end text-xs font-bold text-foreground pb-0.5"
              >
                <span>السعر الأساسي (ر.س) <span className="text-accent">*</span></span>
              </label>
              <input
                id="dish-price"
                type="number"
                min="1"
                step="0.5"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs font-bold text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-right">
              <label
                htmlFor="dish-unit"
                className="min-h-[2.25rem] flex items-end text-xs font-bold text-foreground pb-0.5"
              >
                <span>الوصف الكمّي (الحجم / الحبات)</span>
              </label>
              <input
                id="dish-unit"
                type="text"
                placeholder="مثال: صينية ٥٠ حبة أو بوكس"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-right">
              <label
                htmlFor="dish-serving-info"
                className="min-h-[2.25rem] flex items-end text-xs font-bold text-foreground pb-0.5"
              >
                <span>حجم الضيافة (كم شخص تكفي؟)</span>
              </label>
              <input
                id="dish-serving-info"
                type="text"
                placeholder="مثال: تكفي ٤-٦ أشخاص"
                value={servingInfo}
                onChange={(e) => setServingInfo(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs font-semibold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2.5: Multi-Size Variants Manager */}
          <div className="rounded-2xl border border-primary/25 bg-secondary/20 p-4 space-y-3 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="size-4 text-primary" />
                <span>خيارات الأحجام المتعددة (Multi-Size Variants)</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setHasVariants(checked)
                    if (checked && variants.length === 0) {
                      setVariants([
                        { id: 'mini', name: 'حجم ميني', price: 12, servingInfo: 'تكفي شخص واحد', inStock: true },
                        { id: 'medium', name: 'حجم وسط', price: 45, servingInfo: 'تكفي 3-4 أشخاص', inStock: true },
                        { id: 'family', name: 'حجم عائلي', price: 78, servingInfo: 'تكفي 6-8 أشخاص', inStock: true },
                      ])
                    }
                  }}
                  className="rounded text-primary focus:ring-primary size-4"
                />
                <span className={hasVariants ? 'text-primary font-black' : 'text-muted-foreground'}>
                  {hasVariants ? 'مفعل (أحجام متعددة)' : 'معطل (حجم وسعر موحد)'}
                </span>
              </label>
            </div>

            {hasVariants && (
              <div className="space-y-3 pt-1">
                <p className="text-[11px] text-muted-foreground">
                  أضف خيارات الأحجام وسعر كل حجم وسعته الكمية لضيافة الجمعات (مثال: حجم ميني، حجم وسط، حجم عائلي، أو بوكسات):
                </p>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      className="grid grid-cols-12 gap-2 p-2.5 rounded-xl border border-border/80 bg-background/80 items-center text-xs"
                    >
                      <div className="col-span-4 space-y-0.5">
                        <label className="text-[10px] text-muted-foreground font-semibold block">اسم الحجم</label>
                        <input
                          type="text"
                          required
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(idx, { name: e.target.value })}
                          placeholder="مثال: حجم وسط"
                          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div className="col-span-3 space-y-0.5">
                        <label className="text-[10px] text-muted-foreground font-semibold block">السعر (ر.س)</label>
                        <input
                          type="number"
                          min="1"
                          step="0.5"
                          required
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, { price: Number(e.target.value) })}
                          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div className="col-span-4 space-y-0.5">
                        <label className="text-[10px] text-muted-foreground font-semibold block">سعة الضيافة</label>
                        <input
                          type="text"
                          value={v.servingInfo || ''}
                          onChange={(e) => handleUpdateVariant(idx, { servingInfo: e.target.value })}
                          placeholder="مثال: تكفي 3-4 أشخاص"
                          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div className="col-span-1 flex items-center justify-end gap-1 pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف هذا الحجم"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>إضافة حجم إضافي (+)</span>
                </button>
              </div>
            )}
          </div>

          {/* Row 3: Description */}
          <div className="space-y-1 text-right">
            <label htmlFor="dish-description" className="text-xs font-bold text-foreground">
              وصف الصنف والمكونات (المختصر)
            </label>
            <textarea
              id="dish-description"
              rows={2}
              placeholder="ملفوف يدوياً بالأرز المتبّل بدبس الرمان وزيت الزيتون البكر الفاخر..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:border-primary focus:outline-none"
            />
          </div>

          {/* Row 3.5: Long Culinary Description */}
          <div className="space-y-1 text-right">
            <label htmlFor="dish-long-description" className="text-xs font-bold text-foreground">
              الوصف الطويل وقصة سر التحضير الفاخر
            </label>
            <textarea
              id="dish-long-description"
              rows={3}
              placeholder="اكتب قصة الطبق وسر التتبيلة وطريقة التحضير الحرفية وملاحظات التقديم لضيوف المجالس..."
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:border-primary focus:outline-none"
            />
          </div>

          {/* Row 3.8: Culinary Highlights Checkboxes (مزايا وركائز الجودة الأربع للطبق) */}
          <div className="rounded-2xl border border-primary/20 bg-secondary/20 p-4 space-y-3 text-right">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-3.5" />
                </span>
                <span>مزايا وركائز الجودة للطبق (Culinary Highlights)</span>
              </label>
              <span className="text-[10px] text-muted-foreground font-semibold">
                {highlights.length} من 4 محددة
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              اختر المزايا التي تنطبق على هذا الصنف لعرضها في نافذة تفاصيل الطبق للمستهلك. الميزة المحددة ستظهر بداخل بطاقة الطبق، وغير المحددة ستُخفى تلقائياً:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {highlightOptions.map((opt) => {
                const isChecked = highlights.includes(opt.key)
                return (
                  <label
                    key={opt.key}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all select-none',
                      isChecked
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30 shadow-xs'
                        : 'border-border/80 bg-background/80 text-foreground/80 hover:bg-secondary'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleHighlight(opt.key)}
                      className="mt-0.5 size-4 rounded border-primary/30 text-primary focus:ring-primary/40 cursor-pointer"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{opt.label}</span>
                        {isChecked && <Check className="size-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-normal leading-tight">
                        {opt.hint}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Row 3.9: Preparation & Serving Tip (طريقة التحضير والتقديم الخاصة بالطبق) */}
          <div className="rounded-2xl border border-primary/20 bg-secondary/20 p-4 space-y-3.5 text-right">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UtensilsCrossed className="size-3.5" />
                </span>
                <span>طريقة التقديم والتحضير (Preparation & Serving Tip)</span>
              </label>

              {/* Master Switch for this Dish */}
              <div className="flex items-center gap-2.5">
                <span className={cn('text-[11px] font-bold transition-colors', showPreparationTip ? 'text-primary' : 'text-muted-foreground')}>
                  {showPreparationTip ? 'مفعل للطبق' : 'معطل ومخفي'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showPreparationTip}
                  onClick={() => setShowPreparationTip((prev) => !prev)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    showPreparationTip ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                  title={showPreparationTip ? 'إخفاء جزئية طريقة التحضير لهذا الطبق' : 'تفعيل وإظهار جزئية طريقة التحضير'}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      showPreparationTip ? '-translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              تحكم في ظهور أو إخفاء إرشاد التقديم والتحضير لهذا الطبق. يمكنك كتابة إرشادات خاصة بالطبق أدناه، أو ترك الحقل فارغاً لاستخدام النص الافتراضي العام.
            </p>

            {showPreparationTip && (
              <div className="space-y-2 pt-1 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="dish-preparation-tip" className="text-[11px] font-bold text-foreground">
                    نص طريقة التحضير والتقديم المقترحة:
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {preparationTip.length} حرف
                  </span>
                </div>
                <textarea
                  id="dish-preparation-tip"
                  rows={3}
                  value={preparationTip}
                  onChange={(e) => setPreparationTip(e.target.value)}
                  placeholder={t('dishModal.servingTipText', 'يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.')}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
                <div className="rounded-xl bg-background/60 border border-primary/10 p-2.5 flex items-start gap-2 text-[10.5px] text-muted-foreground leading-relaxed">
                  <span className="text-primary font-bold shrink-0">💡 ملاحظة:</span>
                  <span>
                    عنوان هذه الجزئية يتم التحكم به وتعديله من صفحة <span className="font-bold text-foreground">"المظهر والمحتوى"</span> ولا يتم تغييره من هنا لضمان اتساق هوية البراند.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Image Upload to Supabase Storage with WebP Optimizer */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                صورة الطبق (تحويل وضغط تلقائي لـ WebP ورفع مباشر لسحابة Supabase)
              </label>
              <span className="text-[10px] text-muted-foreground font-semibold">يدعم PNG, JPG, HEIC</span>
            </div>

            {/* Real-time WebP Compression Feedback Badge */}
            {compressionBadge && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span>{compressionBadge}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-background/50 p-4">
              <img
                src={image}
                alt="معاينة الطبق"
                className="size-20 rounded-2xl object-cover border border-border shadow-sm shrink-0"
              />

              <div className="flex-1 space-y-2 text-right w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.heic"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>جاري الرفع إلى سحابة التخزين...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-3.5" />
                      <span>اختر صورة من جهازك للرفع السحابي</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-muted-foreground">
                  أو يمكنك كتابة رابط مباشر للصورة أدناه:
                </p>
                <input
                  type="text"
                  placeholder="رابط الصورة (URL)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-left"
                  dir="ltr"
                />

                {/* Image Alt Text (النص البديل للصورة لتحسين محركات البحث والوصول) */}
                <div className="pt-2 border-t border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="dish-image-alt" className="text-[11px] font-bold text-foreground">
                      النص البديل للصورة (Image Alt Text)
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {imageAlt.length} / 120 حرف (مهم لمحركات بحث Google)
                    </span>
                  </div>
                  <input
                    id="dish-image-alt"
                    type="text"
                    maxLength={120}
                    placeholder="مثال: بابكا نوتيلا وبيكان فاخرة طازجة من مخبز هشوشة بالرياض"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    النص البديل (alt) يقرأه محرك بحث Google لأرشفة صورة الطبق في نتائج الصور، كما يقرأه قارئ الشاشة لفاقدي البصر.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: SEO Slug & Title with Character Limits & Live Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Slug */}
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-between">
                <label htmlFor="dish-slug" className="text-xs font-bold text-foreground">
                  الرابط المخصص للسيو (Slug)
                </label>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    slug.length > 45 ? 'text-amber-600' : 'text-muted-foreground'
                  )}
                >
                  {slug.length} / 50 حرف
                </span>
              </div>
              <input
                id="dish-slug"
                type="text"
                maxLength={50}
                placeholder="babka-nutella-pecan"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
                dir="ltr"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span dir="ltr">/dish/{slug || '...'}</span>
                <span>(رابط إنجليزي فريد وصديق لمحركات البحث)</span>
              </div>
            </div>

            {/* SEO Title */}
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-between">
                <label htmlFor="dish-seo-title" className="text-xs font-bold text-foreground">
                  عنوان السيو (Meta Title)
                </label>
                <span
                  className={cn(
                    'text-[10px] font-semibold',
                    seoTitle.length > 60
                      ? 'text-amber-600'
                      : seoTitle.length >= 40
                      ? 'text-emerald-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {seoTitle.length} / 70 حرف (الموصى به: 50-60)
                </span>
              </div>
              <input
                id="dish-seo-title"
                type="text"
                maxLength={70}
                placeholder="بابكا نوتيلا وبيكان فاخرة بالرياض | هشوشة"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
              />
              <p className="text-[10px] text-muted-foreground">
                يظهر كعنوان رئيسي في نتائج بحث Google ومشاركات وسائل التواصل.
              </p>
            </div>
          </div>

          {/* Row 5.5: SEO Description with Character Limits & Live Guidance */}
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-between">
              <label htmlFor="dish-seo-desc" className="text-xs font-bold text-foreground">
                وصف السيو لمحركات البحث (Meta Description)
              </label>
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  seoDescription.length > 155
                    ? 'text-amber-600'
                    : seoDescription.length >= 120
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
                )}
              >
                {seoDescription.length} / 165 حرف (الموصى به: 120-155)
              </span>
            </div>
            <textarea
              id="dish-seo-desc"
              rows={2}
              maxLength={165}
              placeholder="تذوق بابكا النوتيلا والبيكان المحمص بعجينة البريوش الفرنسية الفاخرة المورقة طازجة يومياً من مخبز هشوشة بالرياض..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-medium leading-relaxed focus:border-primary focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground">
              يظهر كنص وصفي أسفل الرابط في جوجل، ويُنصح بأن يكون بين 120 إلى 155 حرفاً لتفادي الاقتطاع.
            </p>
          </div>

          {/* Row 5.6: SEO Keywords (Tag Manager with Limits & Live Guidance) */}
          <div className="space-y-2 text-right rounded-2xl border border-primary/20 bg-secondary/15 p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                <span>الكلمات المفتاحية للسيو (SEO Keywords)</span>
              </label>
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  seoKeywords.length >= 8
                    ? 'text-amber-600'
                    : seoKeywords.length >= 3
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
                )}
              >
                {seoKeywords.length} / 8 كلمات موصى بها
              </span>
            </div>

            {/* Keyword Input & Add Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  seoKeywords.length >= 8
                    ? 'تم استيفاء الحد الأقصى للكلمات المفتاحية (8 كلمات)'
                    : 'اكتب كلمة مفتاحية واضغط Enter أو زر إضافة (مثال: بابكا نوتيلا)'
                }
                disabled={seoKeywords.length >= 8}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddKeyword()
                  }
                }}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none disabled:bg-muted/50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                disabled={seoKeywords.length >= 8 || !keywordInput.trim()}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>إضافة</span>
              </button>
            </div>

            {/* Active Keywords Tags */}
            <div className="min-h-[32px] flex flex-wrap items-center gap-1.5 pt-1">
              {seoKeywords.length === 0 ? (
                <span className="text-[11px] text-muted-foreground">
                  لم يتم إضافة كلمات مفتاحية بعد. يُنصح بإضافة 3-8 كلمات لتعزيز تصدر الصنف في محركات البحث.
                </span>
              ) : (
                seoKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors"
                  >
                    <span>#{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="size-3.5 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                      title="حذف الكلمة المفتاحية"
                    >
                      <X className="size-2.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <p className="text-[10px] text-muted-foreground">
              الكلمات المفتاحية تساهم في تغذية وسوم الميتا ومحركات الفهرسة الذكية لتصدر قوائم البحث في الرياض.
            </p>
          </div>

          {/* Row 6: Badges & Stock Switch */}
          <div className="rounded-2xl border border-border bg-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>شارات التمييز (Badges)</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-primary focus:ring-primary size-4"
                />
                <span className={inStock ? 'text-emerald-700' : 'text-rose-600'}>
                  {inStock ? 'متوفر للطلب اليوم' : 'غير متوفر حالياً'}
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {availableBadges.map((b) => {
                const isSelected = badges.includes(b.id)
                const Icon = getBadgeIcon(b.iconName)
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBadgeToggle(b.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    {isSelected ? <Check className="size-3" /> : <Icon className="size-3 text-primary/70" />}
                    <span>{b.label}</span>
                  </button>
                )
              })}

              {/* Also display any custom badges already on the dish if not in availableBadges */}
              {badges
                .filter((bId) => !availableBadges.some((ab) => ab.id === bId))
                .map((orphanId) => (
                  <button
                    key={orphanId}
                    type="button"
                    onClick={() => handleBadgeToggle(orphanId)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold shadow-sm"
                    title="شارة مخصصة محفوظة بهذا الطبق"
                  >
                    <Check className="size-3" />
                    <span>{orphanId}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="border-t border-border/80 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/95 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري حفظ الطبق...</span>
                </>
              ) : (
                <span>{dish ? 'حفظ التعديلات' : 'إضافة الطبق للقائمة'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent
}
