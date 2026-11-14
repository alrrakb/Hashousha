import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Plus,
  Minus,
  Star,
  Sparkles,
  ShoppingBag,
  Truck,
  Check,
  Share2,
  Users,
  UtensilsCrossed,
  Leaf,
  Gift,
  Award,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react'
import { Dish } from '../../../types/menu'
import { AdminReview } from '../../../types/admin'
import { dishes as defaultDishes, formatPrice } from '../../../data/menu'
import { useCart } from '../../cart-context'
import { fetchDishesFromSupabase, fetchReviewsForDish, submitCustomerReview } from '../../../services/adminService'
import { ProductLandingSkeleton } from './StorefrontSkeletons'
import { ThemeToggle } from '../../common/ThemeToggle'
import { getBadgeDisplayConfig } from '../../../services/badgeService'
import { useSiteContent } from '../../../context/SiteContentContext'
import { cn } from '../../../lib/utils'
import {
  injectJsonLd,
  removeJsonLd,
  getBreadcrumbSchema,
  getDishBreadcrumbs,
  getDishProductSchema,
} from '../../../utils/seoSchemas'
import { getOptimizedDishImageAlt } from '../../../utils/imageSeo'

const HIGHLIGHT_CONFIG = [
  { key: 'fresh', uiKey: 'dishModal.highlightFresh', defaultLabel: 'تحضير طازج يومياً بالرياض' },
  { key: 'ingredients', uiKey: 'dishModal.highlightIngredients', defaultLabel: 'زيت زيتون بكر ودبس رمان أصلي' },
  { key: 'packaging', uiKey: 'dishModal.highlightPackaging', defaultLabel: 'تغليف حراري مخصص للجمعات' },
  { key: 'delivery', uiKey: 'dishModal.highlightDelivery', defaultLabel: 'توصيل فوري بسيارات مجهزة' },
] as const

export interface ProductLandingPageProps {
  slug: string
  onNavigateHome: () => void
  onOpenCheckout?: () => void
}

