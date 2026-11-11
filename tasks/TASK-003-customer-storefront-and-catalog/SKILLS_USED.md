# TASK-003: Mobilized Skills & Engineering Capabilities (Phase B)

> **Task ID:** `TASK-003-customer-storefront-and-catalog`  
> **Phase:** Phase B (Skills Mobilization)  
> **Author:** Agent Beta (Senior Full-Stack Implementer)  
> **Supervisor:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Timestamp:** 2026-10-05T02:35:00Z  

---

## 1. Domain Skills Mobilized from `.agents/skills/`

In accordance with `AGENT_RULES.md` and Phase A `SPEC.md`, Agent Beta mobilizes the following four verified skills:

### 1.1 `medusajs/medusa-agent-skills/storefront-best-practices`
- **Visual Hierarchy:** Product card structured strictly as: Dish Imagery (`aspect-[4/3]`) ➔ Title ➔ Gastronomy Badge ➔ Price (`ر.س`) ➔ Primary CTA Button.
- **Accessibility:** `aria-live="polite"` on cart count updates and accessible screen reader labels for dish cards.
- **Conversion Optimization:** Clear trust signals (طازج يومياً، زيت زيتون بكر، توصيل سريع)، frictionless CTA, and visible badge cues.
- **Image Handling:** Explicit `loading="lazy"` on below-the-fold dish photography with graceful fallback handling.

### 1.2 `wshobson/agents/tailwind-design-system`
- **Design Token Invariance:** 100% adherence to tokens defined in `docs/DESIGN_SYSTEM.md` and configured in `tailwind.config.js`:
  - `olive-50` through `olive-950`
  - `pomegranate-50` through `pomegranate-900`
  - `honey-50` through `honey-800`
  - `surface-warm` (`#FDFBF7`), `surface-card`, `surface-muted`, `surface-border`
  - `shadow-gourmet-sm`, `shadow-gourmet-md`, `shadow-gourmet-lg`, `shadow-gourmet-float`
- **Zero Arbitrary Classes:** Banned inline hex codes (`#...`) and arbitrary bracket notation (`w-[...]` unless strict dimensional invariants).

### 1.3 `designed-by-ai/skills/design-mobile-apps`
- **Touch Targets:** Minimum 44px (`min-h-[44px]` / `h-11`) touch target boundaries for interactive buttons, category pills, and search triggers.
- **Ergonomic Scrolling:** Horizontal scrolling category tabs bar with `scrollbar-none`, `overscroll-x-contain`, and smooth touch inertia.
- **Mobile Responsive Breakpoints:** Mobile-first layout scaling progressively from 1 column (`grid-cols-1`) on mobile, to 2 columns on tablet (`sm:grid-cols-2`), to 3-4 columns on desktop (`lg:grid-cols-3 xl:grid-cols-4`).

### 1.4 `vercel-labs/agent-skills/vercel-react-best-practices`
- **Re-render Optimization (`rerender-memo`, `rerender-derived-state`):** Filtered catalog computation derived via `useMemo` on `[products, activeCategoryId, searchQuery]`.
- **Atomic Modular Contracts:** Clear prop interfaces (`ProductCardProps`, `CategoryPillsProps`, `HeroBannerProps`, `BadgeProps`).
- **Eliminating Waterfalls:** Client-side local seed initialization (`src/data/initialCatalog.ts`) backed by Zustand, providing instant zero-latency rendering.

---

## 2. Internal Architectural Standards Consulted

1. **`AGENT_RULES.md`**:
   - Laws of Scope Containment (zero ad-hoc modifications, strict design token sovereignty).
   - Arabic-first RTL invariant (`dir="rtl"`).
2. **`docs/DESIGN_SYSTEM.md`**:
   - Typographic hierarchy (`Cairo` for Display/Headings, `Readex Pro` for body and numerals).
   - Badge styling matrix (`bestseller` ➔ Honey, `signature` ➔ Pomegranate, `spicy` ➔ Pomegranate Red, `new` ➔ Olive Green).
3. **`docs/SYSTEM_ARCHITECTURE.md`**:
   - Formal data contracts for `Category`, `Product`, `ProductOptionGroup`, `ProductOptionChoice`.
4. **`docs/LEGACY_SYSTEM_AUDIT.md`**:
   - Audited legacy items extracted from `old_store/` ("سر اللفة" / Hana Store).

---

## 3. Engineering Invariants for Phase C Execution

- Native Arabic layout and culinary terminology.
- Clean compilation under `npm run build` with zero TypeScript errors.
- Strict chronological logging in `EXECUTION.log`.
