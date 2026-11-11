# HASHOUSHA (هشوشة) — Legacy System Reverse-Engineering & Audit Report

> **Target Subject:** Legacy Store (`old_store/` — "سر اللفة" / "Hana Store")  
> **Document Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Audit Status:** COMPLETED & VERIFIED  
> **Audit Date:** 2026-09-26  

---

## 1. Executive Summary & Brand Origins

The legacy codebase located in `old_store/` represents an initial proof-of-concept e-commerce system built under the brand **"سر اللفة" (Sirr Al-Laffa)** and code-named **"Hana Store"**.

### Commercial Identity & Operational Footprint:
- **Brand Name:** سر اللفة (Sirr Al-Laffa) / Hana Store.
- **Geographic Market:** Riyadh, Kingdom of Saudi Arabia (تغطية أنحاء مدينة الرياض).
- **Primary WhatsApp Dispatch Channel:** `+966 56 060 2341` (`966560602341`).
- **Core Value Proposition:** Homemade warmth, heritage vine leaves and cabbage rolls rolled by hand with authentic spices and fresh herbs, plus freshly baked homemade cookies and sweets.

---

## 2. Product Catalog & Data Extraction

Reverse-engineering the frontend seeds (`assets/generated.json`), backend models (`models/Product.js`), and frontend views revealed the exact legacy menu items and pricing:

### Extracted Menu Items:
| ID | Arabic Name | Category | Base Price | Discount / Offer | Rating | Description & Notes |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| `1` | **ورق عنب فاخر** | محاشي (ورق عنب) | 25.99 ر.س | 0% | 4.2 ⭐ | يتميز بجودته العالية وطعمه الرائع المحضر بالخلطة الأصلية الطازجة. |
| `2` | **ملفوف دايب بالسمن** | محاشي (ملفوف) | 15.50 ر.س | 0% | 4.0 ⭐ | منتج طازج يتمتع بمذاق مميز وقيمة غذائية عالية وتتبيلة غنية. |
| `3` | **كوكيز منزلي فاخر** | حلويات وسويت | 18.75 ر.س | 0% | 4.3 ⭐ | كوكيز لذيذة ومقرمشة ومحشوة، مثالية مع القهوة السعودية والشاي. |
| `4` | **ورق عنب سبايسي** | محاشي (ورق عنب) | 29.99 ر.س | 0% | 4.5 ⭐ | نكهة حارة مميزة لعشاق المذاق الحار المتوازن مع الليمون وزيت الزيتون. |
| `5` | **ورق عنب بدبس الرمان** | محاشي (ورق عنب) | 32.50 ر.س | 0% | 4.6 ⭐ | توليفة حامضة حلوة فاخرة تجمع بين نكهة ورق العنب وحلاوة دبس الرمان الأصلي. |
| `6` | **سلطة تبولة / طبق جانبي** | مقبلات وسلطات | 22.00 ر.س | 0% | 4.1 ⭐ | سلطة خضراء منعشة بالبقدونس وزيت الزيتون والليمون كطبق جانبي للمحاشي. |

---

## 3. Product Options & Customization Architecture (Gap Analysis)

### Legacy Architecture:
- **Zero Variation Support:** In the legacy schema (`Product.js`), products were completely flat (`name`, `price`, `description`, `rate`, `stock`, `offer`, `mainImage`, `images`).
- There were **no portion sizes**, **no spice levels**, and **no add-ons**. A customer could only buy a single fixed unit of "ورق عنب" without specifying box quantity (e.g. 25, 50, 100 pieces) or sauce preferences.

### HASHOUSHA Modernization Requirement:
Hashousha's new Option Engine (`docs/SYSTEM_ARCHITECTURE.md`) must introduce structured option groups to replace this limitation:
1. **Portion Sizing:**
   - بوكس شخصي (15 حبة)
   - بوكس وسط (30 حبة - قياسي)
   - بوكس عائلي (50 حبة)
   - صينية عزائم ولائم (100 حبة)
2. **Spiciness Level:**
   - عادي (متبل معتدل)
   - حار مسمسم (سبايسي 🌶️)
   - نار إضافي (شطة حارة 🌶️🌶️)
3. **Gourmet Add-ons (Multi-Select):**
   - دبس رمان إضافي مركز (+5 ر.س)
   - صوص طحينة بالليمون (+7 ر.س)
   - صوص زبادي بالنعناع والثوم (+6 ر.س)
   - بصل مقلي مقرمش ذهبي (+4 ر.س)

---

## 4. WhatsApp Ordering Flow Audit

