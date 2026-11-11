# TASK-005 SPECIFICATION: In-Store Native Checkout & Saudi Payment Flow

> **Task ID:** `TASK-005-in-store-checkout-and-payment-flow`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 2 (Phase 2 of Overhaul)  

---

## 1. Executive Summary & Objective

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement a complete, native **In-Store Checkout Experience (إتمام الطلب الداخلي)** for Hashousha (هشوشة).

This task eliminates exclusive dependency on external WhatsApp redirects for ordering, providing customers with an end-to-end luxury ordering flow within the storefront while maintaining full persistence and preparing structured order records for the kitchen dashboard (`TASK-006`).

### Core Capabilities to Implement:
1. **Hotel-Grade Checkout Modal (`src/components/checkout/CheckoutModal.tsx`)**:
   - Triggered directly from the "إتمام الطلب" button on the floating `OrderBar`.
   - Implements the v0 artisanal visual language: warm ivory cards (`#fdfbf7`), dark roast typography (`#2e1e0d`), subtle linen canvas styling, and bronze/pomegranate focus accents.
2. **Saudi Customer & Riyadh Context Engine (`src/components/checkout/CustomerForm.tsx`)**:
   - Customer Full Name (الاسم الكامل - required).
   - Strict Saudi Mobile Validation (`05xxxxxxxx` or `+9665xxxxxxxx`).
   - Smart Riyadh District Selector with search and custom text entry (الملقا، النرجس، الياسمين، حطين، الصحافة، العارض، الروضة...).
   - Detailed delivery location (street, villa/building, landmark) and special kitchen notes.
3. **Saudi Payment Method Selector (`src/components/checkout/PaymentSelector.tsx`)**:
   - Option 1: **الدفع عند الاستلام (شبكة أو كاش)**.
   - Option 2: **تحويل بنكي مباشر** (with one-click IBAN copy for Al Rajhi / SNB bank accounts and transfer acknowledgement).
4. **Order Generator & Persistence (`src/store/useOrdersStore.ts` & `src/types/order.ts`)**:
   - Generates unique `#HSH-XXXX` tracking numbers.
   - Persists completed orders into `localStorage` under `hashousha_orders`.
5. **Luxury Order Confirmation Screen (`src/components/checkout/OrderSuccessModal.tsx`)**:
   - Celebratory confirmation screen ("تم استلام طلبك وبدأ المطبخ بالتحضير 👨‍🍳🌿").
   - Order summary card with unique order code and prep estimate.
   - Clears cart automatically.
   - Optional secondary action: "إرسال نسخة للواتساب" for customer service and sharing.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Frictionless checkout sequence: Cart review ➔ Customer Info ➔ Payment Method ➔ Order Confirmation.
   - Form error state handling with clear inline Arabic validation messages.
   - Cart clearing protocol upon order dispatch to prevent duplicate orders.
2. **`designed-by-ai/skills/design-mobile-apps`**:
   - Mobile-first sheet/dialog interactions: draggable header affordance, bottom safe-area paddings (`pb-[env(safe-area-inset-bottom)]`).
   - Touch ergonomics: `inputMode="tel"` for Saudi phone numbers, `inputMode="numeric"` for postal/building codes.
   - Minimum 48px touch targets for payment method radio cards and submit actions.
3. **`wshobson/agents/tailwind-design-system`**:
   - Aesthetic harmony with v0 tokens: `--card: #fdfbf7`, `--background: #faf7f2`, `--primary: #9e774c`, `--accent: #931f2d`, `--border: #e8ddd0`.
   - Luxury micro-borders (`border border-primary/20`) and gourmet elevation shadows (`shadow-2xl`).
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Strict TypeScript prop contracts.
   - Efficient state management avoiding unnecessary re-renders during form typing.

---

## 3. Detailed Technical Specifications

