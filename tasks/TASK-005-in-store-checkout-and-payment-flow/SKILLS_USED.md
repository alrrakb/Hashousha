# Phase B: Mobilized Engineering Skills & Execution Blueprint
## TASK-005: In-Store Native Checkout & Saudi Payment Flow

> **Task ID:** `TASK-005-in-store-checkout-and-payment-flow`  
> **Phase:** Phase B (Skills Mobilization & Architecture Blueprint)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Authorizer:** Agent Alpha (Lead Software Architect) & Brand Chief of Staff  
> **Timestamp:** 2026-10-05T03:23:00Z  

---

### 1. Overview & Objectives

In accordance with `SPEC.md` for **TASK-005**, Agent Beta mobilizes the repository's active skill ecosystem from `.agents/skills/` to build a native in-store checkout dialog for Hashousha (هشوشة). This removes external WhatsApp dependencies for order placement, validates Saudi customer data and Riyadh delivery zones, provides seamless payment method switching (Cash on Delivery vs. Bank Transfer with one-click IBAN copy), persists orders locally under `hashousha_orders`, and presents a celebratory order confirmation modal with unique `#HSH-XXXX` tracking.

---

### 2. Active Skills Inventory & Concrete Technical Mobilization

| Skill Name | Skill Path | Specific Architectural Capabilities Applied |
|:---|:---|:---|
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices/SKILL.md`<br>+ `reference/layouts/checkout.md` | - **Checkout Flow & Friction Elimination**: Single-view dialog layout combining Order Summary, Customer Information, Delivery Location, Payment Selector, and Order Confirmation.<br>- **Order Total Transparency**: Itemized line summary + fixed delivery fee (20 ر.س) + grand total before placement.<br>- **State Cleanliness**: Instant cart purge upon order dispatch to guarantee zero duplicate submissions.<br>- **Trust & Security Signals**: Clear order status badges and customer support secondary communication. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/SKILL.md` | - **Artisanal Design Tokens**: Warm ivory modal cards (`#fdfbf7`), dark roast text (`#2e1e0d`), subtle warm linen texture canvas, warm bronze highlights (`#9e774c`), pomegranate accent triggers (`#931f2d`).<br>- **Micro-Borders & Shadows**: `border border-border/60`, `shadow-2xl`, subtle hover glow effects on active payment radios.<br>- **Accessibility & Spacing**: Proper focus outlines, text contrast adhering to WCAG AAA standards. |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps/SKILL.md` | - **Mobile Sheet Ergonomics**: Responsive sheet sliding from bottom on mobile (`rounded-t-[2rem] max-h-[92vh] overflow-y-auto`) and centered card dialog on desktop (`max-w-xl rounded-[2rem]`).<br>- **Safe-Area Insets**: Proper padding bottom `pb-[env(safe-area-inset-bottom)]`.<br>- **Touch Targets**: Minimum 48px height touch targets for radio options, quantity adjustments, and submit buttons.<br>- **Virtual Keyboards**: Optimized inputs (`inputMode="tel"` for phone, `dir="rtl"`). |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | - **Strict Typing**: Zero `any` types; well-defined interfaces for `Order`, `CustomerDetails`, `PaymentMethod`, `OrderItem`.<br>- **Direct Imports**: Direct Lucide icon imports and strict path resolution to keep bundle size minimal.<br>- **Re-render Optimization**: Local form state handling with minimal top-level re-render cascading.<br>- **Zero-Warning Clean Build**: Compliant with `tsc --noEmit` and Vite build standards (`noUnusedLocals` strictly respected). |

---

### 3. Implementation Phasing Strategy

1. **Step 1: Domain Contracts & Static Datasets**
   - Define `src/types/order.ts` (Order, CustomerDetails, PaymentMethod, OrderStatus, BankAccountDetails).
   - Create `src/data/riyadhDistricts.ts` (Curated Riyadh districts, Saudi phone regex `/^(05|\+?9665)\d{8}$/` and normalizer).
   - Create `src/data/bankAccounts.ts` (Al Rajhi Bank official account and IBAN).

2. **Step 2: Order Persistence Engine**
   - Create `src/store/useOrdersStore.ts` using Zustand `persist` with key `hashousha_orders`.
   - Expose `clearCart` in `CartContextValue` for direct cart clearing on checkout completion.

3. **Step 3: Component Engineering**
   - Build `src/components/checkout/CustomerForm.tsx` (Name, Saudi phone with real-time validation, Riyadh district searchable selector + manual input, address details, kitchen notes).
   - Build `src/components/checkout/PaymentSelector.tsx` (Cash on delivery vs. Bank transfer with instant copy IBAN and feedback).
   - Build `src/components/checkout/OrderSuccessModal.tsx` (Celebratory screen with `#HSH-XXXX`, copy button, kitchen timer, and optional WhatsApp dispatch).
   - Build `src/components/checkout/CheckoutModal.tsx` (Complete coordinating modal integrating order calculation, validation, storage, cart clearing, and success transition).

4. **Step 4: Storefront Integration**
   - Update `OrderBar.tsx`: Replace external WhatsApp anchor with "إتمام الطلب" button opening the checkout modal.
   - Mount `CheckoutModal` and coordinate state in `App.tsx`.

5. **Step 5: Rigorous Verification**
   - Run `npm run build` and ensure zero errors or warnings.
   - Verify all acceptance criteria from Phase A `SPEC.md`.
