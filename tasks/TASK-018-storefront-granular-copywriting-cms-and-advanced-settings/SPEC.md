# TASK-018 SPECIFICATION: Storefront Granular Copywriting CMS & Advanced UI Controls

> **Task ID:** `TASK-018-storefront-granular-copywriting-cms-and-advanced-settings`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 14 (Granular Storefront Copywriting CMS & Advanced UI Settings)  

---

## 1. Executive Summary & Strategic Objective

In response to the Founder's direct vision and the executive briefing from the Brand Chief of Staff, **TASK-018** addresses the complete democratization of storefront micro-copy across **Hashousha (هشوشة)**.

While **TASK-016** delivered high-level CMS management for brand assets and primary hero headings, the store's conversion engine relies heavily on micro-copy:
- The sticky cart action button (`إتمام الطلب`)
- The checkout modal header, subtitle, and trust badges (`إتمام الطلب الفاخر`)
- All form input field labels and placeholders (Name, Phone, Riyadh District, Detailed Address, Hospitality Notes)
- Payment method titles and guidance subtexts (COD, Direct Bank Transfer)
- Promo/coupon code labels, placeholders, and action triggers
- Financial breakdown labels (Subtotal, Refrigerated Delivery Fee, Hospitality Discount, Grand Total)
- Product modal and dish card action buttons (`إضافة إلى السلة`, `نفد اليوم`, story section headings)

### 1.1 The "Advanced Settings" Accordion Invariant (Wi-Fi Settings Paradigm)
To prevent overwhelming non-technical store operators with dozens of micro-copy input fields, the UI must follow the **"الإعدادات المتقدمة" (Advanced Settings)** pattern:
1. **Primary Interface Cleanliness:** Primary brand copy (Hero title, subtitle, pillars, footer) remains immediately visible and clean.
2. **Collapsible Advanced Chamber:** Secondary micro-copy is gracefully nested inside a luxury collapsible container: **«الإعدادات المتقدمة: التحكم الدقيق بنصوص الواجهة الثابتة (Micro-Copy)»**.
3. **Smart Deep Search & Auto-Expansion:** The top instant search bar searches across **both** primary and advanced strings simultaneously. If a search query matches any micro-copy label, placeholder, or value, the advanced accordion **automatically expands** and highlights the matching field with a gold focus indicator and badge.

---

## 2. Cloud Database Architecture (`public.site_content`)

The Supabase table `public.site_content` already features the `ui_strings` JSONB column (confirmed via schema inspection).

```sql
-- Schema representation of public.site_content
-- ui_strings JSONB contains structured key-value pairs for storefront micro-copy
-- Example payload stored in public.site_content.ui_strings:
{
  "orderBar.checkoutBtn": "إتمام الطلب",
  "orderBar.itemsSuffix": "أصناف",
  "orderBar.currency": "ر.س",
  "checkout.modalTitle": "إتمام الطلب الفاخر",
  "checkout.modalSubtitle": "مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض",
  "checkout.summaryTitle": "ملخص محتويات الطلب",
  "checkout.couponLabel": "كوبون الخصم:",
  "checkout.couponPlaceholder": "مثال: RAMADAN10 أو HASH20",
  "checkout.couponApplyBtn": "تطبيق",
  "checkout.nameLabel": "الاسم الكريم",
  "checkout.namePlaceholder": "مثال: سارة العبدالله",
  "checkout.phoneLabel": "رقم الجوال (واتساب)",
  "checkout.phonePlaceholder": "05XXXXXXXX",
  "checkout.districtLabel": "الحي السكني بالرياض",
  "checkout.districtPlaceholder": "اختر حيك السكني أو ابحث عنه...",
  "checkout.addressLabel": "العنوان بالتفصيل / معلم بارز",
  "checkout.addressPlaceholder": "اسم الشارع، رقم المبنى، أو معلم قريب...",
  "checkout.notesLabel": "ملاحظات خاصة بالضيافة أو التوصيل",
  "checkout.notesPlaceholder": "حرارة الشطة، توقيت التسليم، إهداء خاص...",
  "checkout.paymentCodTitle": "الدفع عند الاستلام",
  "checkout.paymentCodSubtitle": "نقداً أو عبر بطاقة مدى عند استلام الطلب",
  "checkout.paymentTransferTitle": "تحويل بنكي مباشر",
  "checkout.paymentTransferSubtitle": "حساب الراجحي أو الأهلي (إرفاق الإشعار)",
  "checkout.subtotalTitle": "المجموع الفرعي",
  "checkout.deliveryFeeTitle": "توصيل مجهّز (سيارات مبردة)",
  "checkout.totalTitle": "الإجمالي النهائي",
  "checkout.submitOrderBtn": "تأكيد الطلب",
  "dishModal.addToCartBtn": "إضافة إلى السلة",
  "dishModal.soldOutBtn": "نفد اليوم",
  "dishModal.storyTitle": "قصة الصنع والتحضير",
  "dishModal.pairingsTitle": "أطباق تكمّل جمعتكم"
}
```