### Legacy Implementation (`Cart.jsx` & `ProductDetails.jsx`):
The legacy application attempted to construct a WhatsApp link via:
```javascript
// Legacy Cart.jsx implementation
const sendCartToWhatsApp = () => {
  let message = "مرحبًا، أود طلب المنتجات التالية:\n";
  cart.forEach((item) => {
    message += `- المنتج: ${item.productDetails.name}\n  الكمية: ${item.quantity}\n  السعر: ${item.productDetails.price * item.quantity} ر.س\n\n`;
  });
  message += `المبلغ الإجمالي: ${totalPrice} ر.س`;
  const whatsappURL = `https://wa.me/966560602341?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};
```

### Critical Vulnerabilities & Defects Identified:
1. **Data Binding Bug:** `Cart.jsx` checked `item.productDetails.name` while `ProductCard.jsx` and `generated.json` used `title`. If imported dishes had `title` instead of `name`, the message displayed `- المنتج: undefined`.
2. **Missing Customer Identity & Address:** The message included zero delivery information. The merchant had to converse back and forth asking for the customer's name, phone, city, district, and house location.
3. **Missing Order Identification:** No unique Order ID (`#HA-XXXX`) or timestamp was generated, making reconciliation impossible when multiple orders arrived concurrently.
4. **Hardcoded Phone Number:** The phone number `966560602341` was hardcoded in 4 different frontend components (`Cart.jsx`, `ProductDetails.jsx`, `ProductCard.jsx`, `WhatsApp.jsx`), making phone changes hazardous.
5. **No Delivery Fee Calculation:** No minimum order amount or delivery fee was factored into the grand total.

---

## 5. Admin Dashboard & Inventory Mechanism Audit

### Legacy Architecture (`Dashboard.jsx` & `ProductsTable.jsx`):
- **Backend Stack:** Node.js Express server + MongoDB Atlas (`mongodb+srv://root:root@root.imksxck.mongodb.net/hanastore`).
- **Admin Workflow:**
  - Login required via `POST /api/auth/login` saving `adminToken` in `localStorage`.
  - Products fetched via `GET /api/products`.
  - Adding products sent `FormData` (multipart file upload) via `POST /api/products`.
  - Editing converted uploaded images into base64 blobs and sent `PUT /api/products/:id`.
  - Deletion called `DELETE /api/products/:id`.
  - Simple CSV export generated on client with UTF-8 BOM.

### Architectural Shortcomings:
1. **Fragile External Dependency:** The entire storefront depended on `http://:5000`. If this remote server was uncontactable or down, the public storefront failed to render dishes.
2. **No "Out of Stock" Toggle:** The legacy schema only had a numerical `stock` field. To disable an item, the merchant had to delete it or set stock to 0 (which wasn't even checked on the storefront add-to-cart button).
3. **No Settings Management:** No ability to update the store's contact number, operating hours, delivery fees, or announcement banner.

---

## 6. Asset & Photography Inventory

The following reusable graphic assets and photographs were extracted from `old_store/Hana-Store-FrontEnd-main/Hana-Store-FrontEnd-main/public`:

| Asset File | Size | Visual Description | Migration Path |
|:---|:---:|:---|:---|
| `1.png` | ~538 KB | Authentic plate of stuffed vine leaves garnished with pomegranate seeds and lemons. | Move to `src/assets/dishes/vine-leaves-classic.png` |
| `2.png` / `ملفوف.png` | ~1.01 MB | Hot pot of tender cabbage rolls with garlic and cumin sauce. | Move to `src/assets/dishes/cabbage-rolls-pot.png` |
| `3.png` | ~399 KB | Mixed platter of stuffed vine leaves and cabbage rolls for catering. | Move to `src/assets/dishes/mixed-platter.png` |
| `logo_removeBac.png` | ~110 KB | Stylized logo graphic with rolling pin/pot motif. | Reference for header logo token |
| `heroSection.webp` | ~8 KB | Illustrated chef/culinary graphics. | Optional decorative asset |
| `icons8-about-us-400.svg` | ~4.7 KB | Vector icon representing culinary team. | About page asset |

---

## 7. Strategic Recommendations for HASHOUSHA (Milestone 1 & 2)

1. **Self-Contained Seed Catalog:** Bundle the audited legacy dishes into `src/data/initialCatalog.ts` with enhanced descriptions, badges, and full option groups so the storefront is instantly functional offline and under zero-latency conditions.
2. **Centralized WhatsApp Engine:** Implement `src/services/whatsapp.ts` with phone number pulled reactively from `useSettingsStore` (defaulting to `966560602341`).
3. **Luxury Arabic Gastronomy Aesthetics:** Elevate the visuals from the plain green/gray cards of the legacy store to the rich Olive, Pomegranate, and Warm Ivory design system defined in `docs/DESIGN_SYSTEM.md`.
4. **Resilient Local Persistence:** Store all catalog edits, inventory toggles, and cart items in browser `localStorage` with exportable JSON backups, allowing the merchant to operate without an expensive cloud backend.
