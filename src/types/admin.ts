export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'discounts'
  | 'seo'
  | 'reviews'
  | 'site-content'

export interface AdminReview {
  id: string
  dishId: string
  dishName: string
  customerName: string
  rating: number // 1 to 5
  comment: string
  isPublished: boolean
  createdAt: string
}

export interface AdminCategory {
  id: string
  name: string
  englishName: string
  slug: string
  sortOrder: number
  isActive: boolean
}

export interface AdminBadge {
  id: string
  label: string
  englishLabel?: string
  description?: string
  colorPreset?: 'amber' | 'emerald' | 'rose' | 'primary' | 'purple' | 'blue'
  iconName?: string
  sortOrder?: number
  isDefault?: boolean
}

export interface AdminDiscount {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount: number
  isActive: boolean
  usageCount?: number
}

export interface CustomerSummary {
  id: string
  name: string
  phone: string
  primaryDistrict: string
  totalOrders: number
  lifetimeSpend: number
  lastOrderDate: string
  notes?: string
}

export interface SeoSettings {
  id?: string
  siteTitle: string
  siteDescription: string
  keywords: string
  ogImage: string
}

export interface BrandPillarItem {
  title: string
  subtitle: string
}

export interface ThemeColorPalette {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  border: string
}

export interface StoreThemeColors {
  light: ThemeColorPalette
  dark: ThemeColorPalette
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  colors: StoreThemeColors
}

export const DEFAULT_THEME_COLORS: StoreThemeColors = {
  light: {
    background: '#faf7f2',
    foreground: '#2e1e0d',
    card: '#fdfbf7',
    cardForeground: '#2e1e0d',
    primary: '#9e774c',
    primaryForeground: '#faf7f2',
    border: '#e8ddd0',
  },
  dark: {
    background: '#1a120b', // Deep honey-roasted amber noir
    foreground: '#faf7f2',
    card: '#241a12',       // Dark chocolate honey card
    cardForeground: '#faf7f2',
    primary: '#c29567',    // Warm honey gold
    primaryForeground: '#1a120b',
    border: '#3d2c1e',
  },
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal-honey',
    name: 'العسل الملكي والكتان (شعار هشوشة)',
    description: 'درجات الكتان العسلي الفاتح مع توهج ذهبي دافئ وخلفية ليلية عنبرية فاخرة',
    colors: {
      light: {
        background: '#f6f1e8',
        foreground: '#2b1d0c',
        card: '#fdfbf7',
        cardForeground: '#2b1d0c',
        primary: '#b0834f',
        primaryForeground: '#fdfbf7',
        border: '#e6dac8',
      },
      dark: {
        background: '#18110a',
        foreground: '#f6f1e8',
        card: '#24180f',
        cardForeground: '#f6f1e8',
        primary: '#d4a366',
        primaryForeground: '#18110a',
        border: '#3b281a',
      },
    },
  },
  {
    id: 'espresso-caramel',
    name: 'الإسبريسو والكراميل الذهبي',
    description: 'درجات قهوة البن المحمص الغنية مع لمسات الكراميل الدافئة',
    colors: {
      light: {
        background: '#faf7f2',
        foreground: '#24170b',
        card: '#ffffff',
        cardForeground: '#24170b',
        primary: '#946338',
        primaryForeground: '#ffffff',
        border: '#e8dccf',
      },
      dark: {
        background: '#140e08',
        foreground: '#faf7f2',
        card: '#1e140d',
        cardForeground: '#faf7f2',
        primary: '#be8751',
        primaryForeground: '#140e08',
        border: '#332014',
      },
    },
  },
  {
    id: 'classic-luxury',
    name: 'المخبوزات الحرفية الكلاسيكية',
    description: 'الهوية الكلاسيكية المعتمدة لمخبوزات وبابكا هشوشة',
    colors: DEFAULT_THEME_COLORS,
  },
]

export interface SiteContentSettings {
  id?: string
  heroImage: string
  logoImage: string
  favicon: string
  ogImage: string
  heroTag: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroAlt: string
  pillars: BrandPillarItem[]
  footerTitle: string
  footerSubtitle: string
  deliveryNotice: string
  // Bank Account Details (التحويل البنكي المباشر)
  bankName?: string
  bankAccountName?: string
  bankIban?: string
  bankAccountNumber?: string
  bankTransferNotes?: string
  // WhatsApp & Contact Details (زر الواتساب والتواصل)
  whatsappNumber?: string
  whatsappFloatingMessage?: string
  whatsappFloatingEnabled?: boolean
  darkModeEnabled?: boolean
  uiStrings?: Record<string, string>
  themeColors?: StoreThemeColors
  updatedAt?: string
}