---

## 3. Domain Models & Type Contracts

### 3.1 Type Definitions (`src/types/admin.ts`)
Extend `SiteContentSettings` with `uiStrings: Record<string, string>` and declare `DEFAULT_UI_STRINGS`:

```typescript
export interface SiteContentSettings {
  id?: string
  heroImage: string
  logoImage: string
  favicon: string
  ogImage: string
  heroTag: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroAlt: string
  pillars: BrandPillarItem[]
  footerTitle: string
  footerSubtitle: string
  deliveryNotice: string
  uiStrings?: Record<string, string>
  updatedAt?: string
}

export const DEFAULT_UI_STRINGS: Record<string, string> = {
  // Cart & OrderBar
  'orderBar.checkoutBtn': 'إتمام الطلب',
  'orderBar.itemsSuffix': 'أصناف',
  'orderBar.currency': 'ر.س',

  // Checkout Modal Header & Structure
  'checkout.modalTitle': 'إتمام الطلب الفاخر',
  'checkout.modalSubtitle': 'مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض',
  'checkout.summaryTitle': 'ملخص محتويات الطلب',

  // Coupon Engine
  'checkout.couponLabel': 'كوبون الخصم:',
  'checkout.couponPlaceholder': 'مثال: RAMADAN10 أو HASH20',
  'checkout.couponApplyBtn': 'تطبيق',

  // Customer Form Fields
  'checkout.nameLabel': 'الاسم الكريم',
  'checkout.namePlaceholder': 'مثال: سارة العبدالله',
  'checkout.phoneLabel': 'رقم الجوال (واتساب)',
  'checkout.phonePlaceholder': '05XXXXXXXX',
  'checkout.districtLabel': 'الحي السكني بالرياض',
  'checkout.districtPlaceholder': 'اختر حيك السكني أو ابحث عنه...',
  'checkout.addressLabel': 'العنوان بالتفصيل / معلم بارز',
  'checkout.addressPlaceholder': 'اسم الشارع، رقم المبنى، أو معلم قريب...',
  'checkout.notesLabel': 'ملاحظات خاصة بالضيافة أو التوصيل',
  'checkout.notesPlaceholder': 'حرارة الشطة، توقيت التسليم، إهداء خاص...',

  // Payment Methods
  'checkout.paymentCodTitle': 'الدفع عند الاستلام',
  'checkout.paymentCodSubtitle': 'نقداً أو عبر بطاقة مدى عند استلام الطلب',
  'checkout.paymentTransferTitle': 'تحويل بنكي مباشر',
  'checkout.paymentTransferSubtitle': 'حساب الراجحي أو الأهلي (إرفاق الإشعار)',

  // Order Financial Summary
  'checkout.subtotalTitle': 'المجموع الفرعي',
  'checkout.deliveryFeeTitle': 'توصيل مجهّز (سيارات مبردة)',
  'checkout.totalTitle': 'الإجمالي النهائي',
  'checkout.submitOrderBtn': 'تأكيد الطلب',

  // Dish Showcase & Action Buttons
  'dishModal.addToCartBtn': 'إضافة إلى السلة',
  'dishModal.soldOutBtn': 'نفد اليوم',
  'dishModal.storyTitle': 'قصة الصنع والتحضير',
  'dishModal.pairingsTitle': 'أطباق تكمّل جمعتكم',
}
```

### 3.2 Service Updates (`src/services/adminService.ts`)
Update `fetchSiteContent()` and `saveSiteContent()`:
- `fetchSiteContent()` reads `row.ui_strings` and merges with `DEFAULT_UI_STRINGS`.
- `saveSiteContent()` sends `ui_strings: settings.uiStrings` payload to Supabase.

---

