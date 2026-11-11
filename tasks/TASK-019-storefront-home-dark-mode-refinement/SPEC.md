# TASK-019 SPECIFICATION: Storefront Home, Catalog & OrderBar Hotel-Grade Dark Roast Refinement

> **Task ID:** `TASK-019-storefront-home-dark-mode-refinement`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 15 (Storefront Home, Catalog & OrderBar Dark Roast Refinement)  

---

## 1. Executive Summary & Context

Under the direct instructions of the Founder, the engineering team is executing a rigorous, section-by-section (جزئية جزئية) visual defect eradication across the dark mode experience ("Dark Roast" / `.dark`).

### The Target Scope: Station 1 (المحطة الأولى: الواجهة الرئيسية والمتجر)
Station 1 encompasses the customer storefront landing experience:
1. **Hero Section & Brand Pillars** (`src/components/storefront/v0/Hero.tsx`)
2. **Artisanal Dish Cards & Badges** (`src/components/storefront/v0/DishCard.tsx`)
3. **Storefront Shimmer Skeletons** (`src/components/storefront/v0/StorefrontSkeletons.tsx`)
4. **Floating Order Bar Capsule** (`src/components/storefront/v0/OrderBar.tsx`)

Subsequent stations (Station 2: Detail Modal & Checkout, Station 3: Product Landing Page, Station 4: Merchant Center) will be addressed in separate, isolated tasks once Station 1 is verified and signed off.

---

## 2. Forensic Code Audit & Defect Catalog

### Defect 1.1: `Hero.tsx` — Hardcoded Ivory Pillars
- **Location:** `src/components/storefront/v0/Hero.tsx` (Line 119)
- **Defect:** Brand pillars (`BRAND_PILLARS`) contain hardcoded `bg-[#FDFBF7]`.
- **Visual Impact:** While the background switches to Dark Espresso (`#17110B`), the four hospitality cards remain bright white/ivory, creating severe contrast glare and breaking the dark aesthetic.
- **Architectural Remedy:** Replace `bg-[#FDFBF7]` with `bg-card` (or `bg-[#FDFBF7] dark:bg-card dark:border-primary/25 dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.5)]`). In CSS, `--card` is `#fdfbf7` in light mode and `#231b14` in dark mode, ensuring automatic token harmony.

---

### Defect 1.2: `DishCard.tsx` — Hardcoded "حامض حلو" Badge & Image Placeholder Glare
- **Location 1:** `src/components/storefront/v0/DishCard.tsx` (Line 22)
  - **Defect:** The `tangy` ("حامض حلو") badge configuration has:
    ```tsx
    tangy: {
      label: "حامض حلو",
      icon: Citrus,
      className: "bg-[#fdfbf7] text-[#2e1e0d] border border-[#9e774c]/40 shadow-md backdrop-blur-md font-black",
      iconColor: "text-[#9e774c]",
    }
    ```
  - **Visual Impact:** The badge remains bright ivory linen with dark text, sticking out jarringly on dark dish cards.
  - **Architectural Remedy:** Tokenize the classes:
    ```tsx
    tangy: {
      label: "حامض حلو",
      icon: Citrus,
      className: "bg-card dark:bg-[#231b14] text-card-foreground dark:text-foreground border border-primary/40 shadow-md backdrop-blur-md font-black",
      iconColor: "text-primary",
    }
    ```
- **Location 2:** `src/components/storefront/v0/DishCard.tsx` (Line 63)
  - **Defect:** Aspect ratio container has hardcoded `bg-[#ebdccb]`.
  - **Visual Impact:** Before an image loads or during network delay, a bright cream/beige rectangle flashes on dark mode.
  - **Architectural Remedy:** Update to `bg-[#ebdccb] dark:bg-secondary/50`.
- **Location 3:** `src/components/storefront/v0/DishCard.tsx` (Line 59)
  - **Defect:** Box-shadow uses hardcoded `rgba(46,30,13,...)` (light mode warm brown shadow).
  - **Visual Impact:** Dark cards lack dark depth elevation in night mode.
  - **Architectural Remedy:** Append `dark:shadow-[0_1px_0_rgba(194,149,103,0.06),0_20px_40px_-24px_rgba(0,0,0,0.7)]`.

---

### Defect 1.3: `StorefrontSkeletons.tsx` — Hardcoded Ivory Skeleton Pillars
- **Location:** `src/components/storefront/v0/StorefrontSkeletons.tsx` (Line 54)
- **Defect:** `HeroSkeleton` brand pillars use hardcoded `bg-[#FDFBF7]`.
- **Visual Impact:** While the skeleton hero banner is dark shimmer (`.dark .skeleton-shimmer { background: #261e16 }`), the 4 skeleton pillar cards flash bright ivory.
- **Architectural Remedy:** Replace `bg-[#FDFBF7]` with `bg-card dark:border-primary/25`.
- **Card Skeleton Shadow:** Line 74 in `DishCardSkeleton`: append `dark:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)]`.

