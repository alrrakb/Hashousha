# Architectural Specification: TASK-020 — Full Storefront Micro-Copy Democratization

> **Task ID:** `TASK-020-full-storefront-micro-copy-democratization`  
> **Milestone:** Milestone 16 — Comprehensive Storefront Micro-Copy Democratization & CMS Expansion  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** 🟡 `Phase A Approved (Ready for Implementation)`  
> **Created:** 2026-10-09T08:35:00+03:00  

---

## 1. Executive Summary & Strategic Objectives

Following the comprehensive forensic audit mandated by the Founder and the Brand Chief of Staff, **TASK-020** elevates the **Hashousha (هشوشة)** platform to complete content autonomy.

While **TASK-018** laid the foundation by democratizing high-level checkout labels and primary cart buttons via `ui_strings`, the forensic audit revealed **38 critical strings** that remain hardcoded in React TSX components across the storefront:
1. **Order Confirmation & Success Modal (`OrderSuccessModal.tsx`):** Celebratory badges, preparation headlines, tracking labels, copy triggers, and receipt row headers.
2. **Catalog Dish Cards (`DishCard.tsx`):** Out-of-stock badges, disabled action triggers, and quick add-to-cart buttons.
3. **Product Detail Modal (`ProductDetailModal.tsx`):** Serving capacity defaults, culinary story titles, hospitality serving suggestions, and the 4 quality guarantees.
4. **Standalone Product Landing Page (`ProductLandingPage.tsx`):** Catalog navigation, culinary story headings, serving recommendations, Riyadh delivery district highlights, customer review section headers, verified customer badges, and pairing titles.
5. **Customer Checkout Form & Payment Selector Completion (`CustomerForm.tsx` & `PaymentSelector.tsx`):** Recipient section headers, phone validation helpers, Riyadh delivery notices, default dropdown options, and payment selector headers.

### Core Architecture Invariants
- **100% Zero-Flicker Fallback Guarantee:** Every `t(key, fallback)` call must provide a fallback identical to the legacy text. If `ui_strings` is loading or undefined, the customer experiences zero layout shift, zero blank text, and zero visual regression.
- **Unified Advanced Settings Chamber:** All micro-copy fields reside inside the collapsible accordion in `SiteContentModule.tsx` under well-structured groups with luxury iconography and descriptive help text.
- **Deep Instant Search & Auto-Expansion:** Operators searching for any snippet (e.g. "دبس رمان", "تتبع", "مجهّز", "طريقة التقديم") instantly locate the field, with the accordion automatically expanding and highlighting matching controls.

---

## 2. Central Data Model & Schema Expansion (`src/types/admin.ts`)

The central key registry `DEFAULT_UI_STRINGS` in `src/types/admin.ts` expands from 28 keys to **66 keys** (+38 new keys).

```
========================================================================================
CURRENT (TASK-018): 28 Keys  ──►  EXPANSION (TASK-020): +38 Keys  ──►  TOTAL: 66 Keys
========================================================================================
```

### 2.1 The 38 New Micro-Copy Keys & Default Values

#### Cluster 0: Customer Form & Payment Selector Completion (5 Keys)
| Key | Default Arabic Value | Target Component | Description |
| :--- | :--- | :--- | :--- |
| `checkout.recipientHeader` | `بيانات المستلم وعنوان التوصيل في الرياض` | `CustomerForm.tsx` | عنوان ترويسة قسم بيانات العميل |
| `checkout.phoneHelper` | `سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم` | `CustomerForm.tsx` | نص الإرشاد التوضيحي أسفل حقل الجوال |
| `checkout.districtNotice` | `توصيل لجميع أحياء الرياض` | `CustomerForm.tsx` | شارة التوصيل لكافة أحياء العاصمة |
| `checkout.districtSelectDefault` | `-- اختر حي التوصيل --` | `CustomerForm.tsx` | الخيار الافتراضي في قائمة الأحياء المنسدلة |
| `checkout.paymentMethodHeader` | `طريقة الدفع المفضلة` | `PaymentSelector.tsx` | عنوان ترويسة قسم اختيار طريقة الدفع |

