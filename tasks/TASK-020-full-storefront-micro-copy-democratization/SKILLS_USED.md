# Skills Mobilization: TASK-020 — Full Storefront Micro-Copy Democratization

> **Task ID:** `TASK-020-full-storefront-micro-copy-democratization`  
> **Milestone:** Milestone 16 — Comprehensive Storefront Micro-Copy Democratization & CMS Expansion  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** Phase B Complete — Skills Mobilized  
> **Date:** 2026-10-09  

---

## 1. Mobilized Skills Overview

For this mission, Agent Beta has mobilized two primary engineering and design skills from `.agents/skills/`:

### 1.1 `storefront-best-practices` (`.agents/skills/storefront-best-practices/SKILL.md`)
- **Justification:** Central to implementing zero-flicker e-commerce micro-copy across cart, checkout, order confirmation, dish cards, and product modals.
- **Rules Applied:**
  - **Zero-Flicker Fallback Invariant:** Every `t(key, fallback)` call provides a default character-for-character identical to the production string, avoiding CLS (Cumulative Layout Shift) or text blanking while settings load.
  - **Context-Aware Dynamic Localization:** Consistent string extraction patterns preserving dynamic string interpolations (e.g., currency, serving counts, item units).
  - **E-Commerce Conversion Hygiene:** Clarity on critical friction points: phone helper notes, district delivery assurances, clear sold-out badges, and transparent COD / bank transfer descriptions.

### 1.2 `tailwind-design-system` (`.agents/skills/tailwind-design-system/SKILL.md`)
- **Justification:** Essential for the reorganization and styling of the 7 advanced micro-copy CMS groups in `SiteContentModule.tsx`.
- **Rules Applied:**
  - **Token Consistency:** Adherence to Hashousha luxury design tokens (warm bronze `primary`, warm ivory `bg`, linen warm card surfaces, and dark roast typography).
  - **Interactive Search Highlighting:** Styling matched search query inputs with prominent gold accent rings (`ring-2 ring-primary/40 border-primary bg-primary/5`).
  - **Responsive Layouts:** Graceful stacking across mobile screens, iPads, and desktop displays for the 66 configurable input fields.

---

## 2. Target Component Integration Matrix

| Skill | Target File | Specific Directives Mobilized |
| :--- | :--- | :--- |
| `storefront-best-practices` | `src/types/admin.ts` | Central registry expansion to 66 micro-copy keys with default Arabic values. |
| `tailwind-design-system` | `src/components/admin/modules/SiteContentModule.tsx` | Structuring 7 advanced groups, deep search matching, auto-expansion, and highlight rings. |
| `storefront-best-practices` | `src/components/checkout/CustomerForm.tsx` | Binding 4 customer recipient & delivery strings. |
| `storefront-best-practices` | `src/components/checkout/PaymentSelector.tsx` | Binding 1 payment header string. |
| `storefront-best-practices` | `src/components/checkout/OrderSuccessModal.tsx` | Binding 11 celebratory and receipt confirmation strings. |
| `storefront-best-practices` | `src/components/storefront/v0/DishCard.tsx` | Binding 3 quick catalog action and sold-out strings. |
| `storefront-best-practices` | `src/components/storefront/v0/ProductDetailModal.tsx` | Binding 8 hospitality story and quality highlight strings. |
| `storefront-best-practices` | `src/components/storefront/v0/ProductLandingPage.tsx` | Binding 11 standalone landing page and Riyadh review strings. |

---

## 3. Protocol Declaration

Agent Beta certifies that:
1. All changes will be executed cleanly without introducing breaking changes or type mismatches.
2. Full build verification (`npm run build`) will be conducted prior to Phase D sign-off.
3. Every operation will be logged in `tasks/TASK-020-full-storefront-micro-copy-democratization/EXECUTION.log`.
