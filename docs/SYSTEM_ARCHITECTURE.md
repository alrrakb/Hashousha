# HASHOUSHA (هشوشة) — Online Food Boutique System Architecture

> **Document Type:** System Architecture & Data Contract Specification  
> **Status:** RATIFIED & LOCKED (v2.5.0 Merchant Center & Hybrid SEO Overhaul)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Target Audience:** Implementer Agents (Agent Beta) & Engineering Team  
> **Version:** 2.5.0  

---

## 1. Executive Summary & Brand Paradigm

**Hashousha (هشوشة للمحاشي والحلويات الفاخرة)** is officially architected and branded as an **Online Luxury Food Boutique (متجر أطعمة فاخرة أونلاين)**.

The platform combines artisanal culinary heritage (fresh handmade vine leaves, tender cabbage rolls, gathering platters, and oriental sweets) with enterprise boutique e-commerce standards, a comprehensive Merchant Center adapted from the battle-tested `shbakhur-main` architecture, and a hybrid search engine optimization (SEO) architecture designed for maximum organic reach in Riyadh and the Kingdom.

### Core Architecture Pillars:
1. **Online Boutique Experience:** Premium customer storefront with warm linen textures, authentic dish photography, floating order bar, and in-store checkout with Saudi mobile validation (`05xxxxxxxx`) and Riyadh district routing.
2. **Comprehensive Merchant Center (`/admin`):** Fully-featured administrative hub with 7 core management modules:
   - 👑 **Overview (نظرة عامة):** Financial metrics, active orders, and sales analytics.
   - 🍽️ **Products CRUD (إدارة المنتجات):** Full catalog management, image uploads to Supabase Storage (`dishes` bucket), and automated SEO slug generation.
   - 📑 **Categories CRUD (إدارة التصنيفات):** Category hierarchy with instant storefront navigation synchronization.
   - 📦 **Orders & Sales (الطلبات والمبيعات):** 6-phase order pipeline, customer details, and 80mm thermal kitchen ticket printing.
   - 👥 **Customers (سجل العملاء):** Customer directory, district insights, order counts, and lifetime spend.
   - 🏷️ **Discounts & Loyalty (كوبونات الخصم):** Coupon code creation, percentage/fixed amounts, and real-time checkout validation.
   - 🔍 **SEO & Discovery (تحسين السيو):** Meta tags manager, Riyadh district keywords, and Schema.org rich snippets.
3. **Hybrid SEO Engine (SPA Modal + Google Product Landing):**
   - **In-Store Visitor:** Clicking any dish card opens `ProductDetailModal` seamlessly without leaving the page, while updating the browser address to `/dish/:slug`.
   - **External Google Visitor:** Direct navigation to `/dish/:slug` renders a standalone, fully-featured, crawlable product landing page containing OpenGraph tags and `ld+json` (`schema.org/Product`) for Google Rich Snippets with price and ratings.
4. **Cloud Infrastructure & Security:** Secured via Supabase Auth (`/admin` barrier), Supabase Postgres Cloud, and Supabase Realtime for instant multi-device kitchen notifications with zero-dependency synthetic audio chimes.

---