#### Cluster 1: Order Confirmation & Success View (11 Keys)
| Key | Default Arabic Value | Target Component | Description |
| :--- | :--- | :--- | :--- |
| `orderSuccess.badge` | `تم استلام طلبك بنجاح` | `OrderSuccessModal.tsx` | شارة استلام الطلب الاحتفالية |
| `orderSuccess.title` | `مطبخ هشوشة بدأ بالتحضير` | `OrderSuccessModal.tsx` | عنوان تأكيد بدء تجهيز الطلب |
| `orderSuccess.subtitle` | `شكراً لثقتك بهشوشة. يتم تحضير أطباقك طازجة باستخدام أرقى المكونات والوصفات المنزلية الأصيلة.` | `OrderSuccessModal.tsx` | السطر الوصفي ورسالة الامتنان |
| `orderSuccess.trackingLabel` | `رقم تتبع طلبك:` | `OrderSuccessModal.tsx` | تسمية كود تتبع الطلب |
| `orderSuccess.copyBtn` | `نسخ الرمز` | `OrderSuccessModal.tsx` | زر نسخ كود التتبع للحافظة |
| `orderSuccess.copiedBtn` | `تم النسخ بنجاح` | `OrderSuccessModal.tsx` | نص تأكيد إتمام النسخ |
| `orderSuccess.customerLabel` | `العميل الكريم:` | `OrderSuccessModal.tsx` | تسمية حقل اسم وبيانات العميل |
| `orderSuccess.locationLabel` | `موقع التوصيل:` | `OrderSuccessModal.tsx` | تسمية حقل حي وموقع التوصيل |
| `orderSuccess.paymentLabel` | `طريقة الدفع:` | `OrderSuccessModal.tsx` | تسمية حقل طريقة الدفع المعتمدة |
| `orderSuccess.totalLabel` | `المجموع النهائي (شامل التوصيل):` | `OrderSuccessModal.tsx` | تسمية ملخص المبلغ الإجمالي |
| `orderSuccess.whatsappBtn` | `إرسال نسخة وتأكيد عبر الواتساب` | `OrderSuccessModal.tsx` | زر إرسال تفاصيل الفاتورة عبر واتساب |

#### Cluster 2: Dish Cards & Quick Catalog Actions (3 Keys)
| Key | Default Arabic Value | Target Component | Description |
| :--- | :--- | :--- | :--- |
| `dishCard.soldOutBadge` | `نفد اليوم` | `DishCard.tsx` | شارة نفاد الكمية على صورة الصنف |
| `dishCard.unavailableBtn` | `غير متوفر اليوم` | `DishCard.tsx` | زر الصنف غير المتاح للطلب |
| `dishCard.addBtn` | `أضف للطلب` | `DishCard.tsx` | زر الإضافة السريعة بالبطاقة |

#### Cluster 3: Product Detail Modal Hospitality & Story (8 Keys)
| Key | Default Arabic Value | Target Component | Description |
| :--- | :--- | :--- | :--- |
| `dishModal.defaultServing` | `تكفي ٤-٦ أشخاص` | `ProductDetailModal.tsx` | سعة الحصة الافتراضية عند عدم تحديدها |
| `dishModal.aboutTitle` | `عن هذا الطبق الفاخر` | `ProductDetailModal.tsx` | عنوان قسم وصف الطبق ومكوناته |
| `dishModal.servingTipTitle` | `طريقة التقديم الفندقية المقترحة:` | `ProductDetailModal.tsx` | عنوان نصيحة التقديم الفندقية |
| `dishModal.servingTipText` | `يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.` | `ProductDetailModal.tsx` | نص الإرشاد الفندقي للتقديم والتزيين |
| `dishModal.highlightFresh` | `تحضير طازج يومياً بالرياض` | `ProductDetailModal.tsx` | ميزة التحضير اليومي الطازج |
| `dishModal.highlightIngredients` | `زيت زيتون بكر ودبس رمان أصلي` | `ProductDetailModal.tsx` | ميزة جودة المكونات البكر |
| `dishModal.highlightPackaging` | `تغليف حراري مخصص للجمعات` | `ProductDetailModal.tsx` | ميزة التغليف الحراري الخاص |
| `dishModal.highlightDelivery` | `توصيل فوري بسيارات مجهزة` | `ProductDetailModal.tsx` | ميزة التوصيل بسيارات مبردة |

