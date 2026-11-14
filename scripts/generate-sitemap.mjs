import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables (.env, .env.local, .env.production)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env') })
dotenv.config({ path: path.join(rootDir, '.env.local') })
dotenv.config({ path: path.join(rootDir, '.env.production') })

const SITE_URL = 'https://hshosha.com'
const TODAY = new Date().toISOString().split('T')[0]

// Helper to sanitize XML text
function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Fallback dish extractor from src/data/menu.ts when Supabase is unreachable
function extractDishesFromLocalMenu() {
  try {
    const menuPath = path.join(rootDir, 'src', 'data', 'menu.ts')
    if (!fs.existsSync(menuPath)) return []

    const content = fs.readFileSync(menuPath, 'utf8')
    const dishes = []

    // Only inspect the dishes export array, ignoring categories
    const dishesSection = content.split(/export\s+const\s+dishes/)[1] || content

    // Match dish objects with id, slug, and inStock
    const dishBlocks = dishesSection.split(/\{\s*id\s*:/g).slice(1)
    for (const block of dishBlocks) {
      // Must be a top-level dish, not a sub-variant
      const isTopLevelDish = block.includes('category:') || block.includes('categories:') || block.includes('image:')
      if (!isTopLevelDish) continue

      const idMatch = block.match(/^\s*["']([^"']+)["']/)
      const slugMatch = block.match(/slug\s*:\s*["']([^"']+)["']/)
      const inStockMatch = block.match(/inStock\s*:\s*(true|false)/)

      const id = idMatch ? idMatch[1] : null
      const slug = slugMatch ? slugMatch[1] : id
      const inStock = inStockMatch ? inStockMatch[1] === 'true' : true

      if (id && inStock) {
        dishes.push({
          id,
          slug,
          updated_at: TODAY,
        })
      }
    }
    return dishes
  } catch (err) {
    console.warn('[sitemap-generator] Failed to parse local menu.ts fallback:', err.message)
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
      console.log(`[sitemap-generator] Connecting to Supabase at: ${supabaseUrl}`)
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })

      const { data, error } = await supabase
        .from('dishes')
        .select('id, slug, in_stock, updated_at')

      if (error) {
        console.warn('[sitemap-generator] Supabase query error, falling back to local menu:', error.message)
      } else if (Array.isArray(data) && data.length > 0) {
        // Filter only active dishes: in_stock !== false
        const active = data.filter((d) => d.in_stock !== false)
        console.log(`[sitemap-generator] Found ${active.length} active dishes in Supabase.`)
        return active.map((d) => ({
          id: d.id,
          slug: d.slug || d.id,
          updated_at: d.updated_at ? new Date(d.updated_at).toISOString().split('T')[0] : TODAY,
        }))
      }
    } catch (err) {
      console.warn('[sitemap-generator] Supabase connection failed, using local fallback:', err.message)
    }
  } else {
    console.log('[sitemap-generator] No Supabase credentials found in environment. Using local menu.ts fallback.')
  }

  // Fallback to static menu.ts
  const fallback = extractDishesFromLocalMenu()
  console.log(`[sitemap-generator] Extracted ${fallback.length} active dishes from local menu data.`)
  return fallback
}

export async function generateSitemap() {
  console.log('[sitemap-generator] Generating dynamic sitemap for Hashousha...')
  const dishes = await fetchActiveDishes()

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // 1. Homepage Entry (Priority 1.0, Daily)
  xml += `  <url>\n`
  xml += `    <loc>${escapeXml(`${SITE_URL}/`)}</loc>\n`
  xml += `    <lastmod>${TODAY}</lastmod>\n`
  xml += `    <changefreq>daily</changefreq>\n`
  xml += `    <priority>1.0</priority>\n`
  xml += `  </url>\n`

  // 2. Active Dishes Entries (Priority 0.8, Weekly)
  const seenSlugs = new Set()
  for (const dish of dishes) {
    const slug = dish.slug || dish.id
    if (!slug || seenSlugs.has(slug)) continue
    seenSlugs.add(slug)

    const dishUrl = `${SITE_URL}/dish/${slug}`
    const lastmod = dish.updated_at || TODAY

    xml += `  <url>\n`
    xml += `    <loc>${escapeXml(dishUrl)}</loc>\n`
    xml += `    <lastmod>${lastmod}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.8</priority>\n`
    xml += `  </url>\n`
  }

  xml += `</urlset>\n`

  // Destination Targets:
  const destinations = [
    path.join(rootDir, 'public', 'sitemap.xml'),
    path.join(rootDir, 'dist', 'sitemap.xml'),
    '/var/www/Hashousha/dist/sitemap.xml',
    '/var/www/hashousha/dist/sitemap.xml',
  ]

  // Optional custom path passed as CLI argument
  if (process.argv[2]) {
    destinations.push(path.resolve(process.argv[2]))
  }

  let writeCount = 0
  for (const targetPath of destinations) {
    try {
      const targetDir = path.dirname(targetPath)
      if (fs.existsSync(targetDir)) {
        fs.writeFileSync(targetPath, xml, 'utf8')
        console.log(`[sitemap-generator] ✅ Written sitemap to: ${targetPath}`)
        writeCount++
      }
    } catch {
      // Ignore targets that don't exist in current environment
    }
  }

  console.log(`[sitemap-generator] 🎉 Sitemap generation complete! Total URLs: ${seenSlugs.size + 1} (targets updated: ${writeCount})`)
  return xml
}

// Run directly if invoked as main script
generateSitemap().catch((err) => {
  console.error('[sitemap-generator] Fatal error:', err)
  process.exit(1)
})
