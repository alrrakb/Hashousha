import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { dishes, categories } from '../src/data/menu'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function sync() {
  console.log('🚀 Starting Supabase Babka Catalog Synchronization...')

  // 1. Purge legacy dishes
  const legacyDishIds = [
    'warak-classic',
    'warak-box',
    'malfouf-spicy',
    'kunafa-box',
    'date-cake',
    'majlis-tray'
  ]
  const { error: delDishErr } = await supabase.from('dishes').delete().in('id', legacyDishIds)
  if (delDishErr) {
    console.warn('⚠️ Note on legacy dishes deletion:', delDishErr.message)
  } else {
    console.log('✅ Purged legacy dishes successfully.')
  }

  // 2. Purge legacy categories
  const legacyCatIds = ['warak', 'malfouf', 'trays', 'sweets']
  const { error: delCatErr } = await supabase.from('categories').delete().in('id', legacyCatIds)
  if (delCatErr) {
    console.warn('⚠️ Note on legacy categories deletion:', delCatErr.message)
  } else {
    console.log('✅ Purged legacy categories successfully.')
  }

  // 3. Upsert 4 new categories
  const categoryRows = categories
    .filter((c) => c.id !== 'all')
    .map((c, idx) => ({
      id: c.id,
      name: c.label,
      english_name: c.id === 'mini-babka' ? 'Mini Babka' :
                    c.id === 'medium-babka' ? 'Medium Babka' :
                    c.id === 'family-babka' ? 'Family Babka' : 'Babka Boxes',
      slug: c.id,
      sort_order: (idx + 1) * 10,
      is_active: true,
    }))

  const { error: catUpsertErr } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'id' })
  if (catUpsertErr) {
    console.error('❌ Error upserting categories:', catUpsertErr.message)
  } else {
    console.log(`✅ Synced ${categoryRows.length} categories to Supabase.`)
  }

  // 4. Upsert all dishes
  const dishRows = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    english_name: d.englishName,
    slug: d.slug || d.id,
    description: d.description,
    long_description: d.longDescription || null,
    serving_info: d.servingInfo || null,
    price: d.price,
    unit: d.unit,
    category: d.category,
    image: d.image,
    badges: d.badges,
    in_stock: d.inStock,
    seo_title: d.seoTitle || null,
    seo_description: d.seoDescription || null,
  }))

  const { error: dishUpsertErr } = await supabase.from('dishes').upsert(dishRows, { onConflict: 'id' })
  if (dishUpsertErr) {
    console.error('❌ Error upserting dishes:', dishUpsertErr.message)
  } else {
    console.log(`✅ Synced ${dishRows.length} artisanal babka dishes to Supabase.`)
  }

  // 5. Verification count
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: dishCount } = await supabase.from('dishes').select('*', { count: 'exact', head: true })

  console.log(`📊 Cloud Database Audit: Categories=${catCount}, Dishes=${dishCount}`)
  console.log('🎉 Supabase synchronization complete!')
}

sync().catch(console.error)
