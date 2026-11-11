# Skills Mobilized: TASK-022 — SEO Persistence, Supabase RLS Fix & Storefront Dynamic Head Sync

> **Task ID:** `TASK-022-seo-persistence-rls-and-storefront-dynamic-head`  
> **Milestone:** Milestone 18 — SEO Persistence & Head Metadata Synchronization  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-11  

---

## 1. Primary Skills Mobilized

### A. `storefront-best-practices` (`.agents/skills/storefront-best-practices/`)
- **Pillar Applied:** E-commerce SEO Architecture (`reference/seo.md`), Crawl-Friendly Metadata, OpenGraph & Social Cards, Dynamic Storefront Title Updates.
- **Key Rules Enforced:**
  - Crawlers inspect static HTML without executing React JS; `index.html` MUST contain valid, rich OpenGraph (`og:title`, `og:description`, `og:image`, `og:type`, `og:locale`) and Twitter card tags.
  - Social media previews (WhatsApp, Twitter/X, Facebook, LinkedIn) must render the luxury Artisanal Babka brand imagery and Arabic copy without stale legacy mentions.
  - Dynamic route considerations: Storefront root (`/`) dynamically syncs metadata from the CMS database, while dedicated dish routes (`/dish/:slug`) maintain their individual rich dish metadata without collision.

### B. `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)
- **Pillar Applied:** Client-Side Head Synchronization & Performance Optimization.
- **Key Rules Enforced:**
  - Lightweight React hook (`useStorefrontSeo`) with cached fallback and zero-flicker head injection.
  - Event listeners on window focus and storage sync to instantly react to merchant changes without expensive re-renders or page refreshes.
  - Zero TypeScript errors and clean production bundle verification (`npm run build`).

---

## 2. Infrastructure & Tools Mobilized

- **`supabase` MCP (`execute_sql`):** Direct database execution to configure RLS security policies on table `public.seo_settings` and seed default record `default_seo`.
- **Node.js / tsx:** Direct verification scripts to validate database reads, writes, and RLS integrity across anon/authenticated clients.

---

## 3. Readiness Declaration

Agent Beta has inspected the technical specification in `SPEC.md`, confirmed the architectural plan, and initialized Phase B. Proceeding to **Phase C Execution**.
