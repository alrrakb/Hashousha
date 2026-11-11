# TASK-023 Specification: Official Luxury Brand Emblem Social OG & WhatsApp Card Integration

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Implementer)  
> **Date:** 2026-10-11  
> **Status:** Approved for Implementation  

---

## 1. Context & Objective

### 1.1 Context
The Founder has explicitly designated the luxury gold foil embossed emblem ("هشوشة — HASHOUSHA — SWEET & SAVORY BAKES" on textured warm linen) as the official Social Share / Open Graph cover image across WhatsApp, Twitter/X, Facebook, Telegram, and iMessage.

### 1.2 Objective
- Ensure the master asset is served from `public/images/brand-og.jpg` (optimized 1024x1024, 72.7 KB, well under WhatsApp's strict 300 KB thumbnail cap) and `public/images/brand-og.png` (high-res 1024x1024, 332 KB).
- Update static Open Graph and Twitter tags in `index.html` from the grouped menu card (`/images/official-menu-card.jpg`) to `/images/brand-og.jpg`.
- Update `DEFAULT_SEO_SETTINGS.ogImage` in `src/services/adminService.ts`.
- Update the live Supabase `seo_settings` table rows (`default_seo` and `global`) to store `/images/brand-og.jpg`.
- Verify full TypeScript and Vite build passes (`npm run build` exit code 0).

---

## 2. Impacted Files & Architecture

| File Path | Action | Description |
|:---|:---:|:---|
| `public/images/brand-og.jpg` | **VERIFY** | Optimized 1024x1024 JPEG (72.7 KB) for lightning-fast WhatsApp preview caching |
| `public/images/brand-og.png` | **VERIFY** | High-res 1024x1024 PNG master emblem |
| `index.html` | **MODIFY** | Update `og:image` and `twitter:image` to `/images/brand-og.jpg` |
| `src/services/adminService.ts` | **MODIFY** | Update `DEFAULT_SEO_SETTINGS.ogImage` to `/images/brand-og.jpg` |
| Supabase `seo_settings` | **UPDATE** | Set `og_image = '/images/brand-og.jpg'` in `default_seo` and `global` rows |
| `tasks/INDEX.md` | **MODIFY** | Append TASK-023 row to ledger |

---

## 3. Technical Implementation Checklist for Agent Beta

### 3.1 Static HTML Metadata Update (`index.html`)
Update the `<head>` Open Graph and Twitter meta tags:
```html
<meta property="og:image" content="/images/brand-og.jpg" />
<meta name="twitter:image" content="/images/brand-og.jpg" />
```

### 3.2 Codebase Defaults (`src/services/adminService.ts`)
Update `DEFAULT_SEO_SETTINGS`:
```ts
export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'هشوشة (Hashousha) — متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض',
  siteDescription: 'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض.',
  keywords: 'بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة',
  ogImage: '/images/brand-og.jpg',
}
```

### 3.3 Supabase Cloud Sync
Execute an UPDATE query or upsert via Supabase client:
```sql
UPDATE seo_settings
SET og_image = '/images/brand-og.jpg', updated_at = NOW()
WHERE id IN ('default_seo', 'global');
```

### 3.4 WhatsApp Cache Busting Directive for User
Document in the Post-Mortem and report that because WhatsApp caches link previews by URL, when testing the newly deployed Vercel link, appending `?v=brand` or `?v=2` (e.g., `https://<domain>.vercel.app/?v=brand`) triggers WhatsApp's scraper to fetch the fresh brand emblem immediately without waiting for server cache expiration.

---

## 4. Acceptance Criteria
- [ ] `public/images/brand-og.jpg` is in place (<100KB, 1024x1024).
- [ ] `index.html` references `/images/brand-og.jpg` in both `og:image` and `twitter:image`.
- [ ] `DEFAULT_SEO_SETTINGS.ogImage` set to `/images/brand-og.jpg` in `src/services/adminService.ts`.
- [ ] Supabase `seo_settings` table reflects `og_image = '/images/brand-og.jpg'`.
- [ ] TypeScript check and `npm run build` exit with code 0.
