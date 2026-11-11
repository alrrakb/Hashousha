# SKILLS USED — TASK-012: Rich Product Page, Culinary Showcase & Interactive Conversion Engine

> **Task ID:** `TASK-012-rich-product-page-and-interactive-showcase`  
> **Phase:** Phase B (Skills Mobilization)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-05  

---

## 1. Mobilized Skills Matrix

| Skill Name | Source Path | Core Principles Applied to TASK-012 |
|:---|:---|:---|
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices/` | • Implementation of Product Detail Page (PDP) hierarchy.<br>• Non-disruptive upsells ("يكمل جمعتكم") allowing 1-click cart additions without leaving the page.<br>• Social proof & local market trust signals (Riyadh verified buyers, 4.9 rating summary).<br>• Serving capacity indicators to answer high-ticket banquet decision questions.<br>• Mobile-responsive sticky action areas & zero UI emojis (strict Lucide geometric icons). |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/` | • Adherence to brand tokens: `#FAF7F2` (Ivory bg), `#FDFBF7` (Linen card), `#9E774C` (Bronze Gold), `#931F2D` (Pomegranate accent), `#2E1E0D` (Roasting text).<br>• High-contrast borders (`border-primary/20`), elegant rounded corners (`rounded-3xl`, `rounded-2xl`).<br>• Responsive flex/grid layouts with consistent typography hierarchies. |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps/` | • Mobile-first ergonomics with touch targets $\ge 44\text{px}$.<br>• Compact expandable accordions for secret recipes and serving guides in mobile viewport.<br>• Safe scrolling in dialog modals (`max-h-[92vh] overflow-y-auto`) with fixed action bars. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/` | • Clean state management with React hooks and memoized data filtering for related dishes.<br>• Optimistic UI updates with instant cart count and quantity reflects.<br>• Clean schema injection and unmount cleanup for JSON-LD rich snippets. |

---

## 2. Technical Strategy & Implementation Directives

1. **Type Contract Expansion (`src/types/menu.ts`)**:
   - Add `longDescription?: string`
   - Add `servingInfo?: string`

2. **Data & Cloud Hydration (`src/data/menu.ts` & `src/services/adminService.ts`)**:
   - Populate high-craft storytelling and banquet metrics for all dishes.
   - Map `long_description` and `serving_info` into Supabase cloud sync operations.

3. **Standalone Product Showcase (`ProductLandingPage.tsx`)**:
   - Integrate serving capacity pill (`Users` icon) next to price & unit.
   - Insert rich narrative box for secret culinary heritage & hotel-grade presentation tip.
   - Replace generic cards with 4 Royal Hospitality Guarantees (`طازج يومياً`, `توصيل مجهز ومبرد`, `تغليف الضيافة والإهداء`, `ضمان الذائقة الفاخرة`).
   - Add Riyadh Verified Reviews section (4.9 rating summary + 3 verified reviews from Al-Narjis, Hittin, and Al-Malqa).
   - Add "يكمل جمعتكم" related dishes with instant 1-tap `add(dish.id)`.

4. **In-Store Quick-View Modal (`ProductDetailModal.tsx`)**:
   - Add serving capacity badge (`Users` icon).
   - Add rich long description section (`سر النكهة والتحضير الفاخر 🌿`) and serving tips.
   - Ensure clean vertical scrolling and sticky actions.

5. **Merchant Center Management (`ProductEditModal.tsx`)**:
   - Add fields for `servingInfo` and `longDescription` to allow merchant updates.