## 4. Global State Architecture (`SiteContentContext.tsx`)

To avoid refetching on every component and to enable live instantaneous re-renders across the storefront when settings change, create `src/context/SiteContentContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SiteContentSettings, DEFAULT_SITE_CONTENT, DEFAULT_UI_STRINGS } from '../types/admin'
import { fetchSiteContent } from '../services/adminService'

interface SiteContentContextType {
  content: SiteContentSettings
  loading: boolean
  reload: () => Promise<void>
  t: (key: string, fallback?: string) => string
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
  reload: async () => {},
  t: (key: string, fallback?: string) => fallback || DEFAULT_UI_STRINGS[key] || key,
})

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentSettings>(DEFAULT_SITE_CONTENT)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await fetchSiteContent()
      setContent(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (content.uiStrings && content.uiStrings[key] !== undefined && content.uiStrings[key].trim() !== '') {
        return content.uiStrings[key]
      }
      if (fallback !== undefined) return fallback
      return DEFAULT_UI_STRINGS[key] || key
    },
    [content.uiStrings]
  )

  return (
    <SiteContentContext.Provider value={{ content, loading, reload, t }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export const useSiteContent = () => useContext(SiteContentContext)
```

Wrap `SiteContentProvider` at the root in `src/App.tsx`.

---

## 5. UI Architecture: Merchant Center `SiteContentModule.tsx`

### 5.1 The "Advanced Settings" Collapsible Chamber
Inside `SiteContentModule.tsx` under the `copy` sub-tab:
1. **Primary Copy Sections (Always Accessible):**
   - 2.1 Hero Showcase Copy
   - 2.2 Four Brand Pillars
   - 2.3 Footer & Delivery Guarantees
2. **Advanced Settings Accordion Block:**
   ```tsx
   {/* Collapsible Advanced Copy Chamber */}
   <div className="rounded-3xl border border-primary/20 bg-[#FDFBF7] dark:bg-card shadow-sm overflow-hidden transition-all">
     {/* Accordion Header / Trigger */}
     <button
       type="button"
       onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
       className="w-full flex items-center justify-between p-5 sm:p-6 text-right hover:bg-primary/5 transition-colors border-b border-primary/10"
     >
       <div className="flex items-center gap-3">
         <span className="p-2 rounded-xl bg-primary/15 text-primary">
           <Sliders className="size-5" />
         </span>
         <div>
           <div className="flex items-center gap-2">
             <h3 className="text-base font-black text-foreground">الإعدادات المتقدمة: نصوص الواجهة الدقيقة (Micro-Copy)</h3>
             <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">
               تحكم تفصيلي شامل
             </span>
           </div>
           <p className="text-xs text-muted-foreground mt-0.5">
             تعديل نصوص أزرار السلة، عناوين وPlaceholders نافذة الشيك أوت، كوبونات الخصم، وخيارات الدفع (شبيهة بإعدادات الشبكة المتقدمة).
           </p>
         </div>
       </div>

       <div className="flex items-center gap-2">
         {hasActiveAdvancedSearch && (
           <span className="text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-lg">
             نتائج مطابقة ({matchingAdvancedCount})
           </span>
         )}
         <ChevronDown className={cn('size-5 text-muted-foreground transition-transform duration-300', isAdvancedOpen && 'rotate-180')} />
       </div>
     </button>

     {/* Accordion Body with 4 Categorized Panels */}
     {isAdvancedOpen && (
       <div className="p-5 sm:p-7 space-y-8 animate-in fade-in duration-300">
         {/* Group 1: Cart & OrderBar */}
         {/* Group 2: Checkout Modal & Form Labels & Placeholders */}
         {/* Group 3: Payment Options & Promo Codes */}
         {/* Group 4: Dish Details & Action Buttons */}
       </div>
     )}
   </div>
   ```

### 5.2 Universal Deep Search & Auto-Expansion Protocol
- In `SiteContentModule.tsx`:
  - When `searchQuery` is modified:
    - Search matches against primary fields (`heroTitle`, `pillars`, `footerTitle`, etc.).
    - Search matches against all key labels, placeholders, and current values in `uiStrings`.
    - If `searchQuery.trim().length > 0` and ANY advanced string matches:
      - Automatically expand `isAdvancedOpen = true`.
      - Highlight matching input boxes with a gold border (`border-primary ring-2 ring-primary/20`) and render a badge: `مطابق للبحث 🔍`.
    - If `searchQuery` is cleared:
      - Reset `isAdvancedOpen` to user's manual preference (or collapse if auto-expanded).

