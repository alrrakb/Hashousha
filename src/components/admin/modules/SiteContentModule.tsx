import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Image as ImageIcon,
  Type,
  Search,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Save,
  RefreshCw,
  ExternalLink,
  ChefHat,
  Droplets,
  Gift,
  Truck,
  Sliders,
  ChevronDown,
  ShoppingBag,
  CreditCard,
  UtensilsCrossed,
  FileText,
  RotateCcw,
  CheckCircle2,
  Tag,
  X,
  Building2,
  MessageCircle,
  Copy,
  ShieldCheck,
  Palette,
  Sun,
  Moon,
} from 'lucide-react'
import {
  SiteContentSettings,
  DEFAULT_SITE_CONTENT,
  DEFAULT_UI_STRINGS,
  BrandPillarItem,
  THEME_PRESETS,
  DEFAULT_THEME_COLORS,
  ThemePreset,
  ThemeColorPalette,
} from '../../../types/admin'
import { fetchSiteContent, saveSiteContent, uploadDishImage } from '../../../services/adminService'
import { optimizeImageToWebp, OPTIMIZER_PRESETS, formatFileSize } from '../../../utils/imageOptimizer'
import { cn } from '../../../lib/utils'

interface AdvancedField {
  key: string
  label: string
  placeholder: string
  hint?: string
}

interface AdvancedGroup {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  fields: AdvancedField[]
}

const ADVANCED_GROUPS: AdvancedGroup[] = [
  {
    id: 'cart-orderbar',
    title: 'نصوص السلة وشريط الطلب (Cart & OrderBar)',
    icon: ShoppingBag,
    description: 'نصوص شريط الطلب السفلي العائم، عداد الأصناف، ورمز العملة',
    fields: [
      { key: 'orderBar.checkoutBtn', label: 'زر إتمام الطلب الرئيسي', placeholder: 'إتمام الطلب' },
      { key: 'orderBar.itemsSuffix', label: 'لاحقة عدد الأصناف في السلة', placeholder: 'أصناف' },
      { key: 'orderBar.currency', label: 'رمز العملة النقدية', placeholder: 'ر.س' },
    ],
  },
  {
    id: 'checkout-form',
    title: 'نافذة إتمام الطلب وحقول البيانات (Checkout Modal & Form)',
    icon: FileText,
    description: 'عناوين ترويسة نافذة الطلب وتسميات حقول العميل ونصوص الإرشاد (Placeholders)',
    fields: [
      { key: 'checkout.modalTitle', label: 'عنوان نافذة الطلب الرئيسي', placeholder: 'إتمام الطلب الفاخر' },
      { key: 'checkout.modalSubtitle', label: 'السطر الوصفي تحت العنوان', placeholder: 'مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض' },
      { key: 'checkout.summaryTitle', label: 'عنوان ملخص السلة بالنافذة', placeholder: 'ملخص محتويات الطلب' },
      { key: 'checkout.recipientHeader', label: 'عنوان ترويسة قسم بيانات المستلم', placeholder: 'بيانات المستلم وعنوان التوصيل في الرياض' },
      { key: 'checkout.nameLabel', label: 'تسمية حقل الاسم', placeholder: 'الاسم الكريم' },
      { key: 'checkout.namePlaceholder', label: 'نص إرشاد حقل الاسم (Placeholder)', placeholder: 'مثال: سارة العبدالله' },
      { key: 'checkout.phoneLabel', label: 'تسمية حقل رقم الجوال', placeholder: 'رقم الجوال (واتساب)' },
      { key: 'checkout.phonePlaceholder', label: 'نص إرشاد الجوال (Placeholder)', placeholder: '05XXXXXXXX' },
      { key: 'checkout.phoneHelper', label: 'إرشاد تحديثات المندوب أسفل الجوال', placeholder: 'سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم' },
      { key: 'checkout.districtLabel', label: 'تسمية حقل الحي بالرياض', placeholder: 'الحي السكني بالرياض' },
      { key: 'checkout.districtPlaceholder', label: 'نص إرشاد الحي (Placeholder)', placeholder: 'اختر حيك السكني أو ابحث عنه...' },
      { key: 'checkout.districtNotice', label: 'إشعار توصيل كافة أحياء الرياض', placeholder: 'توصيل لجميع أحياء الرياض' },
      { key: 'checkout.districtSelectDefault', label: 'الخيار الافتراضي بقائمة الأحياء', placeholder: '-- اختر حي التوصيل --' },
      { key: 'checkout.addressLabel', label: 'تسمية تفاصيل العنوان والمعلم', placeholder: 'العنوان بالتفصيل / معلم بارز' },
      { key: 'checkout.addressPlaceholder', label: 'نص إرشاد العنوان (Placeholder)', placeholder: 'اسم الشارع، رقم المبنى، أو معلم قريب...' },
      { key: 'checkout.notesLabel', label: 'تسمية ملاحظات الطلب والضيافة', placeholder: 'ملاحظات خاصة بالضيافة أو التوصيل' },
      { key: 'checkout.notesPlaceholder', label: 'نص إرشاد الملاحظات (Placeholder)', placeholder: 'حرارة الشطة، توقيت التسليم، إهداء خاص...' },
    ],
  },
  {
    id: 'payment-summary',
    title: 'طرق الدفع وكوبونات الخصم والملخص (Payment & Summary)',
    icon: CreditCard,
    description: 'خيارات الدفع (استلام / تحويل)، خانات كود الخصم، وتسميات تفاصيل الفاتورة المالية',
    fields: [
      { key: 'checkout.paymentMethodHeader', label: 'عنوان ترويسة اختيار طريقة الدفع', placeholder: 'طريقة الدفع المفضلة' },
      { key: 'checkout.paymentCodTitle', label: 'عنوان الدفع عند الاستلام', placeholder: 'الدفع عند الاستلام' },
      { key: 'checkout.paymentCodSubtitle', label: 'وصف الدفع عند الاستلام', placeholder: 'نقداً أو عبر بطاقة مدى عند استلام الطلب' },
      { key: 'checkout.paymentTransferTitle', label: 'عنوان التحويل البنكي', placeholder: 'تحويل بنكي مباشر' },
      { key: 'checkout.paymentTransferSubtitle', label: 'وصف التحويل البنكي', placeholder: 'حساب الراجحي أو الأهلي (إرفاق الإشعار)' },
      { key: 'checkout.couponLabel', label: 'تسمية حقل كود الخصم', placeholder: 'كوبون الخصم:' },
      { key: 'checkout.couponPlaceholder', label: 'نص إرشاد كود الخصم (Placeholder)', placeholder: 'مثال: RAMADAN10 أو HASH20' },
      { key: 'checkout.couponApplyBtn', label: 'زر تطبيق الكود', placeholder: 'تطبيق' },
      { key: 'checkout.subtotalTitle', label: 'تسمية المجموع الفرعي', placeholder: 'المجموع الفرعي' },
      { key: 'checkout.deliveryFeeTitle', label: 'تسمية رسوم التوصيل المجهز', placeholder: 'توصيل مجهّز (سيارات مبردة)' },
      { key: 'checkout.totalTitle', label: 'تسمية الإجمالي النهائي', placeholder: 'الإجمالي النهائي' },
      { key: 'checkout.submitOrderBtn', label: 'زر تأكيد الطلب بالواتساب', placeholder: 'تأكيد الطلب' },
    ],
  },
  {
    id: 'order-success',
    title: 'نافذة تأكيد ونجاح الطلب ورسالة الواتساب (Order Success)',
    icon: CheckCircle2,
    description: 'نصوص الاحتفال بإتمام الطلب، كود التتبع، بيانات الاستلام، وزر مشاركة الفاتورة',
    fields: [
      { key: 'orderSuccess.badge', label: 'شارة استلام الطلب الاحتفالية', placeholder: 'تم استلام طلبك بنجاح' },
      { key: 'orderSuccess.title', label: 'عنوان تأكيد بدء التجهيز', placeholder: 'مطبخ هشوشة بدأ بالتحضير' },
      { key: 'orderSuccess.subtitle', label: 'رسالة الشكر والامتنان', placeholder: 'شكراً لثقتك بهشوشة. يتم تحضير أطباقك طازجة باستخدام أرقى المكونات والوصفات المنزلية الأصيلة.' },
      { key: 'orderSuccess.trackingLabel', label: 'تسمية كود تتبع الطلب', placeholder: 'رقم تتبع طلبك:' },
      { key: 'orderSuccess.copyBtn', label: 'زر نسخ كود التتبع', placeholder: 'نسخ الرمز' },
      { key: 'orderSuccess.copiedBtn', label: 'تأكيد نجاح نسخ الرمز', placeholder: 'تم النسخ بنجاح' },
      { key: 'orderSuccess.customerLabel', label: 'تسمية خانة اسم العميل', placeholder: 'العميل الكريم:' },
      { key: 'orderSuccess.locationLabel', label: 'تسمية خانة موقع التوصيل', placeholder: 'موقع التوصيل:' },
      { key: 'orderSuccess.paymentLabel', label: 'تسمية خانة طريقة الدفع', placeholder: 'طريقة الدفع:' },
      { key: 'orderSuccess.totalLabel', label: 'تسمية خانة المجموع النهائي', placeholder: 'المجموع النهائي (شامل التوصيل):' },
      { key: 'orderSuccess.whatsappBtn', label: 'زر إرسال وتأكيد الطلب بالواتساب', placeholder: 'إرسال نسخة وتأكيد عبر الواتساب' },
    ],
  },
  {
    id: 'dish-cards',
    title: 'بطاقات الأطباق وأزرار الإضافة السريعة (Dish Cards)',
    icon: Tag,
    description: 'شارات التوفر وأزرار الإضافة السريعة على بطاقات المنيو',
    fields: [
      { key: 'dishCard.soldOutBadge', label: 'شارة نفاد الكمية على الصورة', placeholder: 'نفد اليوم' },
      { key: 'dishCard.unavailableBtn', label: 'زر الصنف غير المتاح للطلب', placeholder: 'غير متوفر اليوم' },
      { key: 'dishCard.addBtn', label: 'زر الإضافة السريعة بالبطاقة', placeholder: 'أضف للطلب' },
    ],
  },
  {
    id: 'product-modal',
    title: 'نافذة تفاصيل وضيافة الطبق الفاخرة (Product Detail Modal)',
    icon: UtensilsCrossed,
    description: 'سعة الحصة، عنوان الوصف، نصيحة التقديم الفندقية، وركائز الجودة الأربع',
    fields: [
      { key: 'dishModal.addToCartBtn', label: 'زر الإضافة إلى السلة بالنافذة', placeholder: 'إضافة إلى السلة' },
      { key: 'dishModal.soldOutBtn', label: 'زر الطبق غير المتوفر بالنافذة', placeholder: 'نفد اليوم' },
      { key: 'dishModal.defaultServing', label: 'سعة الحصة الافتراضية', placeholder: 'تكفي ٤-٦ أشخاص' },
      { key: 'dishModal.aboutTitle', label: 'عنوان تفاصيل ومكونات الطبق', placeholder: 'عن هذا الطبق الفاخر' },
      { key: 'dishModal.storyTitle', label: 'عنوان قصة الصنع والتحضير الفندقي', placeholder: 'قصة الصنع والتحضير' },
      { key: 'dishModal.servingTipTitle', label: 'عنوان نصيحة التقديم الفندقية', placeholder: 'طريقة التقديم الفندقية المقترحة:' },
      { key: 'dishModal.servingTipText', label: 'نص إرشاد التقديم ودبس الرمان', placeholder: 'يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.' },
      { key: 'dishModal.highlightFresh', label: 'ميزة التحضير اليومي الطازج', placeholder: 'تحضير طازج يومياً بالرياض' },
      { key: 'dishModal.highlightIngredients', label: 'ميزة زيت الزيتون ودبس الرمان', placeholder: 'زيت زيتون بكر ودبس رمان أصلي' },
      { key: 'dishModal.highlightPackaging', label: 'ميزة التغليف الحراري الخاص', placeholder: 'تغليف حراري مخصص للجمعات' },
      { key: 'dishModal.highlightDelivery', label: 'ميزة التوصيل الفوري بسيارات مجهزة', placeholder: 'توصيل فوري بسيارات مجهزة' },
      { key: 'dishModal.pairingsTitle', label: 'عنوان توصية الأطباق المكملة', placeholder: 'أطباق تكمّل جمعتكم' },
    ],
  },
  {
    id: 'landing-page',
    title: 'صفحة الهبوط المستقلة وتقييمات الرياض (Dish Landing Page)',
    icon: ExternalLink,
    description: 'نصوص صفحة المنتج المستقلة (/dish/slug)، أحياء التوصيل، قسم المراجعات، وشارة العميل الموثق',
    fields: [
      { key: 'landing.backToCatalog', label: 'زر العودة لكامل قائمة هشوشة', placeholder: 'تصفح كامل أطباق هشوشة' },
      { key: 'landing.storyTitle', label: 'عنوان قصة الطبق وسر التحضير الحرفي', placeholder: 'قصة الطبق وسر التحضير الحرفي' },
      { key: 'landing.servingTipTitle', label: 'عنوان نصيحة الضيافة لضيوفكم', placeholder: 'سر التقديم الفندقي لضيوفكم:' },
      { key: 'landing.servingTipText', label: 'نص إرشاد تقديم دبس الرمان والليمون', placeholder: 'يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر وحبوب الرمان الطازجة.' },
      { key: 'landing.deliveryTitle', label: 'عنوان توفر التوصيل لأحياء الرياض', placeholder: 'التوصيل متوفر لجميع أحياء الرياض:' },
      { key: 'landing.deliveryText', label: 'تفصيل أحياء الرياض وطرق الدفع', placeholder: 'الملقا، حطين، النرجس، الياسمين، الصحافة، الغدير، العليا، السليمانية، الروضة، وكافة الأحياء الأخرى مع خيارات الدفع عند الاستلام، أبل باي، ومدى.' },
      { key: 'landing.reviewsTitle', label: 'عنوان تقييمات ذواقة الرياض', placeholder: 'آراء وتجارب ذواقة الرياض' },
      { key: 'landing.reviewsSubtitle', label: 'السطر الوصفي لقسم المراجعات', placeholder: 'تجارب حقيقية لعملاء وثقوا بضيافة هشوشة في جمعاتهم ومناسباتهم الخاصة' },
      { key: 'landing.addReviewBtn', label: 'زر كتابة تقييم جديد للطبق', placeholder: 'شاركنا تجربتك وتقييمك للطبق ✍️' },
      { key: 'landing.verifiedBadge', label: 'شارة توثيق تقييم العميل', placeholder: 'عميل موثّق 🌿' },
      { key: 'landing.pairingsTitle', label: 'عنوان الأطباق المتناغمة (يكمل جمعتكم)', placeholder: 'يكمل جمعتكم (أطباق متناغمة)' },
    ],
  },
]

