# TASK-016 SPECIFICATION: Storefront Modal Thumbnail, Floating WhatsApp & Site Content CMS

> **Task ID:** `TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 12 (Modal Thumbnail, Floating WhatsApp & Site Content CMS)  

---

## 1. Executive Summary & Strategic Objective

In accordance with official directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-016: Storefront Modal Thumbnail, Floating WhatsApp & Site Content CMS (مواءمة بوب اب المنتج، زر الواتساب العائم، ومركز إدارة المحتوى والصور)** across the storefront and Merchant Center.

This architectural enhancement comprises three synergistic pillars:
1. **Product Detail Modal Ergonomic Refactor (`ProductDetailModal.tsx`):**
   - Reposition the product imagery from an oversized, vertical-consuming full-width banner into a compact, proportionate square thumbnail (`size-28 sm:size-36`) integrated directly alongside the product header (Arabic name, English subtitle, price, and portion capacity).
   - Keeps the modal compact, elegant, and directly legible without forcing users to scroll past huge banners to read ingredients.
2. **Luxury Floating WhatsApp Concierge (`FloatingWhatsApp.tsx`):**
   - Provide an ambient, circular floating WhatsApp touchpoint in the bottom-left corner with a soft pulsing emerald-gold glow.
   - Positioned cleanly (`bottom-24 sm:bottom-6 left-4 sm:left-6`) to avoid collision with the sticky cart `OrderBar`.
   - Directs patrons to `966560602341` with a polite, pre-formatted Riyadh hospitality greeting.
3. **Merchant Center Site Content & Media CMS (`SiteContentModule.tsx`):**
   - Dedicated «إدارة المظهر والمحتوى» (Site Content & Brand Assets) module in the Merchant Center (`/admin`).
   - Divided into two clear sections:
     - **Media & Brand Assets:** Hero banner image, logos, favicon, and social OG share image with Supabase upload and live preview.
     - **Storefront Copywriting:** Smart instant search bar to find and modify any text string across hero headings, the 4 brand pillars, footer copy, and delivery guarantees.
   - Synchronized with Supabase (`public.site_content`) for live real-time storefront reflection.

---

## 2. Cloud Database Architecture (`public.site_content`)

The table `public.site_content` has been created and initialized in Supabase (`oulzpjcmnxvvrpdyfpcg`) with the following schema:

```sql
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  hero_image TEXT DEFAULT '/images/hero.png',
  logo_image TEXT DEFAULT '',
  favicon TEXT DEFAULT '/favicon.ico',
  og_image TEXT DEFAULT '/images/hero.png',
  hero_tag TEXT DEFAULT 'Riyadh · Artisanal Babka & Bakery',
  hero_title TEXT DEFAULT 'ترف البابكا والمخبوزات الفاخرة',
  hero_subtitle TEXT DEFAULT 'تُخبز طازجة يومياً',
  hero_description TEXT DEFAULT 'بابكا مجدولة بحشوات غنية وكوكيز فاخر يُحضّر بحب وإتقان، إلى جانب أطايب ورق العنب والضيافة لتكتمل بها جمعاتكم.',
  hero_alt TEXT DEFAULT 'بابكا حرفية مجدولة ومخبوزات وكوكيز فاخر من هشوشة',
  pillars JSONB DEFAULT '[
    {"title": "طهي يدوي طازج", "subtitle": "تحضير يومي عند الطلب بأيدي طهاة سعوديين"},
    {"title": "مكونات بكر أصيلة", "subtitle": "زيت زيتون بكر ممتاز ودبس رمان جبلي"},
    {"title": "تقديم يبيّض الوجه", "subtitle": "صواني وبوكسات فاخرة مهيأة لمجالسكم"},
    {"title": "توصيل مجهّز بالرياض", "subtitle": "سيارات مبردة لحفظ حرارة وطراوة الأطباق"}
  ]'::jsonb,
  footer_title TEXT DEFAULT 'هشوشة',
  footer_subtitle TEXT DEFAULT 'مطبخ منزلي فاخر · الرياض، المملكة العربية السعودية',
  delivery_notice TEXT DEFAULT 'التوصيل متوفر لجميع أحياء الرياض بسيارات مجهزة ومبردة',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
