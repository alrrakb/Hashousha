# Skills Mobilized: TASK-021 — Artisanal Babka Catalog Migration & Assets

> **Task ID:** `TASK-021-artisanal-babka-catalog-migration-and-assets`  
> **Milestone:** Milestone 17 — Artisanal Babka Full Catalog Migration & Visual Assets Generation  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-10  

---

## 1. Primary Skills Mobilized

### A. `storefront-best-practices` (`.agents/skills/storefront-best-practices/`)
- **Pillar Applied:** E-commerce Catalog Design, Pricing Transparency, Product Hierarchy, and Conversion Optimization.
- **Key Rules Enforced:**
  - Standardized display of pricing in SAR (`formatPrice`) without cent-division artifacts.
  - Zero emoji usage across official storefront labels, maintaining ultra-luxury French-Saudi boutique aesthetics.
  - Dynamic route readiness and canonical English slugs for every single item (`babka-mini-pesto`, `babka-family-nutella-pecan`, etc.).
  - Complete replacement of legacy dish categories with 4 high-converting categorized collections (`mini-babka`, `medium-babka`, `family-babka`, `babka-boxes`).
  - Accessibility standards: preserving `aria-live` on cart and interactive components.

### B. `tailwind-design-system` (`.agents/skills/tailwind-design-system/`)
- **Pillar Applied:** Design Token Uniformity & Color Calibration.
- **Key Rules Enforced:**
  - Luxury badge color presets (`amber`, `primary`, `emerald`, `rose`, `purple`, `blue`) consistent across both Light Ivory and Dark Espresso modes.
  - Consistent token mappings for gold roasting (`#9E774C`), dark roasting (`#2E1E0D`), warm linen (`#FDFBF7`), and pomegranate red accents (`#931F2D`).
  - Fluid mobile-first responsive grid system for 19 dishes across smartphone and desktop viewports.

### C. `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)
- **Pillar Applied:** Performance, Bundle Optimization, and Type Integrity.
- **Key Rules Enforced:**
  - Strict TypeScript type safety across `CategoryId`, `Dish`, `Category`, `BadgeKind`, and `SeoSettings`.
  - Zero runtime errors, zero circular dependencies, and complete clean-build guarantee (`npm run build`).
  - Proper image asset structuring under `public/images/dishes/` for fast static asset serving and caching.

---

## 2. MCP Tools Mobilized

- **`supabase` MCP:** Direct execution of cloud PostgreSQL migrations on `oulzpjcmnxvvrpdyfpcg` to synchronize `public.categories` and `public.dishes`.
- **`generate_image`:** High-fidelity AI photoshoot execution for all 19 Babka variants adhering to the visual contract.

---

## 3. Readiness Declaration

Agent Beta has reviewed all specifications in `SPEC.md` and activated the above skills. Proceeding to **Phase C Execution**.
