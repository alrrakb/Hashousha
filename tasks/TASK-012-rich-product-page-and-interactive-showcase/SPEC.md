# TASK-012 SPECIFICATION: Rich Product Page, Culinary Showcase & Interactive Conversion Engine

> **Task ID:** `TASK-012-rich-product-page-and-interactive-showcase`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 8 (Rich Culinary Showcase, CRO & Social Proof)  

---

## 1. Executive Summary & Conversion Architecture

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-012: Rich Product Page, Culinary Showcase & Interactive Conversion Engine (تطوير صفحة المنتج، الوصف الطويل، التقييمات، والمنتجات ذات الصلة)** across both the standalone product landing page (`ProductLandingPage.tsx`) and the in-store quick-view modal (`ProductDetailModal.tsx`).

In bespoke culinary commerce, customers ordering for upscale Riyadh gatherings (جمعات العوائل، مجالس الضيافة، إهداءات راقية) require confidence and sensory connection before committing to high-ticket orders. This feature transforms product pages into high-converting culinary showcases:
1. **Sensory Storytelling & Serving Clarification:** Explaining artisanal ingredients, slow-cooking heritage, exact serving capacity (كم شخص تكفي؟), and optimal hospitality presentation tips.
2. **Authentic Social Proof (Riyadh Verified Reviews):** Reassuring hosts with authentic testimonials from recognizable Riyadh districts (الملقا، النرجس، حطين، الياسمين).
3. **Frictionless Upselling ("يكمل جمعتكم"):** Suggesting 3 complementary dishes with instant one-tap add-to-cart functionality without leaving the current dish view.
4. **Royal Hospitality Badges:** Reinforcing standards of fresh daily cooking, refrigerated Riyadh delivery, and luxury gifting presentation.
5. **Admin Catalog Control:** Allowing store managers to manage long descriptions and serving metrics in `ProductEditModal.tsx` with Supabase persistence.

---

## 2. Domain Model & Data Contracts

### 2.1 Domain Type Enhancements (`src/types/menu.ts`)
Extend `Dish` interface to accommodate long culinary descriptions and serving details:

```typescript
export interface Dish {
  id: string
  name: string
  englishName: string
  slug?: string
  description: string
  longDescription?: string // Rich culinary story, secret seasoning & cooking heritage
  servingInfo?: string // e.g. "تكفي ٤-٦ أشخاص (صينية ٥٠ حبة)"
  price: number
  unit: string
  category: string
  image: string
  badges: BadgeKind[]
  inStock: boolean
  seoTitle?: string
  seoDescription?: string
}
```

### 2.2 Cloud Data Persistence (`src/services/adminService.ts`)
Update `CloudDishRow` and mappings:
- Add `long_description?: string`
- Add `serving_info?: string`
- In `fetchDishesFromSupabase`:
  ```typescript
  longDescription: d.long_description || undefined,
  servingInfo: d.serving_info || undefined,
  ```
- In `saveDishToSupabase`:
  ```typescript
  long_description: dish.longDescription || null,
  serving_info: dish.servingInfo || null,
  ```

### 2.3 Default Dishes Enrichment (`src/data/menu.ts`)
Provide rich default content for all 5 signature dishes:
1. `warak-classic`:
   - `servingInfo`: `"تكفي ٤-٦ أشخاص (صينية ٥٠ حبة)"`
   - `longDescription`: `"حكاية تبدأ باختيار أجود أوراق العنب الغضة، تُلف حبةً بحبة بالأرز المصري المتبل بالنعناع البلدي والبهارات الشرقية المتوازنة. يُطهى على نار هادئة جداً لساعات في مزيج غني من زيت الزيتون البكر الممتاز ودبس الرمان الجبلي الأصيل، ليتشرب كل حبة طراوة لا تُقاوم ونكهة حامضة حلوة تأسر الحواس."`
2. `warak-box`:
   - `servingInfo`: `"تكفي ٦-٨ أشخاص (بوكس ٧٠ حبة للإهداء)"`
   - `longDescription`: `"صُمم خصيصاً للمناسبات الراقية والإهداء الفاخر في مجالس الرياض. يتم ترتيب حبات ورق العنب بعناية فائقة في بوكس أنيق محكم الإغلاق، مصحوباً بعبوات كريستالية خارجية لصلصة دبس الرمان المركزة لسكبها طازجة عند التقديم المباشر."`
3. `malfouf-spicy`:
   - `servingInfo`: `"تكفي ٤-٥ أشخاص (صينية ٤٠ حبة)"`
   - `longDescription`: `"ورقات الكرنب البيضاء المنتقاة بعناية، محشوة بخلطة الأرز المبهرة والمطهوة ببطء في مرق الطماطم الغني بالحرارة المعتدلة ونكهة الثوم والليمون. تعلوه لمسة من السمسم المحمص ورقائق الفلفل الحار، ليمنح المجالس دفئاً ونكهة أصيلة ذائبة في الفم."`