-- RLS allows public select and admin upsert
```

---

## 3. Domain Models & Service Contracts

### 3.1 Type Definitions (`src/types/admin.ts`)
Add `'site-content'` to `AdminTab` and define `SiteContentSettings`:

```typescript
export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'discounts'
  | 'seo'
  | 'reviews'
  | 'site-content';

export interface BrandPillarItem {
  title: string;
  subtitle: string;
}

export interface SiteContentSettings {
  id?: string;
  heroImage: string;
  logoImage: string;
  favicon: string;
  ogImage: string;
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroAlt: string;
  pillars: BrandPillarItem[];
  footerTitle: string;
  footerSubtitle: string;
  deliveryNotice: string;
  updatedAt?: string;
}

export const DEFAULT_SITE_CONTENT: SiteContentSettings = {
  heroImage: '/images/hero.png',
  logoImage: '',
  favicon: '/favicon.ico',
  ogImage: '/images/hero.png',
  heroTag: 'Riyadh · Artisanal Babka & Bakery',
  heroTitle: 'ترف البابكا والمخبوزات الفاخرة',
  heroSubtitle: 'تُخبز طازجة يومياً',
  heroDescription: 'بابكا مجدولة بحشوات غنية وكوكيز فاخر يُحضّر بحب وإتقان، إلى جانب أطايب ورق العنب والضيافة لتكتمل بها جمعاتكم.',
  heroAlt: 'بابكا حرفية مجدولة ومخبوزات وكوكيز فاخر من هشوشة',
  pillars: [
    { title: 'طهي يدوي طازج', subtitle: 'تحضير يومي عند الطلب بأيدي طهاة سعوديين' },
    { title: 'مكونات بكر أصيلة', subtitle: 'زيت زيتون بكر ممتاز ودبس رمان جبلي' },
    { title: 'تقديم يبيّض الوجه', subtitle: 'صواني وبوكسات فاخرة مهيأة لمجالسكم' },
    { title: 'توصيل مجهّز بالرياض', subtitle: 'سيارات مبردة لحفظ حرارة وطراوة الأطباق' },
  ],
  footerTitle: 'هشوشة',
  footerSubtitle: 'مطبخ منزلي فاخر · الرياض، المملكة العربية السعودية',
  deliveryNotice: 'التوصيل متوفر لجميع أحياء الرياض بسيارات مجهزة ومبردة',
};
```

### 3.2 Cloud Site Content Services (`src/services/adminService.ts`)
Implement:
1. `fetchSiteContent(): Promise<SiteContentSettings>`:
   - Queries `supabase.from('site_content').select('*').eq('id', 'primary').maybeSingle()`.
   - Maps database snake_case columns to camelCase `SiteContentSettings`.
   - Returns fallback defaults if null or error.
2. `saveSiteContent(content: Partial<SiteContentSettings>): Promise<{ success: boolean; error?: string }>`:
   - Upserts camelCase properties into snake_case columns with `id: 'primary'`.
   - Returns `{ success: true }` or error.

---

## 4. Component Architectural Blueprints

### 4.1 Product Detail Modal Header Refactor (`ProductDetailModal.tsx`)

#### Structural Layout Shift:
- **Legacy Layout:** Huge full-width banner (`aspect-[16/10] sm:aspect-[16/9]`) sitting atop the modal, forcing text details below the initial fold.
- **New Compact Thumbnail Lockup:**
  - Replace the giant banner with a unified top header block:
    ```tsx
    <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-7 border-b border-primary/10">
      {/* Square Thumbnail Box */}
      <div className="relative size-24 sm:size-32 rounded-2xl overflow-hidden shrink-0 border border-primary/20 bg-[#ebdccb] shadow-md">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
        )}
        <img
          src={dish.image || '/images/warak-enab.png'}
          alt={dish.name}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'relative z-10 h-full w-full object-cover transition-transform duration-500 hover:scale-105',
            !imgLoaded ? 'opacity-0' : 'opacity-100',
            !dish.inStock && 'grayscale opacity-75'
          )}
        />
        {!dish.inStock && (
          <div className="absolute inset-x-0 bottom-0 bg-rose-950/90 text-rose-200 text-[10px] font-bold text-center py-0.5 z-20">
            نفد اليوم
          </div>
        )}
      </div>

      {/* Header Text & Metrics Lockup */}
      <div className="flex flex-col min-w-0 flex-1 space-y-1">
        <p dir="ltr" className="text-right font-serif text-[11px] tracking-[0.2em] text-primary uppercase font-medium">
          {dish.englishName}
        </p>
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
          {dish.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xl font-black text-primary">
            {formatPrice(dish.price)}
          </span>
          <span className="text-[11px] text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-lg border border-primary/10">
            {dish.unit}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
            <Users className="size-3" />
            <span>{dish.servingInfo || 'تكفي ٤-٦ أشخاص'}</span>
          </span>
        </div>
      </div>
    </div>
    ```
  - The modal body follows beneath with culinary descriptions, secret craft notes, and bottom action footer.

---

### 4.2 Luxury Floating WhatsApp Concierge (`FloatingWhatsApp.tsx`)

Create `src/components/storefront/v0/FloatingWhatsApp.tsx`:
- **Placement & Non-Collision Guard:**
  - Placed at `fixed z-30 bottom-24 sm:bottom-6 left-4 sm:left-6`.
  - When `OrderBar` is visible on mobile screens, `bottom-24` keeps the WhatsApp button comfortably elevated above the order bar without blocking checkout taps.
- **Visual Design:**
  - Circular luxury button (`size-13 sm:size-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center`).
  - Pulsing ambient glow: gentle CSS/Framer Motion pulsing ring (`ring-4 ring-[#25D366]/30 animate-pulse` or spring heartbeat).
  - Luxury SVG or Lucide WhatsApp/MessageCircle icon.
  - Hover pill tooltip: `تواصل مع الضيافة 💬` on desktop.
- **Link Protocol:**
  ```typescript
  const whatsappUrl = `https://wa.me/966560602341?text=${encodeURIComponent(
    'مرحباً هشوشة 🌿، أود الاستفسار بخصوص قائمة الضيافة ومواعيد التوصيل بالرياض...'
  )}`;
  ```
