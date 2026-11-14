import { supabase } from './supabase'
import { Dish, BadgeKind, DishVariant } from '../types/menu'
import { AdminCategory, AdminDiscount, CustomerSummary, SeoSettings, SitemapStats, AdminReview, SiteContentSettings, StoreThemeColors, DEFAULT_THEME_COLORS, DEFAULT_SITE_CONTENT, DEFAULT_UI_STRINGS } from '../types/admin'
import { Order } from '../types/order'
import { dishes as defaultDishes, categories as defaultCategories } from '../data/menu'
import { optimizeImageToWebp, OPTIMIZER_PRESETS } from '../utils/imageOptimizer'

// Fallback initial categories if cloud table is empty
export const DEFAULT_ADMIN_CATEGORIES: AdminCategory[] = defaultCategories
  .filter((c) => c.id !== 'all')
  .map((c, index) => ({
    id: c.id,
    name: c.label,
    englishName:
      c.id === 'plain-dough-babka' ? 'Plain Dough Babka' :
      c.id === 'cocoa-dough-babka' ? 'Cocoa Dough Babka' :
      c.id === 'sweet-babka' ? 'Sweet Babka' :
      c.id === 'savory-babka' ? 'Savory Babka' :
      c.id === 'babka-boxes' ? 'Babka Boxes' : 'Artisanal Cookies',
    slug: c.id,
    sortOrder: (index + 1) * 10,
    isActive: true,
  }))

// Fallback initial discounts
export const DEFAULT_DISCOUNTS: AdminDiscount[] = [
  {
    id: 'disc_welcome10',
    code: 'HSH10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 100,
    isActive: true,
    usageCount: 14,
  },
  {
    id: 'disc_majlis25',
    code: 'MAJLIS25',
    discountType: 'fixed',
    discountValue: 25,
    minOrderAmount: 250,
    isActive: true,
    usageCount: 8,
  },
]

// Fallback initial SEO settings
export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'هشوشة (Hashousha) — متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض',
  siteDescription: 'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض.',
  keywords: 'بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة',
  ogImage: 'https://hshosha.com/images/brand-og.jpg',
  googleSiteVerification: '',
}

// ---------------------------------------------------------------------------
// 1. Image Upload via Supabase Storage ('dishes' bucket)
// ---------------------------------------------------------------------------

