import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testThemeColors() {
  console.log('🧪 Testing site_content theme_colors persistence in Supabase...')

  // 1. Fetch current row
  const { data: beforeData, error: fetchErr } = await supabase
    .from('site_content')
    .select('id, theme_colors')
    .eq('id', 'primary')
    .maybeSingle()

  if (fetchErr) {
    console.error('❌ Error fetching site_content:', fetchErr)
    process.exit(1)
  }

  console.log('✅ Current site_content row fetched:', beforeData ? 'Found' : 'Empty')

  // 2. Upsert test theme_colors
  const testPayload = {
    id: 'primary',
    theme_colors: {
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
        background: '#1a120b',
        foreground: '#faf7f2',
        card: '#241a12',
        cardForeground: '#faf7f2',
        primary: '#c29567',
        primaryForeground: '#1a120b',
        border: '#3d2c1e',
      },
    },
    updated_at: new Date().toISOString(),
  }

  const { error: upsertErr } = await supabase.from('site_content').upsert(testPayload)
  if (upsertErr) {
    console.error('❌ Error upserting theme_colors:', upsertErr)
    process.exit(1)
  }

  console.log('✅ theme_colors upserted successfully!')

  // 3. Verify read back
  const { data: afterData, error: verifyErr } = await supabase
    .from('site_content')
    .select('id, theme_colors')
    .eq('id', 'primary')
    .maybeSingle()

  if (verifyErr || !afterData?.theme_colors) {
    console.error('❌ Verification failed:', verifyErr)
    process.exit(1)
  }

  console.log('✅ Verification succeeded! Saved dark background:', afterData.theme_colors.dark.background)
  console.log('🎉 All theme_colors persistence tests passed!')
}

testThemeColors()