### 3.1 Strict TypeScript Contracts (`src/types/order.ts`)
```typescript
export type OrderStatus =
  | "pending"     // جديد
  | "processing"  // قيد التحضير في المطبخ
  | "confirmed"   // جاهز للتوصيل
  | "shipped"     // جاري التوصيل مع المندوب
  | "delivered"   // تم التوصيل بنجاح
  | "cancelled";  // ملغي

export type PaymentMethod = "cod" | "bank_transfer";

export interface CustomerDetails {
  name: string;
  phone: string; // validated 05xxxxxxxx
  district: string; // Riyadh district
  addressDetails: string;
  notes?: string;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  dishImage: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  iban: string;
  accountNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. '#HSH-1042'
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 3.2 Saudi Validation & Riyadh Districts Dataset (`src/data/riyadhDistricts.ts`)
1. **Phone Validation:**
   - Must validate with regex: `/^(05|\+?9665)\d{8}$/`.
   - Normalize to canonical format: `05XXXXXXXX`.
2. **Riyadh Districts List:**
   ```typescript
   export const RIYADH_DISTRICTS = [
     "الملقا", "النرجس", "الياسمين", "حطين", "الصحافة", "العارض",
     "الروضة", "قرطبة", "الغدير", "الربيع", "التعاون", "الرمال",
     "المونسية", "إشبيلية", "العليا", "السليمانية", "المعذر",
     "الدرعية", "النخيل", "حي السفارات", "لبن", "السويدي", "الشفا"
   ] as const;
   ```
   Provide a searchable selector or dropdown with quick search filter + option "حي آخر (إدخال يدوي)".

### 3.3 Bank Account Information Dataset (`src/data/bankAccounts.ts`)
```typescript
export const OFFICIAL_BANK_ACCOUNT: BankAccountDetails = {
  bankName: "مصرف الراجحي (Al Rajhi Bank)",
  accountName: "مؤسسة هشوشة للأطعمة الفاخرة",
  iban: "SA0380000456608010123456",
  accountNumber: "456608010123456",
};
```

### 3.4 Orders State Store (`src/store/useOrdersStore.ts`)
- Zustand store using `persist` with storage key `hashousha_orders`.
- Methods:
  - `orders: Order[]`
  - `addOrder: (order: Order) => void`
  - `updateOrderStatus: (orderId: string, status: OrderStatus) => void`
  - `getOrder: (orderId: string) => Order | undefined`

### 3.5 Component Blueprint

#### 1. `OrderBar.tsx` Update:
- Replace the direct WhatsApp `<a>` link with an interactive `<button>` labeled **"إتمام الطلب"** (styled in pomegranate accent `bg-accent text-accent-foreground`).
- Clicking the button opens the checkout modal when the cart is not empty.

#### 2. `CheckoutModal.tsx`:
- Fixed overlay backdrop (`backdrop-blur-sm bg-foreground/60`).
- Responsive dialog: full-width bottom sheet on mobile (`max-h-[92vh] overflow-y-auto rounded-t-[2rem]`), centered modal on desktop (`max-w-xl rounded-[2rem]`).
- Clean visual sections:
  1. Header with title ("إتمام الطلب الفاخر 🌿") and close button.
  2. Order Summary Banner (total items count, subtotal, delivery fee = 20 ر.س, grand total).
  3. Customer Info Form (Name, Phone with instant feedback, District selector, Detailed address, Kitchen notes).
  4. Payment Method Selector (COD vs. Bank Transfer with IBAN copy button).
  5. Action Submit Button ("تأكيد الطلب").

#### 3. `OrderSuccessModal.tsx`:
- Celebratory modal with animated checkmark or gourmet dish emblem.
- Displays generated order number: `#HSH-XXXX` with one-click copy.
- Confirmation badge: "طلبك قيد التحضير في المطبخ الآن 👨‍🍳 (الوقت المتوقع: ٣٠-٤٥ دقيقة)".
- Button 1: "إرسال ملخص الطلب إلى الواتساب 📱" (creates formatted Arabic WhatsApp message as secondary channel).
- Button 2: "العودة للقائمة الرئيسية 🌿" (closes modal and returns to storefront).

---

## 4. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/order.ts` | CREATE | Complete Order, Customer, Payment, and Status TypeScript contracts |
| `src/data/riyadhDistricts.ts` | CREATE | Curated Riyadh districts dataset and phone validation helper |
| `src/data/bankAccounts.ts` | CREATE | Official Hashousha bank accounts for bank transfer option |
| `src/store/useOrdersStore.ts` | CREATE | Zustand persistent store for orders lifecycle |
| `src/components/checkout/CustomerForm.tsx` | CREATE | Name, Saudi phone, district search, address, and notes fields |
| `src/components/checkout/PaymentSelector.tsx` | CREATE | COD and Bank Transfer radio cards with one-click IBAN copy |
| `src/components/checkout/OrderSuccessModal.tsx` | CREATE | Luxury order confirmation view with #HSH-XXXX and optional WhatsApp dispatch |
| `src/components/checkout/CheckoutModal.tsx` | CREATE | Main checkout container coordinating form, order generation, and state |
| `src/components/storefront/v0/OrderBar.tsx` | MODIFY | Wire primary CTA button to open `CheckoutModal` |
| `src/App.tsx` | MODIFY | Render `CheckoutModal` alongside `OrderBar` |
| `tasks/TASK-005-in-store-checkout-and-payment-flow/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-005-in-store-checkout-and-payment-flow/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-005-in-store-checkout-and-payment-flow/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `src/types/order.ts` defines all contracts (`Order`, `CustomerDetails`, `OrderItem`, `PaymentMethod`, `OrderStatus`).
- [ ] `src/store/useOrdersStore.ts` persists placed orders in `localStorage` (`hashousha_orders`).
- [ ] Clicking "إتمام الطلب" in `OrderBar` opens the checkout modal with proper focus management.
- [ ] Saudi mobile number strictly validates (`05xxxxxxxx` or `+9665xxxxxxxx`) with descriptive Arabic error messages.
- [ ] Riyadh district selector allows searching and selecting curated districts or entering custom districts.
- [ ] Both payment methods (Cash on Delivery and Bank Transfer) work seamlessly.
- [ ] Selecting "تحويل بنكي" renders bank details and includes a working one-click copy button for the IBAN.
- [ ] Submitting the order generates a unique `#HSH-XXXX` code, clears the active cart, and saves the order to `useOrdersStore`.
- [ ] `OrderSuccessModal` displays the generated order number, prep time estimate, and optional WhatsApp dispatch button.
- [ ] Styling strictly conforms to v0 luxury tokens (`--card`, `--primary`, `--accent`, `--foreground`, warm linen feel).
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-005-in-store-checkout-and-payment-flow/`.