export const DEFAULT_UI_STRINGS: Record<string, string> = {
  // 1. Cart & OrderBar (3)
  'orderBar.checkoutBtn': 'إتمام الطلب',
  'orderBar.itemsSuffix': 'أصناف',
  'orderBar.currency': 'ر.س',

  // 2. Checkout Modal & Customer Form (17)
  'checkout.modalTitle': 'إتمام الطلب الفاخر',
  'checkout.modalSubtitle': 'مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض',
  'checkout.summaryTitle': 'ملخص محتويات الطلب',
  'checkout.recipientHeader': 'بيانات المستلم وعنوان التوصيل في الرياض',
  'checkout.nameLabel': 'الاسم الكريم',
  'checkout.namePlaceholder': 'مثال: سارة العبدالله',
  'checkout.phoneLabel': 'رقم الجوال (واتساب)',
  'checkout.phonePlaceholder': '05XXXXXXXX',
  'checkout.phoneHelper': 'سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم',
  'checkout.districtLabel': 'الحي السكني بالرياض',
  'checkout.districtPlaceholder': 'اختر حيك السكني أو ابحث عنه...',
  'checkout.districtNotice': 'توصيل لجميع أحياء الرياض',
  'checkout.districtSelectDefault': '-- اختر حي التوصيل --',
  'checkout.addressLabel': 'العنوان بالتفصيل / معلم بارز',
  'checkout.addressPlaceholder': 'اسم الشارع، رقم المبنى، أو معلم قريب...',
  'checkout.notesLabel': 'ملاحظات خاصة بالضيافة أو التوصيل',
  'checkout.notesPlaceholder': 'حرارة الشطة، توقيت التسليم، إهداء خاص...',

  // 3. Payment Methods, Discounts & Summary (12)
  'checkout.paymentMethodHeader': 'طريقة الدفع المفضلة',
  'checkout.paymentCodTitle': 'الدفع عند الاستلام',
  'checkout.paymentCodSubtitle': 'نقداً أو عبر بطاقة مدى عند استلام الطلب',
  'checkout.paymentTransferTitle': 'تحويل بنكي مباشر',
  'checkout.paymentTransferSubtitle': 'حساب الراجحي أو الأهلي (إرفاق الإشعار)',
  'checkout.couponLabel': 'كوبون الخصم:',
  'checkout.couponPlaceholder': 'مثال: RAMADAN10 أو HASH20',
  'checkout.couponApplyBtn': 'تطبيق',
  'checkout.subtotalTitle': 'المجموع الفرعي',
  'checkout.deliveryFeeTitle': 'توصيل مجهّز (سيارات مبردة)',
  'checkout.totalTitle': 'الإجمالي النهائي',
  'checkout.submitOrderBtn': 'تأكيد الطلب',

  // 4. Order Confirmation & Success View (11)
  'orderSuccess.badge': 'تم استلام طلبك بنجاح',
  'orderSuccess.title': 'مطبخ هشوشة بدأ بالتحضير',
  'orderSuccess.subtitle': 'شكراً لثقتك بهشوشة. يتم تحضير أطباقك طازجة باستخدام أرقى المكونات والوصفات المنزلية الأصيلة.',
  'orderSuccess.trackingLabel': 'رقم تتبع طلبك:',
  'orderSuccess.copyBtn': 'نسخ الرمز',
  'orderSuccess.copiedBtn': 'تم النسخ بنجاح',
  'orderSuccess.customerLabel': 'العميل الكريم:',
  'orderSuccess.locationLabel': 'موقع التوصيل:',
  'orderSuccess.paymentLabel': 'طريقة الدفع:',
  'orderSuccess.totalLabel': 'المجموع النهائي (شامل التوصيل):',
  'orderSuccess.whatsappBtn': 'إرسال نسخة وتأكيد عبر الواتساب',

  // 5. Dish Cards & Quick Catalog Actions (3)
  'dishCard.soldOutBadge': 'نفد اليوم',
  'dishCard.unavailableBtn': 'غير متوفر اليوم',
  'dishCard.addBtn': 'أضف للطلب',

  // 6. Product Detail Modal Hospitality & Story (12)
  'dishModal.addToCartBtn': 'إضافة إلى السلة',
  'dishModal.soldOutBtn': 'نفد اليوم',
  'dishModal.storyTitle': 'قصة الصنع والتحضير',
  'dishModal.pairingsTitle': 'أطباق تكمّل جمعتكم',
  'dishModal.defaultServing': 'تكفي ٤-٦ أشخاص',
  'dishModal.aboutTitle': 'عن هذا الطبق الفاخر',
  'dishModal.servingTipTitle': 'طريقة التقديم الفندقية المقترحة:',
  'dishModal.servingTipText': 'يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.',
  'dishModal.highlightFresh': 'تحضير طازج يومياً بالرياض',
  'dishModal.highlightIngredients': 'زيت زيتون بكر ودبس رمان أصلي',
  'dishModal.highlightPackaging': 'تغليف حراري مخصص للجمعات',
  'dishModal.highlightDelivery': 'توصيل فوري بسيارات مجهزة',

  // 7. Dedicated Product Landing Page & Riyadh Reviews (11)
  'landing.backToCatalog': 'تصفح كامل أطباق هشوشة',
  'landing.storyTitle': 'قصة الطبق وسر التحضير الحرفي',
  'landing.servingTipTitle': 'سر التقديم الفندقي لضيوفكم:',
  'landing.servingTipText': 'يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر وحبوب الرمان الطازجة.',
  'landing.deliveryTitle': 'التوصيل متوفر لجميع أحياء الرياض:',
  'landing.deliveryText': 'الملقا، حطين، النرجس، الياسمين، الصحافة، الغدير، العليا، السليمانية، الروضة، وكافة الأحياء الأخرى مع خيارات الدفع عند الاستلام، أبل باي، ومدى.',
  'landing.reviewsTitle': 'آراء وتجارب ذواقة الرياض',
  'landing.reviewsSubtitle': 'تجارب حقيقية لعملاء وثقوا بضيافة هشوشة في جمعاتهم ومناسباتهم الخاصة',
  'landing.addReviewBtn': 'شاركنا تجربتك وتقييمك للطبق ✍️',
  'landing.verifiedBadge': 'عميل موثّق 🌿',
  'landing.pairingsTitle': 'يكمل جمعتكم (أطباق متناغمة)',
}

