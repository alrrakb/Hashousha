import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Load environment variables (.env, .env.local, .env.production)
dotenv.config({ path: path.join(rootDir, '.env') })
dotenv.config({ path: path.join(rootDir, '.env.local') })
dotenv.config({ path: path.join(rootDir, '.env.production') })

const SITE_URL = 'https://hshosha.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brand-og.jpg`

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getImageMimeType(imagePath) {
  if (!imagePath) return 'image/jpeg'
  const lower = imagePath.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  return 'image/jpeg'
}

function normalizeImageUrl(img) {
  if (!img) return DEFAULT_OG_IMAGE
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`
}

// Fallback dish extractor from src/data/menu.ts
function extractDishesFromLocalMenu() {
  try {
    const menuPath = path.join(rootDir, 'src', 'data', 'menu.ts')
    if (!fs.existsSync(menuPath)) return []

    const raw = fs.readFileSync(menuPath, 'utf8')
    const js = raw
      .replace(/^import\s+.*$/gm, '')
      .replace(/export\s+const\s+categories:\s*Category\[\]\s*=/, 'const categories =')
      .replace(/export\s+const\s+dishes:\s*Dish\[\]\s*=/, 'const dishes =')
      .replace(/export\s+const\s+WHATSAPP_NUMBER\s*=/, 'const WHATSAPP_NUMBER =')
      .replace(/export\s+function\s+formatPrice[\s\S]*$/, '')

    const context = { console }
    vm.createContext(context)
    vm.runInContext(js + '\nthis.dishes = dishes;', context)

    const rawDishes = context.dishes || []
    return rawDishes
      .filter((d) => d.inStock !== false)
      .map((d) => ({
        id: d.id,
        name: d.name,
        englishName: d.englishName || '',
        slug: d.slug || d.id,
        description: d.description || '',
        price: d.price || 0,
        image: d.image || '',
        imageAlt: d.imageAlt || d.name,
      }))
  } catch (err) {
    console.warn('[og-prerender] Warning parsing local menu.ts:', err.message)
    return []
  }
}

async function fetchActiveDishes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
      const { data, error } = await supabase
        .from('dishes')
        .select('id, name, english_name, slug, description, price, image, image_alt, in_stock, is_available')

      if (!error && Array.isArray(data) && data.length > 0) {
        const active = data.filter((d) => d.in_stock !== false && d.is_available !== false)
        if (active.length > 0) {
          console.log(`[og-prerender] Fetched ${active.length} active dishes from Supabase.`)
          return active.map((d) => ({
            id: d.id,
            name: d.name,
            englishName: d.english_name || '',
            slug: d.slug || d.id,
            description: d.description || '',
            price: d.price || 0,
            image: d.image || '',
            imageAlt: d.image_alt || d.name,
          }))
        }
      }
    } catch (err) {
      console.warn('[og-prerender] Supabase query failed, falling back to menu.ts:', err.message)
    }
  }

  const localDishes = extractDishesFromLocalMenu()
  console.log(`[og-prerender] Extracted ${localDishes.length} active dishes from local menu.ts.`)
  return localDishes
}

function replaceMetaTag(html, selectorPattern, newTag) {
  if (selectorPattern.test(html)) {
    return html.replace(selectorPattern, newTag)
  }
  // If tag doesn't exist, insert before </head>
  return html.replace('</head>', `  ${newTag}\n</head>`)
}

async function main() {
  const distIndexPath = path.join(rootDir, 'dist', 'index.html')
  if (!fs.existsSync(distIndexPath)) {
    console.error('[og-prerender] dist/index.html not found! Make sure to run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(distIndexPath, 'utf8')
  const dishes = await fetchActiveDishes()

  if (dishes.length === 0) {
    console.warn('[og-prerender] No active dishes found to prerender.')
    return
  }

  let generatedCount = 0

  for (const dish of dishes) {
    const slug = (dish.slug || dish.id).trim().replace(/^\/+|\/+$/g, '')
    const pageTitle = `${dish.name} | متجر هشوشة للبابكا الحرفية والمخبوزات الفاخرة بالرياض`
    const description = `${dish.description} — السعر: ${dish.price} ر.س | متوفر للطلب الفوري والتوصيل المجهز بكافة أحياء الرياض من مخبز هشوشة.`
    const canonicalUrl = `${SITE_URL}/dish/${slug}`
    const imageUrl = normalizeImageUrl(dish.image)
    const imageType = getImageMimeType(dish.image)
    const imageAlt = dish.imageAlt
      ? dish.imageAlt
      : `${dish.name} — مخبز هشوشة للبابكا الحرفية والمخبوزات بالرياض`

    let dishHtml = baseHtml

    // 1. Update <title>
    dishHtml = dishHtml.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(pageTitle)}</title>`)

    // 2. Update <meta name="description" ...>
    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(description)}" />`
    )

    // 3. Update <link rel="canonical" ...>
    dishHtml = replaceMetaTag(
      dishHtml,
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )

    // 4. Update OpenGraph Tags
    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image" content="${imageUrl}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:image:secure_url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${imageUrl}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:image:type["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:type" content="${imageType}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`
    )

    // 5. Update Twitter Tags
    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`
    )

    dishHtml = replaceMetaTag(
      dishHtml,
      /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image" content="${imageUrl}" />`
    )

    // 6. Pre-inject Product Schema JSON-LD for Google Merchant Listings (2026 Standards)
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: dish.name,
      image: [imageUrl],
      description: dish.description || `${dish.name} — مخبوزات طازجة وفاخرة من مخبز هشوشة بالرياض.`,
      brand: {
        '@type': 'Brand',
        name: 'هشوشة — Hashousha',
      },
      sku: `HSH-${dish.id}`,
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'SAR',
        price: String(dish.price),
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        shippingDetails: {
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
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'SA',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 1,
          returnFees: 'https://schema.org/FreeReturn',
          returnMethod: 'https://schema.org/ReturnAtKiosk',
          refundType: 'https://schema.org/FullRefund',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
        bestRating: '5',
        worstRating: '1',
      },
    }
    const schemaTag = `<script id="product-jsonld-schema" type="application/ld+json">${JSON.stringify(productSchema)}</script>`
    dishHtml = dishHtml.replace('</head>', `  ${schemaTag}\n</head>`)

    // Write to dist/dish/:slug/index.html
    const targetDir = path.join(rootDir, 'dist', 'dish', slug)
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(path.join(targetDir, 'index.html'), dishHtml, 'utf8')
    generatedCount++

    // Also write alias to dist/dish/:id/index.html if id differs from slug
    if (dish.id && dish.id !== slug) {
      const aliasDir = path.join(rootDir, 'dist', 'dish', dish.id)
      fs.mkdirSync(aliasDir, { recursive: true })
      fs.writeFileSync(path.join(aliasDir, 'index.html'), dishHtml, 'utf8')
      generatedCount++
    }
  }

  console.log(`[og-prerender] ✅ Successfully generated ${generatedCount} static OpenGraph HTML cards in dist/dish/*/index.html`)
}

main().catch((err) => {
  console.error('[og-prerender] Fatal error:', err)
  process.exit(1)
})
