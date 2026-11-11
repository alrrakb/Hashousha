# TASK-009 SPECIFICATION: Manual Order Creation Engine (Merchant Center)

> **Task ID:** `TASK-009-manual-order-creation-engine`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 5 (Merchant Center & Order Fulfillment)  

---

## 1. Executive Summary & Objective

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-009: Manual Order Creation Engine (محرك تدوين الطلبات اليدوية)** within the Merchant Center (`/admin`).

This feature empowers the Hashousha operational and sales team to record incoming orders received via telephone calls, direct WhatsApp inquiries, VIP client requests, and in-person boutique pickups without requiring the customer to go through the consumer web storefront.

### Core Capabilities to Implement:
1. **Prominent Orders Header Action (`OrdersModule.tsx`)**:
   - Add a high-visibility royal CTA button in the header of the Orders module: `[+ تسجيل طلب يدوي جديد]`.
2. **Comprehensive Manual Order Modal (`CreateManualOrderModal.tsx`)**:
   - **Riyadh Customer Context:** Customer name, validated Saudi mobile number (`05xxxxxxxx`), Riyadh district selector (23 curated neighborhoods + custom text input), detailed address, and kitchen/prep instructions.
   - **Interactive Dish & Quantity Selector:** Live dish search/picker from active catalog, quantity stepper (`+ / -`), and itemized summary with portion descriptions.
   - **Dynamic Financial Engine:** Real-time subtotal, flexible delivery fee (default 20 SAR with quick toggle for 0 SAR free delivery / store pickup), custom discount deduction, and grand total.
   - **Payment & Operational Status:** Support for Cash on Delivery, Bank Transfer, and Prepaid (مدفوع مسبقاً), with choice of initial state (`pending 🟡` or `processing 🟣`).
3. **Cloud Persistence & Realtime Integration (`src/services/orderService.ts`)**:
   - Generates unique `#HSH-XXXX` tracking code.
   - Persists order and its lines directly to Supabase (`public.orders` and `public.order_items`).
   - Syncs seamlessly with `useOrdersStore` so the new order appears instantly at the head of the pipeline.
4. **Immediate 80mm Thermal Prep Ticket Printing**:
   - On submission, offers an instant one-click action to print the 80mm kitchen preparation ticket (`KitchenTicket.tsx`) ready to paste onto pastry boxes and gathering trays.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Back-office order creation workflows: line item aggregation, rounding, and discount calculation integrity.
   - Optimistic UI updates with cloud synchronization and rollback safety.
2. **`designed-by-ai/skills/design-mobile-apps`**:
   - Modal ergonomics: scrollable content areas with fixed summary footer, touch-friendly `+ / -` steppers.
   - Numeric input handling (`inputMode="tel"`, `inputMode="numeric"`).
3. **`wshobson/agents/tailwind-design-system`**:
   - Cohesive boutique aesthetic: Warm Ivory cards (`#fdfbf7`), Linen background (`#faf7f2`), Dark Roast text (`#2e1e0d`), Bronze badges and active buttons (`#9e774c`).
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Clean controlled form state, memoized subtotal/total calculations using `useMemo`.
   - Isolated thermal printing rules avoiding print layout contamination.

---

## 3. Detailed Technical Specifications

### 3.1 Type Contract Enhancements (`src/types/order.ts`)
Update `PaymentMethod` to accommodate manual prepaid orders:
```typescript
export type PaymentMethod = "cod" | "bank_transfer" | "prepaid";
```

### 3.2 Orders Module Header Action (`src/components/admin/modules/OrdersModule.tsx`)
In `OrdersModule.tsx`, update the top bar layout:
```tsx
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-primary/10">
  <div>
    <h2 className="text-lg font-black text-foreground flex items-center gap-2">
      <ShoppingBag className="size-5 text-primary" />
      <span>إدارة الطلبات والمبيعات 📦</span>
    </h2>
    <p className="text-xs text-muted-foreground">
      متابعة مراحل تحضير الطلبات، التواصل السريع مع العملاء عبر الهاتف والواتساب، وتسجيل الطلبات اليدوية.
    </p>
  </div>
  
  <button
    type="button"
    onClick={() => setCreateModalOpen(true)}
    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
  >
    <PlusCircle className="size-4" />
    <span>تسجيل طلب يدوي جديد</span>
  </button>
</div>
```

### 3.3 Create Manual Order Modal Architecture (`src/components/admin/modules/CreateManualOrderModal.tsx`)