## 2. High-Level Architecture Topology

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Mobile & Desktop)"]
        Storefront["Storefront Boutique Catalog\n(/ & /#)"]
        ProductModal["Product Detail Modal\n(SPA In-Store View: /dish/:slug)"]
        ProductLanding["Standalone Google Product Landing\n(SEO Crawlable: /dish/:slug)"]
        Checkout["In-Store Checkout Modal\n(Coupon validation, Saudi phone, COD & Bank)"]
        AdminPortal["Merchant Center (/admin)\n(7 Enterprise Management Modules)"]
    end

    subgraph Router ["Hybrid Route Matcher"]
        RouteJudge{"URL Path Evaluator"}
    end

    subgraph Cloud ["Supabase Cloud Infrastructure (oulzpjcmnxvvrpdyfpcg)"]
        Auth["Supabase GoTrue Auth\n(Session Gating)"]
        DB_Dishes[("public.dishes\n(slug, seo_title, in_stock)")]
        DB_Categories[("public.categories\n(slug, sort_order)")]
        DB_Orders[("public.orders & order_items")]
        DB_Discounts[("public.discounts\n(code, discount_type, value)")]
        DB_SEO[("public.seo_settings")]
        Storage[("Supabase Storage: 'dishes'\n(Image Uploads)")]
        Realtime["Realtime Engine\n(Orders & Stock sync)"]
    end

    Client --> RouteJudge
    RouteJudge -->|/| Storefront
    RouteJudge -->|/dish/:slug (In-App)| ProductModal
    RouteJudge -->|/dish/:slug (Deep Link)| ProductLanding
    RouteJudge -->|/admin (Gated)| AdminPortal

    Storefront <--> DB_Dishes
    Storefront <--> DB_Categories
    Checkout <--> DB_Discounts
    Checkout -->|Save Order| DB_Orders
    DB_Orders -.->|Realtime Chime| AdminPortal
    AdminPortal <--> Auth
    AdminPortal <--> DB_Dishes
    AdminPortal <--> DB_Categories
    AdminPortal <--> DB_Orders
    AdminPortal <--> DB_Discounts
    AdminPortal <--> DB_SEO
    AdminPortal -->|Upload Assets| Storage
```

---

## 3. Merchant Center Module Specifications

The Merchant Center at `/admin` is adapted from `shbakhur-main/orders_sys` and reimagined in Hashousha's royal palette:
- Surface: Warm Ivory (`#fdfbf7`) on Linen Canvas (`#faf7f2`).
- Typography: Dark Roast Roast (`#2e1e0d`) with Muted Bronze (`#6b5a48`).
- Primary Actions: Warm Bronze (`#9e774c`) and Pomegranate Accent (`#931f2d`).
- Navigation: Persistent sidebar on desktop, responsive slide-over drawer on mobile/tablet.

### 3.1 Overview (لوحة التحكم الرئيسية)
- **Financial HUD:** Total Revenue (إجمالي المبيعات بالريال), Total Orders count, Active Orders count, Average Order Value (متوسط قيمة الطلب).
- **Riyadh District Distribution:** Top neighborhoods ordering Hashousha (الملقا، الياسمين، النرجس...).
- **Recent Orders Quick Stream:** Live 5 latest orders with status badges and quick action links.

### 3.2 Products CRUD (إدارة المنتجات والأطباق)
- **Product Table:** Thumbnail, Arabic name, English name, category pill, base price (`ر.س`), unit portion, stock toggle, edit and delete actions.
- **Product Editor Modal:**
  - Name (Arabic & English), Category, Base Price, Unit portion description.
  - Badges: `tangy` (حامض حلو), `popular` (الأكثر طلباً), `spicy` (حار مسمسم), `new` (جديد).
  - Automated SEO Slug generation from English name or transliteration (e.g. `warak-classic`).
  - Image Upload: Direct file picker uploading to Supabase Storage bucket `dishes`, returning public URL `https://oulzpjcmnxvvrpdyfpcg.supabase.co/storage/v1/object/public/dishes/<filename>`.
  - Delete with safety confirmation dialog.

### 3.3 Categories CRUD (إدارة التصنيفات)
- Management table: Label, English name, Slug, Display sort order, Active toggle.
- Create / Edit / Delete modal.
- Synchronizes with storefront category bar in real time.

### 3.4 Orders & Sales (الطلبات والمبيعات)
- 6-phase order pipeline filter: `الكل`, `جديد 🟡`, `قيد التحضير 🟣`, `جاهز للتوصيل 🔵`, `جاري التوصيل 🚙`, `تم التوصيل 🟢`, `ملغي 🔴`.
- Search by order number (`#HSH-XXXX`), customer name, or phone.
- Detailed drawer with direct call (`tel:`) and direct WhatsApp buttons.
- 80mm thermal receipt kitchen print ticket (`window.print()` with `@media print`).