4. `majlis-tray`:
   - `servingInfo`: `"تكفي ٨-١٠ أشخاص (صينية مشكلة للمجالس الكبيرة)"`
   - `longDescription`: `"الخيار الأكمل لجمعات العائلة والديوانيات. تشكيلة ملكية تجمع بين ورق العنب الحامض حلو الكلاسيكي والملفوف الذائب الحار المسمسم، مُرتبة في صينية تقديم ذهبية مخصصة للمائدة مباشرة دون الحاجة لنقلها لأوانٍ أخرى."`
5. `sweets-om-ali`:
   - `servingInfo`: `"تكفي ٤-٦ أشخاص (صينية فخار دافئة)"`
   - `longDescription`: `"طبقات رقائق الميلفوي الهشة المحمصة، مغمورة بالحليب المكثف الغني بالقشطة البلدية الطازجة والمستكة، ومزينة بالفستق الحلبي الحلبي واللوز المحمص والزبيب الذهبي. تُخبز حتى تكتسب وجهاً ذهبياً مقرمشاً وقلباً كريمياً دافئاً."`

---

## 3. Component Architectural Blueprints

### 3.1 Standalone Product Landing Page Showcase (`ProductLandingPage.tsx`)

#### 1. Section: The Culinary Story & Secret Craft (قصة الطبق وسر النكهة)
- **Serving Capacity Pill:** Prominent badge next to price and unit:
  - Icon: `Users` (Lucide)
  - Text: `{dish.servingInfo || 'تكفي ٤-٦ أشخاص'}`
- **Story Narrative Box:**
  - Styled card in Linen Warm (`#fdfbf7`) with subtle bronze border (`border-primary/20`).
  - Narrative text formatted with generous line-height (`leading-relaxed`).
- **Hospitality Serving Tip (طريقة التقديم الفندقية):**
  - Highlighted tip box:
    - `"💡 سر التقديم الفندقي: يُفضل تقديمه بدرجة حرارة الغرفة (أو دافئاً قليلاً)، مع سكب صوص دبس الرمان الإضافي وتزيينه بشرائح الليمون الأصفر الطازج وحبوب الرمان."`

#### 2. Section: Royal Hospitality Guarantees (أوسمة الضيافة الملكية)
A 4-column responsive grid replacing the generic quality cards:
1. **طهي طازج يومياً 🌿:** تحضير يدوي عند الطلب بمكونات طبيعية وزيوت بكر دون مواد حافظة.
2. **توصيل مجهز ومبرد ❄️:** سيارات مجهزة لحفظ حرارة وطراوة الأطباق في كافة أحياء الرياض.
3. **تغليف الضيافة والإهداء 🎁:** صواني وبوكسات فاخرة مهيأة للتقديم المباشر في المجالس دون نقل.
4. **ضمان الذائقة الفاخرة ⭐:** التزام مطلق بالمذاق الرفيع وتوازن الحموضة والحلاوة.

#### 3. Section: Verified Riyadh Customer Reviews (آراء وتجارب ذواقة الرياض)
- **Header:**
  - Rating Summary: ⭐ 4.9 من 5 (أكثر من +120 تقييم موثق من عملاء الرياض).
- **Review Cards Carousel / Grid (3 Curated Testimonials):**
  1. **سارة العتيبي — حي النرجس:**
     - تقييم: 5 نجوم ⭐⭐⭐⭐⭐
     - الشارة: `شراء مؤكد 🌿`
     - التعليق: `"ورق العنب خيالي بكل ما تعنيه الكلمة، الحبات متماسكة والرز ذايب وحموضة الرمان متوازنة بدون أي مرارة. بيّض وجهي بجمعة خواتي!"`
  2. **م. سلطان الدوسري — حي حطين:**
     - تقييم: 5 نجوم ⭐⭐⭐⭐⭐
     - الشارة: `شراء مؤكد 🌿`
     - التعليق: `"الملفوف الحار المسمسم إدمان! التوصيل كان في الموعد تماماً والأكل وصل دافئ وتغليف الصينية فاخر جداً يليق بالمجلس."`
  3. **نورة السبيعي — حي الملقا:**
     - تقييم: 5 نجوم ⭐⭐⭐⭐⭐
     - الشارة: `شراء مؤكد 🌿`
     - التعليق: `"بوكس الضيافة فكرة رائعة للإهداء. ترتيب الحبات والصوص الخارجي والريحة تفتح النفس. صرت زبونة دائمة لهشوشة."`

#### 4. Section: "يكمل جمعتكم" Related Dishes (Complementary Upsells)
- Displays 3 complementary dishes from `dishes` (excluding current dish).
- Card Layout:
  - Dish thumbnail with rounded corners.
  - Title, English subtitle, price, and unit.
  - Direct Action Button: `[+ أضف للطلب]` with instant cart dispatch (`add(dish.id)`) and tactile bounce feedback.
  - Does NOT trigger page navigation; customer stays on current page while the cart updates in real time.

