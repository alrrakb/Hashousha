# Phase D: Post-Mortem & Architectural Decisions — TASK-019

> **Task ID:** `TASK-019-storefront-home-dark-mode-refinement`  
> **Lifecycle Phase:** Phase D (Post-Mortem & ADR)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Reviewers:** Founder & Brand Chief of Staff, Agent Alpha  
> **Status:** ✅ Completed & Verified  
> **Timestamp:** 2026-10-09T08:02:00+03:00  

---

## 1. Executive Summary

This engineering task eliminated dark mode visual defects in Station 1 (Storefront Home, Catalog, and OrderBar), as well as direct UX defects identified by the Founder in the Product Detail Modal and Admin Dashboard KPI Statistics Cards.

By migrating ad-hoc hardcoded colors to semantic design tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, and dark roast elevation shadows), the interface now achieves hotel-grade luxury aesthetics in both Light Mode (`.linen`) and Dark Roast Mode (`.dark`).

---

## 2. Architectural Decisions (ADRs)

### ADR-019.1: Semantic Unification of Statistics and Metric Cards (`bg-card`)
- **Context:** In `OverviewModule.tsx`, `KitchenStats.tsx`, and `ReviewsModule.tsx`, active orders and delivered orders were styled with hardcoded light-mode Tailwind tints (`bg-amber-50/40`, `bg-emerald-50/40`) and near-black text (`text-amber-950`, `text-emerald-950`). In Dark Roast mode, this rendered as muddy washed-out grey/brown blocks with completely illegible numbers.
- **Decision:** Unify all 4 metric cards onto `bg-card` surface, with bold numbers rendered in `text-foreground` (crisp `#faf7f2` in dark mode, deep rich espresso in light mode). Semantic identity (active kitchen vs delivered) is preserved through subtle borders (`border-amber-500/25`, `border-emerald-500/25`) and colored icon pills (`bg-amber-500/10 text-amber-600 dark:text-amber-400`, `bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`).
- **Impact:** Flawless contrast, eliminated visual noise, and achieved 100% visual harmony across the dashboard.

### ADR-019.2: Modal Header Seamless Inheritance
- **Context:** `ProductDetailModal.tsx` rendered the header with an explicit semi-transparent background `bg-[#FAF7F2]/60 dark:bg-[#1a130c]/90`, creating an awkward split-tone container inside the modal card.
- **Decision:** Remove the child background and let the header naturally inherit `bg-card`. Action buttons use `bg-secondary/80 border-primary/20 text-foreground`.
- **Impact:** Perfectly cohesive modal in both light and dark modes.

---

## 3. Verification & Compliance Checklist

- [x] All 4 Station 1 files updated according to specification.
- [x] Product Detail Modal header and buttons unified and verified.
- [x] Admin Overview KPI statistics cards harmonized with `bg-card` and `text-foreground`.
- [x] Kitchen stats and reviews metric cards harmonized.
- [x] `npx tsc --noEmit` passed with 0 errors (Exit code 0).
- [x] `npm run build` production build succeeded with 0 errors.
- [x] Dev server verified at `http://localhost:5174/` (HTTP 200).
- [x] Strict 4-Phase Protocol completed (`SPEC.md`, `SKILLS_USED.md`, `EXECUTION.log`, `POST_MORTEM.md`).