#### Cluster 4: Dedicated Product Landing Page & Riyadh Reviews (11 Keys)
| Key | Default Arabic Value | Target Component | Description |
| :--- | :--- | :--- | :--- |
| `landing.backToCatalog` | `تصفح كامل أطباق هشوشة` | `ProductLandingPage.tsx` | زر الرجوع لقائمة أطباق المتجر |
| `landing.storyTitle` | `قصة الطبق وسر التحضير الحرفي` | `ProductLandingPage.tsx` | عنوان قصة الصنع والإتقان بالصفحة |
| `landing.servingTipTitle` | `سر التقديم الفندقي لضيوفكم:` | `ProductLandingPage.tsx` | عنوان نصيحة الضيافة لضيوف العميل |
| `landing.servingTipText` | `يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر وحبوب الرمان الطازجة.` | `ProductLandingPage.tsx` | نص توجيهات تقديم صوص الرمان والليمون |
| `landing.deliveryTitle` | `التوصيل متوفر لجميع أحياء الرياض:` | `ProductLandingPage.tsx` | عنوان توفر التوصيل لجميع أحياء الرياض |
| `landing.deliveryText` | `الملقا، حطين، النرجس، الياسمين، الصحافة، الغدير، العليا، السليمانية، الروضة، وكافة الأحياء الأخرى مع خيارات الدفع عند الاستلام، أبل باي، ومدى.` | `ProductLandingPage.tsx` | تفصيل أحياء الرياض وطرق الدفع |
| `landing.reviewsTitle` | `آراء وتجارب ذواقة الرياض` | `ProductLandingPage.tsx` | عنوان قسم مراجعات وتقييمات العملاء |
| `landing.reviewsSubtitle` | `تجارب حقيقية لعملاء وثقوا بضيافة هشوشة في جمعاتهم ومناسباتهم الخاصة` | `ProductLandingPage.tsx` | السطر الوصفي لقسم المراجعات |
| `landing.addReviewBtn` | `شاركنا تجربتك وتقييمك للطبق ✍️` | `ProductLandingPage.tsx` | زر فتح نموذج إضافة تقييم جديد |
| `landing.verifiedBadge` | `عميل موثّق 🌿` | `ProductLandingPage.tsx` | شارة توثيق تقييم العميل |
| `landing.pairingsTitle` | `يكمل جمعتكم (أطباق متناغمة)` | `ProductLandingPage.tsx` | عنوان قسم الأطباق التكميلية المقترحة |

---

## 3. Merchant Center CMS Architecture (`SiteContentModule.tsx`)

### 3.1 Organization of `ADVANCED_GROUPS`
In `src/components/admin/modules/SiteContentModule.tsx`, the `ADVANCED_GROUPS` array is re-architected into **7 distinct, beautifully organized categories** with dedicated icons:

```
+-----------------------------------------------------------------------------------------+
|                  «الإعدادات المتقدمة: التحكم الدقيق بنصوص الواجهة (Micro-Copy)»         |
+-----------------------------------------------------------------------------------------+
| 🛒 المجموعة 1: نصوص السلة وشريط الطلب (Cart & OrderBar)                   [3 حقول]     |
| 📝 المجموعة 2: نافذة إتمام الطلب وحقول البيانات (Checkout Modal & Form)    [17 حقلاً]   |
| 💳 المجموعة 3: طرق الدفع وكوبونات الخصم والملخص (Payment & Summary)       [12 حقلاً]   |
| 🎉 المجموعة 4: نافذة تأكيد ونجاح الطلب ورسالة الواتساب (Order Success)     [11 حقلاً]   |
| 🏷️ المجموعة 5: بطاقات الأطباق وأزرار الإضافة السريعة (Dish Cards)          [3 حقول]     |
| ✨ المجموعة 6: نافذة تفاصيل وضيافة الطبق الفاخرة (Product Detail Modal)    [8 حقول]     |
| 🌟 المجموعة 7: صفحة الهبوط المستقلة وتقييمات الرياض (Dish Landing Page)    [11 حقلاً]   |
+-----------------------------------------------------------------------------------------+
```

### 3.2 Instant Deep Search & Auto-Accordion Expansion
The matching algorithm in `SiteContentModule.tsx` natively evaluates all 66 keys:
```typescript
const isFieldMatched = (field: AdvancedField) => {
  if (!searchQuery.trim()) return false
  const q = searchQuery.trim().toLowerCase()
  const currentVal = getUiStringValue(field.key).toLowerCase()
  return (
    field.label.toLowerCase().includes(q) ||
    field.placeholder.toLowerCase().includes(q) ||
    field.key.toLowerCase().includes(q) ||
    currentVal.includes(q)
  )
}
```
Whenever an operator types any word into the search box:
1. `matchingAdvancedCount` counts matching fields across all 7 groups.
2. `effectiveIsAdvancedOpen = isAdvancedOpen || hasActiveAdvancedSearch` immediately expands the accordion.
3. Groups containing matching fields display an active highlight counter badge (e.g. `٢ مطابقة`).
4. Matched input fields receive a prominent gilded ring (`ring-2 ring-primary/40 border-primary bg-primary/5`).

