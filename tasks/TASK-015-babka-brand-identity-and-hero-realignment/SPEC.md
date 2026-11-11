# TASK-015 SPECIFICATION: Babka Brand Identity & Hero Realignment

> **Task ID:** `TASK-015-babka-brand-identity-and-hero-realignment`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 11 (Artisanal Babka Flagship & Hero Realignment)  

---

## 1. Executive Summary & Strategic Positioning

In accordance with official directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-015: Babka Brand Identity & Hero Realignment (مواءمة هوية المتجر مع البابكا والكوكيز الفاخرة)** within the storefront hero showcase (`src/components/storefront/v0/Hero.tsx`).

### Strategic Brand Realignment:
1. **The Hero Flagship:** Artisanal braided Babka and luxury baked cookies (البابكا الحرفية والكوكيز الفاخر) are now permanently established as the primary flagship hero products of Hashousha.
2. **Complementary Hospitality:** Artisanal vine leaves and savory mahashi (ورق العنب والمحاشي) remain revered as complementary gathering accompaniments (أطايب الضيافة التكميلية).
3. **New Photography Asset:** The newly generated, hotel-grade hero photography has been successfully installed at `public/images/hero.png` and is ready to anchor the storefront aesthetic.

---

## 2. Detailed Copywriting & Typography Specifications (`Hero.tsx`)

Agent Beta will update the typography and copy in `src/components/storefront/v0/Hero.tsx` to precisely match the Founder's approved brand voice:

### 2.1 English Header Label
- **Existing:** `Riyadh · Artisanal Kitchen`
- **Updated:**
  ```tsx
  <p dir="ltr" className="self-end font-serif text-xs tracking-[0.3em] text-[#E9D3B4] font-bold uppercase md:self-start drop-shadow-sm">
    Riyadh · Artisanal Babka & Bakery
  </p>
  ```

### 2.2 Arabic Master Headline (`h1`)
- **Existing:** `نكهة الجمعات الأصيلة / طازجة يومياً`
- **Updated:**
  ```tsx
  <h1
    id="hero-title"
    className="text-balance text-4xl leading-[1.25] font-extrabold text-[#E9D3B4] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] md:text-6xl"
  >
    ترف البابكا والمخبوزات الفاخرة
    <span className="block text-[#FAF7F2] drop-shadow-md">تُخبز طازجة يومياً</span>
  </h1>
  ```

### 2.3 Narrative Description (`p`)
- **Existing:** `أطباق منزلية فاخرة تُحضَّر بأيادٍ سعودية، لتليق بضيافتكم ومجالسكم.`
- **Updated:**
  ```tsx
  <p className="max-w-md text-pretty text-xs sm:text-sm md:text-base font-medium leading-relaxed text-[#FAF7F2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
    روائع البابكا والمخبوزات الحرفية، تُخبز بشغف وإتقان يومياً لتليق بأرقى مجالس الضيافة.
  </p>
  ```

### 2.4 Photography Accessibility Alt Tag (`img`)
- **Existing:** `alt="صينية ورق عنب فاخرة مزيّنة بالرمان والنعناع"`
- **Updated:**
  ```tsx
  alt="بابكا حرفية مجدولة ومخبوزات وكوكيز فاخر من هشوشة"
  ```

---

## 3. Visual Scrim & Contrast Verification

- **Background Image:** `/images/hero.png`
- **Overlay Scrim:**
  `<div className="absolute inset-0 bg-gradient-to-t from-[#2e1e0d] via-[#2e1e0d]/70 to-black/20" />`
  Must be preserved to guarantee WCAG AAA contrast ratio between the gilded text (`#E9D3B4`, `#FAF7F2`) and the warm roasted bakery imagery beneath.
- **Skeleton Shimmer:**
  Hero photography loading state (`!imgLoaded ? "opacity-0" : "opacity-85"`) with `HeroSkeleton` remains active.

---

## 4. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must document and mobilize the following skills:
1. **`storefront-best-practices`**:
   - Hero value proposition alignment with the primary high-conversion product offering.
2. **`tailwind-design-system`**:
   - Typography scales, drop-shadow hierarchies, and warm contrast preservation.
3. **`vercel-react-best-practices`**:
   - Semantic heading landmarks (`h1`, `p`, `img` accessibility tags).

---

## 5. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/components/storefront/v0/Hero.tsx` | MODIFY | Update English tag, master h1, narrative description, and image alt text to Artisanal Babka & Bakery |
| `tasks/TASK-015-babka-brand-identity-and-hero-realignment/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-015-babka-brand-identity-and-hero-realignment/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-015-babka-brand-identity-and-hero-realignment/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 6. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] English tag in `Hero.tsx` strictly reads: `Riyadh · Artisanal Babka & Bakery`.
- [ ] Arabic headline in `Hero.tsx` strictly reads: `ترف البابكا والمخبوزات الفاخرة` with second line `تُخبز طازجة يومياً`.
- [ ] Narrative description strictly reads: `بابكا مجدولة بحشوات غنية وكوكيز فاخر يُحضّر بحب وإتقان، إلى جانب أطايب ورق العنب والضيافة لتكتمل بها جمعاتكم.`.
- [ ] Image alt tag strictly reflects the babka & cookies bakery aesthetic.
- [ ] Text contrast and drop-shadows ensure flawless legibility over the new `/images/hero.png`.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-015-babka-brand-identity-and-hero-realignment/`.
