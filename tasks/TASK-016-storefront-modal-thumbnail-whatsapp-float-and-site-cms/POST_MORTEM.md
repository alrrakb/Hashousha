# Phase D: Post-Mortem & Architecture Decisions (ADR) — TASK-016

> **Task ID:** `TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms`  
> **Lifecycle Phase:** Phase D (Post-Mortem, ADR & Verification Checklist)  
> **Author:** Agent Beta (Senior Full-Stack Implementer)  
> **Architectural Sign-off:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Status:** ✅ VERIFIED & COMPLETED  
> **Timestamp:** 2026-10-09T06:38:00+03:00  

---

## 1. Architectural Decisions & Discoveries (ADR)

### ADR-016.1: Product Modal Ergonomic Header Lockup
- **Context:** Previously, opening a dish in `ProductDetailModal` presented an oversized full-width photography banner (`aspect-[16/10]`), forcing all product descriptions, pricing, and serving info far down the viewport.
- **Decision:** Replaced the banner with a compact square thumbnail lockup (`size-24 sm:size-32`) integrated directly alongside the English title, Arabic name, price, portion info, and badges, while cleanly positioning close and share actions in the header corner.
- **Outcome:** The product modal is compact, instant to read, and immediately presents the culinary story above the fold.

### ADR-016.2: Authentic Floating WhatsApp Concierge with Viewport Clearance
- **Context:** Customers need direct concierge communication for custom gathering orders and Riyadh delivery inquiries. However, floating action buttons frequently overlap with the sticky cart `OrderBar` on mobile screens.
- **Decision:** Placed `FloatingWhatsApp` at `bottom-24 sm:bottom-6 left-4 sm:left-6` with an authentic, official WhatsApp brand SVG vector path and ambient pulsing ring.
- **Outcome:** Zero occlusion with the sticky order bar on mobile devices, immediate recognition via the official WhatsApp icon, and instant click-to-chat with `966560602341`.

### ADR-016.3: Two-Tier Headless CMS Architecture (`public.site_content`)
- **Context:** The boutique previously hardcoded certain hero copy and images, requiring engineering intervention for simple marketing adjustments.
- **Decision:** Built `SiteContentModule` divided into:
  1. **Media & Brand Assets:** Hero banner, logo, favicon, and OG social share image with Supabase Storage integration and live aspect ratio previews.
  2. **Storefront Copywriting:** Smart real-time search toolbar filtering across hero titles, the 4 brand pillars, and footer guarantees.
- **Outcome:** Full operational autonomy for the merchant team with real-time storefront reflection.

---

## 2. Verification Checklist

| Criterion | Target | Verification Result |
| :--- | :--- | :--- |
| **Product Detail Modal** | Square thumbnail lockup next to title & price | ✅ Verified in `ProductDetailModal.tsx` |
| **Floating WhatsApp** | Official WhatsApp SVG icon + ambient glow | ✅ Verified in `FloatingWhatsApp.tsx` |
| **Viewport Clearance** | Elevated `bottom-24` above sticky `OrderBar` on mobile | ✅ Verified in `FloatingWhatsApp.tsx` |
| **Site Content CMS** | Media uploads + Copywriting with instant search | ✅ Verified in `SiteContentModule.tsx` |
| **Sidebar & Routing** | Accessible in Merchant Center sidebar | ✅ Verified in `MerchantSidebar.tsx` & `MerchantCenter.tsx` |
| **Supabase Sync** | CRUD against `public.site_content` | ✅ Verified in `adminService.ts` |
| **Type Safety** | TypeScript compiler clean | ✅ `npx tsc --noEmit` exited code 0 |
| **Production Build** | Clean production bundle | ✅ `npm run build` exited code 0 in 17.81s |
| **Dev Server Status** | Local dev server responsive | ✅ Active on `http://localhost:5174/` |

---

## 3. Governance Sign-off
- **Implementer:** Agent Beta (Senior Full-Stack Implementer) ✅
- **Architectural Review:** Agent Alpha (Lead Software Architect & Creative Director) ✅
- **Task Status:** Completed and archived in `tasks/INDEX.md`.