export const ProductLandingPage: React.FC<ProductLandingPageProps> = ({
  slug,
  onNavigateHome,
  onOpenCheckout,
}) => {
  const { t } = useSiteContent()
  const { quantities, add, remove, totalItems, totalPrice } = useCart()
  const [allDishes, setAllDishes] = useState<Dish[]>(defaultDishes)
  const [dish, setDish] = useState<Dish | null>(() => {
    // Find initial match from local default menu
    return (
      defaultDishes.find((d) => d.slug === slug || d.id === slug) ||
      defaultDishes[0]
    )
  })
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    return dish?.variants && dish.variants.length > 0 ? dish.variants[0].id : ''
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  // Sync selected variant when dish changes
  useEffect(() => {
    if (dish?.variants && dish.variants.length > 0) {
      setSelectedVariantId(dish.variants[0].id)
    } else {
      setSelectedVariantId('')
    }
  }, [dish?.id])

  // Culinary Highlights to display for this specific dish (with local persistence fallback)
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
        return true
      })
      .map((item) => ({
        key: item.key,
        label: t(item.uiKey, item.defaultLabel),
      }))
  })()

  // Reviews State
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true)
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false)
  const [reviewName, setReviewName] = useState<string>('')
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false)
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null)
  const [reviewErrorMsg, setReviewErrorMsg] = useState<string | null>(null)

  // Fetch reviews for active dish
  useEffect(() => {
    if (!dish) return
    let isMounted = true
    setLoadingReviews(true)

    fetchReviewsForDish(dish.id).then((cloudReviews) => {
      if (!isMounted) return
      if (cloudReviews && cloudReviews.length > 0) {
        setReviews(cloudReviews)
      } else {
        // Fallback signature reviews
        setReviews([
          {
            id: 'fallback-1',
            dishId: dish.id,
            dishName: dish.name,
            customerName: 'سارة العتيبي',
            rating: 5,
            comment: 'البابكا خيالية بكل ما تعنيه الكلمة، العجينة هشة وطرية وحشوة غنية ومحمصة بإتقان. بيّض وجهي بجمعة الأهل!',
            isPublished: true,
            createdAt: '2026-10-03T18:00:00Z',
          },
          {
            id: 'fallback-2',
            dishId: dish.id,
            dishName: dish.name,
            customerName: 'م. سلطان الدوسري',
            rating: 5,
            comment: 'طعم أصيل ومستوى مخابز حرفية عالمية، طراوة العجين والنكهة خرافية والتوصيل وصل طازج وفاخر يليق بالضيافة.',
            isPublished: true,
            createdAt: '2026-09-30T18:00:00Z',
          },
          {
            id: 'fallback-3',
            dishId: dish.id,
            dishName: dish.name,
            customerName: 'نورة السبيعي',
            rating: 5,
            comment: 'من أروع وألذ المخبوزات الحرفية في الرياض، البابكا مميزة ومثالية للجمعات الصباحية والمسائية. صار خيارنا المعتمد دائماً.',
            isPublished: true,
            createdAt: '2026-09-28T18:00:00Z',
          },
        ])
      }
      setLoadingReviews(false)
    })

    return () => {
      isMounted = false
    }
  }, [dish?.id, dish?.name])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dish) return
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewErrorMsg('يرجى كتابة اسمك الكريم ورأيك في التجربة')
      return
    }

    setIsSubmittingReview(true)
    setReviewErrorMsg(null)

    const res = await submitCustomerReview({
      dishId: dish.id,
      dishName: dish.name,
      customerName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    })

    setIsSubmittingReview(false)

    if (res.success && res.data) {
      setReviews((prev) => [res.data!, ...prev])
      setReviewSuccessMsg('شكراً لذوقك الرفيع! تم تسجيل تقييمك بنجاح 🌿')
      setReviewName('')
      setReviewRating(5)
      setReviewComment('')
      setTimeout(() => {
        setIsReviewFormOpen(false)
        setReviewSuccessMsg(null)
      }, 2500)
    } else {
      setReviewErrorMsg(res.error || 'حدث خطأ أثناء حفظ التقييم، يرجى المحاولة لاحقاً')
    }
  }

  const formatReviewDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
    } catch {
      return 'مؤخراً'
    }
  }

  // Perceptible luxury presentation window for landing page
  useEffect(() => {
    setInitialLoading(true)
    setImgLoaded(false)
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [slug])

  // Fetch fresh dishes from Supabase to match custom slug
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetchDishesFromSupabase()
      .then((cloudDishes) => {
        if (!isMounted) return
        if (cloudDishes && cloudDishes.length > 0) {
          setAllDishes(cloudDishes)
        }
        const found = cloudDishes.find((d) => d.slug === slug || d.id === slug)
        if (found) {
          setDish(found)
        } else {
          // Check default dishes
          const defaultFound = defaultDishes.find(
            (d) => d.slug === slug || d.id === slug
          )
          if (defaultFound) setDish(defaultFound)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  // Inject Document Title, Meta OpenGraph, and JSON-LD Rich Snippet
  useEffect(() => {
    if (!dish) return

    const pageTitle = `${dish.name} (${dish.englishName}) | متجر هشوشة للبابكا الحرفية والمخبوزات الفاخرة بالرياض`
    document.title = pageTitle

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', dish.description)

    // Update Canonical URL dynamically to prevent duplicate content
    const dishCanonical = `https://hshosha.com/dish/${dish.slug || dish.id}`
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', dishCanonical)

    // Dynamic OpenGraph & Twitter Meta Tags for rich sharing
    const fullDishImage = dish.image
      ? (dish.image.startsWith('http') ? dish.image : `https://hshosha.com${dish.image.startsWith('/') ? '' : '/'}${dish.image}`)
      : 'https://hshosha.com/images/brand-og.jpg'

    const updateOrCreateMeta = (attr: 'property' | 'name', attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attr}="${attrVal}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, attrVal)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    updateOrCreateMeta('property', 'og:title', pageTitle)
    updateOrCreateMeta('name', 'twitter:title', pageTitle)
    updateOrCreateMeta('property', 'og:description', dish.description)
    updateOrCreateMeta('name', 'twitter:description', dish.description)
    updateOrCreateMeta('property', 'og:image', fullDishImage)
    updateOrCreateMeta('property', 'og:image:secure_url', fullDishImage)
    updateOrCreateMeta('name', 'twitter:image', fullDishImage)
    updateOrCreateMeta('property', 'og:url', dishCanonical)

    // Inject Product JSON-LD Schema (Google Merchant Listings 2026 Compliant)
    const ldJsonScriptId = 'product-jsonld-schema'
    injectJsonLd(ldJsonScriptId, getDishProductSchema(dish, dishCanonical))

    // Inject BreadcrumbList Schema for this dish
    const dishBreadcrumbs = getDishBreadcrumbs(dish.name, dish.slug || dish.id)
    injectJsonLd('dish-breadcrumb-schema', getBreadcrumbSchema(dishBreadcrumbs))

    return () => {
      // Cleanup custom JSON-LD when unmounting
      removeJsonLd(ldJsonScriptId)
      removeJsonLd('dish-breadcrumb-schema')

      // Restore default canonical URL
      const cLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (cLink) {
        cLink.setAttribute('href', 'https://hshosha.com/')
      }
    }
  }, [dish])

  if (initialLoading || (loading && !dish)) {
    return <ProductLandingSkeleton />
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
        <h2 className="text-2xl font-black text-foreground">الطبق غير متوفر حالياً</h2>
        <p className="mt-2 text-xs text-muted-foreground">ربما تم تغيير رابط الطبق أو إزالته من القائمة.</p>
        <button
          type="button"
          onClick={onNavigateHome}
          className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md"
        >
          العودة لقائمة أطباق هشوشة
        </button>
      </div>
    )
  }

  const activeVariant = dish?.variants?.find((v) => v.id === selectedVariantId) ?? dish?.variants?.[0]
  const activePrice = activeVariant ? activeVariant.price : dish.price
  const activeServingInfo = activeVariant?.servingInfo ?? dish.servingInfo ?? 'تكفي ٤-٦ أشخاص'
  const lineKey = activeVariant ? `${dish.id}__${activeVariant.id}` : dish.id
  const quantity = quantities[lineKey] ?? 0

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dish.name} | هشوشة`,
          text: dish.description,
          url,
        })
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground"
      dir="rtl"
    >
      {/* Luxury Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ArrowRight className="size-4" />
          <span>{t('landing.backToCatalog', 'تصفح كامل أطباق هشوشة')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Hotel-Grade Theme Toggle */}
          <ThemeToggle variant="round" className="size-9" iconSize={16} />

          <button
            type="button"
            onClick={handleShare}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
            title="مشاركة رابط الطبق"
            aria-label="مشاركة"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Share2 className="size-4" />}
          </button>

          {totalItems > 0 && onOpenCheckout && (
            <button
              type="button"
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all"
            >
              <ShoppingBag className="size-3.5" />
              <span>السلة ({totalItems})</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Product Showcase */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-40 sm:pt-12 sm:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Photography Column */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-primary/20 shadow-2xl bg-[#ebdccb]">
              {!imgLoaded && (
                <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
              )}
              <img
                src={dish.image || '/images/warak-enab.png'}
                alt={getOptimizedDishImageAlt(dish)}
                onLoad={() => setImgLoaded(true)}
                className={cn(
                  'relative z-10 h-full w-full object-cover transition-all duration-700 hover:scale-105',
                  !imgLoaded ? 'opacity-0' : 'opacity-100',
                  !dish.inStock && 'grayscale opacity-75'
                )}
              />

              <ul className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
                {!dish.inStock && (
                  <li className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold bg-[#4c0519]/95 text-[#fecdd3] backdrop-blur-md border border-rose-500/50 shadow-md">
                    نفد اليوم
                  </li>
                )}
                {dish.badges.map((kind) => {
                  const cfg = getBadgeDisplayConfig(kind)
                  const { label, Icon, className, iconColor } = cfg
                  return (
                    <li
                      key={kind}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-md',
                        className
                      )}
                    >
                      <Icon
                        className={cn('size-3.5 shrink-0', iconColor)}
                        aria-hidden="true"
                        fill={kind === 'popular' ? 'currentColor' : 'none'}
                      />
                      <span>{label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Royal Hospitality Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-card border border-primary/15 shadow-sm text-center">
              <div className="space-y-1 p-2 rounded-xl bg-background/60 border border-border/50">
                <Leaf className="size-4 sm:size-5 text-primary mx-auto" />
                <p className="text-[11px] font-bold text-foreground">طهي طازج يومياً</p>
                <p className="text-[9px] text-muted-foreground leading-tight">تحضير يدوي بمكونات طبيعية وزيوت بكر</p>
              </div>
              <div className="space-y-1 p-2 rounded-xl bg-background/60 border border-border/50">
                <Truck className="size-4 sm:size-5 text-primary mx-auto" />
                <p className="text-[11px] font-bold text-foreground">توصيل مجهز ومبرد</p>
                <p className="text-[9px] text-muted-foreground leading-tight">سيارات مبردة لحفظ طراوة الأطباق بالرياض</p>
              </div>
              <div className="space-y-1 p-2 rounded-xl bg-background/60 border border-border/50">
                <Gift className="size-4 sm:size-5 text-primary mx-auto" />
                <p className="text-[11px] font-bold text-foreground">تغليف الضيافة والإهداء</p>
                <p className="text-[9px] text-muted-foreground leading-tight">صواني وبوكسات فاخرة مهيأة للتقديم المباشر</p>
              </div>
              <div className="space-y-1 p-2 rounded-xl bg-background/60 border border-border/50">
                <Award className="size-4 sm:size-5 text-primary mx-auto" />
                <p className="text-[11px] font-bold text-foreground">ضمان الذائقة الفاخرة</p>
                <p className="text-[9px] text-muted-foreground leading-tight">توازن لا يُضاهى في الحموضة واللذاذة</p>
              </div>
            </div>
          </div>

          {/* Details & Ordering Column */}
          <div className="space-y-5">
            <div className="space-y-2 border-b border-primary/10 pb-5">
              <p dir="ltr" className="text-right font-serif text-xs tracking-[0.25em] text-primary uppercase font-bold">
                {dish.englishName}
              </p>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {dish.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-3xl font-black text-primary">
                  {formatPrice(activePrice)}
                </span>
                <span className="text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-xl border border-primary/10">
                  {activeVariant ? activeVariant.name : dish.unit}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                  <Users className="size-3.5" />
                  <span>{activeServingInfo}</span>
                </span>
              </div>

              {/* Multi-Size Variant Selector Pills */}
              {dish.variants && dish.variants.length > 0 && (
                <div className="space-y-2 pt-3">
                  <p className="text-xs font-bold text-muted-foreground">اختر الحجم المناسب لضيافتكم:</p>
                  <div className="flex flex-wrap gap-2">
                    {dish.variants.map((v) => {
                      const isSelected = v.id === (activeVariant?.id ?? dish.variants![0].id)
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                              : "border-primary/20 bg-card text-foreground/80 hover:bg-secondary hover:border-primary/40 shadow-xs"
                          )}
                        >
                          <span>{v.name}</span>
                          <span className={cn(
                            "text-[11px] font-extrabold",
                            isSelected ? "text-primary-foreground/90" : "text-primary"
                          )}>
                            ({formatPrice(v.price)})
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Culinary Story & Secret Craft */}
            <div className="rounded-2xl border border-primary/20 bg-card p-5 space-y-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Sparkles className="size-4" />
                  <span>{t('landing.storyTitle', 'قصة الطبق وسر التحضير الحرفي')}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-normal">
                  {dish.longDescription || dish.description}
                </p>
              </div>

              {/* Hotel-Grade Hospitality Serving Tip (Controlled per dish) */}
              {dish.showPreparationTip !== false && (
                <div className="rounded-xl border border-primary/15 bg-secondary/60 p-3.5 flex items-start gap-2.5 text-xs">
                  <UtensilsCrossed className="size-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-primary text-[11px]">
                      {t('landing.servingTipTitle', 'سر التقديم الفندقي لضيوفكم:')}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
                      {dish.preparationTip?.trim() ||
                        t(
                          'landing.servingTipText',
                          'يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر وحبوب الرمان الطازجة.'
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

            {/* Riyadh Delivery Note */}
            <div className="rounded-2xl border border-primary/20 bg-secondary/40 p-3.5 text-xs text-foreground/80 space-y-1">
              <p className="font-bold text-primary text-[11px]">
                {t('landing.deliveryTitle', 'التوصيل متوفر لجميع أحياء الرياض:')}
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('landing.deliveryText', 'الملقا، حطين، النرجس، الياسمين، الصحافة، الغدير، العليا، السليمانية، الروضة، وكافة الأحياء الأخرى مع خيارات الدفع عند الاستلام، أبل باي، ومدى.')}
              </p>
            </div>

            {/* Ordering CTA */}
            <div className="space-y-4 pt-1">
              {!dish.inStock ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-bold text-rose-700">
                  نعتذر، انتهت كمية هذا الطبق لليوم
                </div>
              ) : quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => add(dish.id, activeVariant?.id)}
                  className="w-full flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-base font-extrabold text-primary-foreground shadow-lg hover:bg-primary/95 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Plus className="size-5" />
                  <span>أضف للطلب ({formatPrice(activePrice)})</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-auto flex min-h-[52px] items-center justify-between gap-4 rounded-2xl bg-primary px-4 py-2 text-primary-foreground shadow-lg">
                    <button
                      type="button"
                      onClick={() => add(dish.id, activeVariant?.id)}
                      aria-label="زيادة"
                      className="flex size-10 items-center justify-center rounded-xl bg-background/20 hover:bg-background/30 transition-colors cursor-pointer"
                    >
                      <Plus className="size-5" />
                    </button>
                    <span className="min-w-10 text-center text-lg font-extrabold" aria-live="polite">
                      {quantity.toLocaleString('ar-SA')}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(dish.id, activeVariant?.id)}
                      aria-label="إنقاص"
                      className="flex size-10 items-center justify-center rounded-xl bg-background/20 hover:bg-background/30 transition-colors cursor-pointer"
                    >
                      <Minus className="size-5" />
                    </button>
                  </div>

                  {onOpenCheckout && (
                    <button
                      type="button"
                      onClick={onOpenCheckout}
                      className="w-full sm:flex-1 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-card px-6 py-3.5 text-sm font-extrabold text-primary hover:bg-primary hover:text-white transition-all shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="size-4" />
                      <span>إتمام الطلب الآن ({formatPrice(totalPrice + 20)})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Verified Riyadh Customer Reviews */}
        <section className="mt-12 sm:mt-16 pt-10 border-t border-primary/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {t('landing.reviewsTitle', 'آراء وتجارب ذواقة الرياض')}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t('landing.reviewsSubtitle', 'تجارب حقيقية لعملاء وثقوا بضيافة هشوشة في جمعاتهم ومناسباتهم الخاصة')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-2xl border border-primary/20 shadow-sm">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-black text-foreground">٤٫٩ من ٥</span>
                <span className="text-xs text-muted-foreground">
                  ({reviews.length > 0 ? reviews.length : 3} تقييمات موثقة)
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsReviewFormOpen(!isReviewFormOpen)
                  setReviewErrorMsg(null)
                }}
                className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>{t('landing.addReviewBtn', 'شاركنا تجربتك وتقييمك للطبق ✍️')}</span>
              </motion.button>
            </div>
          </div>

          {/* Interactive 3-Field Review Submission Form */}
          <AnimatePresence>
            {isReviewFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleSubmitReview}
                  className="rounded-3xl border border-primary/25 bg-card p-5 sm:p-6 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌿</span>
                      <h3 className="text-sm sm:text-base font-black text-foreground">
                        مشاركة تقييمك لـ {dish.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                      aria-label="إغلاق النموذج"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {reviewSuccessMsg && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 text-center animate-in fade-in-50">
                      {reviewSuccessMsg}
                    </div>
                  )}

                  {reviewErrorMsg && (
                    <div className="rounded-xl border border-red-500/30 bg-red-50 p-3 text-xs font-bold text-red-800 text-center animate-in fade-in-50">
                      {reviewErrorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Field 1: Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        اسمك الكريم <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="مثال: نورة السبيعي / فهد الدوسري"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Field 2: Rating (5 clickable stars) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        تقييمك للطبق <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="size-9 sm:size-10 flex items-center justify-center rounded-xl bg-background border border-border/80 hover:border-amber-400 transition-colors cursor-pointer"
                            aria-label={`${star} نجوم`}
                          >
                            <Star
                              className={cn(
                                'size-4 sm:size-5 transition-colors',
                                (hoverRating || reviewRating) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/40'
                              )}
                            />
                          </motion.button>
                        ))}
                        <span className="text-xs font-black text-amber-600 mr-2">
                          {reviewRating} من ٥
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Field 3: Comment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      رأيك وتجربتك مع المذاق والتقديم <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="اكتب رأيك الصادق في جودة المكونات، الطعم، وتجربة الضيافة..."
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingReview && <Loader2 className="size-3.5 animate-spin" />}
                      <span>إرسال التقييم الآن 🌿</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Review Cards Grid */}
          {loadingReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-primary/15 bg-card p-5 space-y-3">
                  <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
                  <div className="h-12 w-full bg-muted/40 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-muted/60 rounded animate-pulse pt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-primary/15 bg-card p-5 space-y-3 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'size-3.5',
                              i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            )}
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                        <CheckCircle2 className="size-3" />
                        <span>{t('landing.verifiedBadge', 'عميل موثّق 🌿')}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                      "{r.comment}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{r.customerName}</span>
                    <span className="text-[11px] text-muted-foreground">{formatReviewDate(r.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section: Complementary Upsells: يكمل جمعتكم */}
        <section className="mt-12 sm:mt-16 pt-10 border-t border-primary/15 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold">
              <Sparkles className="size-4" />
              <span>إضافات مثالية لسفرتكم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
              {t('landing.pairingsTitle', 'يكمل جمعتكم (أطباق متناغمة)')}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              أصناف تم اختيارها بعناية لتكتمل بها روعة المائدة وتنوع الضيافة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(allDishes.length > 0 ? allDishes : defaultDishes)
              .filter((d) => d.id !== dish.id)
              .slice(0, 3)
              .map((item) => {
                const itemQty = quantities[item.id] ?? 0
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-2xl border border-primary/15 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#ebdccb]">
                        <img
                          src={item.image || '/images/warak-enab.png'}
                          alt={getOptimizedDishImageAlt(item)}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2.5 right-2.5 text-[11px] font-bold bg-[#fdfbf7]/95 text-[#2e1e0d] px-2.5 py-1 rounded-full border border-[#9e774c]/40 shadow-md backdrop-blur-sm">
                          {item.unit}
                        </span>
                      </div>

                      <div>
                        <p dir="ltr" className="text-right font-serif text-[10px] tracking-wider text-primary font-bold">
                          {item.englishName}
                        </p>
                        <h3 className="text-sm font-extrabold text-foreground line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-base font-extrabold text-foreground">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-semibold">
                          {item.unit}
                        </span>
                      </div>

                      <AnimatePresence mode="wait" initial={false}>
                        {itemQty === 0 ? (
                          <motion.button
                            key="add-btn"
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", damping: 20, stiffness: 350 }}
                            type="button"
                            onClick={() => add(item.id)}
                            className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-primary bg-transparent px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                            <span>أضف للطلب</span>
                          </motion.button>
                        ) : (
                          <motion.div
                            key="stepper"
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20, stiffness: 350 }}
                            className="flex min-h-[44px] items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground shadow-sm"
                            role="group"
                            aria-label={`كمية ${item.name}`}
                          >
                            <motion.button
                              whileTap={{ scale: 0.84 }}
                              type="button"
                              onClick={() => add(item.id)}
                              aria-label="زيادة"
                              className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35 cursor-pointer"
                            >
                              <Plus className="size-3.5" />
                            </motion.button>

                            <motion.span
                              key={itemQty}
                              initial={{ scale: 0.7, y: -2 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 18 }}
                              className="min-w-6 text-center text-xs font-bold inline-block"
                              aria-live="polite"
                            >
                              {itemQty.toLocaleString("ar-SA")}
                            </motion.span>

                            <motion.button
                              whileTap={{ scale: 0.84 }}
                              type="button"
                              onClick={() => remove(item.id)}
                              aria-label="إنقاص"
                              className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35 cursor-pointer"
                            >
                              <Minus className="size-3.5" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      </main>
    </motion.div>
  )
}
