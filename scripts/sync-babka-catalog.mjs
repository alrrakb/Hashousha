import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { dishes, categories } from '../src/data/menu.js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  console.log('--- Starting Cloud Catalog Sync ---')

  // 1. Delete legacy dishes
  const legacyDishIds = [
    'warak-classic',
    'warak-box',
    'malfouf-spicy',
    'kunafa-box',
    'date-cake',
    'majlis-tray'
  ]
  const { error: delDishesErr } = await supabase.from('dishes').delete().in('id', legacyDishIds)
  if (delDishesErr) {
    console.error('Error deleting legacy dishes:', delDishesErr)
  } else {
    console.log('Successfully purged legacy dishes.')
  }

  // 2. Delete legacy categories
  const legacyCatIds = ['warak', 'malfouf', 'trays', 'sweets']
  const { error: delCatErr } = await supabase.from('categories').delete().in('id', legacyCatIds)
  if (delCatErr) {
    console.error('Error deleting legacy categories:', delCatErr)
  } else {
    console.log('Successfully purged legacy categories.')
  }

  // 3. Upsert 4 categories
  const newCategories = [
    { id: 'mini-babka', name: 'البابكا ميني', english_name: 'Mini Babka', slug: 'mini-babka', sort_order: 10, is_active: true },
    { id: 'medium-babka', name: 'البابكا حجم وسط', english_name: 'Medium Babka', slug: 'medium-babka', sort_order: 20, is_active: true },
    { id: 'family-babka', name: 'البابكا حجم عائلي', english_name: 'Family Babka', slug: 'family-babka', sort_order: 30, is_active: true },
    { id: 'babka-boxes', name: 'بوكسات البابكا', english_name: 'Babka Boxes', slug: 'babka-boxes', sort_order: 40, is_active: true },
  ]
  const { error: upCatErr } = await supabase.from('categories').upsert(newCategories, { onConflict: 'id' })
  if (upCatErr) {
    console.error('Error upserting categories:', upCatErr)
  } else {
    console.log('Successfully synced 4 Babka categories.')
  }

  console.log('--- Done ---')
}

run()
