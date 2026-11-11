-- ============================================================================
-- Migration: 20261011_seo_rls_policy.sql
-- Task: TASK-022 SEO Persistence, Supabase RLS Fix & Storefront Dynamic Head Sync
-- Target Table: public.seo_settings
-- ============================================================================

-- 1. Enable RLS on seo_settings (ensure it is on)
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- 2. Enable public read for all visitors
DROP POLICY IF EXISTS "Public can read seo_settings" ON public.seo_settings;
CREATE POLICY "Public can read seo_settings"
  ON public.seo_settings FOR SELECT
  USING (true);

-- 3. Allow authenticated users to manage seo_settings
DROP POLICY IF EXISTS "Authenticated users can manage seo_settings" ON public.seo_settings;
CREATE POLICY "Authenticated users can manage seo_settings"
  ON public.seo_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Allow anon to manage seo_settings
DROP POLICY IF EXISTS "Anon can upsert seo_settings" ON public.seo_settings;
CREATE POLICY "Anon can upsert seo_settings"
  ON public.seo_settings FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Purge stale legacy row
DELETE FROM public.seo_settings WHERE id = 'global';

-- 6. Seed official artisanal babka luxury metadata
INSERT INTO public.seo_settings (id, site_title, site_description, keywords, og_image)
VALUES (
  'default_seo',
  'هشوشة (Hashousha) — متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض',
  'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض.',
  'بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة',
  '/images/official-menu-card.jpg'
)
ON CONFLICT (id) DO UPDATE
SET
  site_title = EXCLUDED.site_title,
  site_description = EXCLUDED.site_description,
  keywords = EXCLUDED.keywords,
  og_image = EXCLUDED.og_image;
