# Phase B: Mobilized Engineering Skills & Execution Blueprint
## TASK-008: Merchant Center Overhaul, Catalog CRUD & Hybrid SEO Engine

> **Task ID:** `TASK-008-merchant-center-catalog-crud-and-hybrid-seo`  
> **Phase:** Phase B (Skills Mobilization & Architecture Blueprint)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Authorizer:** Agent Alpha (Lead Software Architect) & Brand Chief of Staff  
> **Timestamp:** 2026-10-05T04:34:30Z  

---

### 1. Overview & Objectives

In accordance with `SPEC.md` for **TASK-008**, Agent Beta mobilizes the repository's active skill ecosystem from `.agents/skills/` to elevate Hashousha (هشوشة) into an **Online Luxury Food Boutique**.

Key deliverables:
- **Comprehensive Merchant Center (`/admin`)**:
  1. `Overview`: Financial metrics, top dishes, recent orders stream.
  2. `Products CRUD`: Full product editing, Supabase Storage image uploads (`dishes` bucket), automatic slug generation.
  3. `Categories CRUD`: Category management with instant storefront synchronization.
  4. `Orders & Sales`: 6-phase order pipeline with 80mm thermal receipt kitchen print tickets.
  5. `Customers Registry`: Customer CRM with lifetime spend, order count, and direct WhatsApp / call links.
  6. `Discounts & Loyalty`: Coupon code creation and real-time checkout validation in `CheckoutModal`.
  7. `SEO & Discovery`: Global meta tags, Riyadh keywords, and live Google SERP preview.
- **Hybrid SEO Engine**:
  - In-store modal (`ProductDetailModal.tsx`) with pushState sync to `/dish/:slug`.
  - Standalone Google landing page (`ProductLandingPage.tsx`) for direct Google visitors with OpenGraph and `schema.org/Product` JSON-LD.

---

### 2. Active Skills Inventory & Concrete Technical Mobilization

| Skill Name | Skill Path | Specific Architectural Capabilities Applied |
|:---|:---|:---|
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices/SKILL.md` | - **Catalog Management & Hierarchy**: Structured data modeling for dishes, categories, and inventory.<br>- **Coupon Validation Architecture**: Client & server coupon validation logic (code, expiry, min spend, discount calculation).<br>- **Cloud Image Upload Lifecycle**: File selection, optimistic preview, Supabase Storage bucket upload, and public URL storage. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/SKILL.md` | - **Royal Boutique Visual Language**: Cohesive styling with warm ivory cards (`#fdfbf7`), linen canvas (`#faf7f2`), dark roast typography (`#2e1e0d`), warm bronze badges (`#9e774c`), and pomegranate highlights (`#931f2d`).<br>- **Modular Admin Dashboard Patterns**: Micro-borders, sticky headers, subtle table highlights, and modal transitions. |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps/SKILL.md` | - **Mobile/Tablet Admin Navigation**: Collapsible responsive sidebar with smooth slide-over drawer for kitchen tablets.<br>- **Touch Ergonomics**: 48px touch targets for table actions, file picker triggers, and coupon apply buttons. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | - **Hybrid Route Management**: Lightweight URL synchronization via `window.history.pushState` for `/dish/:slug` without full browser reloads.<br>- **SEO Schema.org Generation**: Clean injection of valid `application/ld+json` for Google Rich Snippets without hydration mismatch. |

---

### 3. Implementation Phasing Strategy

1. **Step 1: Domain Models & Cloud Services**
   - Create `src/types/admin.ts`: Contracts for Categories, Discounts, Customers, and SEO Settings.
   - Create `src/services/adminService.ts`: Supabase CRUD operations for products, categories, discounts, image storage upload, and SEO settings.
   - Update `src/types/menu.ts` to include `slug`, `seoTitle`, and `seoDescription`.

2. **Step 2: Merchant Center Shell & Navigation**
   - Create `src/components/admin/MerchantSidebar.tsx`: Royal boutique sidebar with 7 navigation items.
   - Create `src/components/admin/MerchantLayout.tsx`: Master administrative layout coordinating top bar, sidebar, and module switching.

3. **Step 3: Merchant Modules Implementation**
   - `OverviewModule.tsx`: Financial KPIs, top dishes, recent orders stream.
   - `ProductsModule.tsx` & `ProductEditModal.tsx`: Dishes table, add/edit modal, Supabase Storage image upload, auto-slug generator.
   - `CategoriesModule.tsx`: Categories table and add/edit modal with storefront sync.
   - `OrdersModule.tsx`: Embedding existing 6-phase pipeline & thermal ticket.
   - `CustomersModule.tsx`: Customer CRM with lifetime spend and direct call / WhatsApp links.
   - `DiscountsModule.tsx`: Discounts CRUD with code, percentage/fixed value, and min order spend.
   - `SeoModule.tsx`: SEO settings form and live Google SERP preview card.

4. **Step 4: Storefront & Checkout Integrations**
   - Update `CheckoutModal.tsx`: Add coupon code input, validate against discounts, and apply discount to total.
   - Create `ProductDetailModal.tsx`: In-store dish detail modal with URL update to `/dish/:slug`.
   - Create `ProductLandingPage.tsx`: Standalone SEO page with `schema.org/Product` JSON-LD and OpenGraph tags.
   - Update `DishCard.tsx`: Trigger `ProductDetailModal` on click.
   - Update `MenuSection.tsx`: Sync categories dynamically from `useMenuStore` or cloud categories.
   - Update `App.tsx`: Hybrid routing support for `/`, `/admin`, and `/dish/:slug`.

5. **Step 5: Build & TypeCheck Validation**
   - Run `npm run build` to verify 0 errors and 0 warnings.
   - Complete Phase C `EXECUTION.log` and Phase D `POST_MORTEM.md`.
