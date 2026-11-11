# Phase B: Mobilized Engineering Skills & Execution Blueprint
## TASK-006: Kitchen Orders Management Dashboard

> **Task ID:** `TASK-006-kitchen-orders-management-dashboard`  
> **Phase:** Phase B (Skills Mobilization & Architecture Blueprint)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Authorizer:** Agent Alpha (Lead Software Architect) & Brand Chief of Staff  
> **Timestamp:** 2026-10-05T03:35:00Z  

---

### 1. Overview & Objectives

In accordance with `SPEC.md` for **TASK-006**, Agent Beta mobilizes the repository's active skill ecosystem from `.agents/skills/` to build a high-performance **Kitchen Orders Management Dashboard (لوحة تحكم وإدارة طلبات المطبخ)**.

This system adapts the architecture from `shbakhur-main/orders_sys` specifically for a gourmet kitchen:
- Real-time KPI summaries (Today's Revenue, Active Kitchen Orders, Total Orders, Top Dishes).
- 6-phase order pipeline with instant status progression buttons.
- Customer communication drawer with one-tap phone call and WhatsApp triggers.
- Thermal/paper printable prep ticket (`KitchenTicket.tsx` with `@media print`).
- Kitchen menu availability manager (`StockManager.tsx` + `useMenuStore.ts`), dynamically reflecting on storefront `DishCard` items.

---

### 2. Active Skills Inventory & Concrete Technical Mobilization

| Skill Name | Skill Path | Specific Architectural Capabilities Applied |
|:---|:---|:---|
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices/SKILL.md` | - **Order Lifecycle Management**: Structured status pipeline (`pending` ➔ `processing` ➔ `confirmed` ➔ `shipped` ➔ `delivered` / `cancelled`).<br>- **Inventory Availability Guardrails**: Out-of-stock dish state management prevents customer disappointment and orders for depleted inventory.<br>- **Order Tracking & Communication**: Transparent customer contact links with direct order payload references. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/SKILL.md` | - **Semantic Operational Tokens**: Clean semantic color chips (Amber for Pending 🟡, Purple for Kitchen Prep 👨‍🍳, Blue for Ready/Confirmed 📦, Sky for On Delivery 🚙, Emerald for Delivered 🟢, Rose for Cancelled 🔴).<br>- **Luxury Artisanal Consistency**: Harmonious cards, borders, and typography maintaining Hashousha's warm identity (`#faf7f2`, `#fdfbf7`, `#2e1e0d`, `#9e774c`). |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps/SKILL.md` | - **Kitchen Tablet Ergonomics**: Minimum 48px touch targets for rapid fingers in kitchen environments.<br>- **Responsive Drawer & Tabs**: Smooth slide-over drawer for order details, horizontal scroll tabs with zero overflow clipping.<br>- **Thermal Print Isolation**: High-contrast, clean 80mm printable layout tailored for receipt printers and packing tables. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | - **Strict Typing**: Strict contracts in `src/types/kitchen.ts` without `any`.<br>- **Performance & Computations**: Memoized calculations for KPIs and filter lookups.<br>- **Clean CSS Printing**: Standalone print styles scoped to `.kitchen-ticket-print` to avoid bleed into the web application layout. |

---

### 3. Implementation Phasing Strategy

1. **Step 1: Domain Contracts & Persistent Stores**
   - Create `src/types/kitchen.ts`: Status labels, semantic color mappings, next action transitions, KPI interfaces.
   - Create `src/store/useMenuStore.ts`: Persistent Zustand store with key `hashousha_dishes`, stock toggle, and reset methods.

2. **Step 2: Kitchen Operational HUD & KPI Cards**
   - Create `src/components/kitchen/KitchenStats.tsx`: Quick stats (Revenue, Active Orders, Delivered, Top Dishes).

3. **Step 3: Orders Pipeline Engine**
   - Create `src/components/kitchen/OrdersPipeline.tsx`: Multi-status filter tabs, search bar, order cardlets with rapid one-click status advancement.

4. **Step 4: Order Details Drawer & Printable Kitchen Ticket**
   - Create `src/components/kitchen/KitchenTicket.tsx`: 80mm printable thermal prep ticket with `@media print`.
   - Create `src/components/kitchen/OrderDetailsDrawer.tsx`: Customer information, phone call action, WhatsApp action, status dropdown, printable trigger.

5. **Step 5: Kitchen Stock Management**
   - Create `src/components/kitchen/StockManager.tsx`: Real-time toggle list for all dishes.

6. **Step 6: Master Kitchen Dashboard View**
   - Create `src/components/kitchen/KitchenDashboard.tsx`: Coordinates tabs (`طلبات المطبخ` vs `إدارة توفر الأطباق`), statistics, drawer, and tickets.

7. **Step 7: Storefront Integration & Build Validation**
   - Modify `SiteHeader.tsx`: Add discreet kitchen dashboard toggle button with `ChefHat` icon.
   - Modify `DishCard.tsx`: Display "نفد اليوم" badge and disable order CTA when `inStock: false`.
   - Modify `MenuSection.tsx`: Wire to `useMenuStore.dishes`.
   - Modify `App.tsx`: Mount `KitchenDashboard` modal/view switcher.
   - Run `npm run build` to verify clean compilation with 0 errors and 0 warnings.
