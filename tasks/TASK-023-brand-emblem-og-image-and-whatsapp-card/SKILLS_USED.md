# Skills Mobilized: TASK-023 — Official Luxury Brand Emblem Social OG & WhatsApp Card Integration

> **Task ID:** `TASK-023-brand-emblem-og-image-and-whatsapp-card`  
> **Milestone:** Milestone 19 — Brand Emblem Social OG & WhatsApp Card Integration  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-11  

---

## 1. Primary Skills Mobilized

### A. `storefront-best-practices` (`.agents/skills/storefront-best-practices/`)
- **Pillar Applied:** E-commerce Social Previews, WhatsApp Link Preview Optimization, Asset Optimization, and Open Graph Standards.
- **Key Rules Enforced:**
  - **WhatsApp Strict Thumbnail Constraints:** WhatsApp scraper caps link preview images strictly at 300 KB, with optimal square dimensions at 1024x1024 or 1200x630. Images exceeding 300 KB fail to render preview cards on mobile WhatsApp.
  - **Primary Brand Asset:** The luxury gold foil embossed emblem ("هشوشة — HASHOUSHA — SWEET & SAVORY BAKES" on warm linen canvas) is confirmed as the official brand flagship image (`public/images/brand-og.jpg`, 72.7 KB, 1024x1024).
  - **Static & Dynamic Alignment:** Both raw static HTML (`index.html`), client defaults (`DEFAULT_SEO_SETTINGS.ogImage`), and database persistence (`public.seo_settings`) must align synchronously to prevent crawler and client desynchronization.
  - **Aggressive Edge Cache Busting:** Document the query parameter strategy (`?v=brand`) to bust WhatsApp edge caches upon deployment.

### B. `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)
- **Pillar Applied:** Asset Delivery, Zero-Flicker Head Management, Production Build Quality.
- **Key Rules Enforced:**
  - Asset caching via public directory (`/images/brand-og.jpg`).
  - Safe default constants in `src/services/adminService.ts` for instant fallback before network resolution.
  - Clean TypeScript compilation without regressions (`npm run build` exit code 0).

---

## 2. Infrastructure & Tools Mobilized

- **`supabase` MCP (`execute_sql`):** Update live `seo_settings` rows (`default_seo`, `global`) in cloud PostgreSQL project `oulzpjcmnxvvrpdyfpcg`.
- **Node.js / tsx verification:** Run audit script to guarantee live rows reflect `/images/brand-og.jpg`.
- **Vite & TypeScript compiler:** Complete production verification.

---

## 3. Readiness Declaration

Agent Beta has inspected the technical specification in `SPEC.md`, verified the asset requirements, and completed Phase B initialization. Proceeding to **Phase C Execution**.