export const DEFAULT_SITE_CONTENT: SiteContentSettings = {
  heroImage: '/images/hero.png',
  logoImage: '',
  favicon: '/favicon.ico',
  ogImage: '/images/hero.png',
  heroTag: 'Riyadh · Artisanal Babka & Bakery',
  heroTitle: 'ترف البابكا والمخبوزات الفاخرة',
  heroSubtitle: 'تُخبز طازجة يومياً',
  heroDescription: 'روائع البابكا والمخبوزات الحرفية، تُخبز بشغف وإتقان يومياً لتليق بأرقى مجالس الضيافة.',
  heroAlt: 'بابكا حرفية مجدولة ومخبوزات وكوكيز فاخر من هشوشة',
  pillars: [
    { title: 'عجين بريوش مخمر ببطء', subtitle: 'طحين فاخر وزبدة نقية طازجة' },
    { title: 'حشوات غنية وأصيلة', subtitle: 'نوتيلا وبيكان، بيستو، وأجبان معتقة' },
    { title: 'تقديم وإهداء يبيّض الوجه', subtitle: 'بوكسات فندقية أنيقة للمجالس' },
    { title: 'توصيل مجهّز بالرياض', subtitle: 'سيارات مبردة لحفظ الطراوة والدفء' },
  ],
  footerTitle: 'هشوشة',
  footerSubtitle: 'H A S H O U S H A — Sweet & Savory Bakes · الرياض، المملكة العربية السعودية',
  deliveryNotice: 'التوصيل متوفر لجميع أحياء الرياض بسيارات مجهزة ومبردة',
  // Bank Account Defaults
  bankName: 'مصرف الراجحي (Al Rajhi Bank)',
  bankAccountName: 'مؤسسة هشوشة للأطعمة الفاخرة',
  bankIban: 'SA0380000456608010123456',
  bankAccountNumber: '456608010123456',
  bankTransferNotes: 'بعد إتمام التحويل، سيصلك رقم الطلب ويمكنك إرفاق صورة الإشعار عبر الواتساب لتسريع التجهيز.',
  // WhatsApp Defaults
  whatsappNumber: '966598956580',
  whatsappFloatingMessage: 'مرحباً هشوشة 🌿، أود الاستفسار بخصوص قائمة البابكا والمخبوزات الفاخرة ومواعيد التوصيل بالرياض...',
  whatsappFloatingEnabled: true,
  darkModeEnabled: false,
  uiStrings: DEFAULT_UI_STRINGS,
  themeColors: DEFAULT_THEME_COLORS,
}

