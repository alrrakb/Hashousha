# TASK-011 SPECIFICATION: Luxury Skeleton Loading & Perceived Performance

> **Task ID:** `TASK-011-luxury-skeleton-loading-and-perceived-performance`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 7 (Luxury Skeleton Systems & Perceived Performance)  

---

## 1. Executive Summary & Brand Purpose

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-011: Luxury Skeleton Loading & Perceived Performance (منظومة الهياكل العظمية التمهيدية والتحميل الفاخر)** across the Hashousha platform.

In luxury hospitality and bespoke culinary retail, the psychological perception of speed (Perceived Performance) is paramount. Customers visiting Hashousha must never encounter:
- Abrupt spinners (`animate-spin`) that broadcast latency or system hesitation.
- White flash gaps or layout shifts (CLS) as images and data hydrate from the cloud.
- Jumping card grids that flicker when categories or catalog queries resolve.

Instead, the customer is greeted by warm ivory and linen placeholder geometry (`#f5ede2` to `#faf5ee`) bathed in a soft golden-bronze shimmer, followed by a smooth crossfade into live artisanal dishes.

---

## 2. Design Tokens & Hotel-Grade Shimmer Standard (`src/index.css`)

### 2.1 CSS Specification for `.skeleton-shimmer`
Update `src/index.css` to adopt warm royal tones aligned with Hashousha's palette (`#faf7f2`, `#fdfbf7`, `#9e774c`):

```css
/* Hotel-Grade Luxury Skeleton Shimmer (Hardware-Accelerated 60fps) */
@keyframes luxury-shimmer {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #f5ede2;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.45) 45%,
    rgba(233, 211, 180, 0.35) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: luxury-shimmer 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
```

---

## 3. Component Architectural Blueprints

### 3.1 Storefront Catalog & Categories Crossfade (`MenuSection.tsx`)
Impacted File: `src/components/storefront/v0/MenuSection.tsx`

#### Architectural Requirements:
1. **Category Pills Skeleton:**
   - While `categoriesList.length <= 1` or during initial category fetch, display `CategoryPillsSkeleton` in place of the pills list.
   - Transition smoothly into real pills once loaded without horizontal jumping.
2. **Catalog Grid Skeleton:**
   - Introduce an `isInitialLoading` state (or check when dishes are empty / fetching from Supabase).
   - Display `MenuGridSkeleton count={6}` with 6 realistic card geometries.
3. **Smooth Crossfade Transition (No Screen Jank):**
   - Wrap the grid area in Framer Motion `<AnimatePresence mode="wait">`:
     ```tsx
     <AnimatePresence mode="wait">
       {isInitialLoading || dishes.length === 0 ? (
         <motion.div
           key="menu-skeleton-grid"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
         >
           <MenuGridSkeleton count={6} />
         </motion.div>
       ) : (
         <motion.div
           key={`menu-real-grid-${active}`}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.35, ease: "easeInOut" }}
           ...
         >
           {/* Dish Cards Grid */}
         </motion.div>
       )}
     </AnimatePresence>
     ```

---

### 3.2 Standalone Product Landing Page Sanitization (`ProductLandingPage.tsx`)
Impacted File: `src/components/storefront/v0/ProductLandingPage.tsx`

#### Architectural Requirements:
1. **Permanent Removal of `animate-spin`:**
   - Remove lines 165–171 containing the generic spinning circle completely:
     ```tsx
     // DELETED:
     // <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
     ```
2. **Immediate Shimmer Replacement:**
   - While `loading && !dish` (or during initial cloud resolution of the slug), immediately return `<ProductLandingSkeleton />`:
     ```tsx
     if (loading && !dish) {
       return <ProductLandingSkeleton />
     }
     ```
3. **Content Fade-In:**
   - When dish data is loaded, wrap the page content in a gentle Framer Motion fade-in (`initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}`).

---

### 3.3 Modal Hero Photography Skeleton (`ProductDetailModal.tsx`)
Impacted File: `src/components/storefront/v0/ProductDetailModal.tsx`

