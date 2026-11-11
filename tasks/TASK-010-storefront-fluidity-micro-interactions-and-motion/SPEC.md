# TASK-010 SPECIFICATION: Storefront Fluidity, Micro-Interactions & Luxury Motion

> **Task ID:** `TASK-010-storefront-fluidity-micro-interactions-and-motion`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 6 (Luxury Motion, Storefront Fluidity & Hotel-Grade Micro-Interactions)  

---

## 1. Executive Summary & Brand Vision

In accordance with strategic directives from the Founder and Brand Chief of Staff, **Agent Beta** will implement **TASK-010: Storefront Fluidity, Micro-Interactions & Luxury Motion (سلاسة المتجر والميكرو-أنيميشن التفاعلي)** across the Hashousha luxury storefront and merchant interface using **Framer Motion (`framer-motion@^11.5.4`)**.

Hashousha is an artisanal Saudi luxury food boutique catering to discerning Riyadh clientele. Digital interactions must not feel like a generic shopping cart; they must evoke the grace, poise, and tactile elegance of a five-star hospitality concierge:
- **No jarring layout jumps:** Smooth layout morphing and spring physics.
- **Immediate tactile feedback:** Tactile bounce on counters and celebratory pops on bag updates.
- **Whisper-quiet elegance:** Natural physics parameters (`damping: 25, stiffness: 300`) without unnatural overshoot or sluggish delays.

---

## 2. Motion Design Tokens & Physics Standard (Luxury Hospitality Physics)

All Framer Motion transitions across the platform must adhere to this standardized physics palette:

```typescript
// Shared Motion Configurations
export const luxurySpring = {
  type: "spring",
  damping: 25,
  stiffness: 300,
  mass: 0.8,
} as const;

export const tactileTap = {
  scale: 0.88,
  transition: { type: "spring", stiffness: 500, damping: 15 },
} as const;

export const badgePop = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 450, damping: 18 },
} as const;

export const modalBackdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.22, ease: "easeOut" },
} as const;

export const modalDialogMotion = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 16 },
  transition: { type: "spring", damping: 26, stiffness: 320 },
} as const;

export const bottomSheetMotion = {
  initial: { opacity: 0, y: "100%" },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
  transition: { type: "spring", damping: 28, stiffness: 280 },
} as const;
```

---

## 3. Detailed Component Architecture Specifications

### 3.1 Luxury Modals & Sheets Motion Architecture
Impacted Files:
- `src/components/checkout/CheckoutModal.tsx`
- `src/components/storefront/v0/ProductDetailModal.tsx`
- `src/components/admin/modules/CreateManualOrderModal.tsx`

#### Architectural Requirements:
1. **Remove hard `if (!isOpen) return null;` blockers:**
   - Both parent and child must allow Framer Motion's `<AnimatePresence>` to orchestrate the exit lifecycle.
   - Inside the component, encapsulate the modal contents inside:
     ```tsx
     <AnimatePresence>
       {isOpen && (
         <motion.div
           key="modal-backdrop"
           variants={modalBackdropMotion}
           initial="initial"
           animate="animate"
           exit="exit"
           className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-md"
           dir="rtl"
         >
           <motion.div
             key="modal-card"
             variants={window.innerWidth < 640 ? bottomSheetMotion : modalDialogMotion}
             initial="initial"
             animate="animate"
             exit="exit"
             className="relative w-full max-h-[92vh] sm:max-h-[88vh] sm:max-w-xl ..."
           >
             {/* Modal Content */}
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
     ```
2. **Backdrop Blur & Depth:**
   - Use `bg-foreground/60 backdrop-blur-md` for the backdrop, ensuring the storefront beneath gently blurs out as the modal enters.
3. **Esc Key & Click Outside:**
   - Retain clean dismissal handling without interrupting the exit spring animation.

---

### 3.2 Floating Order Bar Drawer & Header Badge Fluidity
Impacted Files:
- `src/components/storefront/v0/OrderBar.tsx`
- `src/components/storefront/v0/SiteHeader.tsx`

#### Architectural Requirements:
1. **`OrderBar.tsx` Accordion Summary Drawer:**
   - Currently, `open && (<ul id="order-summary">...)` snaps in abruptly.
   - Replace with `<AnimatePresence>` and `<motion.ul>`:
     ```tsx
     <AnimatePresence>
       {open && (
         <motion.ul
           id="order-summary"
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: "auto", opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           transition={{ type: "spring", damping: 25, stiffness: 300 }}
           className="max-h-64 divide-y divide-background/10 overflow-y-auto px-4 pt-3"
         >
           {lines.map(({ dish, quantity }) => (
             <motion.li
               layout
               key={dish.id}
               initial={{ opacity: 0, y: 8 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -8 }}
               className="flex items-center justify-between gap-3 py-2.5"
             >
               {/* Item details & stepper */}
             </motion.li>
           ))}
         </motion.ul>
       )}
     </AnimatePresence>
     ```
   - Add gentle rotation transition on the chevron icon using Framer Motion or class transforms.