---

### Defect 1.4: `OrderBar.tsx` — Critical Inversion Glare Bug
- **Location:** `src/components/storefront/v0/OrderBar.tsx` (Lines 31, 40, 55, 101)
- **Defect:** 
  The floating Order Bar wrapper uses:
  ```tsx
  className="mx-auto max-w-xl pointer-events-auto overflow-hidden rounded-[1.75rem] border border-primary/25 bg-foreground text-background shadow-[0_24px_60px_-20px_rgba(46,30,13,0.6)]"
  ```
  - In **Light Mode**: `--foreground` is `#2e1e0d` (dark brown) and `--background` is `#faf7f2` (ivory). Result: Dark luxury capsule with white text.
  - In **Dark Mode**: `--foreground` is `#faf7f2` (ivory white) and `--background` is `#17110b` (dark espresso).
  - **CRITICAL FAILURE:** The entire floating bar INVERTS into a glaring white/ivory capsule floating on the dark page! Furthermore, child elements using `bg-background/10` and `text-background/65` invert into faint black tones on the white bar, making the cart items unreadable!
- **Architectural Remedy:**
  Decouple `OrderBar` from inverted variable pairs. The Order Bar is a luxury floating dark roasting capsule in both modes:
  ```tsx
  className="mx-auto max-w-xl pointer-events-auto overflow-hidden rounded-[1.75rem] border border-primary/25 bg-[#231b14] dark:bg-[#1a130c] text-[#faf7f2] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
  ```
  And for child styling:
  - Line 40: `divide-white/10 dark:divide-primary/15`
  - Line 55: `bg-white/10 dark:bg-primary/10`
  - Line 61 & Line 71: `hover:bg-white/15 dark:hover:bg-primary/20`
  - Line 101: `text-white/65 dark:text-muted-foreground`
  - Line 53 & Line 97: `text-[#E9D3B4] dark:text-primary`

---

## 3. Impacted Files Specification

| File Path | Action | Description |
|:---|:---:|:---|
| `src/components/storefront/v0/Hero.tsx` | Edit | Replace hardcoded `#FDFBF7` on brand pillars with `bg-card` & dark elevation tokens |
| `src/components/storefront/v0/DishCard.tsx` | Edit | Tokenize `tangy` badge, dark fallback on image aspect box, dark shadow elevation |
| `src/components/storefront/v0/StorefrontSkeletons.tsx` | Edit | Tokenize `HeroSkeleton` pillars to `bg-card` and add dark shadow on skeletons |
| `src/components/storefront/v0/OrderBar.tsx` | Edit | Fix severe inversion bug; anchor capsule background to luxury cocoa/dark espresso in both modes |

---

## 4. Acceptance Criteria (Verifiable Checklist)

- [ ] **AC-1 (Hero Pillars Harmony):** In dark mode, all 4 brand pillar cards under the Hero banner have dark cocoa background (`#231B14`), warm borders, and clear readable typography with zero white glare.
- [ ] **AC-2 (DishCard Badges & Placeholders):** The "حامض حلو" (`tangy`) badge renders seamlessly in dark mode without bright ivory background. The image aspect box has a dark cocoa loading background in dark mode.
- [ ] **AC-3 (Shimmer Skeleton Consistency):** `HeroSkeleton` brand pillars render dark cards in dark mode matching `Hero.tsx`.
- [ ] **AC-4 (OrderBar Luxury Capsule):** The floating OrderBar remains a rich dark roasted capsule (`#231B14` in light mode, `#1A130C` in dark mode) with luminous gold/bronze accents. It **NEVER** turns white or ivory in dark mode.
- [ ] **AC-5 (Light Mode Zero Regression):** All 4 components continue to look 100% flawless and luxurious in Light Mode (`.linen` warm ivory).
- [ ] **AC-6 (Build Verification):** `npm run build` completes with exit code 0 and zero TypeScript or Tailwind compilation errors.

---

## 5. Architectural Invariants & Red Lines

1. **Station 1 Scope Isolation:** Agent Beta must ONLY modify the 4 files specified in Section 3. Do not touch `ProductDetailModal.tsx`, `CheckoutModal.tsx`, or `MerchantCenter.tsx` in this task.
2. **Strict Protocol Compliance:** No production code modification may begin until the Founder gives explicit authorization to Agent Beta.
