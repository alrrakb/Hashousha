/**
 * Structured Data Schemas (JSON-LD) for Hashousha Storefront
 * Following Schema.org and Google Search Central Guidelines
 */

export const BASE_SITE_URL = 'https://hshosha.com'

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FaqItem {
  question: string
  answer: string
}

export const STOREFRONT_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'ما هي روائع البابكا والمخبوزات المتوفرة لدى هشوشة؟',
    answer:
      'نقدم في هشوشة تشكيلة فاخرة من البابكا الحرفية بعجين البريوش المخمر ببطء بحشوات حلوة فاخرة (نوتيلا وبيكان أمريكي، سينابون وقرفة، كاسترد فانيليا وشوكولاتة بلجيكية) وبابكا مالحة فاخرة (بيستو وصنوبر، أجبان ثلاثية، بيتزا إيطالية، زعتر ولبنة)، بالإضافة لبوكسات ميني 24 قطعة وكوكيز هشوشة الحرفي.',
  },
  {
    question: 'هل يتوفر توصيل لجميع أحياء مدينة الرياض؟',
    answer:
      'نعم، نوفر خدمة توصيل يومية سريعة ومجهزة بسيارات مبردة لضمان وصول المخبوزات طازجة وهشة لكافة أحياء الرياض (شمال، شرق، غرب، ووسط الرياض).',
  },
  {
    question: 'هل تخبز المخبوزات طازجة يومياً؟',
    answer:
      'نعم، كافة منتجات هشوشة تُخبز يومياً عند الطلب باستخدام الزبدة الطبيعية والمكونات البكر دون أي مواد حافظة لتقديم تجربة تذوق طازجة لا تُنسى.',
  },
  {
    question: 'هل تتوفر بوكسات مناسبة للجمعات والمناسبات؟',
    answer:
      'بالتأكيد، نوفر بوكسات ميكس بابكا حجم عائلي (24 قطعة ميني مشكلة حلوة أو مالحة) مصممة خصيصاً لتبييض الوجه في الجمعات العائلية ولقاءات العمل والمناسبات.',
  },
  {
    question: 'كيف يمكنني تقديم الطلب من متجر هشوشة؟',
    answer:
      'يمكنك الطلب مباشرة وبكل سهولة عبر سلة المتجر في موقعنا الإلكتروني واختيار التوصيل الفوري أو التنسيق المباشر عبر واتساب المطبخ المركزي.',
  },
]

/**
 * Generates Valid FAQPage Schema.org structure
 */
export function getFaqPageSchema(faqItems: FaqItem[] = STOREFRONT_FAQ_ITEMS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Local Bakery / FoodEstablishment Schema for Riyadh Local SEO & Knowledge Graph
 */
export function getBakerySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${BASE_SITE_URL}/#bakery`,
    name: 'هشوشة — Hashousha | مخبز البابكا الحرفية والمخبوزات الفاخرة بالرياض',
    alternateName: [
      'هشوشة',
      'Hashousha',
      'مخبز هشوشة',
      'هشوشة للبابكا والمخبوزات',
      'Hashousha Artisanal Bakery',
    ],
    url: BASE_SITE_URL,
    logo: `${BASE_SITE_URL}/images/brand-og.jpg`,
    image: `${BASE_SITE_URL}/images/brand-og.jpg`,
    description:
      'مطبخ مركزي ومخبز حرفي فاخر بمدينة الرياض متخصص في روائع البابكا الفرنسية المجدولة بعجين البريوش المخمر ببطء بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان، مع بوكسات الضيافة وتوصيل مجهز لكافة أحياء الرياض.',
    telephone: '+966598956580',
    priceRange: '١٢ ر.س - ٨٥ ر.س',
    currenciesAccepted: 'SAR',
    paymentAccepted: ['Cash', 'Credit Card', 'Apple Pay', 'Mada', 'Bank Transfer'],
    servesCuisine: [
      'Artisanal Bakery',
      'French Brioche Babka',
      'Gourmet Cookies',
      'مخبوزات بريوش فرنسية',
      'بابكا حرفية',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'الرياض',
      addressRegion: 'منطقة الرياض',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.7136,
      longitude: 46.6753,
    },
    areaServed: [
      { '@type': 'City', name: 'الرياض' },
      { '@type': 'AdministrativeArea', name: 'شمال الرياض' },
      { '@type': 'AdministrativeArea', name: 'شرق الرياض' },
      { '@type': 'AdministrativeArea', name: 'وسط الرياض' },
      { '@type': 'AdministrativeArea', name: 'غرب الرياض' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '23:30',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'قائمة مخبوزات وبابكا هشوشة الحرفية',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'البابكا الحلوة (نوتيلا وبيكان، سينابون، كاسترد شوكولاتة)',
        },
        {
          '@type': 'OfferCatalog',
          name: 'البابكا المالحة (بيستو وصنوبر، أجبان، بيتزا، زعتر ولبنة)',
        },
        {
          '@type': 'OfferCatalog',
          name: 'بوكسات الجمعات والمناسبات حجم عائلي 24 قطعة',
        },
        {
          '@type': 'OfferCatalog',
          name: 'كوكيز هشوشة الحرفي الفاخر',
        },
      ],
    },
  }
}

