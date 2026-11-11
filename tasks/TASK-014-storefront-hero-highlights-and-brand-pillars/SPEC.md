# TASK-014 SPECIFICATION: Storefront Hero Highlights & Brand Pillars Redesign

> **Task ID:** `TASK-014-storefront-hero-highlights-and-brand-pillars`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 10 (Storefront Hero Highlights & Brand Pillars)  

---

## 1. Executive Summary & Creative Directive

In accordance with official directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-014: Storefront Hero Highlights & Brand Pillars Redesign (إعادة تصميم ركائز الضيافة الفاخرة أسفل الهيرو)** located in `src/components/storefront/v0/Hero.tsx` and mirrored in `src/components/storefront/v0/StorefrontSkeletons.tsx`.

### The Founder's Non-Negotiable Artistic Principle:
> **"عدم طغيان البطاقات الجديدة على الهيرو سيكشن في الجمالية أو الكثافة البصرية، وبقاؤها كمكمّل فندقي أنيق ومتناغم."**  
> *"The new pillar cards must NEVER overpower the hero section in aesthetic weight or visual density. They must exist as a quiet, whispered hotel-grade accompaniment."*

The hero photography already commands deep emotional resonance with its warm roasted backdrop (`#2e1e0d`) and grand artisanal dish presentation. The 4 brand pillars below must therefore:
- Refrain from loud borders, heavy dropshadows, or high-contrast dark fills.
- Use Hashousha's soft royal linen background (`#FDFBF7`) with gentle bronze boundaries (`border-primary/15`).
- Maintain a compact vertical footprint so the menu section (`#menu`) remains clearly visible in the initial viewport (preserving Above-the-Fold priority).
- Communicate concise, eloquent Arabic copy that builds immediate hospitality confidence.

---

## 2. The 4 Hotel-Grade Hospitality Pillars (الركائز الأربع)

The 4 pillar cards replace the legacy single-line tags with a dignified 2-tier content structure (Title + concise micro-copy):

```typescript
export interface BrandPillar {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
}

export const BRAND_PILLARS: BrandPillar[] = [
  {
    icon: ChefHat,
    title: "طهي يدوي طازج",
    subtitle: "تحضير يومي بأيادٍ سعودية",
  },
  {
    icon: Droplets,
    title: "مكونات بكر أصيلة",
    subtitle: "زيت زيتون بكر ممتاز ودبس رمان جبلي",
  },
  {
    icon: Gift,
    title: "تقديم يبيّض الوجه",
    subtitle: "صواني فاخرة لمجالسكم",
  },
  {
    icon: Truck,
    title: "توصيل مجهّز بالرياض",
    subtitle: "سيارات مبردة لحفظ الطراوة",
  },
];
```

*Note: Icons from `lucide-react` (`ChefHat`, `Droplets`, `Gift`, `Truck`).*

---

## 3. Dimensional & Layout Specifications

### 3.1 Visual Weight & Color Tokens
- **Surface:** `bg-[#FDFBF7]` (Linen Warm / `bg-card`) — avoids stark cold white.
- **Border:** `border border-primary/15 hover:border-primary/35 transition-all duration-300`.
- **Corner Radius:** `rounded-2xl` matching Hashousha's organic curvature language.
- **Shadow:** Whisper-quiet elevation: `shadow-[0_2px_8px_-4px_rgba(46,30,13,0.06)]`.
- **Gilded Micro-Icon:**
  - Container: `flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary`
  - Icon geometry: `size-4`, `strokeWidth={1.75}`, `aria-hidden="true"`.

### 3.2 Typography & Copy Hierarchy
- **Title:** `text-xs sm:text-[13px] font-bold text-foreground leading-snug`.
- **Subtitle:** `text-[10px] sm:text-[11px] text-muted-foreground leading-tight line-clamp-1 truncate`.
- Text container: `flex flex-col min-w-0 text-right`.

