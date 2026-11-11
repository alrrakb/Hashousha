# Phase B: Mobilized Skills Catalog — TASK-019

> **Task ID:** `TASK-019-storefront-home-dark-mode-refinement`  
> **Lifecycle Phase:** Phase B (Skills Mobilization)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Architectural Sign-off:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Timestamp:** 2026-10-09T07:33:30+03:00  

---

## 1. Inventory of Mobilized Skills

| Skill | Source | Primary Purpose for TASK-019 |
| :--- | :--- | :--- |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system` | Semantic tokenization of dark mode surfaces (`bg-card`, `dark:bg-[#231b14]`, `dark:bg-[#1a130c]`), dark shadow elevations, and multi-mode border tokens |
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices` | Eradication of contrast glare on food cards, luxury dark-roast culinary aesthetics, and floating cart capsule stability |

---

## 2. Skill Application Matrix

### 2.1 `tailwind-design-system`
- **Surface Harmonization (`bg-card`):** Replacing hardcoded ivory `#FDFBF7` in `Hero.tsx` and `StorefrontSkeletons.tsx` with `bg-card`. In our CSS design tokens, `--card` resolves to warm linen `#fdfbf7` in light mode and rich dark cocoa `#231b14` in dark mode (`.dark`), seamlessly adapting without color clashing.
- **Badge Tokenization:** Replacing hardcoded light ivory on the `tangy` ("حامض حلو") badge in `DishCard.tsx` with semantic tokens (`bg-card dark:bg-[#231b14] text-card-foreground dark:text-foreground border-primary/40`).
- **Dark Shadow Depth:** Adding dark shadow tokens (`dark:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)]`) to replace light-brown shadows that vanish on dark backgrounds.
- **Capsule Decoupling:** Decoupling `OrderBar.tsx` from inverted CSS variables (`bg-foreground text-background`), permanently anchoring it to a luxury roasting capsule (`#231B14` in light mode, `#1A130C` in dark mode) with golden accents.

### 2.2 `storefront-best-practices`
- **Zero-Flicker Image Loading:** Adding `dark:bg-secondary/50` to the dish card aspect ratio container so that dark mode users never experience a bright beige flash before food photography loads.
- **Visual Comfort & Non-Glare:** Guaranteeing that the entire storefront landing experience (Station 1) maintains an immersive, warm hotel-grade dark roast atmosphere.
