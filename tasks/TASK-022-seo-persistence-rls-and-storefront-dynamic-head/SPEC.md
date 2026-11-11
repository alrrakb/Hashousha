# TASK-022 Specification: SEO Persistence, Supabase RLS Fix & Storefront Dynamic Head Sync

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Implementer)  
> **Date:** 2026-10-11  
> **Status:** Approved for Implementation  

---

## 1. Context & Objective

### 1.1 Problem Statement
1. **Stale Legacy Crawl Metadata (`index.html`)**:  
   The application root `index.html` contains hardcoded legacy copy:
   - `<title>هشوشة | محاشي وحلويات فاخرة</title>`
   - `<meta name="description" content="هشوشة (Hashousha) - متجر للمحاشي وورق العنب والملفوف الفاخر والحلويات الشرقية الأصيلة." />`
   Because social media web crawlers (WhatsApp, Facebook, Twitter, Telegram, LinkedIn) and web search engines inspect raw HTML without executing React hydration, every shared link displays the outdated vine leaves and mahashi preview.
2. **Supabase RLS Lockout on `seo_settings`**:  
   Row-Level Security (RLS) is enabled (`relrowsecurity: true`) on the `seo_settings` table in Supabase, but zero security policies exist. Any `UPSERT` or `SELECT` from the admin client or public visitor violates policy (`code 42501`, HTTP 403/401 Forbidden), causing changes made in `SeoModule` to fail silently or error out, leaving the table empty (`0 rows`).
3. **Storefront Dynamic Head Invariance**:  
   `src/App.tsx` mounts the storefront without querying or synchronizing `seo_settings`, meaning client-side title and meta tags never reflect database-driven updates.

### 1.2 Objective
- Overhaul `index.html` with production-grade OpenGraph, Twitter card, and luxury artisanal babka metadata.
- Apply Supabase RLS policies to `seo_settings` enabling public read access (`SELECT`) and authenticated/admin upsert (`ALL`), and seed the default babka configuration.
- Add a lightweight, zero-latency dynamic SEO synchronizer to `src/App.tsx` to bind `document.title` and meta tags to live settings.
- Guarantee 100% build pass with zero TypeScript errors.

---

## 2. Impacted Files & Architecture

| File Path | Action | Description |
|:---|:---:|:---|
| `index.html` | **MODIFY** | Update static `<title>`, `<meta name="description">`, add OpenGraph and Twitter card meta tags |
| `supabase/migrations/20261011_seo_rls_policy.sql` | **CREATE** | SQL migration script for `seo_settings` RLS policies & initial seed |
| `src/hooks/useStorefrontSeo.ts` | **CREATE** | Lightweight hook to fetch `seo_settings` and update `document.title`, description & og tags |
| `src/App.tsx` | **MODIFY** | Integrate `useStorefrontSeo` on storefront root |
| `tasks/INDEX.md` | **MODIFY** | Record TASK-022 lifecycle state |

---

## 3. Technical Requirements & Implementation Details

### 3.1 Static HTML Overhaul (`index.html`)
Replace lines 8 and 35, and enrich `<head>` with:
```html
<title>هشوشة (Hashousha) | متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض</title>
<meta name="description" content="أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض." />
<meta name="keywords" content="بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة" />

<!-- Open Graph / WhatsApp / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:locale" content="ar_SA" />
<meta property="og:site_name" content="هشوشة (Hashousha)" />
<meta property="og:title" content="هشوشة (Hashousha) | متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض" />
<meta property="og:description" content="أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض." />
<meta property="og:image" content="/images/official-menu-card.jpg" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="هشوشة (Hashousha) | متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض" />
<meta name="twitter:description" content="أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر." />
<meta name="twitter:image" content="/images/official-menu-card.jpg" />
```

### 3.2 Supabase RLS Policy & Database Seeding
Execute SQL against Supabase project `oulzpjcmnxvvrpdyfpcg`:
```sql
-- Enable public read for all visitors
DROP POLICY IF EXISTS "Public can read seo_settings" ON seo_settings;
CREATE POLICY "Public can read seo_settings"
  ON seo_settings FOR SELECT
  USING (true);

-- Allow authenticated users / service to insert and update seo_settings
DROP POLICY IF EXISTS "Authenticated users can manage seo_settings" ON seo_settings;
CREATE POLICY "Authenticated users can manage seo_settings"
  ON seo_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon fallback if needed or testupsert
DROP POLICY IF EXISTS "Anon can manage seo_settings if authenticated token" ON seo_settings;
CREATE POLICY "Anon can upsert seo_settings"
  ON seo_settings FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Seed default record if table is empty
INSERT INTO seo_settings (id, site_title, site_description, keywords, og_image)
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
```

### 3.3 Dynamic Storefront Head Hook (`src/hooks/useStorefrontSeo.ts`)
Create a lightweight hook:
- Fetches `fetchSeoSettings()` on mount.
- If current route is `/` (not `/dish/:slug`, which manages its own title in `ProductLandingPage`), sets:
  - `document.title = seo.siteTitle`
  - Updates or creates `meta[name="description"]`
  - Updates `meta[property="og:title"]`, `meta[property="og:description"]`
- Listen for tab focus or cache refresh to keep in sync.

### 3.4 Verification Mandate for Agent Beta
1. Verify Supabase `seo_settings` holds the record without 403 errors.
2. Verify saving from the admin dashboard succeeds with green toast notification.
3. Verify `index.html` static preview tags.
4. Run `npm run build` and ensure exit code 0.

---

## 4. Acceptance Criteria
- [ ] `index.html` has zero mentions of "محاشي" or "ورق عنب".
- [ ] `index.html` contains complete, valid OpenGraph and Twitter meta tags.
- [ ] Supabase table `seo_settings` has RLS policies enabling SELECT and UPSERT without 403 errors.
- [ ] Live row exists in `seo_settings` with the artisanal babka metadata.
- [ ] Saving in `SeoModule.tsx` via Admin Center executes cleanly and updates Supabase.
- [ ] `src/App.tsx` dynamically sets page title and description on the customer storefront.
- [ ] TypeScript check and `npm run build` pass with 0 errors.