export async function uploadDishImage(file: File): Promise<string> {
  try {
    // 1. Client-Side WebP Optimization
    let fileToUpload = file
    try {
      const optimization = await optimizeImageToWebp(file, OPTIMIZER_PRESETS.dish)
      fileToUpload = optimization.file
    } catch (optErr) {
      console.warn('Pre-upload WebP optimization skipped:', optErr)
    }

    const fileExt = fileToUpload.name.split('.').pop() || 'webp'
    const cleanExt = fileExt.toLowerCase()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`

    const { error: uploadError } = await supabase.storage
      .from('dishes')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileToUpload.type || 'image/webp',
      })

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message)
      // Fallback: convert to Object URL for session preview
      return URL.createObjectURL(fileToUpload)
    }

    const { data: urlData } = supabase.storage.from('dishes').getPublicUrl(fileName)
    return urlData.publicUrl
  } catch (err) {
    console.warn('Storage upload exception:', err)
    return URL.createObjectURL(file)
  }
}

// ---------------------------------------------------------------------------
// 2. Dishes Cloud CRUD
// ---------------------------------------------------------------------------

interface CloudDishRow {
  id: string
  name: string
  english_name: string
  slug?: string
  description: string
  long_description?: string
  serving_info?: string
  price: number
  unit: string
  category: string
  categories?: string[]
  image: string
  image_alt?: string
  badges?: string[]
  in_stock: boolean
  variants?: DishVariant[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  highlights?: string[]
  preparation_tip?: string
  show_preparation_tip?: boolean
}

export async function fetchDishesFromSupabase(): Promise<Dish[]> {
  try {
    const { data, error } = await supabase.from('dishes').select('*')
    if (error || !data || data.length === 0) {
      return defaultDishes
    }

    return data.map((d: CloudDishRow) => {
      let localHighlights: string[] | undefined = undefined
      let localPrepTip: string | undefined = undefined
      let localShowPrep: boolean | undefined = undefined

      if (typeof window !== 'undefined') {
        try {
          const rawH = localStorage.getItem(`hashousha_dish_highlights_${d.id}`)
          if (rawH) {
            const parsed = JSON.parse(rawH)
            if (Array.isArray(parsed)) localHighlights = parsed
          }
          const rawP = localStorage.getItem(`hashousha_dish_prep_tip_${d.id}`)
          if (rawP !== null) localPrepTip = rawP
          const rawS = localStorage.getItem(`hashousha_dish_show_prep_${d.id}`)
          if (rawS !== null) localShowPrep = rawS === 'true'
        } catch {}
      }

      const finalHighlights = Array.isArray(d.highlights)
        ? d.highlights
        : (Array.isArray(localHighlights) ? localHighlights : undefined)

      return {
        id: d.id,
        name: d.name,
        englishName: d.english_name || '',
        slug: d.slug || d.id,
        description: d.description || '',
        longDescription: d.long_description || undefined,
        servingInfo: d.serving_info || undefined,
        price: Number(d.price),
        unit: d.unit || '',
        category: d.category,
        categories: Array.isArray(d.categories) && d.categories.length > 0 ? d.categories : (d.category ? [d.category] : []),
        image: d.image || '/images/dishes/babka-mini-pesto.png',
        imageAlt: d.image_alt || undefined,
        badges: (d.badges || []) as BadgeKind[],
        inStock: d.in_stock,
        variants: Array.isArray(d.variants) && d.variants.length > 0 ? d.variants : undefined,
        seoTitle: d.seo_title,
        seoDescription: d.seo_description,
        seoKeywords: Array.isArray(d.seo_keywords) ? d.seo_keywords : undefined,
        highlights: finalHighlights,
        preparationTip: d.preparation_tip || localPrepTip || undefined,
        showPreparationTip: d.show_preparation_tip !== undefined
          ? d.show_preparation_tip
          : (localShowPrep !== undefined ? localShowPrep : undefined),
      }
    })
  } catch (err) {
    console.warn('Error fetching dishes from Supabase:', err)
    return defaultDishes
  }
}

export async function saveDishToSupabase(dish: Dish): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Immediately persist highlights and preparation tip to localStorage for instant resilience
    if (typeof window !== 'undefined') {
      try {
        if (dish.highlights !== undefined) {
          localStorage.setItem(`hashousha_dish_highlights_${dish.id}`, JSON.stringify(dish.highlights))
        }
        if (dish.preparationTip !== undefined) {
          localStorage.setItem(`hashousha_dish_prep_tip_${dish.id}`, dish.preparationTip || '')
        }
        if (dish.showPreparationTip !== undefined) {
          localStorage.setItem(`hashousha_dish_show_prep_${dish.id}`, String(dish.showPreparationTip))
        }
      } catch (e) {
        console.warn('Could not cache dish customizations locally:', e)
      }
    }

    const finalCategories = Array.isArray(dish.categories) && dish.categories.length > 0
      ? dish.categories
      : (dish.category ? [dish.category] : [])

    const payload: Record<string, any> = {
      id: dish.id,
      name: dish.name,
      english_name: dish.englishName,
      slug: dish.slug || dish.id,
      description: dish.description,
      long_description: dish.longDescription || null,
      serving_info: dish.servingInfo || null,
      price: dish.price,
      unit: dish.unit,
      category: dish.category || finalCategories[0] || 'plain-dough-babka',
      categories: finalCategories,
      image: dish.image,
      image_alt: dish.imageAlt || null,
      badges: dish.badges,
      in_stock: dish.inStock,
      variants: dish.variants && dish.variants.length > 0 ? dish.variants : null,
      seo_title: dish.seoTitle || null,
      seo_description: dish.seoDescription || null,
      seo_keywords: Array.isArray(dish.seoKeywords) ? dish.seoKeywords : [],
      highlights: Array.isArray(dish.highlights) ? dish.highlights : null,
      preparation_tip: dish.preparationTip || null,
      show_preparation_tip: dish.showPreparationTip !== undefined ? dish.showPreparationTip : null,
    }

    let { error } = await supabase.from('dishes').upsert(payload, { onConflict: 'id' })
    if (error && (error.message?.includes('highlights') || error.message?.includes('preparation_tip') || error.message?.includes('show_preparation_tip'))) {
      delete payload.highlights
      delete payload.preparation_tip
      delete payload.show_preparation_tip
      const retry = await supabase.from('dishes').upsert(payload, { onConflict: 'id' })
      error = retry.error
    }
    if (error) {
      console.warn('Save dish to Supabase error:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

export async function saveDishesBulkToSupabase(dishesToSave: Dish[]): Promise<{ success: boolean; error?: string }> {
  try {
    const payloads = dishesToSave.map((dish) => {
      const finalCategories = Array.isArray(dish.categories) && dish.categories.length > 0
        ? dish.categories
        : (dish.category ? [dish.category] : [])

      return {
        id: dish.id,
        name: dish.name,
        english_name: dish.englishName,
        slug: dish.slug || dish.id,
        description: dish.description,
        long_description: dish.longDescription || null,
        serving_info: dish.servingInfo || null,
        price: dish.price,
        unit: dish.unit,
        category: dish.category || finalCategories[0] || 'plain-dough-babka',
        categories: finalCategories,
        image: dish.image,
        image_alt: dish.imageAlt || null,
        badges: dish.badges,
        in_stock: dish.inStock,
        variants: dish.variants && dish.variants.length > 0 ? dish.variants : null,
        seo_title: dish.seoTitle || null,
        seo_description: dish.seoDescription || null,
        seo_keywords: Array.isArray(dish.seoKeywords) ? dish.seoKeywords : [],
        highlights: Array.isArray(dish.highlights) ? dish.highlights : null,
        preparation_tip: dish.preparationTip || null,
        show_preparation_tip: dish.showPreparationTip !== undefined ? dish.showPreparationTip : null,
      }
    })

    let { error } = await supabase.from('dishes').upsert(payloads, { onConflict: 'id' })
    if (error && (error.message?.includes('highlights') || error.message?.includes('preparation_tip') || error.message?.includes('show_preparation_tip'))) {
      const sanitized = payloads.map(({ highlights, preparation_tip, show_preparation_tip, ...rest }: any) => rest)
      const retry = await supabase.from('dishes').upsert(sanitized, { onConflict: 'id' })
      error = retry.error
    }
    if (error) {
      console.warn('Bulk save dishes error:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

export async function deleteDishFromSupabase(dishId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('dishes').delete().eq('id', dishId)
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// 3. Categories Cloud CRUD
// ---------------------------------------------------------------------------

interface CloudCategoryRow {
  id: string
  name: string
  english_name: string
  slug: string
  sort_order: number
  is_active: boolean
}

export async function fetchCategoriesFromSupabase(): Promise<AdminCategory[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return DEFAULT_ADMIN_CATEGORIES
    }

    return data.map((c: CloudCategoryRow) => ({
      id: c.id,
      name: c.name,
      englishName: c.english_name || '',
      slug: c.slug || c.id,
      sortOrder: Number(c.sort_order),
      isActive: c.is_active,
    }))
  } catch (err) {
    console.warn('Error fetching categories from Supabase:', err)
    return DEFAULT_ADMIN_CATEGORIES
  }
}

export async function saveCategoryToSupabase(cat: AdminCategory): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('categories').upsert({
      id: cat.id,
      name: cat.name,
      english_name: cat.englishName,
      slug: cat.slug,
      sort_order: cat.sortOrder,
      is_active: cat.isActive,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

export async function deleteCategoryFromSupabase(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

// ---------------------------------------------------------------------------
// 4. Discounts Cloud CRUD & Validation Engine
// ---------------------------------------------------------------------------

interface CloudDiscountRow {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  is_active: boolean
}

export async function fetchDiscountsFromSupabase(): Promise<AdminDiscount[]> {
  try {
    const { data, error } = await supabase.from('discounts').select('*')
    if (error || !data || data.length === 0) {
      return DEFAULT_DISCOUNTS
    }
    return data.map((d: CloudDiscountRow) => ({
      id: d.id,
      code: d.code.toUpperCase(),
      discountType: d.discount_type,
      discountValue: Number(d.discount_value),
      minOrderAmount: Number(d.min_order_amount),
      isActive: d.is_active,
    }))
  } catch (err) {
    console.warn('Error fetching discounts from Supabase:', err)
    return DEFAULT_DISCOUNTS
  }
}

export async function saveDiscountToSupabase(d: AdminDiscount): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('discounts').upsert({
      id: d.id,
      code: d.code.toUpperCase().trim(),
      discount_type: d.discountType,
      discount_value: d.discountValue,
      min_order_amount: d.minOrderAmount,
      is_active: d.isActive,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

export async function deleteDiscountFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('discounts').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

export async function validateCouponCode(
  rawCode: string,
  subtotal: number,
  cachedDiscounts?: AdminDiscount[]
): Promise<{
  valid: boolean
  discountAmount: number
  discount?: AdminDiscount
  message: string
}> {
  const code = rawCode.trim().toUpperCase()
  if (!code) {
    return { valid: false, discountAmount: 0, message: 'يرجى كتابة كود الخصم' }
  }

  const allDiscounts = cachedDiscounts && cachedDiscounts.length > 0
    ? cachedDiscounts
    : await fetchDiscountsFromSupabase()

  const match = allDiscounts.find((d) => d.code === code && d.isActive)

  if (!match) {
    return {
      valid: false,
      discountAmount: 0,
      message: 'كود الخصم غير صحيح أو منتهي الصلاحية',
    }
  }

  if (subtotal < match.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `الحد الأدنى لتطبيق هذا الكوبون هو ${match.minOrderAmount} ر.س`,
    }
  }

  let discountAmount = 0
  if (match.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * match.discountValue) / 100)
  } else {
    discountAmount = match.discountValue
  }

  // Ensure discount does not exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal)

  return {
    valid: true,
    discountAmount,
    discount: match,
    message:
      match.discountType === 'percentage'
        ? `تم تطبيق خصم ${match.discountValue}% بنجاح`
        : `تم تطبيق خصم ${match.discountValue} ر.س بنجاح`,
  }
}

// ---------------------------------------------------------------------------
// 5. SEO Settings Cloud CRUD
// ---------------------------------------------------------------------------

export async function fetchSeoSettings(): Promise<SeoSettings> {
  try {
    const { data, error } = await supabase.from('seo_settings').select('*').limit(1).maybeSingle()
    const localVerification = typeof window !== 'undefined' ? localStorage.getItem('hashousha_google_site_verification') : null

    if (error || !data) {
      return {
        ...DEFAULT_SEO_SETTINGS,
        googleSiteVerification: localVerification || '',
      }
    }
    return {
      id: data.id,
      siteTitle: data.site_title || DEFAULT_SEO_SETTINGS.siteTitle,
      siteDescription: data.site_description || DEFAULT_SEO_SETTINGS.siteDescription,
      keywords: data.keywords || DEFAULT_SEO_SETTINGS.keywords,
      ogImage: data.og_image || DEFAULT_SEO_SETTINGS.ogImage,
      googleSiteVerification: data.google_site_verification || localVerification || '',
    }
  } catch {
    const localVerification = typeof window !== 'undefined' ? localStorage.getItem('hashousha_google_site_verification') : null
    return {
      ...DEFAULT_SEO_SETTINGS,
      googleSiteVerification: localVerification || '',
    }
  }
}

export async function saveSeoSettings(settings: SeoSettings): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanVerification = settings.googleSiteVerification?.trim() || null

    // Always mirror to localStorage for instant hydration across pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('hashousha_google_site_verification', cleanVerification || '')
    }

    const payload: Record<string, any> = {
      id: settings.id || 'default_seo',
      site_title: settings.siteTitle,
      site_description: settings.siteDescription,
      keywords: settings.keywords,
      og_image: settings.ogImage,
      google_site_verification: cleanVerification,
    }

    let { error } = await supabase.from('seo_settings').upsert(payload)

    // Graceful fallback if column google_site_verification is not created yet in remote Supabase schema
    if (error && (error.message?.includes('google_site_verification') || error.code === 'PGRST204')) {
      console.warn('Column google_site_verification not in remote table yet, saving other fields to Supabase:', error.message)
      delete payload.google_site_verification
      const retry = await supabase.from('seo_settings').upsert(payload)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

// ---------------------------------------------------------------------------
// 5.5. Sitemap Hub & Real-time Metrics
// ---------------------------------------------------------------------------

export const OFFICIAL_SITEMAP_URL = 'https://hshosha.com/sitemap.xml'
export const SITEMAP_STORAGE_KEY = 'hashousha_sitemap_last_synced'

export async function getSitemapStats(): Promise<SitemapStats> {
  try {
    // 1. Query live active dishes count from Supabase
    let activeDishesCount = 0
    const { data, error } = await supabase
      .from('dishes')
      .select('id, in_stock, updated_at')

    if (!error && Array.isArray(data) && data.length > 0) {
      activeDishesCount = data.filter((d) => d.in_stock !== false).length
    } else {
      // Fallback to default dishes
      activeDishesCount = defaultDishes.filter((d) => d.inStock !== false).length
    }

    // 2. Read last modified timestamp
    let lastModified = ''
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SITEMAP_STORAGE_KEY)
      if (stored) {
        lastModified = stored
      }
    }
    if (!lastModified) {
      lastModified = new Date().toISOString()
    }

    return {
      sitemapUrl: OFFICIAL_SITEMAP_URL,
      totalPages: 1 + activeDishesCount, // 1 Homepage + active dishes
      activeDishesCount,
      isGoogleCompliant: true,
      lastModified,
    }
  } catch (err) {
    console.warn('[getSitemapStats] Error fetching live sitemap stats:', err)
    const fallbackActive = defaultDishes.filter((d) => d.inStock !== false).length
    return {
      sitemapUrl: OFFICIAL_SITEMAP_URL,
      totalPages: 1 + fallbackActive,
      activeDishesCount: fallbackActive,
      isGoogleCompliant: true,
      lastModified: new Date().toISOString(),
    }
  }
}

export async function triggerSitemapRegeneration(): Promise<{ success: boolean; stats: SitemapStats; error?: string }> {
  try {
    // 1. Fetch latest active dishes and verify connection
    const stats = await getSitemapStats()
    const nowIso = new Date().toISOString()
    stats.lastModified = nowIso

    // 2. Persist last synced timestamp
    if (typeof window !== 'undefined') {
      localStorage.setItem(SITEMAP_STORAGE_KEY, nowIso)
      window.dispatchEvent(new CustomEvent('hashousha_sitemap_updated', { detail: stats }))
    }

    return { success: true, stats }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error during sitemap regeneration'
    return {
      success: false,
      stats: {
        sitemapUrl: OFFICIAL_SITEMAP_URL,
        totalPages: 1 + defaultDishes.length,
        activeDishesCount: defaultDishes.length,
        isGoogleCompliant: true,
        lastModified: new Date().toISOString(),
      },
      error: msg,
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Customers Directory Aggregator from Orders
// ---------------------------------------------------------------------------

export function aggregateCustomersFromOrders(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>()

  for (const order of orders) {
    const phone = order.customer.phone.trim()
    const name = order.customer.name.trim() || 'عميل كريم'
    const key = phone || order.id

    const existing = map.get(key)
    if (!existing) {
      map.set(key, {
        id: `cust_${key}`,
        name,
        phone,
        primaryDistrict: order.customer.district || 'الرياض',
        totalOrders: 1,
        lifetimeSpend: order.status !== 'cancelled' ? order.totalAmount : 0,
        lastOrderDate: order.createdAt,
        notes: order.customer.notes,
      })
    } else {
      existing.totalOrders += 1
      if (order.status !== 'cancelled') {
        existing.lifetimeSpend += order.totalAmount
      }
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt
        existing.primaryDistrict = order.customer.district || existing.primaryDistrict
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders)
}

// ---------------------------------------------------------------------------
// 7. Customer Reviews Cloud CRUD & Moderation Engine
// ---------------------------------------------------------------------------

interface CloudReviewRow {
  id: string
  dish_id: string
  dish_name: string
  customer_name: string
  rating: number
  comment: string
  is_published: boolean
  created_at: string
}

export async function fetchReviewsForDish(dishId: string): Promise<AdminReview[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('dish_id', dishId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.warn('Failed to fetch reviews for dish:', error?.message)
      return []
    }

    return data.map((r: CloudReviewRow) => ({
      id: r.id,
      dishId: r.dish_id,
      dishName: r.dish_name,
      customerName: r.customer_name,
      rating: Number(r.rating),
      comment: r.comment,
      isPublished: r.is_published,
      createdAt: r.created_at,
    }))
  } catch (err) {
    console.warn('Network error fetching dish reviews:', err)
    return []
  }
}

export async function fetchAllReviews(): Promise<AdminReview[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.warn('Failed to fetch all reviews:', error?.message)
      return []
    }

    return data.map((r: CloudReviewRow) => ({
      id: r.id,
      dishId: r.dish_id,
      dishName: r.dish_name,
      customerName: r.customer_name,
      rating: Number(r.rating),
      comment: r.comment,
      isPublished: r.is_published,
      createdAt: r.created_at,
    }))
  } catch (err) {
    console.warn('Network error fetching all reviews:', err)
    return []
  }
}

export async function submitCustomerReview(review: {
  dishId: string
  dishName: string
  customerName: string
  rating: number
  comment: string
}): Promise<{ success: boolean; data?: AdminReview; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        dish_id: review.dishId,
        dish_name: review.dishName,
        customer_name: review.customerName.trim(),
        rating: Math.min(5, Math.max(1, review.rating)),
        comment: review.comment.trim(),
        is_published: true,
      })
      .select()
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'فشل في حفظ التقييم' }
    }

    const createdReview: AdminReview = {
      id: data.id,
      dishId: data.dish_id,
      dishName: data.dish_name,
      customerName: data.customer_name,
      rating: Number(data.rating),
      comment: data.comment,
      isPublished: data.is_published,
      createdAt: data.created_at,
    }

    return { success: true, data: createdReview }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error'
    return { success: false, error: message }
  }
}

export async function updateReviewPublishStatus(
  reviewId: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ is_published: isPublished })
      .eq('id', reviewId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown' }
  }
}

// ---------------------------------------------------------------------------
// 8. Site Content & Media CMS (public.site_content)
// ---------------------------------------------------------------------------

interface CloudSiteContentRow {
  id: string
  hero_image?: string
  logo_image?: string
  favicon?: string
  og_image?: string
  hero_tag?: string
  hero_title?: string
  hero_subtitle?: string
  hero_description?: string
  hero_alt?: string
  pillars?: Array<{ title: string; subtitle: string }>
  footer_title?: string
  footer_subtitle?: string
  delivery_notice?: string
  bank_name?: string
  bank_account_name?: string
  bank_iban?: string
  bank_account_number?: string
  bank_transfer_notes?: string
  whatsapp_number?: string
  whatsapp_floating_message?: string
  whatsapp_floating_enabled?: boolean
  dark_mode_enabled?: boolean
  ui_strings?: Record<string, string>
  theme_colors?: StoreThemeColors
  updated_at?: string
}

export async function fetchSiteContent(): Promise<SiteContentSettings> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'primary')
      .maybeSingle()

    if (error || !data) {
      return DEFAULT_SITE_CONTENT
    }

    const row = data as CloudSiteContentRow
    return {
      id: row.id,
      heroImage: row.hero_image || DEFAULT_SITE_CONTENT.heroImage,
      logoImage: row.logo_image || DEFAULT_SITE_CONTENT.logoImage,
      favicon: row.favicon || DEFAULT_SITE_CONTENT.favicon,
      ogImage: row.og_image || DEFAULT_SITE_CONTENT.ogImage,
      heroTag: row.hero_tag || DEFAULT_SITE_CONTENT.heroTag,
      heroTitle: row.hero_title || DEFAULT_SITE_CONTENT.heroTitle,
      heroSubtitle: row.hero_subtitle || DEFAULT_SITE_CONTENT.heroSubtitle,
      heroDescription: row.hero_description || DEFAULT_SITE_CONTENT.heroDescription,
      heroAlt: row.hero_alt || DEFAULT_SITE_CONTENT.heroAlt,
      pillars: Array.isArray(row.pillars) && row.pillars.length > 0 ? row.pillars : DEFAULT_SITE_CONTENT.pillars,
      footerTitle: row.footer_title || DEFAULT_SITE_CONTENT.footerTitle,
      footerSubtitle: row.footer_subtitle || DEFAULT_SITE_CONTENT.footerSubtitle,
      deliveryNotice: row.delivery_notice || DEFAULT_SITE_CONTENT.deliveryNotice,
      bankName: row.bank_name || DEFAULT_SITE_CONTENT.bankName,
      bankAccountName: row.bank_account_name || DEFAULT_SITE_CONTENT.bankAccountName,
      bankIban: row.bank_iban || DEFAULT_SITE_CONTENT.bankIban,
      bankAccountNumber: row.bank_account_number || DEFAULT_SITE_CONTENT.bankAccountNumber,
      bankTransferNotes: row.bank_transfer_notes || DEFAULT_SITE_CONTENT.bankTransferNotes,
      whatsappNumber: row.whatsapp_number || DEFAULT_SITE_CONTENT.whatsappNumber,
      whatsappFloatingMessage: row.whatsapp_floating_message || DEFAULT_SITE_CONTENT.whatsappFloatingMessage,
      whatsappFloatingEnabled:
        row.whatsapp_floating_enabled !== undefined && row.whatsapp_floating_enabled !== null
          ? Boolean(row.whatsapp_floating_enabled)
          : (DEFAULT_SITE_CONTENT.whatsappFloatingEnabled ?? true),
      darkModeEnabled:
        row.dark_mode_enabled !== undefined && row.dark_mode_enabled !== null
          ? Boolean(row.dark_mode_enabled)
          : (DEFAULT_SITE_CONTENT.darkModeEnabled ?? true),
      uiStrings: { ...DEFAULT_UI_STRINGS, ...(row.ui_strings || {}) },
      themeColors: row.theme_colors || DEFAULT_SITE_CONTENT.themeColors || DEFAULT_THEME_COLORS,
      updatedAt: row.updated_at,
    }
  } catch (err) {
    console.warn('Error fetching site_content from Supabase:', err)
    return DEFAULT_SITE_CONTENT
  }
}

export async function saveSiteContent(
  settings: Partial<SiteContentSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: 'primary',
      hero_image: settings.heroImage,
      logo_image: settings.logoImage,
      favicon: settings.favicon,
      og_image: settings.ogImage,
      hero_tag: settings.heroTag,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      hero_description: settings.heroDescription,
      hero_alt: settings.heroAlt,
      pillars: settings.pillars,
      footer_title: settings.footerTitle,
      footer_subtitle: settings.footerSubtitle,
      delivery_notice: settings.deliveryNotice,
      bank_name: settings.bankName,
      bank_account_name: settings.bankAccountName,
      bank_iban: settings.bankIban,
      bank_account_number: settings.bankAccountNumber,
      bank_transfer_notes: settings.bankTransferNotes,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_floating_message: settings.whatsappFloatingMessage,
      whatsapp_floating_enabled: settings.whatsappFloatingEnabled ?? true,
      dark_mode_enabled: settings.darkModeEnabled ?? true,
      ui_strings: settings.uiStrings,
      theme_colors: settings.themeColors,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('site_content').upsert(payload)

    if (error) {
      console.error('Error saving site_content:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error'
    return { success: false, error: message }
  }
}