#### 1. Customer Information Section:
- **Full Name (`customerName`):** Text input, required.
- **Saudi Mobile (`customerPhone`):** Validated against `/^(05|\+?9665)\d{8}$/`. Normalized to `05xxxxxxxx`.
- **Riyadh District (`district`):** Combobox / searchable select with options from `RIYADH_DISTRICTS` (الملقا، النرجس، الياسمين، حطين، الصحافة، العارض، الروضة...) + custom text entry fallback.
- **Detailed Address (`addressDetails`):** Street name, building/villa number, landmark.
- **Special Kitchen Notes (`notes`):** Optional textarea (e.g. "بدون بصل", "دبس رمان إضافي", "توصيل قبل صلاة المغرب").

#### 2. Dish Picker & Itemized Table Section:
- Shows available dishes from `dishes` (or `fetchDishesFromSupabase()`).
- Quick search / filter by dish name.
- When an item is selected:
  - Add to `selectedItems` list with default quantity = 1.
  - Interactive stepper: `+` button, count, `-` button, and remove trash icon.
- Line calculation: `item.unitPrice * item.quantity`.

#### 3. Financial Breakdown Section:
- **Subtotal:** Sum of `(item.unitPrice * item.quantity)`.
- **Delivery Fee:**
  - Default: `20` SAR (توصيل عادي بالرياض).
  - Quick pills: `[توصيل بالرياض (20 ر.س)]`, `[توصيل مجاني VIP (0 ر.س)]`, `[استلام من الفرع (0 ر.س)]`.
  - Manual numeric input option.
- **Discount Deduction (optional):** Fixed amount in SAR to deduct from total (e.g. `10` or `25` SAR).
- **Grand Total:** `Math.max(0, subtotal + deliveryFee - discount)`.

#### 4. Payment Method & Initial Lifecycle Status:
- Payment Method Radio Cards:
  - `cod`: الدفع عند الاستلام (شبكة / كاش عند الباب)
  - `bank_transfer`: تحويل بنكي (الراجحي / الأهلي)
  - `prepaid`: مدفوع مسبقاً (تم التحويل / سداد مباشر)
- Initial Status Radio:
  - `pending`: جديد 🟡 (في الانتظار)
  - `processing`: قيد التحضير بالمطبخ 🟣 (بدء التحضير فوراً)

#### 5. Submission & Thermal Ticket Print Workflow:
- On submit:
  - Generates unique order number: `#HSH-${Math.floor(1000 + Math.random() * 9000)}`.
  - Constructs `Order` object with unique `id: 'ord-' + Date.now()`.
  - Calls `saveOrderToSupabase(order)` to save in cloud tables `orders` and `order_items`.
  - Appends order to `useOrdersStore` (via `addOrder(order)`).
  - Switches modal view to Celebration / Confirmation Screen:
    - "تم تسجيل الطلب اليدوي بنجاح! رقم الطلب: #HSH-XXXX 👨‍🍳"
    - Primary button: **"طباعة بون المطبخ الفوري (80mm) 🖨️"** (triggers print of `KitchenTicket`).
    - Secondary button: **"إغلاق والعودة لقائمة الطلبات"**.

---

## 4. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/order.ts` | MODIFY | Add `"prepaid"` to `PaymentMethod` union type |
| `src/components/admin/modules/CreateManualOrderModal.tsx` | CREATE | Complete manual order recording dialog with customer form, dish selector, financial calculation, and print prompt |
| `src/components/admin/modules/OrdersModule.tsx` | MODIFY | Add `[+ تسجيل طلب يدوي جديد]` CTA button in header and wire `CreateManualOrderModal` |
| `src/components/admin/MerchantCenter.tsx` | MODIFY | Ensure `OrdersModule` receives `dishes` list and order dispatch callback |
| `tasks/TASK-009-manual-order-creation-engine/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-009-manual-order-creation-engine/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-009-manual-order-creation-engine/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `OrdersModule.tsx` features a prominent `[+ تسجيل طلب يدوي جديد]` button in the module header.
- [ ] Clicking the button opens `CreateManualOrderModal.tsx` with smooth modal animations.
- [ ] Customer form strictly validates customer name and Saudi mobile number (`05xxxxxxxx`).
- [ ] Riyadh district selector allows selecting from curated districts or entering custom text.
- [ ] Dish selector allows choosing active dishes from catalog with interactive quantity steppers (`+ / -`).
- [ ] Financial calculations compute subtotal, flexible delivery fee (20 SAR / 0 SAR VIP / custom), custom discount, and grand total.
- [ ] Payment methods support COD, Bank Transfer, and Prepaid.
- [ ] Initial status options allow setting the order as `pending` (جديد 🟡) or `processing` (قيد التحضير 🟣).
- [ ] Saving the order creates a unique `#HSH-XXXX` code and persists both `orders` and `order_items` in Supabase.
- [ ] The created order immediately appears at the top of the orders pipeline without page refresh.
- [ ] Immediate print action allows printing the 80mm kitchen preparation ticket (`KitchenTicket`).
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-009-manual-order-creation-engine/`.
