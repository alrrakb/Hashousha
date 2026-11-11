# TASK-006 SPECIFICATION: Kitchen Orders Management Dashboard

> **Task ID:** `TASK-006-kitchen-orders-management-dashboard`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 3 (Phase 3 of Overhaul)  

---

## 1. Executive Summary & Objective

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will construct the dedicated **Kitchen Orders Management Dashboard (لوحة تحكم وإدارة طلبات المطبخ)** for Hashousha (هشوشة).

This system adapts and streamlines the battle-tested order management architecture from `shbakhur-main/orders_sys`, customizing it specifically for a high-volume luxury food kitchen.

### Core Capabilities to Implement:
1. **Kitchen Operational HUD (`src/components/kitchen/KitchenDashboard.tsx`)**:
   - Discreet, elegant admin entrypoint in the storefront header and footer.
   - Quick KPI cards: Today's Revenue (إجمالي المبيعات بالريال), Active Orders (الطلبات النشطة), Total Orders (إجمالي الطلبات), and Top Dishes (الأكثر طلباً).
2. **Orders Pipeline & Status Flow (`src/components/kitchen/OrdersPipeline.tsx`)**:
   - Flexible orders list & table adapted from `shbakhur-main/orders_sys`.
   - Status filtering tabs covering the full 6-phase lifecycle:
     - `all` (الكل)
     - `pending` (جديد 🟡)
     - `processing` (قيد التحضير في المطبخ 🟣)
     - `confirmed` (جاهز للتوصيل 🔵)
     - `shipped` (جاري التوصيل مع المندوب 🚙)
     - `delivered` (تم التوصيل بنجاح 🟢)
     - `cancelled` (ملغي 🔴)
   - Search bar (by order `#HSH-XXXX`, customer name, or phone number).
   - One-click status progression buttons directly on each order card for rapid kitchen handoffs.
3. **Order Details Drawer & Kitchen Prep Ticket (`src/components/kitchen/OrderDetailsDrawer.tsx` & `KitchenTicket.tsx`)**:
   - Customer panel with direct call button (`tel:05xxxxxxxx`) and direct WhatsApp button.
   - Complete itemization of stuffed leaves, cabbage, platters, sweets, and special kitchen notes.
   - Printable "Kitchen Prep Ticket" (بون المطبخ السريع) with clean thermal/paper print styling (`@media print`) for pasting onto boxes and gathering trays.
4. **Dish Availability & Kitchen Stock Toggle (`src/components/kitchen/StockManager.tsx` & `src/store/useMenuStore.ts`)**:
   - Sub-tab allowing kitchen staff to toggle dish availability (`متوفر` vs. `نفد اليوم`).
   - Backed by persistent store (`useMenuStore` with `localStorage: hashousha_dishes`).
   - Real-time storefront reflection: dishes marked `inStock: false` show a "نفد اليوم" badge on `DishCard`, and the order button is disabled.
5. **Strict Food-Domain Invariant**:
   - Absolute exclusion of non-food elements: zero barcodes, zero inter-city shipping stickers (Aramex/SMSA), and zero SEO complexity.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Order lifecycle state management and status progression workflows.
   - Inventory availability guardrails (preventing orders on exhausted inventory).
2. **`designed-by-ai/skills/design-mobile-apps`**:
   - Mobile and tablet-friendly kitchen touch screen ergonomics (minimum 48px touch targets for rapid kitchen button clicks).
   - Fast status filter chips with horizontal scroll support on kitchen tablets.
3. **`wshobson/agents/tailwind-design-system`**:
   - Visual consistency with v0 luxury theme tokens (`--card`, `--primary`, `--accent`, `--foreground`, warm linen feel).
   - Clear semantic status colors (Amber for Pending, Purple for Processing, Blue for Confirmed, Emerald for Delivered).
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Memoized order list filtering and aggregation computations (`useMemo`).
   - Clean separation of print styles (`@media print`) preventing layout leakage.

---

## 3. Detailed Technical Specifications

### 3.1 Status Enums & Labels Contract (`src/types/kitchen.ts`)
```typescript
import { OrderStatus, Order, PaymentMethod } from './order';

export interface StatusMeta {
  label: string;
  badgeClass: string;
  bgLight: string;
  textClass: string;
  nextStatus?: OrderStatus;
  nextActionLabel?: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: "جديد",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    bgLight: "bg-amber-50",
    textClass: "text-amber-800",
    nextStatus: "processing",
    nextActionLabel: "بدء التحضير بالمطبخ 👨‍🍳",
  },
  processing: {
    label: "قيد التحضير",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
    bgLight: "bg-purple-50",
    textClass: "text-purple-800",
    nextStatus: "confirmed",
    nextActionLabel: "جاهز للتسليم 📦",
  },
  confirmed: {
    label: "جاهز للتوصيل",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    bgLight: "bg-blue-50",
    textClass: "text-blue-800",
    nextStatus: "shipped",
    nextActionLabel: "تسليم للمندوب 🚙",
  },
  shipped: {
    label: "جاري التوصيل",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-300",
    bgLight: "bg-sky-50",
    textClass: "text-sky-800",
    nextStatus: "delivered",
    nextActionLabel: "تأكيد الاستلام ✅",
  },
  delivered: {
    label: "تم التوصيل",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    bgLight: "bg-emerald-50",
    textClass: "text-emerald-800",
  },
  cancelled: {
    label: "ملغي",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
    bgLight: "bg-rose-50",
    textClass: "text-rose-800",
  },
};
```

### 3.2 Persistent Menu Store for Stock Availability (`src/store/useMenuStore.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from '../types/menu';
import { dishes as defaultDishes } from '../data/menu';

