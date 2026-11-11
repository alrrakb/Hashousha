import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { dishes } from '../src/data/menu'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function syncDishes() {
  console.log(`🔄 Syncing ${dishes.length} Sovereign Master Dishes to Supabase Cloud...`)

  const currentIds = dishes.map((d) => d.id)

  // 1. Fetch all existing dishes
  const { data: existingRows, error: fetchErr } = await supabase.from('dishes').select('id')
  if (fetchErr) {
    console.error('Error fetching existing dishes:', fetchErr)
    process.exit(1)
  }

  const existingIds = (existingRows || []).map((r) => r.id)
  const obsoleteIds = existingIds.filter((id) => !currentIds.includes(id))

  if (obsoleteIds.length > 0) {
    console.log(`🗑️ Removing ${obsoleteIds.length} obsolete fragmented dishes:`, obsoleteIds)
    const { error: delErr } = await supabase.from('dishes').delete().in('id', obsoleteIds)
    if (delErr) {
      console.warn('Delete warning:', delErr.message)
    } else {
      console.log('✅ Obsolete dishes removed successfully.')
    }
  }

  // 2. Prepare payload for the dishes
  const rows = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    english_name: d.englishName,
    description: d.description,
    long_description: d.longDescription,
    serving_info: d.servingInfo,
    price: d.price,
    unit: d.unit,
    category: d.category,
    categories: d.categories || [d.category],
    image: d.image,
    image_alt: d.imageAlt || null,
    badges: d.badges,
    in_stock: d.inStock,
    slug: d.slug || d.id,
    seo_title: d.seoTitle,
    seo_description: d.seoDescription,
    seo_keywords: d.seoKeywords || [],
    variants: d.variants || null,
    updated_at: new Date().toISOString(),
  }))

  const { error: upsertErr } = await supabase.from('dishes').upsert(rows, { onConflict: 'id' })
  if (upsertErr) {
    console.error('❌ Error upserting dishes:', upsertErr)
    process.exit(1)
  }

  console.log(`✅ All ${dishes.length} dishes upserted successfully!`)

  // 3. Verify final list in Supabase
  const { data: verifiedRows, error: verErr } = await supabase
    .from('dishes')
    .select('id, name, category, price, image_alt, variants')

  if (verErr) {
    console.error('Error verifying dishes:', verErr)
  } else {
    console.log(`🎉 Supabase dishes table now has exactly ${verifiedRows?.length} dishes:`)
    verifiedRows?.forEach((r) => {
      const variantCount = Array.isArray(r.variants) ? r.variants.length : 0
      console.log(`  - [${r.id}] ${r.name} - alt: "${r.image_alt?.slice(0, 30)}..." - ${variantCount} variants`)
    })
  }
}

syncDishes()