### 3.5 Customers Registry (سجل العملاء)
- Aggregated customer directory derived from `orders`:
  - Customer Name, Phone number, Primary Riyadh District, Total Orders count, Lifetime Spend (`ر.س`), Last Order Date.
  - Direct customer contact buttons (Call / WhatsApp).

### 3.6 Discounts & Coupons Engine (كوبونات الخصم)
- Create and manage promotional discount codes (e.g. `HSH10`, `RAMADAN`, `VIP`).
- Fields: Code, Type (`percentage` or `fixed`), Value, Minimum order amount, Active switch, Usage counter.
- **Checkout Integration:** In `CheckoutModal`, customers enter coupon code; instant validation against active discounts; dynamic calculation of discount amount on grand total.

### 3.7 SEO & Discovery Engine (تحسين السيو والظهور)
- Global Site Title, Meta Description, Riyadh District Keywords.
- Social OpenGraph Preview card.
- Schema.org rich snippet generator.

---

## 4. Hybrid SEO Engine Specification

To ensure maximum organic search presence without compromising the fluidity of the Single Page Application:

### 4.1 In-Store Experience (Modal Preview)
- When a user on the storefront clicks a dish card:
  - Opens `ProductDetailModal` featuring dish photography, badges, ingredients, unit portion, and quantity selector.
  - Updates the browser URL without full reload using `window.history.pushState(null, '', '/dish/' + dish.slug)`.
  - Closing the modal pushes URL back to `/`.
  - The cart and background scroll state remain completely uninterrupted.

### 4.2 Standalone Google Product Landing Page (`/dish/:slug`)
- When a visitor enters directly via Google or a shared link:
  - The route recognizes the `/dish/:slug` path.
  - Renders `ProductLandingPage`:
    - Dynamic document `<title>`: `${dish.name} | متجر هشوشة للمحاشي بالرياض`.
    - Meta tags: description, keywords, OpenGraph `og:image`, `og:title`, `og:price:amount`.
    - Structured JSON-LD snippet injected into `<head>`:
      ```html
      <script type="application/ld+json">
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
          "availability": "https://schema.org/InStock",
          "url": "https://hashousha.com/dish/warak-classic"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
      }
      </script>
      ```
    - Header with back-to-menu navigation ("تصفح كامل أطباق هشوشة 🌿") and instant "أضف للطلب" action.

---

## 5. Strict Data Contracts & Schemas

### 5.1 Dish / Product Contract
```typescript
export interface Dish {
  id: string;
  name: string;
  englishName: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  badges: BadgeKind[];
  inStock: boolean;
  seoTitle?: string;
  seoDescription?: string;
}
```

### 5.2 Category Contract
```typescript
export interface Category {
  id: string;
  label: string;
  englishName?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
}
```

### 5.3 Discount Coupon Contract
```typescript
export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  isActive: boolean;
  usageCount?: number;
  expiresAt?: string | null;
}
```

### 5.4 Customer Metric Contract
```typescript
export interface CustomerMetric {
  name: string;
  phone: string;
  district: string;
  address: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}
```

---

## 6. Security, Invariants & Anti-Regression Guardrails

1. **Admin Gating:** All Merchant Center features are strictly quarantined behind `/admin` with Supabase Auth session validation.
2. **Offline Fallback Resilience:** All database operations (orders, menu, discounts) maintain synchronous local storage backup so the boutique remains operative even during cloud connectivity drops.
3. **Zero Arbitrary Tokens:** Styling must exclusively utilize the Hashousha luxury boutique tokens.
4. **Clean Build Guarantee:** `npm run build` must succeed with zero TypeScript errors or linter failures.
