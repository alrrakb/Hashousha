# TASK-004 SPECIFICATION: V0 Artisanal Design & Real Assets Migration

> **Task ID:** `TASK-004-v0-design-and-real-assets-migration`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 2 (Phase 1 of Overhaul)  

---

## 1. Executive Summary & Objective

In accordance with the strategic directive of the Founder and Brand Chief of Staff, **Agent Beta** will migrate and integrate the complete v0 luxury artisanal design system from `HASHOUSHA/design` directly into the production Vite + React application.

This task establishes the visual foundation for the entire platform:
1. **Real High-Resolution Culinary Assets:** Copy authentic dish photography from `design/public/images/` to `public/images/`.
2. **Luxury Theme Tokens & Linen Canvas:** Integrate CSS variables and Tailwind styling from `design/app/globals.css` into `src/index.css` and `tailwind.config.js`.
3. **Menu Dataset Migration:** Replace mock data with real audited dish records from `design/lib/menu.ts` (enriching with `inStock: boolean`).
4. **Vite-Native UI Component Porting:** Adapt `SiteHeader`, `Hero`, `MenuSection`, `DishCard`, and `OrderBar` from Next.js (replacing `next/image` with standard responsive `<img>` while strictly maintaining styling fidelity).
5. **Interactive Floating OrderBar:** Ensure the bottom order bar functions smoothly with persistent cart state, serving as the launchpad for the Phase 2 In-Store Checkout.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`wshobson/agents/tailwind-design-system`**:
   - Enforce CSS custom property mappings (`--background`, `--foreground`, `--primary: #9e774c`, `--accent: #931f2d`, `--card: #fdfbf7`, `--border: #e8ddd0`).
   - Implement the `.linen` texture background and rounded-[1.75rem] border tokens.
2. **`designed-by-ai/skills/design-mobile-apps`**:
   - Touch ergonomics: 44px+ touch targets on `+ / -` counter buttons and category pills.
   - Sticky `OrderBar` positioning using `pb-[max(0.75rem,env(safe-area-inset-bottom))]` for iOS/Android home indicators.
3. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Visual hierarchy of gourmet food cards (Aspect 4:3 Image > English Subtitle > Arabic Name > Description > Price & Unit > Stepper Button).
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Optimize image rendering (`loading="lazy"`, `decoding="async"`, `priority` on Hero).
   - Clean state reactivity in `useCartStore` without layout thrashing.

---

## 3. Detailed Technical Requirements

### 3.1 Asset Migration
Agent Beta must ensure the following 7 images are copied from `design/public/images/` to `public/images/`:
- `hero.png` (Hero banner photography)
- `warak-enab.png` (ورق عنب حامض حلو)
- `warak-box.png` (بوكس ورق عنب الضيافة)
- `malfouf.png` (ملفوف دايب حار مسمسم)
- `tray.png` (صينية جمعة المجلس)
- `sweets.png` (بوكس كنافة وبسبوسة)
- `date-cake.png` (كيكة التمر بالكراميل)

### 3.2 Styling & Theme Tokens
- Update `src/index.css` with the exact `:root` variables:
  ```css
  :root {
    --background: #faf7f2;
    --foreground: #2e1e0d;
    --card: #fdfbf7;
    --card-foreground: #2e1e0d;
    --primary: #9e774c;
    --primary-foreground: #faf7f2;
    --secondary: #f5efeb;
    --secondary-foreground: #2e1e0d;
    --muted: #f5efeb;
    --muted-foreground: #6b5a48;
    --accent: #931f2d;
    --accent-foreground: #faf7f2;
    --border: #e8ddd0;
    --input: #e8ddd0;
    --ring: #9e774c;
  }
  .linen {
    background-color: var(--background);
    background-image:
      repeating-linear-gradient(0deg, rgba(158, 119, 76, 0.035) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(158, 119, 76, 0.03) 0 1px, transparent 1px 4px),
      radial-gradient(ellipse at top, #f5efeb 0%, transparent 60%);
  }
  ```
- Ensure `tailwind.config.js` extends colors referencing these tokens (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `bg-accent`, `bg-secondary`, `border-primary`, etc.).

### 3.3 Menu & Catalog Types (`src/types/menu.ts` & `src/data/menu.ts`)
Port the exact audited dishes:
1. `warak-classic`: "ورق عنب حامض حلو" (145 ر.س / صينية ٥٠ حبة / badges: `tangy`, `popular`)
2. `warak-box`: "بوكس ورق عنب الضيافة" (189 ر.س / بوكس ٧٠ حبة / badges: `tangy`)
3. `malfouf-spicy`: "ملفوف دايب حار مسمسم" (129 ر.س / صينية ٤٠ حبة / badges: `spicy`, `popular`)
4. `majlis-tray`: "صينية جمعة المجلس" (349 ر.س / صينية كبيرة / badges: `popular`)
5. `kunafa-box`: "بوكس كنافة وبسبوسة" (119 ر.س / بوكس ٢٤ قطعة / badges: `new`)
6. `date-cake`: "كيكة التمر بالكراميل" (95 ر.س / قالب ٨ شرائح / badges: `popular`)
- Add `inStock: boolean` (default `true`) to all items.
- Formatter helper `formatPrice(value: number): string` rendering `${value.toLocaleString('ar-SA')} ر.س`.