2. **`SiteHeader.tsx` Shopping Bag Count Badge:**
   - When items are added or updated, the quantity badge must trigger a scale pop:
     ```tsx
     <AnimatePresence mode="popLayout">
       {totalItems > 0 && (
         <motion.span
           key={totalItems}
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0.5, opacity: 0 }}
           transition={{ type: "spring", stiffness: 500, damping: 18 }}
           className="absolute -top-0.5 -left-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background"
         >
           {totalItems.toLocaleString("ar-SA")}
         </motion.span>
       )}
     </AnimatePresence>
     ```

---

### 3.3 Sliding Category Capsule & Staggered Dish Grid
Impacted File:
- `src/components/storefront/v0/MenuSection.tsx`

#### Architectural Requirements:
1. **Sliding Capsule Pill (`layoutId="activeCategoryPill"`):**
   - In the category navigation bar, rather than each button conditionally having a background color, use Framer Motion's shared layout animation:
     ```tsx
     <button
       type="button"
       onClick={() => setActive(cat.id as CategoryId)}
       className="relative min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
     >
       {isActive && (
         <motion.div
           layoutId="activeCategoryPill"
           className="absolute inset-0 rounded-full bg-primary shadow-sm"
           transition={{ type: "spring", damping: 25, stiffness: 300 }}
         />
       )}
       <span className={cn("relative z-10", isActive ? "text-primary-foreground font-bold" : "text-foreground/80 hover:text-foreground")}>
         {cat.label}
       </span>
     </button>
     ```
2. **Staggered Dish Grid Transition (`AnimatePresence mode="popLayout"`):**
   - When switching categories (e.g. from "الكل" to "المحاشي الفاخرة"), cards must not blink or jump.
   - Encapsulate the grid inside:
     ```tsx
     <motion.div
       key={active}
       layout
       variants={{
         hidden: { opacity: 0 },
         show: {
           opacity: 1,
           transition: {
             staggerChildren: 0.05,
             delayChildren: 0.02,
           },
         },
       }}
       initial="hidden"
       animate="show"
       className="mx-auto grid w-full max-w-5xl gap-5 px-5 pt-6 sm:grid-cols-2 lg:grid-cols-3"
     >
       <AnimatePresence mode="popLayout">
         {visible.map((dish) => (
           <motion.div
             key={dish.id}
             layout
             initial={{ opacity: 0, scale: 0.95, y: 15 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 15 }}
             transition={{ type: "spring", damping: 24, stiffness: 280 }}
           >
             <DishCard dish={dish} onSelectDish={onSelectDish} />
           </motion.div>
         ))}
       </AnimatePresence>
     </motion.div>
     ```

---

### 3.4 Tactile Counter Micro-Interactions & Morphing Add Button
Impacted File:
- `src/components/storefront/v0/DishCard.tsx`

#### Architectural Requirements:
1. **Morphing State Transition:**
   - Transition seamlessly between the initial "أضف للطلب" pill and the active quantity stepper `+ / [count] / -`.
   - Wrap the button/counter area with:
     ```tsx
     <AnimatePresence mode="wait" initial={false}>
       {quantity === 0 ? (
         <motion.button
           key="add-btn"
           layout
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           whileTap={{ scale: 0.92 }}
           transition={{ type: "spring", damping: 20, stiffness: 350 }}
           onClick={(e) => {
             e.stopPropagation();
             add(dish.id);
           }}
           className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-primary bg-transparent px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
         >
           <Plus className="size-4" aria-hidden="true" />
           أضف للطلب
         </motion.button>
       ) : (
         <motion.div
           key="stepper"
           layout
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           transition={{ type: "spring", damping: 20, stiffness: 350 }}
           className="flex min-h-[44px] items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground shadow-sm"
           onClick={(e) => e.stopPropagation()}
         >
           <motion.button
             whileTap={{ scale: 0.84 }}
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               add(dish.id);
             }}
             className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35"
           >
             <Plus className="size-4" />
           </motion.button>

           <motion.span
             key={quantity}
             initial={{ scale: 0.7, y: -2 }}
             animate={{ scale: 1, y: 0 }}
             transition={{ type: "spring", stiffness: 500, damping: 18 }}
             className="min-w-6 text-center text-sm font-bold inline-block"
             aria-live="polite"
           >
             {quantity.toLocaleString("ar-SA")}
           </motion.span>

           <motion.button
             whileTap={{ scale: 0.84 }}
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               remove(dish.id);
             }}
             className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35"
           >
             <Minus className="size-4" />
           </motion.button>
         </motion.div>
       )}
     </AnimatePresence>
     ```