export interface MenuStoreState {
  dishes: Dish[];
  toggleDishStock: (dishId: string) => void;
  setDishStock: (dishId: string, inStock: boolean) => void;
  resetMenuToDefaults: () => void;
}

export const useMenuStore = create<MenuStoreState>()(
  persist(
    (set) => ({
      dishes: defaultDishes,
      toggleDishStock: (dishId: string) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === dishId ? { ...d, inStock: !d.inStock } : d
          ),
        })),
      setDishStock: (dishId: string, inStock: boolean) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === dishId ? { ...d, inStock } : d
          ),
        })),
      resetMenuToDefaults: () => set({ dishes: defaultDishes }),
    }),
    {
      name: 'hashousha_dishes',
    }
  )
);
```

### 3.3 Dashboard KPI Calculation Engine
Calculate directly from `useOrdersStore.getState().orders`:
- **Today's Revenue:** Sum of `totalAmount` for orders placed today (or all non-cancelled orders).
- **Active Orders:** Orders where status is in `['pending', 'processing', 'confirmed', 'shipped']`.
- **Delivered Orders:** Orders where status is `'delivered'`.
- **Top Dishes Counter:** Aggregated dish order count across all orders.

### 3.4 Kitchen Prep Ticket Blueprint (`KitchenTicket.tsx`)
A printable component optimized for standard 80mm thermal receipts or A4 printouts:
- Header: Wordmark "هشوشة — بون تحضير المطبخ", Order Number `#HSH-XXXX`, Date & Time.
- Customer: Name, Phone, Riyadh District, Full Address.
- Items Table: Dish name, Quantity, Portion/Unit, Price.
- Special Notes: Prominent highlighted box ("ملاحظات العميل: ...").
- Payment & Total: Payment method (`نقداً عند الاستلام` or `تحويل بنكي`) and Grand Total in `ر.س`.
- Print Trigger: One-click button calling `window.print()`.

### 3.5 Storefront Integration & Admin Toggle
1. **Admin Entrypoint:**
   - In `SiteHeader.tsx`: Subtle Chef Hat / Settings icon (`ChefHat` from `lucide-react`) leading to `/admin` or opening the `KitchenDashboard` view.
   - In footer/bottom of page: "لوحة تحكم المطبخ والطلبات 👨‍🍳".
2. **Storefront Stock Synchronization:**
   - Update `MenuSection.tsx` and `DishCard.tsx` to read dishes from `useMenuStore` instead of static `dishes`.
   - When `dish.inStock === false`:
     - Show badge: `نفد اليوم` in muted gray/rose styling.
     - Disable the `أضف للطلب` button with cursor-not-allowed and text `غير متوفر اليوم`.

---

## 4. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/kitchen.ts` | CREATE | Status mapping, KPI summaries, and kitchen contracts |
| `src/store/useMenuStore.ts` | CREATE | Zustand store with local persistence for dishes & stock availability |
| `src/components/kitchen/KitchenStats.tsx` | CREATE | KPI cards for revenue, active orders, and top dishes |
| `src/components/kitchen/OrdersPipeline.tsx` | CREATE | Filterable pipeline table & cards with quick status transitions |
| `src/components/kitchen/OrderDetailsDrawer.tsx` | CREATE | Order details drawer with direct call, WhatsApp, and print actions |
| `src/components/kitchen/KitchenTicket.tsx` | CREATE | Printable thermal-style kitchen preparation ticket |
| `src/components/kitchen/StockManager.tsx` | CREATE | Instant stock toggle list for kitchen menu availability |
| `src/components/kitchen/KitchenDashboard.tsx` | CREATE | Full kitchen dashboard view coordinating pipeline, stats, and stock |
| `src/components/storefront/v0/SiteHeader.tsx` | MODIFY | Add discreet kitchen dashboard toggle button |
| `src/components/storefront/v0/DishCard.tsx` | MODIFY | Render out-of-stock badge and disable ordering when dish is exhausted |
| `src/components/storefront/v0/MenuSection.tsx` | MODIFY | Bind dishes to `useMenuStore` for dynamic stock reactivity |
| `src/App.tsx` | MODIFY | Wire kitchen dashboard modal/view switcher |
| `tasks/TASK-006-kitchen-orders-management-dashboard/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-006-kitchen-orders-management-dashboard/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-006-kitchen-orders-management-dashboard/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] Discreet admin entrypoint in `SiteHeader` or storefront toggles the Kitchen Dashboard view smoothly.
- [ ] KPI cards display accurate Today's Revenue, Active Orders count, and Total Orders from `useOrdersStore`.
- [ ] Status tabs filter orders cleanly across all 6 lifecycle stages (`الكل`, `جديد`, `قيد التحضير`, `جاهز`, `جاري التوصيل`, `تم التوصيل`, `ملغي`).
- [ ] Search input filters orders dynamically by order number (`#HSH-XXXX`), customer name, or phone number.
- [ ] Direct one-click status transition buttons allow progressing orders (e.g. from `جديد` to `قيد التحضير` to `جاهز للتوصيل`) with instant UI reflection.
- [ ] Order details drawer displays full customer info, Riyadh district, address, and special notes with direct `tel:` and WhatsApp links.
- [ ] "طباعة بون المطبخ" renders a clean printable prep ticket formatted for pasting onto boxes.
- [ ] Stock Manager tab allows kitchen staff to toggle any dish between `متوفر` and `نفد اليوم`.
- [ ] Storefront `DishCard` dynamically reflects out-of-stock status, displaying a "نفد اليوم" badge and disabling the order button.
- [ ] Non-food complexity from `shbakhur-main` is strictly excluded (no barcodes, no external courier labels).
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-006-kitchen-orders-management-dashboard/`.
