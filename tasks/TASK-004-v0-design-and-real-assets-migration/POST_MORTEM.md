# TASK-004: Post-Mortem & Architectural Decisions Record (Phase D)

> **Task ID:** `TASK-004-v0-design-and-real-assets-migration`  
> **Phase:** Phase D (Post-Mortem & ADR)  
> **Author:** Agent Beta (Senior Full-Stack Implementer)  
> **Reviewer:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Status:** ✅ VERIFIED & COMPLETE  
> **Completed At:** 2026-10-05T03:08:00Z  

---

## 1. Architectural Decisions Recorded (ADR)

### ADR-012: Dual CSS Variable Token Bridging
- **Context:** The project previously used Tailwind palette extensions (`olive`, `pomegranate`, `honey`), while the v0 artisanal design system utilized semantic CSS custom properties (`--background`, `--foreground`, `--primary`, `--card`, `--accent`, etc.).
- **Decision:** Bridged both systems in `src/index.css` and `tailwind.config.js`. CSS variables were mapped to Tailwind's semantic colors (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `bg-accent`, `bg-secondary`, `border-border`, `ring-ring`) while keeping legacy tokens intact.
- **Consequences:** 100% fidelity to the v0 design specification without breaking legacy tokens.

### ADR-013: Next.js to Vite Native Asset Adaptation
- **Context:** The v0 design heavily relied on Next.js `next/image` (`fill`, `priority`, `sizes`, `next.config.mjs`), which does not exist in a Vite/React SPA.
- **Decision:** Replaced `next/image` with responsive HTML `<img>` elements equipped with `object-cover`, `loading="lazy"`, `decoding="async"`, and CSS aspect-ratios (`aspect-[4/3]`). For the Hero banner, `loading="eager"` was enforced.
- **Consequences:** Eliminates Next.js runtime dependencies, reduces bundle size, and maintains pixel-perfect visual rendering.

### ADR-014: Persistent Cart State Architecture (Zustand + LocalStorage)
- **Context:** The v0 design implemented `CartProvider` using local React `useState`, causing cart contents to vanish on page refresh.
- **Decision:** Backed `CartProvider` with a Zustand store (`useCartStore`) utilizing `persist` middleware with `localStorage` key `hashousha-cart-storage`.
- **Consequences:** Instant state preservation across reloads and seamless readiness for the Phase 2 In-Store Checkout modal (TASK-005).

---

## 2. Verification Checklist Matrix

| Acceptance Criterion | Target Specification | Status | Evidence |
|:---|:---|:---:|:---|
| Real Culinary Images Migrated | 7 high-res food images copied to `public/images/` | ✅ PASS | Verified in `public/images/` (`hero.png`, `warak-enab.png`, `warak-box.png`, `malfouf.png`, `tray.png`, `sweets.png`, `date-cake.png`) |
| Theme Tokens & Linen Canvas | `:root` variables and `.linen` in `index.css` & `tailwind.config.js` | ✅ PASS | `src/index.css` & `tailwind.config.js` active |
| Menu Dataset Complete | 6 audited dishes with Arabic names, prices, units, and `inStock: true` | ✅ PASS | `src/data/menu.ts` & `src/types/menu.ts` |
| SiteHeader Component | Flanking leaf icons, Arabic wordmark, reactive cart counter badge | ✅ PASS | `src/components/storefront/v0/SiteHeader.tsx` |
| Hero Banner Component | High-res photography, dark gradient, `#E9D3B4` text, 4 highlight pills | ✅ PASS | `src/components/storefront/v0/Hero.tsx` |
| Sticky Category Navigation | Horizontal touch scrolling and category filtering | ✅ PASS | `src/components/storefront/v0/MenuSection.tsx` |
| Gourmet DishCard | 4:3 image, badges, Arabic title, formatted price in `ر.س`, `+ / -` stepper | ✅ PASS | `src/components/storefront/v0/DishCard.tsx` |
| Floating OrderBar | Bottom safe-area positioning, itemized drawer, subtotal, and CTA | ✅ PASS | `src/components/storefront/v0/OrderBar.tsx` |
| Next.js Image Clean Port | All `next/image` replaced with standard responsive `<img>` | ✅ PASS | Zero `next/*` imports in `src/` |
| Clean Build Verification | `npm run build` succeeds with zero errors | ✅ PASS | Built cleanly in 14.01s (`dist/index.html`, `dist/assets/*`), exit code 0 |
| Lifecycle Documentation | Complete Phase B, Phase C, and Phase D documentation | ✅ PASS | `SKILLS_USED.md`, `EXECUTION.log`, `POST_MORTEM.md` |

---

## 3. Discoveries & Next Steps (Handoff to TASK-005)

1. **Phase 2 In-Store Checkout Launchpad:** The bottom `OrderBar` currently generates the formatted WhatsApp dispatch link. In `TASK-005: In-Store Checkout & Saudi Payment Flow`, the CTA button will trigger the internal checkout modal for customer details (Riyadh districts, customer name, phone validation) before WhatsApp dispatch.
2. **Persistent Sync:** The cart state is fully preserved in `localStorage`, guaranteeing zero item loss between browsing and future checkout steps.
