# TASK-004: Mobilized Skills & Engineering Capabilities (Phase B)

> **Task ID:** `TASK-004-v0-design-and-real-assets-migration`  
> **Phase:** Phase B (Skills Mobilization)  
> **Author:** Agent Beta (Senior Full-Stack Implementer)  
> **Supervisor:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Timestamp:** 2026-10-05T03:03:00Z  

---

## 1. Domain Skills Mobilized from `.agents/skills/`

In accordance with `AGENT_RULES.md` and Phase A `SPEC.md`, Agent Beta mobilizes the following four verified skills:

### 1.1 `wshobson/agents/tailwind-design-system`
- **CSS Custom Property Mapping:** Systematic injection of v0 design tokens into `:root` and `tailwind.config.js`:
  - `--background: #faf7f2`, `--foreground: #2e1e0d`
  - `--primary: #9e774c`, `--primary-foreground: #faf7f2`
  - `--accent: #931f2d`, `--accent-foreground: #faf7f2`
  - `--secondary: #f5efeb`, `--muted-foreground: #6b5a48`
  - `--card: #fdfbf7`, `--border: #e8ddd0`
- **Linen Tactile Surface Pattern:** Enforcing `.linen` textured backdrop incorporating layered linear gradients and warm ivory ambient radial lighting.
- **Component Radii Tokens:** High-end artisanal `rounded-[1.75rem]` and `rounded-[2rem]` card curvature.

### 1.2 `designed-by-ai/skills/design-mobile-apps`
- **Touch Ergonomics:** Guaranteeing 44px+ minimum touch targets for all interactive elements:
  - Stepper controls (`+` and `-` buttons) on `DishCard`.
  - Category pill tabs with horizontal swipe ergonomics (`overflow-x-auto [scrollbar-width:none]`).
- **Safe Area Insets:** Sticky `OrderBar` positioned with `pb-[max(0.75rem,env(safe-area-inset-bottom))]` to prevent clipping on mobile devices with home bars (iPhone & modern Android).

### 1.3 `medusajs/medusa-agent-skills/storefront-best-practices`
- **Gourmet Visual Hierarchy:** Structure of food items:
  - High-res culinary photography (`aspect-[4/3]`)
  - Badges indicator bar (`الأكثر طلباً`, `حامض حلو`, `حار مسمسم`, `جديد`)
  - English title subtitle (`tracking-[0.2em] font-serif uppercase text-primary`)
  - Arabic dish title (`font-bold text-foreground text-lg`)
  - Sensory description (`text-[13px] text-muted-foreground`)
  - Price display (`formatPrice(dish.price)`) with unit (`صينية ٥٠ حبة`)
  - Primary conversion CTA (`أضف للطلب` ➔ reactive stepper)
- **Cart Count Accessibility:** Maintaining `aria-live="polite"` on cart count changes and stepper updates.

### 1.4 `vercel-labs/agent-skills/vercel-react-best-practices`
- **Next.js to Vite/React Asset Adaptation:** Replacing `next/image` with responsive HTML `<img>` elements equipped with `loading="lazy"`, `decoding="async"`, and `object-cover`.
- **Re-render Optimization (`rerender-memo`):** Memoizing cart lines and order calculations in `CartProvider` / Zustand store.

---

## 2. Technical Invariants & Execution Checklist

- Zero missing images: all 7 real assets migrated into `public/images/`.
- Clean compilation under `npm run build` with zero TypeScript errors.
- Strict chronological logging in `EXECUTION.log`.
