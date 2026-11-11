# TASK-008 SPECIFICATION: Merchant Center Overhaul, Catalog CRUD & Hybrid SEO Engine

> **Task ID:** `TASK-008-merchant-center-catalog-crud-and-hybrid-seo`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 5 (Merchant Center & Hybrid SEO)  

---

## 1. Executive Summary & Brand Identity

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will execute **TASK-008**, elevating **Hashousha (هشوشة للمحاشي والحلويات الفاخرة)** from a kitchen-oriented interface into an **Online Luxury Food Boutique (متجر أطعمة فاخرة أونلاين)**.

This task delivers two monumental architectures:
1. **The Comprehensive Merchant Center (`/admin`)**: Adapted and elevated from the battle-tested `shbakhur-main/orders_sys` system, styled in Hashousha's royal linen palette (`#faf7f2`, `#fdfbf7`, `#2e1e0d`, bronze `#9e774c`, pomegranate `#931f2d`), featuring 7 core modules:
   - 👑 **Overview (نظرة عامة):** Financial metrics, active orders, and sales analytics.
   - 🍽️ **Products CRUD (إدارة المنتجات):** Full catalog management, image uploads to Supabase Storage (`dishes` bucket), and automated SEO slug generation.
   - 📑 **Categories CRUD (إدارة التصنيفات):** Category hierarchy with instant storefront navigation synchronization.
   - 📦 **Orders & Sales (الطلبات والمبيعات):** 6-phase order pipeline, customer details, and 80mm thermal kitchen ticket printing.
   - 👥 **Customers (سجل العملاء):** Customer directory, district insights, order counts, and lifetime spend.
   - 🏷️ **Discounts & Loyalty (كوبونات الخصم):** Coupon code creation, percentage/fixed amounts, and real-time checkout validation.
   - 🔍 **SEO & Discovery (تحسين السيو):** Meta tags manager, Riyadh district keywords, and Schema.org rich snippets.
2. **The Hybrid SEO Engine (SPA Modal + Google Product Landing)**:
   - **In-Store Visitor:** Clicking any dish card opens `ProductDetailModal` seamlessly without leaving the page, while updating the browser address to `/dish/:slug`.
   - **External Google Visitor:** Direct navigation to `/dish/:slug` renders a standalone, fully-featured, crawlable product landing page containing OpenGraph tags and `ld+json` (`schema.org/Product`) for Google Rich Snippets with price and ratings.

---

## 2. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Product catalog management, category hierarchy, coupon code validation algorithms.
   - Image upload lifecycle with optimistic preview and error recovery.
2. **`wshobson/agents/tailwind-design-system`**:
   - Royal boutique aesthetic: Warm Ivory cards (`#fdfbf7`), Linen background (`#faf7f2`), Dark Roast text (`#2e1e0d`), Bronze badges and active tabs (`#9e774c`), Pomegranate accents (`#931f2d`).
   - Clean responsive navigation sidebar and modal overlays.
3. **`designed-by-ai/skills/design-mobile-apps`**:
   - Mobile and tablet drawer navigation for the Merchant Center.
   - Touch targets and mobile-friendly file picker for product images.
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - SEO metadata injection, dynamic document title, structured data `ld+json` generation.
   - History API pushState/popState lifecycle synchronization avoiding unwanted re-renders.

---

## 3. Detailed Technical Specifications

### 3.1 Pre-Configured Supabase Assets & Database Tables
The cloud tables are already live in project `https://oulzpjcmnxvvrpdyfpcg.supabase.co`:
- `public.dishes`: `id`, `name`, `english_name`, `slug`, `description`, `price`, `unit`, `category`, `image`, `badges`, `in_stock`, `seo_title`, `seo_description`.
- `public.categories`: `id`, `name`, `english_name`, `slug`, `sort_order`, `is_active`.
- `public.discounts`: `id`, `code`, `discount_type` ('percentage' | 'fixed'), `discount_value`, `min_order_amount`, `is_active`.
- `public.seo_settings`: `id`, `site_title`, `site_description`, `keywords`, `og_image`.
- `public.orders` & `public.order_items`: orders pipeline.
- `storage.buckets`: bucket `dishes` (Public, for product photography uploads).

### 3.2 Merchant Center Navigation & Layout (`src/components/admin/MerchantLayout.tsx`)
Gated behind `/admin`. Sidebar navigation items:
1. `overview`: 👑 لوحة التحكم (Overview)
2. `products`: 🍽️ المنتجات (Products CRUD)
3. `categories`: 📑 التصنيفات (Categories CRUD)
4. `orders`: 📦 الطلبات (Orders & Sales)
5. `customers`: 👥 العملاء (Customers Registry)
6. `discounts`: 🏷️ كوبونات الخصم (Discounts & Coupons)
7. `seo`: 🔍 تحسين السيو (SEO Settings)
Includes header with logged-in admin email (`admin@hashousha.com`), store link ("معاينة المتجر 🌿"), and Sign Out button.