---

### 3.2 Homepage In-Store Quick-View Modal (`ProductDetailModal.tsx`)

#### Architectural Requirements:
Inside `ProductDetailModal.tsx`, between the description and the action footer:
1. **Serving Info Badge:**
   - Display `{dish.servingInfo}` with a hospitality group icon.
2. **Expandable / Accordion Culinary Craft Section:**
   - Section Title: `سر النكهة والتحضير الفاخر 🌿`
   - Shows `dish.longDescription || dish.description`.
3. **Serving Tip Note:**
   - Brief note on room temperature serving and pairing with tea/coffee.
4. **Keep Compact & Scrollable:**
   - Ensure the modal remains scrollable on mobile viewports (`max-h-[92vh]`) with a sticky footer containing the quantity stepper and "أضف للطلب".

---

### 3.3 Merchant Center Catalog Management (`ProductEditModal.tsx`)

#### Architectural Requirements:
In `src/components/admin/modules/ProductEditModal.tsx`:
1. **New Input Fields:**
   - **تفاصيل الحصة والتقديم (`servingInfo`):**
     - Text input: `placeholder="مثال: تكفي ٤-٦ أشخاص (صينية ٥٠ حبة)"`
   - **الوصف الطويل وقصة الطبق (`longDescription`):**
     - Textarea: `rows={4}`, `placeholder="اكتب قصة الطبق وسر التتبيلة وطريقة التحضير الحرفية بالتفصيل..."`
2. **Form Submission:**
   - Store state in `const [servingInfo, setServingInfo] = useState(dish?.servingInfo || '')`
   - Store state in `const [longDescription, setLongDescription] = useState(dish?.longDescription || '')`
   - Pass both into `updatedDish` and submit to `onSave(updatedDish)`.

---

## 4. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`storefront-best-practices`**:
   - Best practices for e-commerce product detail pages (PDP), including social proof, serving reassurance, and zero-redirect cross-selling.
2. **`tailwind-design-system`**:
   - Ensuring new review cards and storytelling sections follow the warm royal linen aesthetic (`#faf7f2`, `#fdfbf7`, `#9e774c`, `#2e1e0d`).
3. **`design-mobile-apps`**:
   - Responsive multi-device layout (touch-friendly related dish cards, readable typography on mobile screens).
4. **`vercel-react-best-practices`**:
   - Memoized filtering of related dishes, clean component hierarchy, and zero layout thrashing.

---

## 5. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/menu.ts` | MODIFY | Add `longDescription?: string` and `servingInfo?: string` to `Dish` |
| `src/data/menu.ts` | MODIFY | Populate rich culinary stories and serving info for all 5 signature dishes |
| `src/services/adminService.ts` | MODIFY | Add `long_description` and `serving_info` in Supabase mapping & upsert |
| `src/components/storefront/v0/ProductLandingPage.tsx` | MODIFY | Add Culinary Story, Serving Info, Royal Badges, Riyadh Reviews, and "يكمل جمعتكم" related dishes with instant add-to-cart |
| `src/components/storefront/v0/ProductDetailModal.tsx` | MODIFY | Add serving info badge, secret flavor story, and serving tips inside modal |
| `src/components/admin/modules/ProductEditModal.tsx` | MODIFY | Add form fields for `servingInfo` and `longDescription` |
| `tasks/TASK-012-rich-product-page-and-interactive-showcase/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-012-rich-product-page-and-interactive-showcase/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-012-rich-product-page-and-interactive-showcase/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 6. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `src/types/menu.ts` defines `longDescription` and `servingInfo` as optional strings on `Dish`.
- [ ] `src/data/menu.ts` has rich culinary storytelling and serving metrics for all signature dishes.
- [ ] `src/services/adminService.ts` correctly saves and fetches `long_description` and `serving_info` to/from Supabase.
- [ ] `ProductLandingPage.tsx` displays the culinary story box, serving capacity badge, and hotel-grade serving tip.
- [ ] `ProductLandingPage.tsx` displays 4 royal hospitality guarantee badges with luxury typography.
- [ ] `ProductLandingPage.tsx` showcases the Riyadh verified customer reviews section with 4.9 rating summary and neighborhood pills.
- [ ] `ProductLandingPage.tsx` displays "يكمل جمعتكم" with 3 complementary dishes and instant one-click add-to-cart.
- [ ] Clicking "أضف للطلب" in the related dishes updates the cart and header badge without reloading or navigating away.
- [ ] `ProductDetailModal.tsx` showcases serving capacity, flavor secrets, and serving tips in an elegant scrollable format.
- [ ] `ProductEditModal.tsx` provides inputs for `servingInfo` and `longDescription` and saves them successfully.
- [ ] Clean responsive design across iPhone, iPad, and desktop viewports with zero horizontal overflow.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-012-rich-product-page-and-interactive-showcase/`.
