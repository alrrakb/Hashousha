# Post-Mortem & Architecture Decision Record: TASK-020

> **Task ID:** `TASK-020-full-storefront-micro-copy-democratization`  
> **Milestone:** Milestone 16 — Comprehensive Storefront Micro-Copy Democratization & CMS Expansion  
> **Status:** ✅ Completed  
> **Authority:** Agent Alpha (Lead Architect & Creative Director)  
> **Executor:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-09  

---

## 1. Executive Summary

TASK-020 successfully completes the democratization of all storefront micro-copy across the Hashousha e-commerce platform. From the cart drawer and checkout form to order success dialogues, dish cards, product modals, and landing pages, every single user-facing Arabic string is now dynamic, cloud-persisted, and editable from the admin control panel.

In addition, an immediate UX bottleneck reported by the client regarding the CMS search bar was completely resolved: search evaluation is decoupled from typing and editing, preventing matched inputs from vanishing mid-edit.

---

## 2. Architectural Decision Records (ADRs)

### ADR-020.1: Search Decoupling & Snapshot Lock Pattern
- **Context:** In `SiteContentModule.tsx`, a real-time reactive search filter evaluated `isFieldMatched` on every keystroke against the field's current value. When a user typed or modified a single character in a matched field, the field's value no longer matched the query, causing it to disappear or lose focus immediately.
- **Decision:**
  1. Decouple input state (`searchInput`) from committed filter state (`appliedSearch`).
  2. Implement an explicit "بحث" (Search) action button (and `Enter` key trigger) that takes a snapshot of matched keys (`matchedKeysSnapshot: Set<string>`).
  3. Matched status checks `matchedKeysSnapshot.has(field.key)` rather than re-evaluating changing text.
  4. Provide an "إلغاء البحث" (Reset Search) button to restore the entire CMS chamber to normal view.
- **Result:** Editing text inside fields never disturbs their visibility or focus, offering a smooth editing experience.

### ADR-020.2: 66-Key Canonical Registry Expansion
- **Context:** Previous phases democratized 28 keys. 38 hardcoded micro-copy strings remained scattered across 7 components.
- **Decision:** Expanded `DEFAULT_UI_STRINGS` in `src/types/admin.ts` to exactly 66 canonical keys with zero-flicker Arabic fallbacks matching legacy brand tone and typography.
- **Structure:**
  - Cart Modal & Drawers: 10 keys
  - Customer & Delivery Form: 13 keys
  - Payment & Order Summary: 13 keys
  - Order Success & Celebration: 11 keys
  - Dish Cards: 3 keys
  - Product Detail Modal: 8 keys
  - Product Landing Page: 11 keys

### ADR-020.3: Zero-Flicker Fallback Assurance
- **Context:** Asynchronous cloud fetching of `site_content` could cause hydration mismatch or visual flickering if fallback strings are missing.
- **Decision:** Every component consumes strings via `useSiteContent()` using nullish coalescing against `DEFAULT_UI_STRINGS[key]`. Even during cold load or network interruption, the exact brand-approved Arabic copy renders instantly.

---

## 3. Discoveries & Technical Learnings

1. **Reactive Search Pitfall in CMS Forms:** Continuous keystroke filtering is suitable for read-only listings, but hazardous for editable forms where modifying text alters the search match criterion. A snapshot/command-based search pattern is strictly necessary for admin form editors.
2. **Context-Driven Micro-Copy Propagation:** Consuming `useSiteContent` in leaf components (like `DishCard` and `PaymentSelector`) has negligible performance overhead when wrapped with React hooks, while enabling immediate live previewing of copy alterations across the entire application without page reloads.

---

## 4. Verification & QA Checklist

- [x] **Registry Completeness:** `DEFAULT_UI_STRINGS` contains all 66 canonical keys.
- [x] **Search UX Stability:** "بحث" button executes search; typing in input does not filter prematurely; editing field does not cause disappearance.
- [x] **Clear Search Functionality:** "إلغاء البحث" button resets all filters and re-displays all sections.
- [x] **Accordion Auto-Expansion:** Searching expands the advanced settings accordion and badges matched groups.
- [x] **Consumer Wiring:**
  - [x] `CustomerForm.tsx` (4 strings)
  - [x] `PaymentSelector.tsx` (1 string)
  - [x] `OrderSuccessModal.tsx` (11 strings)
  - [x] `DishCard.tsx` (3 strings)
  - [x] `ProductDetailModal.tsx` (8 strings)
  - [x] `ProductLandingPage.tsx` (11 strings)
- [x] **Type Safety & Build:** `npm run build` (`tsc && vite build`) passes with exit code 0 and 0 errors.

---

## 5. Lifecycle Conclusion

TASK-020 has fully satisfied all acceptance criteria defined in `SPEC.md` and user requirements. Status is marked `✅ Completed`.