export const SiteContentModule: React.FC = () => {
  const [content, setContent] = useState<SiteContentSettings>(DEFAULT_SITE_CONTENT)
  const [activeSubTab, setActiveSubTab] = useState<'media' | 'copy' | 'bank' | 'whatsapp' | 'theme'>('media')
  const [themeCustomizerMode, setThemeCustomizerMode] = useState<'light' | 'dark'>('light')
  const [previewThemeMode, setPreviewThemeMode] = useState<'light' | 'dark'>('light')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [matchedKeysSnapshot, setMatchedKeysSnapshot] = useState<Set<string>>(new Set())
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Theme & Palette Customizer Helpers
  const handleColorChange = (mode: 'light' | 'dark', key: keyof ThemeColorPalette, value: string) => {
    setContent((prev) => {
      const currentTheme = prev.themeColors || DEFAULT_THEME_COLORS
      return {
        ...prev,
        themeColors: {
          ...currentTheme,
          [mode]: {
            ...currentTheme[mode],
            [key]: value,
            ...(key === 'primary' && mode === 'light' ? { primaryForeground: '#faf7f2' } : {}),
            ...(key === 'primary' && mode === 'dark' ? { primaryForeground: currentTheme.dark.background } : {}),
            ...(key === 'foreground' ? { cardForeground: value } : {}),
          },
        },
      }
    })
  }

  const handleApplyPreset = (preset: ThemePreset) => {
    setContent((prev) => ({
      ...prev,
      themeColors: preset.colors,
    }))
    setStatusMsg({ type: 'success', text: `تم تطبيق باقة "${preset.name}" بنجاح! ✨` })
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleResetThemeColors = () => {
    setContent((prev) => ({
      ...prev,
      themeColors: DEFAULT_THEME_COLORS,
    }))
    setStatusMsg({ type: 'success', text: 'تمت استعادة ألوان وهوية المتجر الافتراضية بنجاح.' })
    setTimeout(() => setStatusMsg(null), 3000)
  }

  // Advanced UI Strings Helpers
  const handleUiStringChange = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      uiStrings: {
        ...(prev.uiStrings || DEFAULT_UI_STRINGS),
        [key]: value,
      },
    }))
  }

  const getUiStringValue = (key: string) => {
    return content.uiStrings?.[key] ?? DEFAULT_UI_STRINGS[key] ?? ''
  }

  const heroKeys = useMemo(() => ['heroTag', 'heroTitle', 'heroSubtitle', 'heroAlt', 'heroDescription'], [])
  const pillarKeys = useMemo(
    () => [
      'pillar_0_title',
      'pillar_0_subtitle',
      'pillar_1_title',
      'pillar_1_subtitle',
      'pillar_2_title',
      'pillar_2_subtitle',
      'pillar_3_title',
      'pillar_3_subtitle',
    ],
    []
  )
  const footerKeys = useMemo(() => ['footerTitle', 'footerSubtitle', 'deliveryNotice'], [])
  const advancedFieldKeys = useMemo(() => ADVANCED_GROUPS.flatMap((g) => g.fields.map((f) => f.key)), [])

  const isKeyMatched = (key: string) => {
    if (!appliedSearch) return false
    return matchedKeysSnapshot.has(key)
  }

  const isFieldMatched = (field: AdvancedField) => isKeyMatched(field.key)

  const handleExecuteSearch = (customQuery?: string) => {
    const raw = typeof customQuery === 'string' ? customQuery : searchInput
    const q = raw.trim()
    setAppliedSearch(q)

    if (!q) {
      setMatchedKeysSnapshot(new Set())
      return
    }

    const qLower = q.toLowerCase()
    const matched = new Set<string>()

    // 1. Scan Basic Primary Fields (Hero, Pillars, Footer)
    const basicDefs: {
      key: string
      label: string
      val: string
      tags?: string[]
    }[] = [
      {
        key: 'heroTag',
        label: 'الوسم الإنجليزي العلوي English Tag',
        val: content.heroTag,
        tags: ['هيرو', 'hero', 'وسم', 'tag'],
      },
      {
        key: 'heroTitle',
        label: 'العنوان الرئيسي H1 Main Title',
        val: content.heroTitle,
        tags: ['هيرو', 'hero', 'عنوان', 'رئيسي'],
      },
      {
        key: 'heroSubtitle',
        label: 'السطر التكميلي للعنوان Subtitle Badge',
        val: content.heroSubtitle,
        tags: ['هيرو', 'hero', 'فرعي', 'تكميلي'],
      },
      {
        key: 'heroAlt',
        label: 'وصف صورة الهيرو Alt Tag للوصولية وSEO',
        val: content.heroAlt,
        tags: ['هيرو', 'hero', 'صورة', 'alt'],
      },
      {
        key: 'heroDescription',
        label: 'الوصف السردي الإبداعي Narrative Description',
        val: content.heroDescription,
        tags: ['هيرو', 'hero', 'وصف', 'سردي'],
      },
      ...content.pillars.flatMap((p, idx) => [
        {
          key: `pillar_${idx}_title`,
          label: `الركيزة رقم ${idx + 1} العنوان الرئيسي`,
          val: p.title,
          tags: ['ركائز', 'ركيزة', 'pillars', 'مميزات', `ركيزة ${idx + 1}`],
        },
        {
          key: `pillar_${idx}_subtitle`,
          label: `الركيزة رقم ${idx + 1} السطر الفرعي`,
          val: p.subtitle,
          tags: ['ركائز', 'ركيزة', 'pillars', 'مميزات', `ركيزة ${idx + 1}`],
        },
      ]),
      {
        key: 'footerTitle',
        label: 'اسم المتجر في الفوتر Footer Title',
        val: content.footerTitle,
        tags: ['فوتر', 'footer', 'اسم'],
      },
      {
        key: 'footerSubtitle',
        label: 'وصف الفوتر والموقع Footer Subtitle',
        val: content.footerSubtitle,
        tags: ['فوتر', 'footer', 'وصف'],
      },
      {
        key: 'deliveryNotice',
        label: 'رسالة ضمان التوصيل بالرياض Delivery Notice',
        val: content.deliveryNotice,
        tags: ['توصيل', 'ضمان', 'الرياض', 'فوتر', 'delivery'],
      },
    ]

    basicDefs.forEach((f) => {
      const valLower = (f.val || '').toLowerCase()
      const labelLower = f.label.toLowerCase()
      const keyLower = f.key.toLowerCase()
      const tagMatch = f.tags?.some((t) => t.toLowerCase().includes(qLower) || qLower.includes(t.toLowerCase()))

      if (
        valLower.includes(qLower) ||
        labelLower.includes(qLower) ||
        keyLower.includes(qLower) ||
        tagMatch
      ) {
        matched.add(f.key)
      }
    })

    // 2. Scan Advanced Groups Fields
    ADVANCED_GROUPS.forEach((group) => {
      const groupMatch = group.title.toLowerCase().includes(qLower) || group.description.toLowerCase().includes(qLower)
      group.fields.forEach((field) => {
        const currentVal = getUiStringValue(field.key).toLowerCase()
        if (
          groupMatch ||
          field.label.toLowerCase().includes(qLower) ||
          field.placeholder.toLowerCase().includes(qLower) ||
          field.key.toLowerCase().includes(qLower) ||
          currentVal.includes(qLower)
        ) {
          matched.add(field.key)
        }
      })
    })

    setMatchedKeysSnapshot(matched)
    const advCount = advancedFieldKeys.filter((k) => matched.has(k)).length
    if (advCount > 0) {
      setIsAdvancedOpen(true)
    }

    if (q) {
      setTimeout(() => {
        const el = document.getElementById('search-results-anchor')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setAppliedSearch('')
    setMatchedKeysSnapshot(new Set())
  }

  // Upload refs for image cards
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const logoImageInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const ogImageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null)
  const [compressionPills, setCompressionPills] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await fetchSiteContent()
      setContent(data)
    } catch {
      setStatusMsg({ type: 'error', text: 'تعذر تحميل الإعدادات من السحابة، تم تفعيل الوضع الافتراضي.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setStatusMsg(null)
    try {
      const res = await saveSiteContent(content)
      if (res.success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hashousha_content_updated', { detail: content }))
        }
        setStatusMsg({ type: 'success', text: 'تم حفظ وتحديث إعدادات المظهر والمحتوى بنجاح على السحابة! ✨' })
        setTimeout(() => setStatusMsg(null), 5000)
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'تعذر الحفظ في قاعدة البيانات السحابية.' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير متوقع'
      setStatusMsg({ type: 'error', text: msg })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SiteContentSettings
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingTarget(field)
    try {
      // 1. Select preset for field
      const preset =
        field === 'favicon'
          ? OPTIMIZER_PRESETS.favicon
          : field === 'logoImage'
          ? OPTIMIZER_PRESETS.logo
          : OPTIMIZER_PRESETS.hero

      // 2. Client-side WebP optimization
      const opt = await optimizeImageToWebp(file, preset)
      const uploadFile = opt.file

      if (opt.savingsPercent > 0 || opt.optimizedSize > 0) {
        const text = `✨ تم تحويل وضغط الصورة تلقائياً لـ WebP: ${formatFileSize(opt.originalSize)} ← ${formatFileSize(opt.optimizedSize)} (توفير ${opt.savingsPercent}%)`
        setCompressionPills((prev) => ({ ...prev, [field]: text }))
      }

      // 3. Upload optimized WebP file
      const publicUrl = await uploadDishImage(uploadFile)
      setContent((prev) => ({ ...prev, [field]: publicUrl }))
      setStatusMsg({ type: 'success', text: 'تم ضغط ورفع الصورة بصيغة WebP بنجاح!' })
      setTimeout(() => setStatusMsg(null), 4000)
    } catch {
      setStatusMsg({ type: 'error', text: 'فشل رفع الصورة إلى التخزين السحابي.' })
    } finally {
      setUploadingTarget(null)
    }
  }

  const handlePillarChange = (index: number, key: keyof BrandPillarItem, value: string) => {
    setContent((prev) => {
      const newPillars = [...prev.pillars]
      if (!newPillars[index]) {
        newPillars[index] = { title: '', subtitle: '' }
      }
      newPillars[index] = { ...newPillars[index], [key]: value }
      return { ...prev, pillars: newPillars }
    })
  }

  // Search matches counters & visibility
  const heroMatchesCount = heroKeys.filter((k) => matchedKeysSnapshot.has(k)).length
  const pillarsMatchesCount = pillarKeys.filter((k) => matchedKeysSnapshot.has(k)).length
  const footerMatchesCount = footerKeys.filter((k) => matchedKeysSnapshot.has(k)).length
  const matchingBasicCount = heroMatchesCount + pillarsMatchesCount + footerMatchesCount

  const matchingAdvancedCount = advancedFieldKeys.filter((k) => matchedKeysSnapshot.has(k)).length
  const totalMatchesCount = matchingBasicCount + matchingAdvancedCount

  const hasActiveAdvancedSearch = appliedSearch.length > 0 && matchingAdvancedCount > 0
  const effectiveIsAdvancedOpen = isAdvancedOpen || hasActiveAdvancedSearch

  const heroSectionVisible = useMemo(() => {
    if (!appliedSearch) return true
    return heroMatchesCount > 0
  }, [appliedSearch, heroMatchesCount])

  const pillarsSectionVisible = useMemo(() => {
    if (!appliedSearch) return true
    return pillarsMatchesCount > 0
  }, [appliedSearch, pillarsMatchesCount])

  const footerSectionVisible = useMemo(() => {
    if (!appliedSearch) return true
    return footerMatchesCount > 0
  }, [appliedSearch, footerMatchesCount])

  // Dynamic Section Reordering: Any section with matches takes the lead ("يتصدر الصفحة")
  type SectionId = 'hero' | 'pillars' | 'footer' | 'advanced'

  const orderedSections = useMemo(() => {
    const defaultSections: SectionId[] = ['hero', 'pillars', 'footer', 'advanced']
    if (!appliedSearch) return defaultSections

    const matchScore: Record<SectionId, boolean> = {
      hero: heroMatchesCount > 0,
      pillars: pillarsMatchesCount > 0,
      footer: footerMatchesCount > 0,
      advanced: hasActiveAdvancedSearch,
    }

    const matched = defaultSections.filter((id) => matchScore[id])
    const unmatched = defaultSections.filter((id) => !matchScore[id])

    return [...matched, ...unmatched]
  }, [appliedSearch, heroMatchesCount, pillarsMatchesCount, footerMatchesCount, hasActiveAdvancedSearch])

  // Dynamic Advanced Groups Ordering: Groups containing matches take the lead inside the accordion
  const orderedAdvancedGroups = useMemo(() => {
    if (!appliedSearch) return ADVANCED_GROUPS

    const withMatches = ADVANCED_GROUPS.filter((g) => g.fields.some(isFieldMatched))
    const withoutMatches = ADVANCED_GROUPS.filter((g) => !g.fields.some(isFieldMatched))

    return [...withMatches, ...withoutMatches]
  }, [appliedSearch, matchedKeysSnapshot])

  const pillarIcons = [ChefHat, Droplets, Gift, Truck]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">جاري استرجاع إعدادات المظهر والمحتوى من السحابة...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-36" dir="rtl">
      {/* Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers className="size-5" />
            </span>
            <h1 className="text-2xl font-black text-foreground">إدارة المظهر والمحتوى (Site Content)</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
            <span>القسم المفتوح:</span>
            <span className="font-bold text-foreground">
              {activeSubTab === 'media' && 'الصور والوسائط والهوية البصرية'}
              {activeSubTab === 'copy' && 'النصوص والعبارات والمحتوى الترويجي'}
              {activeSubTab === 'bank' && 'بيانات الحساب البنكي (التحويل المباشر)'}
              {activeSubTab === 'whatsapp' && 'رقم وتخصيص زر الواتساب العائم'}
              {activeSubTab === 'theme' && '🎨 ألوان وهوية المتجر (Theme & Palette Customizer)'}
            </span>
          </div>
        </div>

        {/* Sub-tab Switches: Icons Only for Sleek Multi-Category Luxury Control */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-secondary/80 dark:bg-card border border-primary/20 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('media')}
            title="الصور والوسائط والهوية البصرية"
            aria-label="الصور والوسائط والهوية البصرية"
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all cursor-pointer',
              activeSubTab === 'media'
                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            )}
          >
            <ImageIcon className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('copy')}
            title="النصوص والعبارات والمحتوى الترويجي"
            aria-label="النصوص والعبارات والمحتوى الترويجي"
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all cursor-pointer',
              activeSubTab === 'copy'
                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            )}
          >
            <Type className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bank')}
            title="بيانات الحساب البنكي الرسمي (التحويل المباشر)"
            aria-label="بيانات الحساب البنكي الرسمي (التحويل المباشر)"
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all cursor-pointer',
              activeSubTab === 'bank'
                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            )}
          >
            <Building2 className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('whatsapp')}
            title="رقم وتخصيص زر الواتساب والتواصل الفوري"
            aria-label="رقم وتخصيص زر الواتساب والتواصل الفوري"
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all cursor-pointer',
              activeSubTab === 'whatsapp'
                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            )}
          >
            <MessageCircle className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('theme')}
            title="ألوان وهوية المتجر (Theme & Palette Customizer)"
            aria-label="ألوان وهوية المتجر (Theme & Palette Customizer)"
            className={cn(
              'flex items-center justify-center size-10 rounded-xl transition-all cursor-pointer',
              activeSubTab === 'theme'
                ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
            )}
          >
            <Palette className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMsg && (
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-2xl border text-sm font-bold transition-all animate-in fade-in slide-in-from-top-2',
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
          )}
        >
          {statusMsg.type === 'success' ? (
            <Check className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 1: MEDIA & BRAND ASSETS                                    */}
      {/* =================================================================== */}
      {activeSubTab === 'media' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Hero Banner Image */}
          <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">صورة الهيرو الرئيسية (Hero Banner)</span>
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-lg">16:9 مستحسن (WebP تلقائي)</span>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/20 bg-[#2e1e0d] shadow-inner">
              <img
                src={content.heroImage || '/images/hero.png'}
                alt="معاينة الهيرو"
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/images/hero.png'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 text-white text-xs font-bold drop-shadow">
                معاينة مباشرة في المتجر
              </div>
            </div>

            {/* Live WebP Compression Badge */}
            {compressionPills['heroImage'] && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span>{compressionPills['heroImage']}</span>
              </div>
            )}

            {/* URL Input + Upload Action */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">رابط الصورة (URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.heroImage}
                  onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                  placeholder="/images/hero.png"
                  className="flex-1 rounded-xl border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  dir="ltr"
                />
                <input
                  type="file"
                  ref={heroImageInputRef}
                  onChange={(e) => handleFileUpload(e, 'heroImage')}
                  accept=".jpg,.jpeg,.png,.webp,.heic"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  disabled={uploadingTarget === 'heroImage'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  {uploadingTarget === 'heroImage' ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  <span>رفع صورة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Brand Logo */}
          <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">شعار البراند (Brand Logo)</span>
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-lg">PNG / WebP شفاف</span>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/20 bg-secondary/40 dark:bg-card/60 flex items-center justify-center p-6 shadow-inner">
              {content.logoImage ? (
                <img
                  src={content.logoImage}
                  alt="لوجو المتجر"
                  className="max-h-24 max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground space-y-1">
                  <ChefHat className="size-10 text-primary/40" />
                  <span className="text-xs">يتم استخدام الشعار النصي الفندقي حالياً (هشوشة)</span>
                </div>
              )}
            </div>

            {/* Live WebP Compression Badge */}
            {compressionPills['logoImage'] && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span>{compressionPills['logoImage']}</span>
              </div>
            )}

            {/* URL Input + Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">رابط اللوجو (URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.logoImage}
                  onChange={(e) => setContent({ ...content, logoImage: e.target.value })}
                  placeholder="https://... أو /logo.png"
                  className="flex-1 rounded-xl border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  dir="ltr"
                />
                <input
                  type="file"
                  ref={logoImageInputRef}
                  onChange={(e) => handleFileUpload(e, 'logoImage')}
                  accept=".jpg,.jpeg,.png,.webp,.heic"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoImageInputRef.current?.click()}
                  disabled={uploadingTarget === 'logoImage'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  {uploadingTarget === 'logoImage' ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  <span>رفع لوجو</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Favicon Icon */}
          <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">أيقونة التبويب (Favicon)</span>
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-lg">WebP / ICO / PNG</span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-primary/10 bg-secondary/30">
              <div className="size-14 rounded-xl border border-primary/20 bg-card flex items-center justify-center p-2 shadow-sm shrink-0">
                <img
                  src={content.favicon || '/favicon.ico'}
                  alt="Favicon"
                  className="size-8 object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/favicon.ico'
                  }}
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">الأيقونة المعروضة في لسان المتصفح</p>
                <p className="text-muted-foreground text-[11px]">تظهر بجانب اسم المتجر عند فتح الصفحة في أجهزة العملاء وتتزامن حياً مع التبويب.</p>
              </div>
            </div>

            {/* Live WebP Compression Badge */}
            {compressionPills['favicon'] && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span>{compressionPills['favicon']}</span>
              </div>
            )}

            {/* URL Input + Native Upload Action */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">رابط الأيقونة (Favicon URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.favicon}
                  onChange={(e) => setContent({ ...content, favicon: e.target.value })}
                  placeholder="/favicon.ico"
                  className="flex-1 rounded-xl border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  dir="ltr"
                />
                <input
                  type="file"
                  ref={faviconInputRef}
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  accept=".ico,.png,.jpg,.jpeg,.webp,.heic"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingTarget === 'favicon'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  {uploadingTarget === 'favicon' ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  <span>رفع أيقونة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Social OG Image */}
          <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">صورة مشاركة السوشيال ميديا (Social OG)</span>
              <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-lg">1200x630 px (WebP تلقائي)</span>
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-primary/20 bg-[#2e1e0d] shadow-inner">
              <img
                src={content.ogImage || content.heroImage || '/images/hero.png'}
                alt="OG Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/images/hero.png'
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                <div className="rounded-xl bg-card/90 dark:bg-card/95 border border-primary/20 backdrop-blur-md p-3 text-center max-w-xs shadow-lg">
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">معاينة رابط الواتساب وتويتر</p>
                  <p className="text-xs font-black text-foreground truncate mt-0.5">{content.heroTitle}</p>
                </div>
              </div>
            </div>

            {/* Live WebP Compression Badge */}
            {compressionPills['ogImage'] && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="size-3.5 text-emerald-600 shrink-0" />
                <span>{compressionPills['ogImage']}</span>
              </div>
            )}

            {/* URL Input + Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">رابط صورة المشاركة (URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={content.ogImage}
                  onChange={(e) => setContent({ ...content, ogImage: e.target.value })}
                  placeholder="/images/hero.png"
                  className="flex-1 rounded-xl border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  dir="ltr"
                />
                <input
                  type="file"
                  ref={ogImageInputRef}
                  onChange={(e) => handleFileUpload(e, 'ogImage')}
                  accept=".jpg,.jpeg,.png,.webp,.heic"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => ogImageInputRef.current?.click()}
                  disabled={uploadingTarget === 'ogImage'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  {uploadingTarget === 'ogImage' ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  <span>رفع صورة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 2: STOREFRONT COPYWRITING                                   */}
      {/* =================================================================== */}
      {activeSubTab === 'copy' && (
        <div className="space-y-6">
          {/* Smart Search Toolbar with Explicit Search & Cancel Buttons */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleExecuteSearch()
                    }
                  }}
                  placeholder="ابحث في نصوص المتجر (اكتب الكلمة واضغط زر بحث)..."
                  className="w-full rounded-2xl border border-primary/20 bg-card pr-11 pl-10 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold p-1 rounded-full hover:bg-secondary transition-colors"
                    title="مسح حقل الإدخال"
                    aria-label="مسح حقل البحث"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons: Search & Clear Search */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleExecuteSearch()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Search className="size-4" />
                  <span>بحث</span>
                </button>

                {appliedSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-3 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>إلغاء البحث</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Search Notification Banner */}
            {appliedSearch && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">نتائج البحث المعتمدة عن:</span>
                  <span className="font-black bg-amber-500/20 px-2 py-0.5 rounded-md text-primary">
                    "{appliedSearch}"
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {totalMatchesCount === 0
                      ? '(لا توجد حقول مطابقة)'
                      : matchingBasicCount > 0 && matchingAdvancedCount > 0
                        ? `(${totalMatchesCount} حقول مطابقة: ${matchingBasicCount} في النصوص الأساسية، و${matchingAdvancedCount} في الإعدادات المتقدمة)`
                        : matchingBasicCount > 0
                          ? `(${matchingBasicCount} حقول مطابقة في النصوص الأساسية)`
                          : `(${matchingAdvancedCount} حقول مطابقة في الإعدادات المتقدمة)`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer shrink-0 mr-2"
                >
                  إلغاء البحث وإظهار كافة الحقول
                </button>
              </div>
            )}
          </div>

          {/* Empty Search State */}
          {appliedSearch && totalMatchesCount === 0 && (
            <div className="rounded-3xl border border-dashed border-primary/30 p-10 text-center space-y-3 bg-card/60 shadow-xs animate-in fade-in">
              <Search className="size-8 text-muted-foreground/50 mx-auto" />
              <h3 className="text-sm font-bold text-foreground">لم يتم العثور على أي نصوص مطابقة لـ "{appliedSearch}"</h3>
              <p className="text-xs text-muted-foreground">جرب البحث بكلمة أخرى أو اضغط على زر إلغاء البحث لإظهار كافة النصوص.</p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>إلغاء البحث وعرض كافة النصوص</span>
              </button>
            </div>
          )}

                    {/* Dynamic Sections Wrapper (Ordered: Matched Sections Lead the Page) */}
          <div id="search-results-anchor" className="space-y-6">
            {orderedSections.map((sectionId) => {
              if (sectionId === 'hero') {
                if (!heroSectionVisible) return null
                const isHeroLeading = appliedSearch.length > 0 && heroMatchesCount > 0
                return (
                  <div
                    key="section-hero"
                    className={cn(
                      'rounded-3xl border bg-card p-5 sm:p-7 shadow-sm space-y-5 transition-all',
                      isHeroLeading ? 'border-primary ring-2 ring-primary/20 bg-amber-50/10 dark:bg-amber-950/10' : 'border-primary/15'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Sparkles className="size-4" />
                        </span>
                        <h2 className="text-base font-black text-foreground">نصوص وعناوين الهيرو سيكشن (Hero Showcase)</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {isHeroLeading && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-300/40">
                            متصدر نتائج البحث 🚀
                          </span>
                        )}
                        {appliedSearch && heroMatchesCount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                            {heroMatchesCount} نتيجة
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* heroTag */}
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('heroTag')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">الوسم الإنجليزي العلوي (English Tag)</label>
                    {isKeyMatched('heroTag') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.heroTag}
                    onChange={(e) => setContent({ ...content, heroTag: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono',
                      isKeyMatched('heroTag') && 'border-primary font-bold'
                    )}
                    dir="ltr"
                  />
                </div>

                {/* heroTitle */}
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('heroTitle')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">العنوان الرئيسي (H1 Main Title)</label>
                    {isKeyMatched('heroTitle') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold',
                      isKeyMatched('heroTitle') && 'border-primary font-bold'
                    )}
                  />
                </div>

                {/* heroSubtitle */}
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('heroSubtitle')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">السطر التكميلي للعنوان (Subtitle / Badge)</label>
                    {isKeyMatched('heroSubtitle') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40',
                      isKeyMatched('heroSubtitle') && 'border-primary font-bold'
                    )}
                  />
                </div>

                {/* heroAlt */}
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('heroAlt')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">وصف صورة الهيرو (Alt Tag للوصولية وSEO)</label>
                    {isKeyMatched('heroAlt') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.heroAlt}
                    onChange={(e) => setContent({ ...content, heroAlt: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40',
                      isKeyMatched('heroAlt') && 'border-primary font-bold'
                    )}
                  />
                </div>

                {/* heroDescription */}
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 md:col-span-2 transition-all',
                    isKeyMatched('heroDescription')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">الوصف السردي الإبداعي (Narrative Description)</label>
                    {isKeyMatched('heroDescription') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={content.heroDescription}
                    onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed',
                      isKeyMatched('heroDescription') && 'border-primary font-bold'
                    )}
                  />
                </div>
              </div>
                  </div>
                )
              }

              if (sectionId === 'pillars') {
                if (!pillarsSectionVisible) return null
                const isPillarsLeading = appliedSearch.length > 0 && pillarsMatchesCount > 0
                return (
                  <div
                    key="section-pillars"
                    className={cn(
                      'rounded-3xl border bg-card p-5 sm:p-7 shadow-sm space-y-5 transition-all',
                      isPillarsLeading ? 'border-primary ring-2 ring-primary/20 bg-amber-50/10 dark:bg-amber-950/10' : 'border-primary/15'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Gift className="size-4" />
                        </span>
                        <h2 className="text-base font-black text-foreground">ركائز الضيافة الفاخرة الأربع (Brand Pillars)</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPillarsLeading && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-300/40">
                            متصدر نتائج البحث 🚀
                          </span>
                        )}
                        {appliedSearch && pillarsMatchesCount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                            {pillarsMatchesCount} نتيجة
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.pillars.map((pillar, idx) => {
                  const Icon = pillarIcons[idx % pillarIcons.length]
                  const isTitleMatch = isKeyMatched(`pillar_${idx}_title`)
                  const isSubtitleMatch = isKeyMatched(`pillar_${idx}_subtitle`)
                  const isCardMatched = isTitleMatch || isSubtitleMatch

                  return (
                    <div
                      key={`pillar-editor-${idx}`}
                      className={cn(
                        'rounded-2xl border bg-card p-4 space-y-3 transition-all',
                        isCardMatched
                          ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                          : 'border-primary/15'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="text-xs font-bold text-foreground">الركيزة رقم {idx + 1}</span>
                        </div>
                        {isCardMatched && (
                          <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                            مطابق للبحث 🔍
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-muted-foreground block">العنوان الرئيسي</label>
                            {isTitleMatch && (
                              <span className="text-[9px] text-primary font-bold">مطابق للعنوان</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                            className={cn(
                              'w-full rounded-lg border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold',
                              isTitleMatch && 'border-primary ring-1 ring-primary/40 font-black'
                            )}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-muted-foreground block">السطر الفرعي المختصر</label>
                            {isSubtitleMatch && (
                              <span className="text-[9px] text-primary font-bold">مطابق للوصف</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={pillar.subtitle}
                            onChange={(e) => handlePillarChange(idx, 'subtitle', e.target.value)}
                            className={cn(
                              'w-full rounded-lg border border-primary/20 bg-card px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40',
                              isSubtitleMatch && 'border-primary font-bold'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
                  </div>
                )
              }

              if (sectionId === 'footer') {
                if (!footerSectionVisible) return null
                const isFooterLeading = appliedSearch.length > 0 && footerMatchesCount > 0
                return (
                  <div
                    key="section-footer"
                    className={cn(
                      'rounded-3xl border bg-card p-5 sm:p-7 shadow-sm space-y-5 transition-all',
                      isFooterLeading ? 'border-primary ring-2 ring-primary/20 bg-amber-50/10 dark:bg-amber-950/10' : 'border-primary/15'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Truck className="size-4" />
                        </span>
                        <h2 className="text-base font-black text-foreground">نصوص الفوتر ورسائل التوصيل (Footer & Guarantees)</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {isFooterLeading && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-300/40">
                            متصدر نتائج البحث 🚀
                          </span>
                        )}
                        {appliedSearch && footerMatchesCount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                            {footerMatchesCount} نتيجة
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('footerTitle')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">اسم المتجر في الفوتر (Footer Title)</label>
                    {isKeyMatched('footerTitle') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.footerTitle}
                    onChange={(e) => setContent({ ...content, footerTitle: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold',
                      isKeyMatched('footerTitle') && 'border-primary font-bold'
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 transition-all',
                    isKeyMatched('footerSubtitle')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">وصف الفوتر والموقع (Footer Subtitle)</label>
                    {isKeyMatched('footerSubtitle') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.footerSubtitle}
                    onChange={(e) => setContent({ ...content, footerSubtitle: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40',
                      isKeyMatched('footerSubtitle') && 'border-primary font-bold'
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'rounded-xl border p-3.5 space-y-1.5 md:col-span-2 transition-all',
                    isKeyMatched('deliveryNotice')
                      ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                      : 'border-primary/10 bg-card'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">رسالة ضمان التوصيل بالرياض (Delivery Notice)</label>
                    {isKeyMatched('deliveryNotice') && (
                      <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                        مطابق للبحث 🔍
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.deliveryNotice}
                    onChange={(e) => setContent({ ...content, deliveryNotice: e.target.value })}
                    className={cn(
                      'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40',
                      isKeyMatched('deliveryNotice') && 'border-primary font-bold'
                    )}
                  />
                </div>
              </div>
                  </div>
                )
              }

              if (sectionId === 'advanced') {
                const isAdvancedLeading = appliedSearch.length > 0 && hasActiveAdvancedSearch
                return (
                  <div
                    key="section-advanced"
                    className={cn(
                      'rounded-3xl border bg-card shadow-sm overflow-hidden transition-all',
                      isAdvancedLeading ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
                    )}
                  >
            {/* Accordion Trigger Header */}
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-right hover:bg-primary/5 transition-colors border-b border-primary/10 select-none"
              aria-expanded={effectiveIsAdvancedOpen}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary/15 text-primary">
                  <Sliders className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-foreground">
                      الإعدادات المتقدمة: نصوص الواجهة الدقيقة (Micro-Copy)
                    </h3>
                    <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">
                      تحكم شامل
                    </span>
                    {isAdvancedLeading && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-900 dark:text-amber-200 font-black px-2.5 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                        متصدر الصفحة 🚀
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    تعديل نصوص أزرار السلة، حقول وPlaceholders نافذة الشيك أوت، كوبونات الخصم، طرق الدفع، بطاقات الأطباق، نافذة التفاصيل، وصفحات الهبوط.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveAdvancedSearch && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-300/50">
                    مطابقة للبحث ({matchingAdvancedCount})
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'size-5 text-muted-foreground transition-transform duration-300',
                    effectiveIsAdvancedOpen && 'rotate-180'
                  )}
                />
              </div>
            </button>

            {/* Accordion Body: The 4 Categorized Panels */}
            {effectiveIsAdvancedOpen && (
              <div className="p-5 sm:p-7 space-y-8 animate-in fade-in duration-300">
                {orderedAdvancedGroups.map((group) => {
                  const GroupIcon = group.icon
                  const groupFields = group.fields
                  const matchedFieldsInGroup = groupFields.filter(isFieldMatched)
                  const isGroupDimmed = appliedSearch.length > 0 && matchedFieldsInGroup.length === 0
                  const isGroupLeading = appliedSearch.length > 0 && matchedFieldsInGroup.length > 0

                  // Sort fields inside group: matched fields first!
                  const sortedGroupFields = appliedSearch.length > 0
                    ? [...group.fields].sort((a, b) => {
                        const aMatch = isFieldMatched(a) ? 1 : 0
                        const bMatch = isFieldMatched(b) ? 1 : 0
                        return bMatch - aMatch
                      })
                    : group.fields

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        'rounded-2xl border p-5 space-y-4 transition-all',
                        isGroupLeading
                          ? 'border-primary ring-2 ring-primary/20 bg-amber-50/20 dark:bg-amber-950/15 shadow-sm'
                          : isGroupDimmed
                          ? 'border-primary/10 bg-card/40 opacity-40 grayscale-[40%]'
                          : 'border-primary/15 bg-card/60'
                      )}
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <GroupIcon className="size-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-foreground">{group.title}</h4>
                              {isGroupLeading && (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-300/40">
                                  متصدر القسم 🚀
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">{group.description}</p>
                          </div>
                        </div>
                        {appliedSearch.length > 0 && matchedFieldsInGroup.length > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                            {matchedFieldsInGroup.length} نتيجة
                          </span>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedGroupFields.map((field) => {
                          const isMatch = isFieldMatched(field)
                          const currentValue = getUiStringValue(field.key)
                          const isCustomized = currentValue !== DEFAULT_UI_STRINGS[field.key]

                          return (
                            <div
                              key={field.key}
                              className={cn(
                                'rounded-xl border p-3.5 space-y-1.5 transition-all',
                                isMatch
                                  ? 'border-primary ring-2 ring-primary/30 bg-amber-50/60 dark:bg-amber-950/20'
                                  : 'border-primary/10 bg-card'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                  <span>{field.label}</span>
                                  {isMatch && (
                                    <span className="text-[9px] bg-primary text-primary-foreground font-black px-1.5 py-0.5 rounded-full">
                                      مطابق للبحث 🔍
                                    </span>
                                  )}
                                </label>
                                {isCustomized && (
                                  <button
                                    type="button"
                                    onClick={() => handleUiStringChange(field.key, DEFAULT_UI_STRINGS[field.key])}
                                    title="استعادة النص الافتراضي"
                                    className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5"
                                  >
                                    <RotateCcw className="size-2.5" />
                                    <span>استعادة</span>
                                  </button>
                                )}
                              </div>

                              <input
                                type="text"
                                value={currentValue}
                                onChange={(e) => handleUiStringChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={cn(
                                  'w-full rounded-lg border border-primary/20 bg-card px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40',
                                  isMatch && 'border-primary font-bold'
                                )}
                              />

                              <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 font-mono">
                                <span dir="ltr">{field.key}</span>
                                <span className="text-[10px] truncate max-w-[150px]" title={DEFAULT_UI_STRINGS[field.key]}>
                                  افتراضي: {DEFAULT_UI_STRINGS[field.key]}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
                )
              }

              return null
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 3: BANK ACCOUNT DETAILS (التحويل البنكي المباشر)              */}
      {/* =================================================================== */}
      {activeSubTab === 'bank' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-primary/15 text-primary">
                  <Building2 className="size-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-foreground">
                    بيانات الحساب البنكي الرسمي (Official Bank Account)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    هذه البيانات تظهر تلقائياً للعميل عند اختيار طريقة "تحويل بنكي مباشر" في شاشة إتمام الطلب (Checkout).
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                ربط سحابي مباشر
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls (Left / Col 7) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Bank Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">اسم البنك (Bank Name)</label>
                    <span className="text-[11px] text-muted-foreground">مثال: مصرف الراجحي</span>
                  </div>
                  <input
                    type="text"
                    value={content.bankName ?? ''}
                    onChange={(e) => setContent({ ...content, bankName: e.target.value })}
                    placeholder="مصرف الراجحي (Al Rajhi Bank)"
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                  />
                  {/* Bank Presets for convenience */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-muted-foreground">اختيار سريع:</span>
                    {[
                      'مصرف الراجحي (Al Rajhi Bank)',
                      'البنك الأهلي السعودي (SNB)',
                      'بنك الإنماء (Alinma Bank)',
                      'بنك الرياض (Riyad Bank)',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setContent({ ...content, bankName: preset })}
                        className="text-[10px] bg-secondary hover:bg-primary/15 hover:text-primary text-foreground/80 font-medium px-2 py-0.5 rounded-lg border border-primary/10 transition-colors cursor-pointer"
                      >
                        {preset.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">اسم صاحب الحساب المستفيد (Account Beneficiary)</label>
                  <input
                    type="text"
                    value={content.bankAccountName ?? ''}
                    onChange={(e) => setContent({ ...content, bankAccountName: e.target.value })}
                    placeholder="مؤسسة هشوشة للأطعمة الفاخرة"
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                  />
                </div>

                {/* IBAN */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">رقم الآيبان الدولي (IBAN)</label>
                    <span className="text-[11px] font-mono text-muted-foreground">يبدأ بـ SA (24 خانة)</span>
                  </div>
                  <input
                    type="text"
                    value={content.bankIban ?? ''}
                    onChange={(e) => setContent({ ...content, bankIban: e.target.value })}
                    placeholder="SA0380000456608010123456"
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono tracking-wider font-bold"
                    dir="ltr"
                  />
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">رقم الحساب المحلي (Account Number)</label>
                  <input
                    type="text"
                    value={content.bankAccountNumber ?? ''}
                    onChange={(e) => setContent({ ...content, bankAccountNumber: e.target.value })}
                    placeholder="456608010123456"
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Transfer Instructions & Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">ملاحظات وتعليمات التحويل للعميل (Instructions)</label>
                  <textarea
                    rows={3}
                    value={content.bankTransferNotes ?? ''}
                    onChange={(e) => setContent({ ...content, bankTransferNotes: e.target.value })}
                    placeholder="بعد إتمام التحويل، سيصلك رقم الطلب ويمكنك إرفاق صورة الإشعار عبر الواتساب لتسريع التجهيز."
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                  />
                </div>
              </div>

              {/* Live Preview Card (Right / Col 5) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">معاينة مباشرة لنافذة الدفع (Live Preview)</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                    كما تظهر للعميل
                  </span>
                </div>

                <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4.5 text-primary" />
                      <span className="text-xs font-black text-foreground">
                        {content.bankName || 'مصرف الراجحي (Al Rajhi Bank)'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                      حساب رسمي معتمد
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground text-[11px]">اسم الحساب المستفيد:</p>
                    <p className="font-black text-foreground">
                      {content.bankAccountName || 'مؤسسة هشوشة للأطعمة الفاخرة'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs text-muted-foreground">رقم الآيبان (IBAN):</span>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5 shadow-inner">
                      <span className="font-mono text-xs font-bold text-foreground tracking-wider select-all" dir="ltr">
                        {content.bankIban || 'SA0380000456608010123456'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-primary text-primary-foreground shrink-0 cursor-default">
                        <Copy className="size-3" />
                        <span>نسخ</span>
                      </span>
                    </div>
                  </div>

                  {content.bankAccountNumber && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono border-t border-primary/10 pt-2">
                      <span>رقم الحساب:</span>
                      <span className="font-bold text-foreground" dir="ltr">{content.bankAccountNumber}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 pt-2 border-t border-primary/10 text-[11px] text-muted-foreground leading-relaxed">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      {content.bankTransferNotes || 'بعد إتمام التحويل، سيصلك رقم الطلب ويمكنك إرفاق صورة الإشعار عبر الواتساب لتسريع التجهيز.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 4: WHATSAPP & QUICK CONTACT (زر الواتساب والتواصل)          */}
      {/* =================================================================== */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="size-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-foreground">
                    إعدادات زر الواتساب والتواصل الفوري (WhatsApp Integration)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    التحكم برقم الواتساب المتصل بالزر العائم بالمتجر، وإمكانية إخفائه أو تفعيله، والرسالة الافتراضية.
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'text-xs font-bold px-3 py-1 rounded-full border transition-colors',
                  content.whatsappFloatingEnabled !== false
                    ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/30'
                    : 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300/30'
                )}
              >
                {content.whatsappFloatingEnabled !== false ? 'زر عائم نشط ومفعّل' : 'زر عائم معطّل ومخفي'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls (Left / Col 7) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Master Switch: Toggle Floating WhatsApp Button */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-secondary/40 dark:bg-card/60 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">تفعيل ظهور زر الواتساب العائم</span>
                      {content.whatsappFloatingEnabled !== false ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          مفعّل
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                          معطّل (مخفي)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      يمكنك إخفاء الزر العائم مؤقتاً من واجهة المتجر أو إعادة تنشيطه بضغطة واحدة دون فقدان الرقم أو الإعدادات.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={content.whatsappFloatingEnabled !== false}
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        whatsappFloatingEnabled: prev.whatsappFloatingEnabled === false ? true : false,
                      }))
                    }
                    className={cn(
                      'relative flex items-center h-7 w-12 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 shrink-0 mr-3',
                      content.whatsappFloatingEnabled !== false
                        ? 'bg-emerald-600 justify-start'
                        : 'bg-muted-foreground/30 justify-end'
                    )}
                    title={content.whatsappFloatingEnabled !== false ? 'إلغاء التفعيل وإخفاء الزر' : 'تفعيل وإظهار الزر'}
                  >
                    <span className="size-5.5 rounded-full bg-white shadow-md transition-transform" />
                  </button>
                </div>

                {/* WhatsApp Phone Number */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">رقم الواتساب الرسمي (WhatsApp Number)</label>
                    <span className="text-[11px] font-mono text-muted-foreground">صيغة دولية (966XXXXXXXXX)</span>
                  </div>
                  <input
                    type="text"
                    value={content.whatsappNumber ?? ''}
                    onChange={(e) => setContent({ ...content, whatsappNumber: e.target.value })}
                    placeholder="966560602341"
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono font-bold"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    يمكنك إدخال الرقم بصيغة محلية (0560602341) أو دولية، وسيتم تحويله تلقائياً لربطه بزر الواتساب.
                  </p>
                </div>

                {/* Default Welcome Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">الرسالة الافتراضية الجاهزة في الواتساب (Default Message)</label>
                  <textarea
                    rows={3}
                    value={content.whatsappFloatingMessage ?? ''}
                    onChange={(e) => setContent({ ...content, whatsappFloatingMessage: e.target.value })}
                    placeholder="مرحباً هشوشة 🌿، أود الاستفسار بخصوص قائمة الضيافة ومواعيد التوصيل بالرياض..."
                    className="w-full rounded-xl border border-primary/20 bg-card px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    هذه الرسالة تظهر مكتوبة وجاهزة في تطبيق واتساب العميل عند النقر على الزر العائم، لسهولة وسرعة التواصل.
                  </p>
                </div>

                {/* Test Action Link */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${(content.whatsappNumber || '966560602341').replace(/\D/g, '').replace(/^0/, '966')}?text=${encodeURIComponent(content.whatsappFloatingMessage || 'مرحباً هشوشة 🌿')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>تجربة واختبار رابط الواتساب الآن</span>
                  </a>
                </div>
              </div>

              {/* Live Preview Widget Mockup (Right / Col 5) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">معاينة الزر العائم في المتجر (Widget Preview)</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-md',
                      content.whatsappFloatingEnabled !== false
                        ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300'
                    )}
                  >
                    {content.whatsappFloatingEnabled !== false ? 'مباشر (ظاهر)' : 'مخفي حالياً'}
                  </span>
                </div>

                <div className="relative rounded-2xl border border-primary/15 bg-secondary/40 p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                  <div className="absolute top-3 right-3 text-[10px] text-muted-foreground">
                    زاوية أسفل يسار الشاشة
                  </div>

                  {content.whatsappFloatingEnabled === false ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-2 py-4 animate-in fade-in">
                      <div className="size-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <MessageCircle className="size-6 opacity-40" />
                      </div>
                      <p className="text-xs font-bold text-foreground">الزر العائم مخفي حالياً عن زوار المتجر</p>
                      <p className="text-[11px] text-muted-foreground max-w-[210px] leading-relaxed">
                        لن يظهر الزر في واجهة المتجر حتى تقوم بإعادة تنشيطه عبر مفتاح التبديل أعلاه.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Mock Tooltip + Floating Button */}
                      <div className="flex items-center gap-3 animate-in fade-in">
                        <div className="rounded-xl border border-emerald-600/20 bg-card px-3.5 py-1.5 shadow-md flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">تواصل مع الضيافة</span>
                          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>

                        <div className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/25">
                          <MessageCircle className="size-7" />
                        </div>
                      </div>

                      <div className="mt-6 text-center text-xs text-muted-foreground font-mono" dir="ltr">
                        +{(content.whatsappNumber || '966560602341').replace(/\D/g, '').replace(/^0/, '966')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Theme & Palette Customizer Sub-Tab */}
      {activeSubTab === 'theme' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Section Header Card */}
          <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Palette className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-foreground">
                    ألوان وهوية المتجر (Theme & Palette Customizer)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    تحكّم كامل في درجات الألوان للوضعين النهاري والليلي مع باقات فندقية جاهزة بنقرة زر ومعاينة حية فورية.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetThemeColors}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/20 bg-secondary/80 hover:bg-secondary text-xs font-bold text-foreground transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="size-3.5 text-primary" />
                <span>استعادة الألوان الافتراضية</span>
              </button>
            </div>
          </div>

          {/* Master Dark Mode Circuit Breaker Switch Card */}
          <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-3 rounded-2xl transition-colors',
                    content.darkModeEnabled !== false ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Moon className="size-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-foreground">
                      مفتاح التحكم الرئيسي في الوضع الليلي (Master Dark Mode Switch)
                    </h4>
                    {content.darkModeEnabled !== false ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        مفعّل للمتجر
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full">
                        معطّل ومغلق نهائياً
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    عند تعطيل هذا الخيار، سيتم إخفاء أزرار التبديل الليلي في كامل واجهة المتجر ولوحة الإدارة وفرض الوضع النهاري حصرياً وحمايته من التلاعب.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={content.darkModeEnabled !== false}
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    darkModeEnabled: prev.darkModeEnabled === false ? true : false,
                  }))
                }
                className={cn(
                  'relative flex items-center h-8 w-14 rounded-full p-1 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 shrink-0 mr-2',
                  content.darkModeEnabled !== false
                    ? 'bg-emerald-600 justify-start'
                    : 'bg-muted-foreground/30 justify-end'
                )}
                title={content.darkModeEnabled !== false ? 'إلغاء تفعيل الوضع الليلي وقفل المتجر على النهاري' : 'تفعيل الوضع الليلي للمتجر'}
              >
                <span className="size-6 rounded-full bg-white shadow-md transition-transform" />
              </button>
            </div>
          </div>

          {/* 1-Click Luxury Presets */}
          <div className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4.5 text-primary" />
                <h4 className="text-sm font-black text-foreground">باقات فندقية جاهزة بنقرة زر (Luxury Presets)</h4>
              </div>
              <span className="text-[11px] text-muted-foreground">اختر باقة لتطبيقها فورياً على المتجر</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {THEME_PRESETS.map((preset) => {
                const currentTheme = content.themeColors || DEFAULT_THEME_COLORS
                const isCurrent =
                  currentTheme.light.primary.toLowerCase() === preset.colors.light.primary.toLowerCase() &&
                  currentTheme.dark.background.toLowerCase() === preset.colors.dark.background.toLowerCase()

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={cn(
                      'relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 text-right',
                      isCurrent
                        ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/30'
                        : 'border-primary/15 bg-secondary/40 hover:border-primary/40 hover:bg-secondary/70'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-foreground">{preset.name}</span>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Check className="size-3" />
                            <span>مطبقة</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Swatch Previews */}
                    <div className="space-y-2 pt-2 border-t border-primary/10">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">النهاري:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-4 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.light.background }}
                            title="الخلفية"
                          />
                          <span
                            className="size-4 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.light.card }}
                            title="البطاقات"
                          />
                          <span
                            className="size-4 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.light.primary }}
                            title="اللون الأساسي"
                          />
                          <span
                            className="size-4 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.light.border }}
                            title="الحدود"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">الليلي:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-4 rounded-full border border-white/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.dark.background }}
                            title="الخلفية"
                          />
                          <span
                            className="size-4 rounded-full border border-white/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.dark.card }}
                            title="البطاقات"
                          />
                          <span
                            className="size-4 rounded-full border border-white/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.dark.primary }}
                            title="اللون الأساسي"
                          />
                          <span
                            className="size-4 rounded-full border border-white/10 shadow-xs"
                            style={{ backgroundColor: preset.colors.dark.border }}
                            title="الحدود"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={cn(
                        'w-full py-2 rounded-xl text-xs font-bold transition-all',
                        isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 hover:bg-primary/20 text-primary'
                      )}
                    >
                      {isCurrent ? 'الباقة المعتمدة حالياً' : 'تطبيق هذه الباقة'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Granular Color Picker & Live Mini Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Manual Color Picker Controls (Col 7) */}
            <div className="lg:col-span-7 rounded-3xl border border-primary/20 bg-card p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-primary/10 pb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="size-4.5 text-primary" />
                  <div>
                    <h4 className="text-sm font-black text-foreground">محدد الألوان اليدوي (Palette Customizer)</h4>
                    <p className="text-[11px] text-muted-foreground">اختر الوضع لتعديل ألوانه بدقة وبأي درجة ترغب بها</p>
                  </div>
                </div>

                {/* Light / Dark Mode Switch */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-primary/15">
                  <button
                    type="button"
                    onClick={() => setThemeCustomizerMode('light')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      themeCustomizerMode === 'light'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Sun className="size-3.5" />
                    <span>الوضع النهاري</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeCustomizerMode('dark')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      themeCustomizerMode === 'dark'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Moon className="size-3.5" />
                    <span>الوضع الليلي</span>
                  </button>
                </div>
              </div>

              {/* Color Fields for Selected Mode */}
              {(() => {
                const currentPalette =
                  (content.themeColors || DEFAULT_THEME_COLORS)[themeCustomizerMode]

                const colorFields: {
                  key: keyof ThemeColorPalette
                  label: string
                  hint: string
                }[] = [
                  {
                    key: 'background',
                    label: 'الخلفية الأساسية للمتجر (Background)',
                    hint:
                      themeCustomizerMode === 'light'
                        ? 'الخلفية الكتانية العسلية الفاتحة لواجهة المتجر'
                        : 'الخلفية العنبرية الملكية الداكنة المريحة للعين',
                  },
                  {
                    key: 'card',
                    label: 'خلفية البطاقات والأطباق (Card Background)',
                    hint: 'اللون الخاص ببطاقات المنتجات والمودالات والشاشات المنبثقة',
                  },
                  {
                    key: 'primary',
                    label: 'اللون الذهبي/العسلي المميز (Primary Accent)',
                    hint: 'أزرار الطلب والشارات الترويجية وأيقونات التمييز الفاخرة',
                  },
                  {
                    key: 'foreground',
                    label: 'لون النصوص والعناوين (Text Foreground)',
                    hint: 'لون الخطوط والعناوين الرئيسية والأسعار لضمان الوضوح التام',
                  },
                  {
                    key: 'border',
                    label: 'الحدود والفواصل الأنيقة (Border)',
                    hint: 'إطارات البطاقات والفواصل الهادئة بين عناصر المتجر',
                  },
                ]

                return (
                  <div className="space-y-4">
                    {colorFields.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-primary/10 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <label className="text-xs font-bold text-foreground block">
                            {field.label}
                          </label>
                          <span className="text-[11px] text-muted-foreground block mt-0.5">
                            {field.hint}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Visual Color Input Swatch */}
                          <div className="relative size-10 rounded-xl border border-black/15 shadow-inner overflow-hidden cursor-pointer">
                            <input
                              type="color"
                              value={currentPalette[field.key] || '#ffffff'}
                              onChange={(e) =>
                                handleColorChange(themeCustomizerMode, field.key, e.target.value)
                              }
                              className="absolute -top-3 -left-3 size-16 cursor-pointer opacity-0"
                            />
                            <div
                              className="size-full rounded-xl"
                              style={{ backgroundColor: currentPalette[field.key] }}
                            />
                          </div>

                          {/* Hex Code Input */}
                          <input
                            type="text"
                            value={currentPalette[field.key] || ''}
                            onChange={(e) =>
                              handleColorChange(themeCustomizerMode, field.key, e.target.value)
                            }
                            placeholder="#000000"
                            maxLength={7}
                            className="w-24 px-2.5 py-2 text-xs font-mono font-bold text-center rounded-xl border border-primary/20 bg-background text-foreground uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/40"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Live Mini Preview Card (Col 5) */}
            <div className="lg:col-span-5 rounded-3xl border border-primary/20 bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4 text-primary" />
                    <h4 className="text-sm font-black text-foreground">معاينة المتجر التفاعلية الحية</h4>
                  </div>

                  {/* Preview Toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-primary/15">
                    <button
                      type="button"
                      onClick={() => setPreviewThemeMode('light')}
                      className={cn(
                        'p-1.5 rounded-lg transition-all cursor-pointer',
                        previewThemeMode === 'light'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      title="معاينة الوضع النهاري"
                    >
                      <Sun className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewThemeMode('dark')}
                      className={cn(
                        'p-1.5 rounded-lg transition-all cursor-pointer',
                        previewThemeMode === 'dark'
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      title="معاينة الوضع الليلي"
                    >
                      <Moon className="size-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground mt-3">
                  تتفاعل هذه البطاقة لحظياً مع درجات الألوان المحددة لإعطائك نظرة واقعية كما ستظهر للعميل في المتجر:
                </p>

                {/* Mockup Storefront Screen Container */}
                {(() => {
                  const pColors =
                    (content.themeColors || DEFAULT_THEME_COLORS)[previewThemeMode]

                  return (
                    <div
                      className="mt-4 rounded-2xl p-5 border transition-all duration-300 shadow-inner space-y-4"
                      style={{
                        backgroundColor: pColors.background,
                        borderColor: pColors.border,
                        color: pColors.foreground,
                      }}
                    >
                      {/* Store Header Mock */}
                      <div
                        className="flex items-center justify-between pb-3 border-b"
                        style={{ borderColor: pColors.border }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="size-7 rounded-lg flex items-center justify-center text-xs font-black shadow-xs"
                            style={{
                              backgroundColor: pColors.primary,
                              color: pColors.primaryForeground,
                            }}
                          >
                            هـ
                          </span>
                          <span
                            className="text-xs font-black"
                            style={{ color: pColors.foreground }}
                          >
                            هشوشة — HASHOUSHA
                          </span>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                          style={{
                            borderColor: pColors.primary,
                            color: pColors.primary,
                          }}
                        >
                          مخبوزات طازجة
                        </span>
                      </div>

                      {/* Mock Dish Card */}
                      <div
                        className="rounded-2xl border p-4 shadow-sm transition-all space-y-3"
                        style={{
                          backgroundColor: pColors.card,
                          borderColor: pColors.border,
                        }}
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                          <img
                            src="/images/dishes/babka-mini-nutella-pecan.png"
                            alt="معاينة الطبق"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none'
                            }}
                          />
                          <div
                            className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs"
                            style={{
                              backgroundColor: pColors.primary,
                              color: pColors.primaryForeground,
                            }}
                          >
                            الأكثر طلباً
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h5
                              className="text-xs font-black"
                              style={{ color: pColors.foreground }}
                            >
                              بابكا ميني نوتيلا وبيكان
                            </h5>
                            <span
                              className="text-xs font-black"
                              style={{ color: pColors.primary }}
                            >
                              12 ر.س
                            </span>
                          </div>
                          <p
                            className="text-[11px] mt-1 line-clamp-2 leading-relaxed"
                            style={{ color: pColors.foreground, opacity: 0.7 }}
                          >
                            عجينة بريوش مخمرة غنية بالنوتيلا الفاخرة وقطع البيكان المحمص اللذيذ.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="w-full py-2 rounded-xl text-xs font-black transition-all shadow-sm flex items-center justify-center gap-1.5"
                          style={{
                            backgroundColor: pColors.primary,
                            color: pColors.primaryForeground,
                          }}
                        >
                          <ShoppingBag className="size-3.5" />
                          <span>إضافة إلى السلة</span>
                        </button>
                      </div>

                      {/* Micro Pill */}
                      <div
                        className="text-center text-[10px] font-bold py-1.5 rounded-xl border"
                        style={{
                          borderColor: pColors.border,
                          color: pColors.primary,
                        }}
                      >
                        توصيل مجهّز لجميع أحياء الرياض 🚚
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="pt-2 text-center text-[11px] text-muted-foreground">
                اضغط على زر <strong className="text-foreground">"حفظ كافة تعديلات المظهر والمحتوى"</strong> بالأسفل لاعتماد الألوان سحابياً على المتجر فورياً.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Save Action Bar — Always visible across viewport */}
      <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:right-64 lg:left-0 pointer-events-none transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-primary/30 bg-[#2e1e0d]/95 dark:bg-[#1a120b]/95 text-[#FAF7F2] shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md pointer-events-auto ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSettings}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#FAF7F2] transition-all active:scale-95 cursor-pointer"
              title="إعادة تحميل من السحابة"
            >
              <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
              <span className="hidden sm:inline">إعادة تحميل</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#FAF7F2] transition-all active:scale-95 cursor-pointer"
              title="معاينة المتجر"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">معاينة المتجر</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>جاري الحفظ السحابي...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>حفظ كافة تعديلات المظهر والمحتوى</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SiteContentModule
