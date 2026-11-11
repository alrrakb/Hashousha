# HASHOUSHA (هشوشة) — Project State & Context Ledger

> **Purpose:** Single source of persistent memory buffer preventing context loss across agent sessions.  
> **Last Synced:** 2026-09-26  
> **Current Version:** v0.2.0-alpha  
> **Active Milestone:** Milestone 1 — Foundation, Reverse-Engineering & Core Storefront  

---

## 1. Project Overview & Commercial Identity

- **Brand:** Hashousha (هشوشة للمحاشي والحلويات الفاخرة)
- **Legacy Heritage:** Evolved from "سر اللفة" (Sirr Al-Laffa) / "Hana Store".
- **Primary Market:** Riyadh, Kingdom of Saudi Arabia (الرياض، المملكة العربية السعودية).
- **Primary Order WhatsApp Channel:** `+966 56 060 2341` (`966560602341`).
- **Core Specialties:**
  1. Stuffed Vine Leaves with Pomegranate Molasses (ورق عنب بدبس الرمان والليمون)
  2. Melt-in-mouth Cabbage Rolls with Cumin & Garlic Sauce (ملفوف دايب بالكمون والثوم)
  3. Mixed Savory Platters & Appetizer Boxes (صواني وبوكسات مشكلة للجمعات)
  4. Luxury Artisanal Desserts & Sweets (كوكيز فاخر، أم علي بالمكسرات، بسبوسة ملكية)
- **Order Model:** Direct WhatsApp Dispatch with structured, human-readable Arabic order manifest (no payment processor friction in v1).

---

## 2. Milestone Roadmap & Progress Status

```
[Phase 0: Governance & Architecture] ──────────────────────────► [100% COMPLETE]
[TASK-001: Project Setup & Tokens] ────────────────────────────► [100% COMPLETE]
[TASK-002: Legacy Reverse-Engineering & Skills Engine] ────────► [100% COMPLETE]
[TASK-003: Customer Storefront & Catalog] ─────────────────────► [READY FOR BETA]
[TASK-004: Product Customization Engine Modal] ────────────────► [QUEUED]
[TASK-005: Cart Drawer & Local Persistence] ──────────────────► [QUEUED]
[TASK-006: WhatsApp Payload Engine & Checkout] ────────────────► [QUEUED]
[TASK-007: Merchant Admin Dashboard] ──────────────────────────► [QUEUED]
```

### Feature Inventory:
| Feature / Subsystem | Status | Assigned Task | Notes |
|:---|:---:|:---:|:---|
| Governance Constitution (`AGENT_RULES.md`) | ✅ Complete | - | Dual-Agent Protocol active with Just-In-Time Skill Acquisition |
| System Architecture Specification (`SYSTEM_ARCHITECTURE.md`) | ✅ Complete | - | Data contracts & schemas locked |
| Food & Appetizing Design System (`DESIGN_SYSTEM.md`) | ✅ Complete | - | Warm Olive, Pomegranate, Ivory palette |
| Master Task Ledger (`tasks/INDEX.md`) | ✅ Complete | - | Task index synchronized |
| Project Scaffolding & Tailwind Custom Tokens | ✅ Complete | `TASK-001` | React 18 + Vite + Tailwind configured |
| Legacy Reverse-Engineering & Audit | ✅ Complete | `TASK-002` | Audited `old_store/`, extracted dishes, documented in `LEGACY_SYSTEM_AUDIT.md` |
| Autonomous Skills Engine Portfolio | ✅ Complete | `TASK-002` | Installed 4 audited community skills in `.agents/skills/` |
| Customer Storefront & Category Catalog | 🟡 In-Progress | `TASK-003` | Phase A Spec issued to Agent Beta |
| Dish Customization Modal (Sizes, Spiciness, Add-ons) | ⚪ Queued | `TASK-004` | Dynamic price calculation |
| Cart Slide-Over Drawer & Sticky Checkout Bar | ⚪ Queued | `TASK-005` | LocalStorage hydration |
| Formatted WhatsApp Order Payload Generator | ⚪ Queued | `TASK-006` | Formatted Arabic text with emojis |
| Admin Inventory & Settings Management Dashboard | ⚪ Queued | `TASK-007` | In-stock toggle, pricing, phone update |

---

## 3. Locked Architectural Decisions (ADR Register)

| Decision ID | Area | Decision Summary | Rationale |
|:---|:---|:---|:---|
| **ADR-001** | Frontend Core | **React 18 + Vite + TypeScript** | Instant HMR, lightweight bundle, strict type safety for product options and order payloads. |
| **ADR-002** | Styling | **Tailwind CSS + Custom Luxury Food Palette** | Rapid responsive design with zero CSS runtime penalty; tokens tailored for culinary warmth (`olive`, `pomegranate`, `honey`, `surface-warm`). |
| **ADR-003** | State Management | **Zustand with `persist` middleware** | Minimal boilerplate, effortless hooks, persistent local storage cart out of the box without complex Redux machinery. |
| **ADR-004** | Fulfillment Flow | **Direct WhatsApp Ordering URL Engine** | In target market (MENA/GCC/Egypt), WhatsApp ordering converts 4x higher than multi-step credit card gateways for homemade/artisan food. |
| **ADR-005** | Internationalization | **Native Arabic RTL Default (`dir="rtl"`)** | First-class Arabic typographic flow, Cairo/Readex Pro font rendering, and culturally authentic food terminology. |
| **ADR-006** | UI Motion | **Framer Motion + Lucide Icons** | Micro-interactions when adding dishes to cart, opening modal trays, and toggling categories. |
| **ADR-007** | Governance | **Autonomous Just-In-Time Skill Acquisition** | Mandates Phase B discovery & installation of audited agent skills into `.agents/skills/` to guarantee top-tier code quality. |
| **ADR-008** | Data Resiliency | **Self-Contained Local Seed Architecture** | Decouples storefront from fragile external MongoDB/Express backends; operates 100% reliably client-side with offline local persistence. |

---

## 4. Current Blockers & Active Directives

- **Active Blocker:** None.
- **Active Directive:** Agent Beta is cleared to execute `TASK-003` adhering to `tasks/TASK-003-customer-storefront-and-catalog/SPEC.md`, mobilizing the 4 installed skills in `.agents/skills/`.