### 3.4 Component Adaptations (Next.js ➔ Vite/React)
- **`SiteHeader.tsx`**:
  - Two delicate olive leaves flanking the bold Arabic wordmark "هشوشة".
  - Subtitle: `Hashousha — Sweet & Savory Bakes`.
  - Cart bag button showing active total items count with ring badge.
- **`Hero.tsx`**:
  - Large rounded-[2rem] card with dark overlay and typography in `#E9D3B4`.
  - 4 highlight badges with icons: (طازج يومياً، زيت زيتون بكر، بوكسات وصواني فاخرة، توصيل سريع بالرياض).
- **`MenuSection.tsx`**:
  - Category tabs bar (جميع الأطباق، ورق عنب فاخر، ملفوف دايب، صواني الجمعات، حلويات وسويت) with sticky positioning and pill selection.
  - Dishes count in Arabic numerals (`٦ أطباق`).
- **`DishCard.tsx`**:
  - Aspect ratio 4:3 image with fallback and group-hover scaling.
  - Badges: `popular` (الأكثر طلباً ٤٫٩), `tangy` (حامض حلو), `spicy` (حار مسمسم), `new` (جديد).
  - Quick action: when qty = 0 renders "أضف للطلب"; when qty > 0 renders round `+ / [count] / -` stepper.
- **`OrderBar.tsx`**:
  - Floating bottom rounded bar with accordion cart summary list.
  - Action button: Displays "إتمام الطلب" (ready for Phase 2 Checkout modal trigger) with optional fallback link.

---

## 4. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `public/images/*` | CREATE / COPY | All 7 high-res food images copied from `design/public/images/` |
| `src/index.css` | MODIFY | Add v0 `:root` CSS variables and `.linen` background rule |
| `tailwind.config.js` | MODIFY | Add support for semantic CSS-variable utility classes |
| `src/types/menu.ts` | CREATE | Dish, Category, BadgeKind, and Cart contracts |
| `src/data/menu.ts` | CREATE | Real culinary dishes data and `formatPrice` helper |
| `src/store/useCartStore.ts` | CREATE | Zustand store with local persistence for cart quantities and drawer |
| `src/components/cart-context.tsx` | CREATE / ADAPT | React Context adapter wrapping `useCartStore` for component drop-in |
| `src/components/storefront/v0/SiteHeader.tsx` | CREATE | Vite-adapted header with logo and cart badge |
| `src/components/storefront/v0/Hero.tsx` | CREATE | Vite-adapted hero banner with photography and trust badges |
| `src/components/storefront/v0/DishCard.tsx` | CREATE | Vite-adapted gourmet dish card with stepper controls |
| `src/components/storefront/v0/MenuSection.tsx` | CREATE | Vite-adapted category navigation and dish grid |
| `src/components/storefront/v0/OrderBar.tsx` | CREATE | Floating bottom order bar with cart drawer and CTA |
| `src/App.tsx` | MODIFY | Wire the full v0 storefront layout with `.linen` background |
| `tasks/TASK-004-v0-design-and-real-assets-migration/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-004-v0-design-and-real-assets-migration/EXECUTION.log` | CREATE (Beta) | Chronological command execution log |
| `tasks/TASK-004-v0-design-and-real-assets-migration/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] All 7 images from `design/public/images/` are copied to `public/images/` and resolve properly in browser.
- [ ] Theme tokens and `.linen` texture are active in `src/index.css` and `tailwind.config.js`.
- [ ] `src/data/menu.ts` contains all 6 real dishes with correct Arabic names, prices, units, and images.
- [ ] `SiteHeader` displays the luxury brand identity with leaf icons and reactive cart badge.
- [ ] `Hero` renders `/images/hero.png` with overlay and the 4 highlight pills.
- [ ] `MenuSection` sticky category pills scroll horizontally and filter dishes dynamically.
- [ ] `DishCard` displays badges, 4:3 photography, prices in `ر.س`, and interactive `+ / -` quantity stepper.
- [ ] `OrderBar` floats above bottom safe area, expands item summary drawer, and shows live subtotal.
- [ ] All `next/image` imports are cleanly replaced with standard responsive `<img>` elements.
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B (`SKILLS_USED.md`), Phase C (`EXECUTION.log`), and Phase D (`POST_MORTEM.md`) are documented.
