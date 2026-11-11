# TASK-013 SPECIFICATION: Customer Reviews Engine & Merchant Moderation Hub

> **Task ID:** `TASK-013-customer-reviews-engine-and-merchant-moderation-hub`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 9 (Customer Reviews Engine & Merchant Moderation Hub)  

---

## 1. Executive Summary & Strategic Objective

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-013: Customer Reviews Engine & Merchant Moderation Hub (منظومة التقييمات السحابية ولوحة إدارة المراجعات)** across the consumer storefront (`ProductLandingPage.tsx`) and the Merchant Center (`/admin`).

Customer reviews in a luxury culinary boutique serve as the primary engine of social trust. To ensure privacy, brand prestige, and operational control, this task achieves:
1. **Cloud Persistence (`public.reviews`):** Fully structured table in Supabase storing verified customer ratings and commentary with Row-Level Security (RLS).
2. **Storefront Sanitization & Dynamic Loading:**
   - Permanent removal of neighborhood names from review cards.
   - Updating the verification badge to: `عميل موثّق 🌿`.
   - Dynamic fetching of published reviews for each dish from Supabase with smooth fallbacks.
3. **Interactive 3-Field Review Submission Form:**
   - Frictionless submission component allowing customers to submit their review using only 3 essential fields: **الاسم الكريم**, **التقييم بالنجوم (1-5)**, and **رأيك وتجربتك مع الطبق**.
   - Immediate feedback and optimistic list update.
4. **Merchant Moderation Hub (`ReviewsModule.tsx`):**
   - New dedicated module in the Merchant Center enabling operators to monitor incoming feedback, toggle publication visibility (`نشر / إخفاء`), and delete spam or inappropriate reviews.

---

## 2. Cloud Database Architecture (`public.reviews`)

The table `public.reviews` has been established in the active Supabase project (`oulzpjcmnxvvrpdyfpcg`) with the following schema:

```sql
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup indexes
CREATE INDEX idx_reviews_dish_published ON public.reviews (dish_id, is_published);
CREATE INDEX idx_reviews_created_at ON public.reviews (created_at DESC);

-- RLS Policies
-- 1. Public can read published reviews
-- 2. Public can insert reviews
-- 3. Admin can read, update, and delete all reviews
```

---

## 3. Domain Model & Service Contracts

### 3.1 Type Definitions (`src/types/admin.ts`)
Update `AdminTab` and define `AdminReview`:

```typescript
export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'discounts'
  | 'seo'
  | 'reviews';

export interface AdminReview {
  id: string;
  dishId: string;
  dishName: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  isPublished: boolean;
  createdAt: string;
}
```

### 3.2 Cloud Reviews Service (`src/services/adminService.ts`)
Implement the following asynchronous functions in `adminService.ts`:

1. `fetchReviewsForDish(dishId: string): Promise<AdminReview[]>`
   - Queries `supabase.from('reviews').select('*').eq('dish_id', dishId).eq('is_published', true).order('created_at', { ascending: false })`.
   - Maps database columns (`dish_id` ➔ `dishId`, `customer_name` ➔ `customerName`, etc.).
   - Returns mapped reviews or empty array on failure.

2. `fetchAllReviews(): Promise<AdminReview[]>`
   - Queries all records from `reviews` ordered by `created_at DESC`.
   - Used by `ReviewsModule.tsx` in the Merchant Center.

3. `submitCustomerReview(review: { dishId: string; dishName: string; customerName: string; rating: number; comment: string }): Promise<{ success: boolean; data?: AdminReview; error?: string }>`
   - Inserts row into `reviews` with `is_published: true`.
   - Returns the created `AdminReview` object.

4. `updateReviewPublishStatus(reviewId: string, isPublished: boolean): Promise<{ success: boolean; error?: string }>`
   - Updates `is_published` for the given `reviewId`.

5. `deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }>`
   - Deletes row matching `id = reviewId`.

---

## 4. Component Architectural Blueprints

### 4.1 Storefront Reviews Section & Form (`ProductLandingPage.tsx`)

#### 1. Neighborhood Removal & Badge Standard
- Remove all district pills (`حي النرجس`, `حي حطين`, `حي الملقا`).
- Reviewer footer now features only:
  - Customer Name: `<span className="font-bold text-foreground">{review.customerName}</span>`
  - Relative or formatted date: `<span className="text-[11px] text-muted-foreground">{formatDate(review.createdAt)}</span>`
- Verification Badge:
  ```tsx
  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
    <CheckCircle2 className="size-3" />
    <span>عميل موثّق 🌿</span>
  </span>
  ```

#### 2. Dynamic Reviews Hydration
- Add state: `const [reviews, setReviews] = useState<AdminReview[]>([])`
- Add state: `const [loadingReviews, setLoadingReviews] = useState<boolean>(true)`
- On mount / when `dish.id` changes, call `fetchReviewsForDish(dish.id)`.
- If cloud returns records, render them. If empty, fallback gracefully to the 3 curated signature reviews (adapted without districts and with `عميل موثّق 🌿`).

#### 3. Interactive 3-Field Review Submission Form
- Add a prominent CTA in the section header:
  `[+ شاركنا تجربتك وتقييمك للطبق ✍️]`