/**
 * Generates Valid BreadcrumbList Schema.org structure
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Default Main Storefront Breadcrumb structure
 */
export function getDefaultStorefrontBreadcrumbs(): BreadcrumbItem[] {
  return [
    { name: 'الرئيسية', url: `${BASE_SITE_URL}/` },
    { name: 'قائمة الأطباق والمخبوزات', url: `${BASE_SITE_URL}/#menu` },
  ]
}

/**
 * Dish Product Breadcrumb structure
 */
export function getDishBreadcrumbs(dishName: string, dishSlug: string): BreadcrumbItem[] {
  return [
    { name: 'الرئيسية', url: `${BASE_SITE_URL}/` },
    { name: 'قائمة الأطباق والمخبوزات', url: `${BASE_SITE_URL}/#menu` },
    { name: dishName, url: `${BASE_SITE_URL}/dish/${dishSlug}` },
  ]
}

/**
 * Injects or updates a JSON-LD structured data script tag in <head>
 */
export function injectJsonLd(id: string, schema: Record<string, unknown>): void {
  if (typeof document === 'undefined') return
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schema)
}

/**
 * Removes a JSON-LD structured data script tag by ID
 */
export function removeJsonLd(id: string): void {
  if (typeof document === 'undefined') return
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}

/**
 * Riyadh Fast Delivery OfferShippingDetails Schema
 * Google Merchant Listings 2026 Compliant
 */
export function getShippingDetailsSchema() {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '25',
      currency: 'SAR',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'SA',
      addressRegion: 'Riyadh',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'd',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'd',
      },
    },
  }
}

/**
 * Hashousha Fresh Guarantee & Hospitality Return Policy Schema
 * Google Merchant Listings 2026 Compliant
 */
export function getMerchantReturnPolicySchema() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'SA',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 1,
    returnFees: 'https://schema.org/FreeReturn',
    returnMethod: 'https://schema.org/ReturnAtKiosk',
    refundType: 'https://schema.org/FullRefund',
  }
}

/**
 * Unified Dish Product Schema with full Google Merchant Listings & Rich Snippet support
 */
export function getDishProductSchema(dish: any, currentUrl?: string) {
  const pageUrl = currentUrl || `${BASE_SITE_URL}/dish/${dish.slug || dish.id}`
  const rawImage = dish.image || `${BASE_SITE_URL}/images/brand-og.jpg`
  const absoluteImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `${BASE_SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: dish.name,
    image: [absoluteImageUrl],
    description: dish.description || `${dish.name} — مخبوزات طازجة وفاخرة من مخبز هشوشة بالرياض.`,
    brand: {
      '@type': 'Brand',
      name: 'هشوشة — Hashousha',
    },
    sku: `HSH-${dish.id}`,
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'SAR',
      price: String(dish.price),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        dish.inStock !== false && dish.isAvailable !== false
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      shippingDetails: getShippingDetailsSchema(),
      hasMerchantReturnPolicy: getMerchantReturnPolicySchema(),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

