import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in .env.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function test() {
  console.log('🧪 Testing seo_settings RLS policies with ANON client...')

  // 1. Test SELECT
  const { data: readData, error: readError } = await supabase
    .from('seo_settings')
    .select('*')
    .limit(2)

  if (readError) {
    console.error('❌ Anon SELECT failed:', readError.message)
    process.exit(1)
  }
  console.log('✅ Anon SELECT succeeded. Found rows:', readData?.length)

  // 2. Test UPSERT
  const { error: upsertError } = await supabase
    .from('seo_settings')
    .upsert({
      id: 'default_seo',
      site_title: 'هشوشة (Hashousha) — متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض',
      site_description: 'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض.',
      keywords: 'بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة',
      og_image: '/images/official-menu-card.jpg',
      updated_at: new Date().toISOString(),
    })

  if (upsertError) {
    console.error('❌ Anon UPSERT failed:', upsertError.message)
    process.exit(1)
  }
  console.log('✅ Anon UPSERT succeeded cleanly with zero RLS violations!')
}

test().catch(console.error)