- **Mounting:** Mounted in `App.tsx` on storefront routes (`/` and `/dish/:slug`), hidden in `/admin`.

---

### 4.3 Merchant Center Site Content CMS Module (`SiteContentModule.tsx`)

Create `src/components/admin/modules/SiteContentModule.tsx`:

#### Section 1: Media & Brand Assets (الصور والوسائط)
- 4 Card Editors with Live Image Previews:
  1. **صورة الهيرو سيكشن (Hero Banner):** Input URL + File Upload button (uploads to Supabase Storage `dishes` bucket) + Aspect preview box.
  2. **لوجو المتجر (Brand Logo):** Input URL / Upload + Preview.
  3. **أيقونة الموقع (Favicon):** Input URL + Preview.
  4. **صورة مشاركة السوشيال ميديا (Social OG Image):** Input URL + Preview.

#### Section 2: Storefront Copywriting (النصوص والعبارات)
- **Smart Instant Search Toolbar:**
  - Search input: `ابحث في نصوص المتجر (الهيرو، الركائز، الفوتر...)...`
  - Instantly filters fields matching search query.
- **Grouped Text Field Accordions / Cards:**
  1. **نصوص الهيرو (Hero Showcase):**
     - الوسم الإنجليزي (`heroTag`)
     - العنوان الملكي (`heroTitle`)
     - السطر التكميلي (`heroSubtitle`)
     - السطر السردي الوصفي (`heroDescription`)
     - وصف صورة الهيرو (`heroAlt`)
  2. **ركائز الضيافة الأربع (4 Brand Pillars):**
     - Titles & Subtitles for all 4 pillars.
  3. **نصوص الفوتر ورسائل التوصيل (Footer & Guarantees):**
     - عنوان الفوتر (`footerTitle`)
     - وصف الفوتر (`footerSubtitle`)
     - رسالة التوصيل بالرياض (`deliveryNotice`)
