# TASK-003 SPECIFICATION: Appetizing Customer Storefront & Catalog Engine

> **Task ID:** `TASK-003-customer-storefront-and-catalog`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 1  

---

## 1. Executive Summary & Objective

In this task, Agent Beta will construct the core customer storefront experience for **Hashousha (هشوشة)**, migrating and elevating the real dishes extracted from the legacy store (`old_store/`).

Agent Beta will implement:
1. **The Seed Catalog (`src/data/initialCatalog.ts`)**: Real extracted dishes enriched with culinary descriptions, categories, and option groups.
2. **Category Navigation Pills (`src/components/storefront/CategoryPills.tsx`)**: Sticky horizontal scrollable category tabs with active olive pill styling.
3. **Appetizing Hero Banner (`src/components/storefront/HeroBanner.tsx`)**: Warm Arab hospitality welcoming customers to fresh handmade stuffed leaves and desserts with trust indicators (طازج يومياً، زيت زيتون بكر، توصيل سريع).
4. **Luxury Dish Card (`src/components/storefront/ProductCard.tsx`)**: Mobile-first gourmet card featuring high-resolution photography, badge indicators (`الأكثر طلباً`, `حامض حلو`, `جديد`, `حار 🌶️`), price formatting in `ر.س`, description truncation, and "إضافة للسلة" action.
5. **Image Fallback Utility (`src/components/ui/ImageWithFallback.tsx`)**: Prevents broken images by gracefully rendering appetizing SVG culinary illustrations when images fail.
6. **Catalog State Store (`src/store/useCatalogStore.ts`)**: Zustand store managing active category filtering, search queries, and in-stock items.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

In accordance with `AGENT_RULES.md`, Agent Beta MUST mobilize and adhere to the following installed skills during execution:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Product card visual hierarchy (Image > Title > Badge > Price > Primary CTA).
   - Category filtering state synchronization without unnecessary re-renders.
2. **`wshobson/agents/tailwind-design-system`**:
   - Strict usage of design tokens from `docs/DESIGN_SYSTEM.md` (`olive`, `pomegranate`, `honey`, `surface-warm`, `gourmet` shadows).
   - Zero arbitrary hex codes in JSX classes.
3. **`designed-by-ai/skills/design-mobile-apps`**:
   - 44px+ minimum touch targets on mobile CTA buttons and category pills.
   - Smooth horizontal touch scrolling with `scrollbar-none` and `overscroll-x-contain`.
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Memoized filter computations (`useMemo`).
   - Clean modular component composition and atomic prop contracts.

---

## 3. Real Legacy Catalog Dataset Specification

The seed catalog in `src/data/initialCatalog.ts` must incorporate the real audited menu items:

### Categories:
1. `all`: `جميع الأطباق` (All Dishes)
2. `vine-leaves`: `ورق عنب فاخر` (Gourmet Vine Leaves)
3. `cabbage-rolls`: `ملفوف دايب` (Tender Cabbage Rolls)
4. `platters`: `صواني وبوكسات الجمعات` (Gathering Platters)
5. `desserts`: `حلويات وسويت` (Artisanal Desserts)
6. `appetizers`: `مقبلات وسلطات` (Appetizers & Salads)

### Seed Dishes (with Real Extracted Data):
1. **ورق عنب فاخر بدبس الرمان (Signature)**:
   - Base Price: `32.50 ر.س`
   - Category: `vine-leaves`
   - Badge: `signature` ("حامض حلو")
   - Description: "ورق عنب طازج متبل بالخلطة السرية الغنية، مغمور بدبس الرمان الطبيعي المركز وقطع الليمون الطازج وزيت الزيتون البكر."
   - Option Groups: Portions (بوكس 25 حبة / 50 حبة / صينية 100 حبة), Spiciness (عادي / حار 🌶️), Add-ons (دبس رمان إضافي، صوص طحينة).
2. **ملفوف دايب بالسمن البلدي (Best Seller)**:
   - Base Price: `28.00 ر.س`
   - Category: `cabbage-rolls`
   - Badge: `bestseller` ("الأكثر طلباً")
   - Description: "ملفوف أبيض طري يذوب في الفم، محشو بالأرز المتبل بخلطة الثوم والكمون والنعناع مع لمسة سمن بلدي فاخر."
   - Option Groups: Portions (بوكس وسط 30 حبة / بوكس عائلي 60 حبة), Spiciness (عادي / حار 🌶️).