2. **Card Image Micro-Zoom:**
   - Retain and smooth the hover micro-zoom on dish photography (`group-hover:scale-105 duration-700 ease-out`).

---

## 4. Mandatory Skills to Mobilize in Phase B (`SKILLS_USED.md`)

Agent Beta must mobilize and reference the following skills:
1. **`tailwind-design-system`**: Ensuring motion tokens seamlessly complement the existing royal linen palette (`#faf7f2`, `#fdfbf7`, `#9e774c`, `#2e1e0d`).
2. **`design-mobile-apps`**: Ensuring touch-target ergonomics (minimum 44x44px) and smooth 60fps spring responsiveness on iOS/Android WebViews.
3. **`vercel-react-best-practices`**: Zero layout thrashing, proper keying of animated elements, and performance guardrails.
4. **`storefront-best-practices`**: Ensuring micro-interactions clarify customer actions and boost checkout conversion without adding cognitive load.

---

## 5. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `src/components/storefront/v0/MenuSection.tsx` | MODIFY | Add `layoutId="activeCategoryPill"` sliding capsule and staggered grid transitions |
| `src/components/storefront/v0/DishCard.tsx` | MODIFY | Add tactile stepper spring animations, count pop, and morphing Add button |
| `src/components/storefront/v0/OrderBar.tsx` | MODIFY | Add spring accordion drawer for cart contents with smooth height animation |
| `src/components/storefront/v0/SiteHeader.tsx` | MODIFY | Add reactive spring scale pop on cart item counter badge |
| `src/components/checkout/CheckoutModal.tsx` | MODIFY | Wrap dialog in `AnimatePresence` with luxury backdrop blur & spring sheet motion |
| `src/components/storefront/v0/ProductDetailModal.tsx` | MODIFY | Wrap dialog in `AnimatePresence` with luxury backdrop blur & spring card motion |
| `src/components/admin/modules/CreateManualOrderModal.tsx` | MODIFY | Wrap dialog in `AnimatePresence` with luxury backdrop blur & spring card motion |
| `tasks/TASK-010-storefront-fluidity-micro-interactions-and-motion/SKILLS_USED.md` | CREATE (Beta) | Phase B mobilized skills catalog |
| `tasks/TASK-010-storefront-fluidity-micro-interactions-and-motion/EXECUTION.log` | CREATE (Beta) | Phase C chronological execution trace |
| `tasks/TASK-010-storefront-fluidity-micro-interactions-and-motion/POST_MORTEM.md` | CREATE (Beta) | Phase D ADRs, verification checklist & sign-off |

---

## 6. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `MenuSection.tsx` features a smooth sliding capsule indicator behind the active category using `layoutId="activeCategoryPill"`.
- [ ] Switching categories animates dish cards with a fluid staggered entrance (`AnimatePresence mode="popLayout"`).
- [ ] `DishCard.tsx` smoothly morphs between "أضف للطلب" and the stepper without jumping.
- [ ] Stepper buttons (`+` and `-`) execute tactile spring bounce (`whileTap: { scale: 0.84 }`).
- [ ] The quantity number in `DishCard.tsx` performs a subtle spring scale pop on every increment/decrement.
- [ ] `OrderBar.tsx` cart summary smoothly slides open and closed with spring physics.
- [ ] `SiteHeader.tsx` shopping bag badge performs a spring scale pop whenever items are added or removed.
- [ ] `CheckoutModal.tsx` animates entrance and exit seamlessly with backdrop blur and spring dynamics.
- [ ] `ProductDetailModal.tsx` animates entrance and exit seamlessly with backdrop blur and spring dynamics.
- [ ] `CreateManualOrderModal.tsx` animates entrance and exit seamlessly with backdrop blur and spring dynamics.
- [ ] Zero layout thrashing, zero flicker, and 60fps performance on mobile viewport simulations.
- [ ] `npm run build` exits 0 with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is fully compiled in `tasks/TASK-010-storefront-fluidity-micro-interactions-and-motion/`.