---

## 4. Implementation Map & Component Binding Details

Agent Beta will integrate `useSiteContent()` and bind the keys across 6 components:

### 4.1 `src/components/checkout/CustomerForm.tsx`
- **Imports:** `useSiteContent` already imported.
- **Replacements:**
  * Line 43:
    ```tsx
    // Before:
    <h3 className="text-sm font-bold text-foreground">بيانات المستلم وعنوان التوصيل في الرياض</h3>
    // After:
    <h3 className="text-sm font-bold text-foreground">{t('checkout.recipientHeader', 'بيانات المستلم وعنوان التوصيل في الرياض')}</h3>
    ```
  * Line 124:
    ```tsx
    // Before:
    <p className="text-[11px] text-muted-foreground">سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم</p>
    // After:
    <p className="text-[11px] text-muted-foreground">{t('checkout.phoneHelper', 'سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم')}</p>
    ```
  * Line 136:
    ```tsx
    // Before:
    <span className="text-[11px] text-primary font-medium">توصيل لجميع أحياء الرياض</span>
    // After:
    <span className="text-[11px] text-primary font-medium">{t('checkout.districtNotice', 'توصيل لجميع أحياء الرياض')}</span>
    ```
  * Line 151:
    ```tsx
    // Before:
    <option value="">-- اختر حي التوصيل --</option>
    // After:
    <option value="">{t('checkout.districtSelectDefault', '-- اختر حي التوصيل --')}</option>
    ```

### 4.2 `src/components/checkout/PaymentSelector.tsx`
- **Imports:** `useSiteContent` already imported.
- **Replacement:**
  * Line 39:
    ```tsx
    // Before:
    <h3 className="text-sm font-bold text-foreground">طريقة الدفع المفضلة</h3>
    // After:
    <h3 className="text-sm font-bold text-foreground">{t('checkout.paymentMethodHeader', 'طريقة الدفع المفضلة')}</h3>
    ```

### 4.3 `src/components/checkout/OrderSuccessModal.tsx`
- **Imports:** Add `import { useSiteContent } from '../../context/SiteContentContext'`.
- **Hook invocation:** `const { t } = useSiteContent()`.
- **Replacements:**
  * Line 129: `t('orderSuccess.badge', 'تم استلام طلبك بنجاح')`
  * Line 132: `t('orderSuccess.title', 'مطبخ هشوشة بدأ بالتحضير')`
  * Line 135: `t('orderSuccess.subtitle', 'شكراً لثقتك بهشوشة. يتم تحضير أطباقك طازجة باستخدام أرقى المكونات والوصفات المنزلية الأصيلة.')`
  * Line 142: `t('orderSuccess.trackingLabel', 'رقم تتبع طلبك:')`
  * Line 161: `t('orderSuccess.copiedBtn', 'تم النسخ بنجاح')`
  * Line 167: `t('orderSuccess.copyBtn', 'نسخ الرمز')`
  * Line 177: `t('orderSuccess.customerLabel', 'العميل الكريم:')`
  * Line 184: `t('orderSuccess.locationLabel', 'موقع التوصيل:')`
  * Line 192: `t('orderSuccess.paymentLabel', 'طريقة الدفع:')`
  * Line 198: `t('orderSuccess.totalLabel', 'المجموع النهائي (شامل التوصيل):')`
  * Line 213: `t('orderSuccess.whatsappBtn', 'إرسال نسخة وتأكيد عبر الواتساب')`

### 4.4 `src/components/storefront/v0/DishCard.tsx`
- **Imports:** Add `import { useSiteContent } from '../../../context/SiteContentContext'`.
- **Hook invocation:** `const { t } = useSiteContent()`.
- **Replacements:**
  * Line 53: `t('dishCard.soldOutBadge', 'نفد اليوم')`
  * Line 103: `t('dishCard.unavailableBtn', 'غير متوفر اليوم')`
  * Line 123: `t('dishCard.addBtn', 'أضف للطلب')`

