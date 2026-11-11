# Phase B: Mobilized Skills Catalog
## TASK-011: Luxury Skeleton Loading & Perceived Performance

> **Task ID:** `TASK-011-luxury-skeleton-loading-and-perceived-performance`  
> **Phase:** Phase B (Just-In-Time Skill Mobilization)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Timestamp:** 2026-10-05T06:01:00Z  

---

### 1. `medusajs/storefront-best-practices` (E-Commerce Perceived Performance & Conversion Trust)
- **Role in TASK-011:**
  - Eradicate jarring spinners (`animate-spin`) that induce waiting anxiety and perceived system latency.
  - Deliver immediate visual structure upon route or category transitions through warm ivory and bronze-gold geometry.
  - Maintain customer anticipation and trust through artisanal placeholders matching the exact bounding dimensions of Hashousha's signature dishes.

### 2. `designed-by-ai/design-mobile-apps` (Zero CLS & Mobile Viewport Geometry)
- **Role in TASK-011:**
  - Guarantee 0 Cumulative Layout Shift (CLS) on mobile, tablet, and desktop viewports during data hydration.
  - Implement 1:1 skeleton bounding boxes (`aspect-[16/10] sm:aspect-[16/9]` on modals, `aspect-[4/3]` on dish cards, `rounded-[1.75rem]` corners).
  - Ensure touch targets and scroll stability remain unperturbed as real dish entities mount over skeleton placeholders.

### 3. `wshobson/tailwind-design-system` (Artisanal Color Tokens & Shimmer Gradient Styling)
- **Role in TASK-011:**
  - Define warm linen background (`#f5ede2`) and royal gold-bronze gradient pulses in `src/index.css` via hardware-accelerated CSS animations.
  - Harmony with Hashousha brand palette (`#faf7f2`, `#fdfbf7`, `#2e1e0d`, `#9e774c`) without sterile cold gray utility defaults.
  - Accessible semantics: ensure all skeleton nodes carry `aria-hidden="true"` and appropriate ARIA live regions for assistive technologies.

### 4. `vercel-react-best-practices` (60fps GPU Hardware Acceleration & Zero Layout Thrashing)
- **Role in TASK-011:**
  - Pure GPU-accelerated CSS keyframe animation (`transform: translateX(...)` + `will-change: transform`), avoiding CPU-heavy JavaScript interval repaints.
  - Smooth crossfade transitions with Framer Motion (`<AnimatePresence mode="wait">`) between skeleton grids and live dish listings.
  - Proper image lifecycle management (`onLoad` state tracking and reset on `dish.id` change) preventing layout flicker and memory leaks.
