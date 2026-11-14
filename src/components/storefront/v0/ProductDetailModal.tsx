import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  Check,
  ChevronLeft,
  Users,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react'
import { Dish } from '../../../types/menu'
import { useCart } from '../../cart-context'
import { useSiteContent } from '../../../context/SiteContentContext'
import { formatPrice } from '../../../data/menu'
import { modalBackdropVariants, modalDialogVariants } from '../../../lib/motion'
import { getBadgeDisplayConfig } from '../../../services/badgeService'
import { cn } from '../../../lib/utils'
import {
  injectJsonLd,
  removeJsonLd,
  getBreadcrumbSchema,
  getDishBreadcrumbs,
} from '../../../utils/seoSchemas'
import { getOptimizedDishImageAlt } from '../../../utils/imageSeo'

export interface ProductDetailModalProps {
  dish: Dish | null
  isOpen: boolean
  onClose: () => void
  onOpenCart?: () => void
}

const HIGHLIGHT_CONFIG = [
  { key: 'fresh', uiKey: 'dishModal.highlightFresh', defaultLabel: 'تحضير طازج يومياً بالرياض' },
  { key: 'ingredients', uiKey: 'dishModal.highlightIngredients', defaultLabel: 'زيت زيتون بكر ودبس رمان أصلي' },
  { key: 'packaging', uiKey: 'dishModal.highlightPackaging', defaultLabel: 'تغليف حراري مخصص للجمعات' },
  { key: 'delivery', uiKey: 'dishModal.highlightDelivery', defaultLabel: 'توصيل فوري بسيارات مجهزة' },
] as const

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  onOpenCart,
}) => {
  const { quantities, add, remove } = useCart()
  const { t } = useSiteContent()
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>('')
  const [copied, setCopied] = React.useState(false)
  const [imgLoaded, setImgLoaded] = React.useState(false)

  // Reset image loaded status & variant selection on modal open or dish change
  useEffect(() => {
    setImgLoaded(false)
    setSelectedVariantId(dish?.variants && dish.variants.length > 0 ? dish.variants[0].id : '')
  }, [dish?.id, isOpen])

  const activeVariant = dish?.variants?.find((v) => v.id === selectedVariantId) ?? dish?.variants?.[0]
  const activePrice = activeVariant ? activeVariant.price : (dish?.price || 0)
  const activeServingInfo = activeVariant?.servingInfo ?? dish?.servingInfo ?? t('dishModal.defaultServing', 'تكفي ٤-٦ أشخاص')
  const lineKey = dish ? (activeVariant ? `${dish.id}__${activeVariant.id}` : dish.id) : ''
  const quantity = lineKey ? (quantities[lineKey] ?? 0) : 0

  // Culinary Highlights to display for this specific dish (dynamically computed per dish with local persistence fallback)
  const activeHighlights = (() => {
    if (!dish) return []
    let selectedKeys = dish.highlights
    if (!Array.isArray(selectedKeys) && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`hashousha_dish_highlights_${dish.id}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed)) selectedKeys = parsed
        }
      } catch {}
    }

    return HIGHLIGHT_CONFIG
      .filter((item) => {
        if (Array.isArray(selectedKeys)) {
          return selectedKeys.includes(item.key)
        }
        // Legacy fallback: show all 4 if dish was never explicitly customized
        return true
      })
      .map((item) => ({
        key: item.key,
        label: t(item.uiKey, item.defaultLabel),
      }))
  })()

  // PushState URL synchronization, Canonical Tag & Breadcrumb Schema management
  useEffect(() => {
    if (isOpen && dish) {
      const slug = dish.slug || dish.id
      const newPath = `/dish/${slug}`
      if (window.location.pathname !== newPath) {
        window.history.pushState({ modalDishId: dish.id }, '', newPath)
      }
      const cLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (cLink) {
        cLink.setAttribute('href', `https://hshosha.com/dish/${slug}`)
      }
      // Inject BreadcrumbList for this modal dish
      injectJsonLd('dish-breadcrumb-schema', getBreadcrumbSchema(getDishBreadcrumbs(dish.name, slug)))
    } else if (!isOpen) {
      removeJsonLd('dish-breadcrumb-schema')
      const cLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (cLink && !window.location.pathname.startsWith('/dish/')) {
        cLink.setAttribute('href', 'https://hshosha.com/')
      }
    }
  }, [isOpen, dish])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleShare = async () => {
    if (!dish) return
    const shareUrl = `${window.location.origin}/dish/${dish.slug || dish.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dish.name} | هشوشة`,
          text: dish.description,
          url: shareUrl,
        })
      } catch {
        // User cancelled or share not supported
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && dish && (
        <motion.div
          key="product-detail-dialog-root"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
          dir="rtl"
        >
          <motion.div
            variants={modalDialogVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[92vh] rounded-3xl border border-primary/20 bg-card text-foreground shadow-2xl z-10 flex flex-col font-sans overflow-hidden"
          >
            <div className="overflow-y-auto flex-1 relative flex flex-col">
              {/* Compact Header Lockup with Square Thumbnail, Details & Actions */}
              <div className="relative flex items-start gap-3 sm:gap-5 p-3.5 sm:p-6 border-b border-primary/15">
                {/* Square Thumbnail Box */}
                <div className="relative size-20 sm:size-28 md:size-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-primary/20 bg-secondary/60 shadow-md">
                  {!imgLoaded && (
                    <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
                  )}
                  <img
                    src={dish.image || '/images/warak-enab.png'}
                    alt={getOptimizedDishImageAlt(dish)}
                    onLoad={() => setImgLoaded(true)}
                    className={cn(
                      'relative z-10 h-full w-full object-cover transition-transform duration-500 hover:scale-105',
                      !imgLoaded ? 'opacity-0' : 'opacity-100',
                      !dish.inStock && 'grayscale opacity-75'
                    )}
                  />
                  {!dish.inStock && (
                    <div className="absolute inset-x-0 bottom-0 bg-rose-950/90 text-rose-200 text-[9px] sm:text-[10px] font-bold text-center py-0.5 z-20">
                      {t('dishModal.soldOutBtn', 'نفد اليوم')}
                    </div>
                  )}
                </div>

                {/* Header Text & Metrics Lockup */}
                <div className="flex flex-col min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                  <div className="space-y-0.5 pl-16 sm:pl-0">
                    {dish.englishName && (
                      <p dir="ltr" className="text-right font-serif text-[9px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.2em] text-primary uppercase font-bold truncate">
                        {dish.englishName}
                      </p>
                    )}
                    <h2 className="text-base sm:text-2xl font-black text-foreground tracking-tight leading-snug">
                      {dish.name}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                    <span className="text-base sm:text-xl font-black text-primary">
                      {formatPrice(activePrice)}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md sm:rounded-lg border border-primary/15 font-medium whitespace-nowrap">
                      {activeVariant ? activeVariant.name : dish.unit}
                    </span>
                    {activeServingInfo && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md sm:rounded-lg border border-primary/20 whitespace-nowrap">
                        <Users className="size-2.5 sm:size-3 shrink-0" />
                        <span>{activeServingInfo}</span>
                      </span>
                    )}
                  </div>

                  {/* Badges if present */}
                  {dish.badges.length > 0 && (
                    <ul className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                      {dish.badges.map((kind) => {
                        const cfg = getBadgeDisplayConfig(kind)
                        const { label, Icon, className, iconColor } = cfg
                        return (
                          <li
                            key={kind}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold shadow-xs whitespace-nowrap',
                              className
                            )}
                          >
                            <Icon
                              className={cn('size-2.5 sm:size-3 shrink-0', iconColor)}
                              aria-hidden="true"
                              fill={kind === 'popular' ? 'currentColor' : 'none'}
                            />
                            <span>{label}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {/* Top Action Buttons (Share & Close) */}
                <div className="flex items-center gap-1.5 shrink-0 self-start absolute top-3 left-3 sm:relative sm:top-auto sm:left-auto z-20">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-secondary/80 text-foreground border border-primary/20 shadow-xs hover:bg-secondary hover:text-primary transition-all active:scale-95 cursor-pointer"
                    title="مشاركة رابط الطبق"
                    aria-label="مشاركة"
                  >
                    {copied ? <Check className="size-3.5 sm:size-4 text-emerald-600" /> : <Share2 className="size-3.5 sm:size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-secondary/80 text-foreground border border-primary/20 shadow-xs hover:bg-secondary hover:text-primary transition-all active:scale-95 cursor-pointer"
                    aria-label="إغلاق النافذة"
                    title="إغلاق"
                  >
                    <X className="size-3.5 sm:size-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">

          {/* Multi-Size Variant Selector */}
          {dish.variants && dish.variants.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                اختر الحجم المناسب لضيافتكم:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {dish.variants.map((v) => {
                  const isSelected = v.id === (activeVariant?.id ?? dish.variants![0].id)
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 rounded-2xl border text-right transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-sm"
                          : "border-border bg-card/60 hover:bg-secondary/60 hover:border-primary/40 text-muted-foreground"
                      )}
                    >
                      <span className="text-xs font-black text-foreground">{v.name}</span>
                      <span className="text-xs font-extrabold text-primary">{formatPrice(v.price)}</span>
                      {v.servingInfo && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Users className="size-3" />
                          <span>{v.servingInfo}</span>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Detailed Culinary Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('dishModal.aboutTitle', 'عن هذا الطبق الفاخر')}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
              {dish.description}
            </p>
          </div>

          {/* Rich Story & Hospitality Serving Tip */}
          <div className="rounded-2xl border border-primary/20 bg-secondary/35 p-4 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Sparkles className="size-4" />
                <span>{t('dishModal.storyTitle', 'قصة الصنع والتحضير')}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-normal">
                {dish.longDescription || dish.description}
              </p>
            </div>

            {/* Serving / Preparation Tip Note (Controlled per dish) */}
            {dish.showPreparationTip !== false && (
              <div className="rounded-xl border border-primary/15 bg-background/80 p-3 flex items-start gap-2.5 text-xs">
                <UtensilsCrossed className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-primary text-[11px]">
                    {t('dishModal.servingTipTitle', 'طريقة التقديم الفندقية المقترحة:')}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
                    {dish.preparationTip?.trim() ||
                      t(
                        'dishModal.servingTipText',
                        'يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.'
                      )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Culinary Highlights / Quality Guarantee (Controlled per dish) */}
          {activeHighlights.length > 0 && (
            <div
              className={cn(
                'p-4 rounded-2xl bg-secondary/50 border border-primary/10 text-xs transition-all',
                activeHighlights.length === 1 ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-2 gap-3'
              )}
            >
              {activeHighlights.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-foreground/80">
                  <span className="size-2 rounded-full bg-primary shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-primary/10">
            <div className="w-full sm:w-auto">
              {!dish.inStock ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-xs font-bold text-rose-700">
                  {t('dishModal.soldOutBtn', 'نعتذر، انتهت كمية هذا الطبق لليوم')}
                </div>
              ) : quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => add(dish.id, activeVariant?.id)}
                  className="w-full sm:w-auto min-w-[200px] flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/95 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>{t('dishModal.addToCartBtn', 'أضف للطلب')} ({formatPrice(activePrice)})</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex min-h-[48px] items-center gap-2 rounded-2xl bg-primary px-3 py-1 text-primary-foreground shadow-md">
                    <button
                      type="button"
                      onClick={() => add(dish.id, activeVariant?.id)}
                      aria-label="زيادة"
                      className="flex size-9 items-center justify-center rounded-xl bg-background/20 hover:bg-background/30 transition-colors cursor-pointer"
                    >
                      <Plus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center text-base font-extrabold" aria-live="polite">
                      {quantity.toLocaleString('ar-SA')}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(dish.id, activeVariant?.id)}
                      aria-label="إنقاص"
                      className="flex size-9 items-center justify-center rounded-xl bg-background/20 hover:bg-background/30 transition-colors cursor-pointer"
                    >
                      <Minus className="size-4" />
                    </button>
                  </div>

                  {onOpenCart && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onOpenCart()
                      }}
                      className="flex min-h-[48px] items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <ShoppingBag className="size-4" />
                      <span>عرض السلة</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="size-4" />
              <span>متابعة تصفح المنيو</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}
</AnimatePresence>
)
}