- When opened (inline or modal sheet with Framer Motion):
  - **Field 1 (الاسم):**
    - Label: `اسمك الكريم`
    - Input: `text`, required, placeholder: `مثال: نورة السبيعي / فهد الدوسري`
  - **Field 2 (التقييم):**
    - Label: `تقييمك للطبق`
    - 5 clickable gold stars with hover state and `whileTap={{ scale: 0.85 }}` animation.
    - Default rating: 5 stars.
  - **Field 3 (التعليق):**
    - Label: `رأيك وتجربتك مع المذاق والتقديم`
    - Textarea: required, rows: 3, placeholder: `اكتب رأيك الصادق في جودة المكونات، الطعم، وتجربة الضيافة...`
  - **Submit Button:**
    - `[إرسال التقييم الآن 🌿]` with loading spinner and disabled state while submitting.
  - **On Success:**
    - Prepend new review to active `reviews` list.
    - Show warm confirmation message: `شكراً لذوقك الرفيع! تم تسجيل تقييمك بنجاح 🌿`.
    - Reset and close form.

---

### 4.2 Merchant Moderation Hub (`ReviewsModule.tsx`)

Create `src/components/admin/modules/ReviewsModule.tsx` with the following architecture:

#### 1. Header & KPI Summary Cards
- **إجمالي التقييمات (Total):** Count of all reviews.
- **متوسط التقييم العام (Avg Rating):** Average of all ratings (e.g. `٤٫٩ ★`).
- **تقييمات منشورة (Published):** Count with green pill.
- **تقييمات مخفية (Hidden):** Count with gray/amber pill.

#### 2. Filtering & Search Toolbar
- Search input: by customer name or comment content.
- Filter by Dish: Dropdown to filter by specific dish name.
- Filter by Status: All / Published (`منشور`) / Hidden (`مخفي`).
- Filter by Rating: All / 5 stars / 4 stars / 3 stars or below.

#### 3. Moderation Cards / Table Layout
Each review row/card displays:
- Customer name and rating in stars (1-5).
- Dish name badge (`bg-secondary text-primary font-bold`).
- Full comment text.
- Formatted creation date.
- Publication Status Toggle:
  - Button with visual state: `[منشور 🟢]` vs `[مخفي ⚪]`.
  - Clicking calls `updateReviewPublishStatus(review.id, !review.isPublished)` with optimistic UI update.
- Delete Action:
  - Trash button with confirm prompt calling `deleteReview(review.id)`.

#### 4. Navigation & Layout Integration
- **`src/components/admin/MerchantSidebar.tsx`:**
  - Add `{ id: 'reviews', label: 'تقييمات العملاء', englishLabel: 'Reviews', icon: Star, badge: hiddenReviewsCount }` to `navItems`.
- **`src/components/admin/MerchantCenter.tsx`:**
  - Mount `<ReviewsModule />` when `activeTab === 'reviews'`.

---

## 5. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`storefront-best-practices`**:
   - Customer review submission ergonomics, input validation, and social proof trust architectures.
2. **`tailwind-design-system`**:
   - Cohesive luxury aesthetic for review cards, interactive star pickers, and admin moderation tables in Hashousha's royal linen palette.
3. **`design-mobile-apps`**:
   - Touch-friendly 5-star selector (minimum 44x44px target) and mobile responsive sheet for review submission.
4. **`vercel-react-best-practices`**:
   - Optimistic state updates, debounced search filters in admin, and clean component unmounting.

---

## 6. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/types/admin.ts` | MODIFY | Add `'reviews'` to `AdminTab` and define `AdminReview` interface |
| `src/services/adminService.ts` | MODIFY | Implement `fetchReviewsForDish`, `fetchAllReviews`, `submitCustomerReview`, `updateReviewPublishStatus`, and `deleteReview` |
| `src/components/storefront/v0/ProductLandingPage.tsx` | MODIFY | Remove district pills, update badge to `عميل موثّق 🌿`, fetch cloud reviews, and add 3-field submission form |
| `src/components/admin/modules/ReviewsModule.tsx` | CREATE | Complete merchant reviews moderation hub with KPIs, filters, visibility toggle, and deletion |
| `src/components/admin/MerchantSidebar.tsx` | MODIFY | Add Reviews tab with Star icon and count badge |
| `src/components/admin/MerchantCenter.tsx` | MODIFY | Mount `ReviewsModule` when `activeTab === 'reviews'` |
| `tasks/TASK-013-customer-reviews-engine-and-merchant-moderation-hub/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-013-customer-reviews-engine-and-merchant-moderation-hub/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-013-customer-reviews-engine-and-merchant-moderation-hub/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 7. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] Cloud table `public.reviews` is live and accessible via Supabase client with RLS configured.
- [ ] `src/types/admin.ts` exports `AdminReview` and updates `AdminTab` with `'reviews'`.
- [ ] `src/services/adminService.ts` provides all 5 cloud review methods with resilient error handling.
- [ ] `ProductLandingPage.tsx` displays review cards with zero neighborhood names.
- [ ] Verification badge strictly says `عميل موثّق 🌿` with the emerald check icon.
- [ ] `ProductLandingPage.tsx` dynamically fetches and displays published reviews from Supabase.
- [ ] The interactive 3-field review submission form allows entering Name, Rating (1-5 stars), and Comment.
- [ ] Submitting a review saves it to Supabase and immediately reflects in the storefront list.
- [ ] Merchant Center features the `'reviews'` tab in `MerchantSidebar.tsx` with Star icon.
- [ ] `ReviewsModule.tsx` shows KPI metrics, search, and dish filters.
- [ ] Clicking the visibility button toggles `is_published` between published and hidden in real time.
- [ ] Deleting a review removes it from Supabase and the admin UI.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-013-customer-reviews-engine-and-merchant-moderation-hub/`.