#### Architectural Requirements:
1. **Hero Photography Image Shimmer:**
   - Add state: `const [imgLoaded, setImgLoaded] = useState(false)`.
   - In the modal photography container (`aspect-[16/10] sm:aspect-[16/9]`):
     ```tsx
     <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-foreground">
       {/* Shimmer Placeholder */}
       {!imgLoaded && (
         <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
       )}

       <img
         src={dish.image || '/images/warak-enab.png'}
         alt={dish.name}
         onLoad={() => setImgLoaded(true)}
         className={cn(
           'relative z-10 h-full w-full object-cover transition-all duration-700 hover:scale-105',
           !imgLoaded ? 'opacity-0' : 'opacity-100',
           !dish.inStock && 'grayscale opacity-75'
         )}
       />
       ...
     </div>
     ```
   - Reset `imgLoaded` to `false` whenever `dish?.id` changes.

---

### 3.4 Skeletons Component Verification (`StorefrontSkeletons.tsx`)
Impacted File: `src/components/storefront/v0/StorefrontSkeletons.tsx`

#### Architectural Requirements:
- Verify that `DishCardSkeleton`, `MenuGridSkeleton`, `CategoryPillsSkeleton`, and `ProductLandingSkeleton`:
  1. Have exact matching bounding boxes and border radiuses (`rounded-[1.75rem]` for cards, `rounded-3xl` for landing photo).
  2. Maintain `aria-hidden="true"` and appropriate accessibility labels for screen readers (`aria-label="جاري تحميل الأطباق الفاخرة..."`).
  3. All inner placeholder rectangles utilize `.skeleton-shimmer` with warm rounded shapes.

---

## 4. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`tailwind-design-system`**: Ensuring skeleton color tokens (`#f5ede2`, `#faf5ee`, bronze shimmer) blend into the brand tokens.
2. **`design-mobile-apps`**: Ensuring zero CLS (Cumulative Layout Shift) and fluid mobile skeleton layout during screen orientation changes.
3. **`vercel-react-best-practices`**: Zero layout thrashing, proper image `onLoad` lifecycle cleanup, and smooth unmounting of skeleton nodes.
4. **`storefront-best-practices`**: Maintaining customer reassurance and engagement during data hydration.

---

## 5. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/index.css` | MODIFY | Upgrade `.skeleton-shimmer` with warm linen palette and bronze gold gradient |
| `src/components/storefront/v0/StorefrontSkeletons.tsx` | VERIFY / ENHANCE | Validate geometric fidelity of dish cards and landing skeletons |
| `src/components/storefront/v0/MenuSection.tsx` | MODIFY | Add category pills skeleton and grid skeleton crossfade transition |
| `src/components/storefront/v0/ProductLandingPage.tsx` | MODIFY | Remove `animate-spin` completely and activate `ProductLandingSkeleton` |
| `src/components/storefront/v0/ProductDetailModal.tsx` | MODIFY | Add image loading state with skeleton shimmer placeholder |
| `tasks/TASK-011-luxury-skeleton-loading-and-perceived-performance/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-011-luxury-skeleton-loading-and-perceived-performance/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-011-luxury-skeleton-loading-and-perceived-performance/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 6. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `.skeleton-shimmer` in `src/index.css` pulses with warm linen (`#f5ede2`) and a soft gold/bronze gradient.
- [ ] `MenuSection.tsx` displays `CategoryPillsSkeleton` while categories are loading.
- [ ] `MenuSection.tsx` displays `MenuGridSkeleton` with 6 cards while dishes are loading/refreshing.
- [ ] The transition between skeleton and real dish cards executes a seamless crossfade with zero layout jumps or flicker.
- [ ] `animate-spin` is completely eradicated from `ProductLandingPage.tsx`.
- [ ] `ProductLandingPage.tsx` displays `ProductLandingSkeleton` immediately while fetching cloud dish data.
- [ ] `ProductDetailModal.tsx` shows a smooth shimmer placeholder in the hero image area until image load completes.
- [ ] No Cumulative Layout Shift (CLS) occurs across mobile, tablet, and desktop viewports.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-011-luxury-skeleton-loading-and-perceived-performance/`.