3. **ورق عنب كلاسيك بالليمون**:
   - Base Price: `25.99 ر.س`
   - Category: `vine-leaves`
   - Description: "النكهة التراثية الأصلية لورق العنب مع عصير الليمون الطبيعي وزيت الزيتون الصافي وأوراق النعناع."
4. **ورق عنب سبايسي نار 🌶️**:
   - Base Price: `29.99 ر.س`
   - Category: `vine-leaves`
   - Badge: `spicy` ("حار مسمسم")
   - Spicy Level: `spicy`
   - Description: "لعشاق النكهات الحارة الجريئة! ورق عنب متبل بخلطة الفلفل الأحمر الحار والشطة الخاصة مع دبس الرمان."
5. **صينية هشوشة المشكلة (ورق عنب + ملفوف)**:
   - Base Price: `85.00 ر.س`
   - Category: `platters`
   - Badge: `bestseller` ("الأكثر طلباً")
   - Description: "صينية متكاملة تجمع بين ألذ أصنافنا: 30 حبة ورق عنب بدبس الرمان + 30 حبة ملفوف دايب مع صوصات التغميس الخاصة."
6. **كوكيز شوكولاتة منزلي فاخر**:
   - Base Price: `18.75 ر.س`
   - Category: `desserts`
   - Badge: `new` ("جديد")
   - Description: "كوكيز طازج مخبوز بحب، مقرمش من الأطراف وطري وغني بقطع الشوكولاتة البلجيكية من الداخل."
7. **أم علي ملكية بالمكسرات والقشطة**:
   - Base Price: `35.00 ر.س`
   - Category: `desserts`
   - Description: "حلوى أم علي التراثية الساخنة بعجينة الميلفاي الهشة والحليب الطازج المغطى بالمكسرات المحمصة والقشطة البلدية."
8. **سلطة تبولة خضراء بالرمان**:
   - Base Price: `22.00 ر.س`
   - Category: `appetizers`
   - Description: "تبولة لبنانية منعشة بالبقدونس البلدي والنعناع والبرغل الناعم وزيت الزيتون مع حبات الرمان الطازجة."

---

## 4. Impacted Files & Architecture Touchpoints

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/product.ts` | MODIFY / VERIFY | Complete Category, Product, Badge, SpicyLevel types |
| `src/data/initialCatalog.ts` | CREATE | Rich seed dataset with extracted dishes and option groups |
| `src/store/useCatalogStore.ts` | CREATE | Zustand store for categories, products, active filter, search |
| `src/components/ui/Badge.tsx` | CREATE | Luxury badge component for bestselling, spicy, signature dishes |
| `src/components/ui/ImageWithFallback.tsx` | CREATE | Image container with fallback placeholder SVG on load error |
| `src/components/storefront/HeroBanner.tsx` | CREATE | Culinary hospitality hero banner with brand trust badges |
| `src/components/storefront/CategoryPills.tsx` | CREATE | Sticky scrollable category tabs with active pill indicator |
| `src/components/storefront/ProductCard.tsx` | CREATE | Appetizing dish card with price, badges, and quick CTA |
| `src/components/storefront/ProductGrid.tsx` | CREATE | Responsive grid rendering filtered cards with empty state |
| `src/App.tsx` | MODIFY | Wire Header, HeroBanner, CategoryPills, and ProductGrid |
| `tasks/TASK-003-customer-storefront-and-catalog/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-003-customer-storefront-and-catalog/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-003-customer-storefront-and-catalog/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and ADR |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `src/data/initialCatalog.ts` contains all audited categories and real dishes extracted from `old_store/`.
- [ ] `useCatalogStore` manages `activeCategoryId`, `searchQuery`, `products`, and filtering logic.
- [ ] Category tabs bar is sticky on mobile/desktop with smooth horizontal scrolling and active highlight.
- [ ] `ProductCard` exhibits gourmet visual hierarchy with `rounded-2xl`, warm shadows (`shadow-gourmet-md`), and proper Arabic typography.
- [ ] Dish badges render correctly:
  - `signature` -> "حامض حلو" (Pomegranate/Berry styling)
  - `bestseller` -> "الأكثر طلباً" (Honey Gold styling)
  - `spicy` -> "حار 🌶️" (Pomegranate red styling)
  - `new` -> "جديد" (Olive green styling)
- [ ] Fallback component handles missing/broken dish images gracefully with a culinary SVG emblem.
- [ ] Responsive grid displays 1 column on mobile, 2 columns on tablet, 3-4 columns on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- [ ] Clicking quick-add on product card dispatches to cart or notifies user cleanly.
- [ ] `npm run build` passes with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-003-customer-storefront-and-catalog/`.