---

## 6. Storefront Binding Points

Agent Beta will bind the dynamic `t(key, fallback)` function across the following components:

| Component | Target UI String | Dynamic Key | Fallback String |
|:---|:---|:---|:---|
| `OrderBar.tsx` | زر إتمام الطلب الرئيسي | `orderBar.checkoutBtn` | "إتمام الطلب" |
| `OrderBar.tsx` | لاحقة الأصناف | `orderBar.itemsSuffix` | "أصناف" |
| `CheckoutModal.tsx` | عنوان النافذة | `checkout.modalTitle` | "إتمام الطلب الفاخر" |
| `CheckoutModal.tsx` | السطر التكميلي | `checkout.modalSubtitle` | "مطبخ هشوشة — إعداد طازج وتوصيل فوري لجميع أحياء الرياض" |
| `CheckoutModal.tsx` | عنوان ملخص الأصناف | `checkout.summaryTitle` | "ملخص محتويات الطلب" |
| `CheckoutModal.tsx` | تسمية كود الخصم | `checkout.couponLabel` | "كوبون الخصم:" |
| `CheckoutModal.tsx` | الـ Placeholder للكود | `checkout.couponPlaceholder` | "مثال: RAMADAN10 أو HASH20" |
| `CheckoutModal.tsx` | زر تطبيق الكوبون | `checkout.couponApplyBtn` | "تطبيق" |
| `CheckoutModal.tsx` | عنوان المجموع الفرعي | `checkout.subtotalTitle` | "المجموع الفرعي" |
| `CheckoutModal.tsx` | عنوان رسوم التوصيل | `checkout.deliveryFeeTitle` | "توصيل مجهّز (سيارات مبردة)" |
| `CheckoutModal.tsx` | عنوان الإجمالي النهائي | `checkout.totalTitle` | "الإجمالي النهائي" |
| `CheckoutModal.tsx` | زر التأكيد بالواتساب | `checkout.submitOrderBtn` | "تأكيد الطلب" |
| `CustomerForm.tsx` | تسمية الاسم الكريم | `checkout.nameLabel` | "الاسم الكريم" |
| `CustomerForm.tsx` | الـ Placeholder للاسم | `checkout.namePlaceholder` | "مثال: سارة العبدالله" |
| `CustomerForm.tsx` | تسمية رقم الجوال | `checkout.phoneLabel` | "رقم الجوال (واتساب)" |
| `CustomerForm.tsx` | الـ Placeholder للجوال | `checkout.phonePlaceholder` | "05XXXXXXXX" |
| `CustomerForm.tsx` | تسمية الحي السكني | `checkout.districtLabel` | "الحي السكني بالرياض" |
| `CustomerForm.tsx` | الـ Placeholder للحي | `checkout.districtPlaceholder` | "اختر حيك السكني أو ابحث عنه..." |
| `CustomerForm.tsx` | تسمية العنوان بالتفصيل | `checkout.addressLabel` | "العنوان بالتفصيل / معلم بارز" |
| `CustomerForm.tsx` | الـ Placeholder للعنوان | `checkout.addressPlaceholder` | "اسم الشارع، رقم المبنى، أو معلم قريب..." |
| `CustomerForm.tsx` | تسمية ملاحظات الضيافة | `checkout.notesLabel` | "ملاحظات خاصة بالضيافة أو التوصيل" |
| `CustomerForm.tsx` | الـ Placeholder للملاحظات | `checkout.notesPlaceholder` | "حرارة الشطة، توقيت التسليم، إهداء خاص..." |
| `PaymentSelector.tsx` | خيار الدفع عند الاستلام | `checkout.paymentCodTitle` | "الدفع عند الاستلام" |
| `PaymentSelector.tsx` | وصف الدفع عند الاستلام | `checkout.paymentCodSubtitle` | "نقداً أو عبر بطاقة مدى عند استلام الطلب" |
| `PaymentSelector.tsx` | خيار التحويل البنكي | `checkout.paymentTransferTitle` | "تحويل بنكي مباشر" |
| `PaymentSelector.tsx` | وصف التحويل البنكي | `checkout.paymentTransferSubtitle` | "حساب الراجحي أو الأهلي (إرفاق الإشعار)" |
| `ProductDetailModal.tsx` | زر الإضافة للسلة | `dishModal.addToCartBtn` | "إضافة إلى السلة" |
| `ProductDetailModal.tsx` | نص زر نفاد الطبق | `dishModal.soldOutBtn` | "نفد اليوم" |
| `ProductDetailModal.tsx` | عنوان قصة الصنع | `dishModal.storyTitle` | "قصة الصنع والتحضير" |
| `ProductDetailModal.tsx` | عنوان أطباق التكميل | `dishModal.pairingsTitle` | "أطباق تكمّل جمعتكم" |

