# Phase B: Mobilized Skills Catalog
## TASK-009: Manual Order Creation Engine (Merchant Center)

> **Task ID:** `TASK-009-manual-order-creation-engine`  
> **Phase:** Phase B (Just-In-Time Skill Mobilization)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Timestamp:** 2026-10-05T04:58:50Z  

---

### 1. `medusajs/storefront-best-practices` (E-Commerce Operations & Order Pipelines)
- **Role in TASK-009:**
  - Back-office manual order drafting: lines calculations, items pricing, tax/fee rounding, and discount deductions.
  - Ensuring optimistic state updates: injecting created orders into the active store without requiring full page reload.
  - Fail-safe cloud persistence: atomic save of `orders` and `order_items` records in Supabase.

### 2. `designed-by-ai/design-mobile-apps` (Ergonomic Modal & Touch Steppers)
- **Role in TASK-009:**
  - Desktop & tablet responsive dialog layout: scrollable inner body with sticky, accessible action footer.
  - Touch-friendly stepper controls for product quantity increments/decrements.
  - Appropriate mobile keyboard input modes: `inputMode="tel"` for phone numbers and `inputMode="numeric"` for monetary amounts.

### 3. `wshobson/tailwind-design-system` (Royal Linen Aesthetic Consistency)
- **Role in TASK-009:**
  - Strict adherence to the Hashousha brand palette:
    * Background: Linen Warm (`#faf7f2`)
    * Cards: Warm Ivory (`#fdfbf7`)
    * Text: Dark Roast (`#2e1e0d`)
    * Primary Actions: Warm Bronze & Gold (`#9e774c`)
    * Status Accents: Pomegranate Red (`#931f2d`) & Emerald
  - Seamless form inputs, segmented pill buttons, and radio card groups.

### 4. `vercel-react-best-practices` (Performance & Safe DOM Isolation)
- **Role in TASK-009:**
  - Memoized mathematical computations (`useMemo`) for subtotal, delivery fee, discount, and grand total.
  - Isolated thermal printing workflow: rendering `KitchenTicket` inside an isolated print wrapper without contaminating the primary DOM tree.
  - Preventing memory leaks on dialog mounting and unmounting.