### 4.5 `src/components/storefront/v0/ProductDetailModal.tsx`
- **Imports:** `useSiteContent` already imported.
- **Replacements:**
  * Line 152: `dish.servingInfo || t('dishModal.defaultServing', 'تكفي ٤-٦ أشخاص')`
  * Line 212: `t('dishModal.aboutTitle', 'عن هذا الطبق الفاخر')`
  * Line 235: `t('dishModal.servingTipTitle', 'طريقة التقديم الفندقية المقترحة:')`
  * Line 237: `t('dishModal.servingTipText', 'يُفضل التقديم بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الفاخر وتزيينه بحبات الرمان الطازجة وشرائح الليمون.')`
  * Line 248: `t('dishModal.highlightFresh', 'تحضير طازج يومياً بالرياض')`
  * Line 251: `t('dishModal.highlightIngredients', 'زيت زيتون بكر ودبس رمان أصلي')`
  * Line 255: `t('dishModal.highlightPackaging', 'تغليف حراري مخصص للجمعات')`
  * Line 259: `t('dishModal.highlightDelivery', 'توصيل فوري بسيارات مجهزة')`

### 4.6 `src/components/storefront/v0/ProductLandingPage.tsx`
- **Imports:** Add `import { useSiteContent } from '../../../context/SiteContentContext'`.
- **Hook invocation:** `const { t } = useSiteContent()`.
- **Replacements:**
  * Line 356: `t('landing.backToCatalog', 'تصفح كامل أطباق هشوشة')`
  * Line 458: `t('landing.storyTitle', 'قصة الطبق وسر التحضير الحرفي')`
  * Line 469: `t('landing.servingTipTitle', 'سر التقديم الفندقي لضيوفكم:')`
  * Line 471: `t('landing.servingTipText', 'يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر وحبوب الرمان الطازجة.')`
  * Line 479: `t('landing.deliveryTitle', 'التوصيل متوفر لجميع أحياء الرياض:')`
  * Line 481: `t('landing.deliveryText', 'الملقا، حطين، النرجس، الياسمين، الصحافة، الغدير، العليا، السليمانية، الروضة، وكافة الأحياء الأخرى مع خيارات الدفع عند الاستلام، أبل باي، ومدى.')`
  * Line 545: `t('landing.reviewsTitle', 'آراء وتجارب ذواقة الرياض')`
  * Line 548: `t('landing.reviewsSubtitle', 'تجارب حقيقية لعملاء وثقوا بضيافة هشوشة في جمعاتهم ومناسباتهم الخاصة')`
  * Line 575: `t('landing.addReviewBtn', 'شاركنا تجربتك وتقييمك للطبق ✍️')`
  * Line 743: `t('landing.verifiedBadge', 'عميل موثّق 🌿')`
  * Line 769: `t('landing.pairingsTitle', 'يكمل جمعتكم (أطباق متناغمة)')`

---

## 5. Acceptance Criteria & Quality Gates

| ID | Criterion | Verification Method |
| :---: | :--- | :--- |
| **AC-01** | **66 Total Keys in Registry** | `DEFAULT_UI_STRINGS` in `src/types/admin.ts` contains exactly 66 string keys with comprehensive Arabic fallbacks. |
| **AC-02** | **7 Organized Admin Groups** | `SiteContentModule.tsx` renders 7 advanced groups with proper Arabic titles, icons, and descriptions. |
| **AC-03** | **Zero Hardcoded Strings** | All 38 target strings in `CustomerForm`, `PaymentSelector`, `OrderSuccessModal`, `DishCard`, `ProductDetailModal`, and `ProductLandingPage` use `t(key, fallback)`. |
| **AC-04** | **100% Fallback Equivalence** | Fallback parameter for every `t(key, fallback)` call matches legacy text character-for-character. |
| **AC-05** | **Deep Search & Auto-Expand** | Typing any substring of labels, placeholders, or current values into the search bar auto-expands the accordion and highlights matches. |
| **AC-06** | **Cloud Persistence** | Edits saved in `SiteContentModule` persist to `public.site_content.ui_strings` in Supabase and reflect live across storefront reloads. |
| **AC-07** | **Zero Build Errors** | `npm run build` (`tsc && vite build`) executes cleanly with 0 TypeScript compilation errors and 0 runtime warnings. |

---

## 6. Execution Protocol for Agent Beta

Upon Founder sign-off, Agent Beta is authorized to execute:
1. **Phase B (`SKILLS_USED.md`):** Mobilize `storefront-best-practices` and `tailwind-design-system`.
2. **Phase C (`EXECUTION.log`):** Perform atomic edits in the 7 target files, run `npm run build`, and capture chronological terminal output.
3. **Phase D (`POST_MORTEM.md`):** Document architectural decisions (ADRs) and update `tasks/INDEX.md` and `PROJECT_STATE.json` marking status `✅ Completed`.