### 3.3 Module Specifications

#### 1. Overview (`src/components/admin/modules/OverviewModule.tsx`):
- KPI Cards: Total Sales (إجمالي المبيعات بالريال), Total Orders, Active Orders, Average Order Value, Delivered Orders.
- Top Dishes in Riyadh: Ranked list of dishes by order frequency.
- Recent Orders Feed: 5 latest orders with status badges and quick view drawer link.

#### 2. Products CRUD (`src/components/admin/modules/ProductsModule.tsx`):
- Table showing dish thumbnail, Arabic name, English name, category badge, formatted price in `ر.س`, unit (e.g. `صينية ٥٠ حبة`), stock toggle switch, and action buttons (تعديل / حذف).
- **Product Modal (`ProductEditModal.tsx`)**:
  - Arabic Name (required), English Name.
  - Category selector (dynamic from `categories` table).
  - Price (numeric), Unit description (e.g. `بوكس ٧٠ حبة`).
  - Badges checkboxes: `tangy` (حامض حلو), `popular` (الأكثر طلباً), `spicy` (حار مسمسم), `new` (جديد).
  - Description (textarea).
  - SEO Slug: Auto-generated slug with manual edit option.
  - **Image Upload:** File picker allowing uploading PNG/JPG to Supabase Storage:
    ```typescript
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const { data, error } = await supabase.storage.from('dishes').upload(fileName, file)
    const { data: urlData } = supabase.storage.from('dishes').getPublicUrl(fileName)
    // urlData.publicUrl stored in dish.image
    ```
  - Form validation with error messages in Arabic.
  - Save inserts/updates into `public.dishes` and updates local state.
- Delete product with safety confirmation modal.

#### 3. Categories CRUD (`src/components/admin/modules/CategoriesModule.tsx`):
- Table displaying Category ID, Label, English Name, Slug, Sort Order, Active Status toggle, and Edit/Delete actions.
- Add / Edit Modal: Label, English Name, Slug, Sort Order.
- Deleting or updating a category immediately reflects on the public storefront `MenuSection` pills.

#### 4. Orders & Sales (`src/components/admin/modules/OrdersModule.tsx`):
- Preserves the full 6-phase lifecycle from TASK-006:
  `all`, `pending 🟡`, `processing 🟣`, `confirmed 🔵`, `shipped 🚙`, `delivered 🟢`, `cancelled 🔴`.
- Search by order number `#HSH-XXXX`, customer name, or phone.
- Detailed drawer with direct call and WhatsApp links.
- 80mm thermal receipt kitchen print ticket (`KitchenTicket.tsx`).

#### 5. Customers Registry (`src/components/admin/modules/CustomersModule.tsx`):
- Aggregates distinct customers from `orders`:
  - Customer Name, Phone number, Primary Riyadh District, Total Orders count, Lifetime Spend (`ر.س`), Last Order Date.
  - Search by name, phone, or district.
  - Direct Action buttons: Call (`tel:`) and WhatsApp (`wa.me`).

#### 6. Discounts & Coupons (`src/components/admin/modules/DiscountsModule.tsx`):
- Table showing Coupon Code (`HSH10`), Discount Type (نسبة مئوية % or خصم ثابت ر.س), Value, Minimum Order Amount, Active toggle, and Usage Count.
- Add / Edit Modal: Code (uppercase), Type, Value, Min Order Amount, Active switch.
- **Checkout Integration in `CheckoutModal.tsx`**:
  - Coupon Code input with "تطبيق" (Apply) button.
  - Validates code against active discounts in Supabase / store.
  - Checks minimum order amount requirement.
  - If valid: shows green feedback badge ("تم تطبيق خصم 10% بنجاح ✓") and deducts discount from subtotal.
  - If invalid: shows clear error message ("كود الخصم غير صحيح أو منتهي الصلاحية").

#### 7. SEO Settings (`src/components/admin/modules/SeoModule.tsx`):
- Form to manage Global Title, Meta Description, Riyadh District Keywords, OpenGraph Image.
- Live Google Search Snippet preview card showing how Hashousha appears in Google SERP results.
- Save updates to `public.seo_settings` in Supabase.

---

### 3.4 Hybrid SEO Architecture Specification

#### 1. In-Store Modal Experience (`src/components/storefront/v0/ProductDetailModal.tsx`):
- When a user on the storefront clicks a dish card:
  - Opens `ProductDetailModal` showcasing dish photography, badges, ingredients, unit portion, and quantity stepper.
  - Updates browser URL using `window.history.pushState(null, '', '/dish/' + dish.slug)` without full reload.
  - Closing the modal updates URL back to `/` using `window.history.pushState(null, '', '/')`.
  - Background storefront and cart drawer remain completely intact.

