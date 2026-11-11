# Skills Mobilized: TASK-025 — Multi-Size Dish Variants, Hospitality Capacity & Category Realignment

> **Task ID:** `TASK-025-multi-size-variants-hospitality-capacity-and-category-realignment`  
> **Milestone:** Milestone 21 — Multi-Size Dish Variants, Hospitality Capacity & Category Realignment  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-13  

---

## 1. Primary Skills Mobilized

### A. `storefront-best-practices` (`.agents/skills/storefront-best-practices/`)
- **Pillar Applied:** E-Commerce Product Variants & Cart Architecture.
  - Distinct Line Item Tracking: Products with multiple size variants (e.g. Mini, Medium, Family, 12-pack, 24-pack) must be keyed in the cart as `${dishId}__${variantId}` to ensure independent quantities, price lookups, and clear checkout summaries.
  - Hospitality Quantitative Clarification: In Saudi hospitality culture, food orders must immediately declare serving capacity (e.g. *تكفي شخص واحد*, *تكفي 4-6 أشخاص*, *تكفي 8-10 أشخاص*).
  - Clean Navigation Categorization: Sovereign category taxonomy (Plain Dough, Cocoa Dough, Sweet, Savory, Boxes, Cookies) without redundant size-based categories.

### B. `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)
- **Pillar Applied:** State Synchronization, Modal Hydration & Component Re-render Optimization.
  - Interactive Size Selector Pills with local memoized selection on `DishCard`, `ProductDetailModal`, and `ProductLandingPage`.
  - Immediate visual feedback on price changes without full layout re-renders.
  - Kitchen and Checkout synchronization: Selected variants accurately propagate to Order tickets and WhatsApp messages.

### C. `tailwind-design-system` (`.agents/skills/tailwind-design-system/`)
- **Pillar Applied:** Luxury Micro-Interactions & Pill Styling.
  - Tactile size selection pills with active luxury golden amber indicators (`bg-primary text-primary-foreground`) and subtle inactive states (`bg-secondary/60 text-muted-foreground`).
  - Serving info icon badges (`Users` icon with quantitative Arabic text).

---

## 2. Infrastructure & Tools Mobilized

- **`supabase` MCP (`execute_sql`):** Alter table `dishes` to add `variants JSONB` column, and reset/seed the `categories` table with the 6 official categories.
- **Node.js / tsx verification scripts:** Validate database reads, writes, and cart line calculations.
- **Vite & TypeScript compiler:** Complete production verification (`npm run build` exit code 0).

---

## 3. Readiness Declaration

Agent Beta has inspected `SPEC.md`, verified the architecture, and completed Phase B initialization. Proceeding to **Phase C Execution**.