### 3.3 Above-The-Fold Preservation & Padding
- Outer spacing: `mt-4 sm:mt-5`.
- Inner card padding: `p-3 sm:p-3.5` (compact vertical footprint to prevent pushing `#menu` down).
- Grid layout:
  - **Mobile (< 768px):** `grid grid-cols-2 gap-2 sm:gap-2.5` (neat 2x2 grid, finger-friendly yet compact).
  - **Desktop (>= 768px):** `md:grid-cols-4 md:gap-3` (single cohesive 4-card horizontal row).

### 3.4 Micro-Interactions (Framer Motion / Hover)
- Subtle hover state: slight border glow (`hover:border-primary/35`), gentle icon scale (`group-hover:scale-105 transition-transform`).
- Optional subtle stagger entrance matching TASK-010 spring standards.

---

## 4. Skeleton Synchronization (`StorefrontSkeletons.tsx`)

To prevent Cumulative Layout Shift (CLS = 0) during catalog hydration:
- Update `HeroSkeleton` in `src/components/storefront/v0/StorefrontSkeletons.tsx` to match the exact dimensions and 2-line structure of the new 4 pillar cards:
  - An icon circle placeholder (`size-8 rounded-xl skeleton-shimmer shrink-0`).
  - Two stacked text bars (`h-3 w-20 rounded-full skeleton-shimmer` + `h-2.5 w-28 rounded-full skeleton-shimmer mt-1`).
  - Matching `grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4 sm:mt-5`.

---

## 5. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`tailwind-design-system`**:
   - Applying exact linen tokens (`#FDFBF7`), subtle bronze borders, and responsive grid patterns.
2. **`design-mobile-apps`**:
   - Mobile viewport ergonomics: compact 2x2 grid, readable typography, and zero horizontal overflow on 375px/390px screens.
3. **`storefront-best-practices`**:
   - Value proposition clarity below hero banners to maximize trust and guide user gaze seamlessly into the menu catalog.
4. **`vercel-react-best-practices`**:
   - Zero layout shift, featherlight markup, and clean semantic HTML (`<ul>` and `<li>` with ARIA labels).

---

## 6. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/components/storefront/v0/Hero.tsx` | MODIFY | Redesign 4 brand pillars below hero with compact linen cards, micro-gilded icons, and 2-tier copy |
| `src/components/storefront/v0/StorefrontSkeletons.tsx` | MODIFY | Update `HeroSkeleton` to mirror the 2-tier geometry of the new 4 brand pillars (CLS = 0) |
| `tasks/TASK-014-storefront-hero-highlights-and-brand-pillars/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-014-storefront-hero-highlights-and-brand-pillars/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-014-storefront-hero-highlights-and-brand-pillars/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 7. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] The 4 brand pillars strictly present the required content:
  1. `طهي يدوي طازج` (تحضير يومي عند الطلب بأيدي طهاة سعوديين)
  2. `مكونات بكر أصيلة` (زيت زيتون بكر ممتاز ودبس رمان جبلي)
  3. `تقديم يبيّض الوجه` (صواني وبوكسات فاخرة مهيأة لمجالسكم)
  4. `توصيل مجهّز بالرياض` (سيارات مبردة لحفظ حرارة وطراوة الأطباق)
- [ ] Surface uses soft linen `#FDFBF7` with gentle bronze borders `border-primary/15` (hover `border-primary/35`).
- [ ] Visual weight is soft and whispered, without dark fills, heavy shadows, or visual competition with the hero banner.
- [ ] Vertical footprint is compact and does NOT push the menu catalog (`#menu`) off the initial screen view.
- [ ] Mobile renders a crisp, balanced 2x2 grid (`grid-cols-2`), and desktop renders a harmonious 4-column row (`md:grid-cols-4`).
- [ ] `HeroSkeleton` in `StorefrontSkeletons.tsx` accurately mirrors the geometry of the new cards with zero CLS.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-014-storefront-hero-highlights-and-brand-pillars/`.