#### 2. Standalone Google Landing Page (`src/components/storefront/v0/ProductLandingPage.tsx`):
- Route parser in `App.tsx` checks if URL matches `/dish/:slug`:
  - If entered directly from external link or Google search (not as in-store modal):
  - Renders standalone product page:
    - Injects dynamic document `<title>`: `${dish.name} | متجر هشوشة للمحاشي والحلويات بالرياض`.
    - Injects OpenGraph meta tags and Twitter cards.
    - Injects `application/ld+json` structured data:
      ```json
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "ورق عنب حامض حلو",
        "image": "https://oulzpjcmnxvvrpdyfpcg.supabase.co/storage/v1/object/public/dishes/warak-enab.png",
        "description": "ملفوف يدوياً بالأرز المتبّل بدبس الرمان وزيت الزيتون البكر.",
        "brand": {
          "@type": "Brand",
          "name": "هشوشة — Hashousha"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "SAR",
          "price": "145",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
      }
      ```
    - Luxury header with back button "تصفح كامل أطباق هشوشة 🌿", dish hero image, culinary description, portion size, and "أضف للطلب" action that opens the cart and allows completing the order.

---

## 4. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/admin.ts` | CREATE | Contracts for Discounts, Categories, SEO Settings, and Customer Metrics |
| `src/services/adminService.ts` | CREATE | Supabase CRUD for products, categories, discounts, image upload, and SEO |
| `src/components/admin/MerchantLayout.tsx` | CREATE | Luxury boutique admin layout with royal sidebar navigation |
| `src/components/admin/modules/OverviewModule.tsx` | CREATE | Financial KPIs, Riyadh district breakdown, recent orders stream |
| `src/components/admin/modules/ProductsModule.tsx` | CREATE | Full products CRUD table with image upload to Supabase Storage |
| `src/components/admin/modules/ProductEditModal.tsx` | CREATE | Add/edit dish dialog with storage upload and auto-slug |
| `src/components/admin/modules/CategoriesModule.tsx` | CREATE | Categories CRUD with real-time storefront pill synchronization |
| `src/components/admin/modules/OrdersModule.tsx` | CREATE | Full 6-phase order pipeline with 80mm thermal ticket printing |
| `src/components/admin/modules/CustomersModule.tsx` | CREATE | Riyadh customer registry with district insights and direct contacts |
| `src/components/admin/modules/DiscountsModule.tsx` | CREATE | Discount coupon management with active switches and usage counters |
| `src/components/admin/modules/SeoModule.tsx` | CREATE | SEO meta tags manager and live Google SERP preview card |
| `src/components/storefront/v0/ProductDetailModal.tsx` | CREATE | In-store luxury preview modal with URL pushState sync |
| `src/components/storefront/v0/ProductLandingPage.tsx` | CREATE | Standalone Google landing page with Schema.org JSON-LD and OpenGraph |
| `src/components/checkout/CheckoutModal.tsx` | MODIFY | Wire coupon code input and real-time discount calculation |
| `src/components/storefront/v0/DishCard.tsx` | MODIFY | Wire card click to open `ProductDetailModal` with `/dish/:slug` |
| `src/App.tsx` | MODIFY | Hybrid route matcher (/ , /admin , /dish/:slug) and navigation coordination |
| `tasks/TASK-008-merchant-center-catalog-crud-and-hybrid-seo/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-008-merchant-center-catalog-crud-and-hybrid-seo/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-008-merchant-center-catalog-crud-and-hybrid-seo/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 5. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] All 7 Merchant Center modules are fully functional under `/admin`:
  - Overview, Products, Categories, Orders, Customers, Discounts, SEO Settings.
- [ ] Products CRUD allows adding, editing, and deleting dishes with automated slug generation.
- [ ] Uploading a product image successfully uploads to Supabase Storage bucket `dishes` and renders correctly.
- [ ] Categories CRUD allows adding, editing, and deleting categories, reflecting instantly on storefront category navigation.
- [ ] Customers registry aggregates customer records from orders with working Call (`tel:`) and WhatsApp (`wa.me`) buttons.
- [ ] Discounts engine allows creating coupons (`HSH10`), and entering a coupon in `CheckoutModal` applies the discount to the grand total.
- [ ] SEO module allows editing meta tags and displays an accurate Google SERP preview card.
- [ ] Clicking a dish card in the storefront opens `ProductDetailModal` while updating the browser address to `/dish/:slug` without reloading.
- [ ] Navigating directly to `/dish/:slug` renders a standalone SEO-optimized `ProductLandingPage` with `schema.org/Product` JSON-LD and OpenGraph tags.
- [ ] Merchant Center adheres strictly to Hashousha's royal boutique palette (`#faf7f2`, `#fdfbf7`, `#2e1e0d`, `#9e774c`, `#931f2d`).
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-008-merchant-center-catalog-crud-and-hybrid-seo/`.
