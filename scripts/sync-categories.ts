import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function syncCategories() {
  console.log('🔄 Cleaning obsolete categories from Supabase...')
  const oldIds = ['mini-babka', 'medium-babka', 'family-babka']
  const { error: delErr } = await supabase.from('categories').delete().in('id', oldIds)
  if (delErr) {
    console.warn('Delete warning:', delErr.message)
  } else {
    console.log('✅ Obsolete categories deleted cleanly.')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, is_active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    process.exit(1)
  }

  console.log('📋 Current categories in Supabase:', data)
}

syncCategories()