---

## 7. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`storefront-best-practices`**:
   - Reference `reference/layouts/checkout.md` for form labels, accessibility standards, and field placeholders.
   - Dynamic copy caching and zero-flicker fallback patterns.
2. **`tailwind-design-system`**:
   - Styling the luxury "Advanced Settings" accordion with dark-mode compatibility, subtle micro-borders, and gold focus rings.
3. **`vercel-react-best-practices`**:
   - Centralized Context memoization (`useCallback`, `useMemo`) preventing unnecessary re-renders across checkout and dish modals.

---

## 8. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/admin.ts` | MODIFY | Add `uiStrings` to `SiteContentSettings` and declare `DEFAULT_UI_STRINGS` |
| `src/services/adminService.ts` | MODIFY | Update `fetchSiteContent` & `saveSiteContent` to handle `ui_strings` JSONB |
| `src/context/SiteContentContext.tsx` | CREATE | Create centralized store/context for dynamic storefront copy with `t()` helper |
| `src/App.tsx` | MODIFY | Wrap application in `SiteContentProvider` |
| `src/components/admin/modules/SiteContentModule.tsx` | MODIFY | Add "الإعدادات المتقدمة" collapsible accordion, 4 micro-copy categories & auto-expanding search |
| `src/components/storefront/v0/OrderBar.tsx` | MODIFY | Bind dynamic strings for checkout button, currency, and count suffix |
| `src/components/checkout/CheckoutModal.tsx` | MODIFY | Bind dynamic strings for modal header, subtitle, coupons, summary, and action button |
| `src/components/checkout/CustomerForm.tsx` | MODIFY | Bind dynamic labels and placeholders for name, phone, district, address, and notes |
| `src/components/checkout/PaymentSelector.tsx` | MODIFY | Bind dynamic titles and subtexts for COD and Bank Transfer |
| `src/components/storefront/v0/ProductDetailModal.tsx` | MODIFY | Bind dynamic strings for add-to-cart, sold-out, story, and pairings |
| `tasks/TASK-018-storefront-granular-copywriting-cms-and-advanced-settings/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-018-storefront-granular-copywriting-cms-and-advanced-settings/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-018-storefront-granular-copywriting-cms-and-advanced-settings/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 9. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `DEFAULT_UI_STRINGS` dictionary is defined in `src/types/admin.ts` covering all fixed storefront micro-copy with 100% complete Saudi hospitality defaults.
- [ ] `SiteContentContext.tsx` is created, providing `{ content, loading, reload, t }` with fallback resilience.
- [ ] Root `App.tsx` wraps the application in `SiteContentProvider`.
- [ ] `SiteContentModule.tsx` includes the expandable accordion **«الإعدادات المتقدمة: نصوص الواجهة الدقيقة (Micro-Copy)»** positioned beneath the primary copywriting section.
- [ ] The advanced accordion is collapsed by default to keep the interface uncluttered for everyday store managers.
- [ ] The instant search bar searches **both** primary brand copy and advanced micro-copy.
- [ ] When a search term matches any advanced string label, placeholder, or value, the accordion **automatically expands** and highlights matching fields with a gold indicator.
- [ ] Editing any micro-copy field and clicking **«حفظ كافة تعديلات المظهر والمحتوى»** persists the changes to Supabase (`public.site_content.ui_strings`).
- [ ] Changes made in the Merchant Center immediately update the live storefront (Cart bar, Checkout Modal, Customer Form, Payment options, Dish Modal) without page reload.
- [ ] If any field is emptied or cleared in admin, the storefront gracefully falls back to the default luxury Arabic string without crashing or rendering empty space.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero lint warnings.
- [ ] Phase B (`SKILLS_USED.md`), Phase C (`EXECUTION.log`), and Phase D (`POST_MORTEM.md`) are created and signed off.