- **Save Bar:**
  - Sticky bottom save bar: `[💾 حفظ كافة تعديلات المظهر والمحتوى]` with loading state and toast feedback.

#### Integration in Merchant Center:
- In `MerchantSidebar.tsx`: Add `{ id: 'site-content', label: 'إدارة المظهر والمحتوى', englishLabel: 'Site Content', icon: Palette }`.
- In `MerchantCenter.tsx`: Mount `<SiteContentModule />` when `activeTab === 'site-content'`.

---

## 5. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`storefront-best-practices`**:
   - Floating support ergonomics, modal visual hierarchy, and dynamic CMS hydration.
2. **`tailwind-design-system`**:
   - Harmonious layout using royal linen tokens, emerald WhatsApp accents, and responsive modal structures.
3. **`design-mobile-apps`**:
   - Mobile viewport non-collision guarantees between `FloatingWhatsApp` and `OrderBar`.
4. **`vercel-react-best-practices`**:
   - Debounced search filtering, optimistic updates, and clean state handling.

---

## 6. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/admin.ts` | MODIFY | Add `'site-content'` to `AdminTab`, define `SiteContentSettings` and defaults |
| `src/services/adminService.ts` | MODIFY | Implement `fetchSiteContent` and `saveSiteContent` targeting Supabase |
| `src/components/storefront/v0/ProductDetailModal.tsx` | MODIFY | Rebuild modal header with square thumbnail lockup alongside product title, price & portion |
| `src/components/storefront/v0/FloatingWhatsApp.tsx` | CREATE | Luxury floating WhatsApp button with pulsing glow and collision-free placement |
| `src/components/admin/modules/SiteContentModule.tsx` | CREATE | Complete Site Content & Media CMS module with media upload and copy search |
| `src/components/admin/MerchantSidebar.tsx` | MODIFY | Add Site Content tab to sidebar navigation |
| `src/components/admin/MerchantCenter.tsx` | MODIFY | Mount `SiteContentModule` when `activeTab === 'site-content'` |
| `src/App.tsx` | MODIFY | Mount `FloatingWhatsApp` on customer storefront views |
| `tasks/TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 7. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `ProductDetailModal.tsx` features an elegant square thumbnail (`size-24` to `size-32`) placed directly beside the dish name, English subtitle, price, and portion capacity.
- [ ] Large banner is eliminated from `ProductDetailModal.tsx`, keeping culinary details directly readable.
- [ ] `FloatingWhatsApp.tsx` is created, fixed at the bottom-left corner with ambient pulsing glow.
- [ ] `FloatingWhatsApp.tsx` does NOT overlap or collide with `OrderBar` on mobile or desktop viewports.
- [ ] Clicking the WhatsApp button launches WhatsApp with number `966560602341` and a polite Riyadh greeting.
- [ ] `public.site_content` table is fully active in Supabase and queried via `adminService.ts`.
- [ ] `MerchantSidebar.tsx` includes «إدارة المظهر والمحتوى» (`site-content`).
- [ ] `SiteContentModule.tsx` is mounted and divided into Media/Assets and Storefront Copywriting.
- [ ] Media section provides URL input, upload to Supabase, and live image previews.
- [ ] Copywriting section provides an instant search bar that filters storefront text strings.
- [ ] Saving modifications in `SiteContentModule.tsx` persists changes to Supabase successfully.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms/`.
