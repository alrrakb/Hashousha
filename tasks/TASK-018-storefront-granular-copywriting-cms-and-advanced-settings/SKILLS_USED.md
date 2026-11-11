# Phase B: Mobilized Skills & Architectural Standards — TASK-018

> **Task ID:** `TASK-018-storefront-granular-copywriting-cms-and-advanced-settings`  
> **Phase:** Phase B (Skills Mobilization)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Reviewed By:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Date:** 2026-10-09  

---

## 1. Mobilized Autonomous Skills

In accordance with the **Mandatory Just-In-Time Skill Acquisition Protocol** defined in `AGENT_RULES.md`, Agent Beta mobilizes the following four specialized domain skills:

### 1.1 `storefront-best-practices` (`.agents/skills/storefront-best-practices/`)
- **Focus Area:** Reference `reference/layouts/checkout.md` and `reference/design.md`.
- **Application:**
  - Standardizing form field labels, assistive hints, and placeholders across the native checkout modal.
  - Ensuring zero UI shift / flicker during dynamic string hydration from Supabase.
  - Bulletproof fallback resilience: if any dynamic string key is missing, empty, or undefined in the database, the storefront gracefully presents the luxury Arabic default.

### 1.2 `tailwind-design-system` (`.agents/skills/tailwind-design-system/`)
- **Focus Area:** Design tokens, micro-borders, collapsible accordions, and dark mode harmonization.
- **Application:**
  - Designing the "الإعدادات المتقدمة" collapsible card with warm linen surfaces (`bg-[#FDFBF7]`), delicate borders (`border-primary/20`), smooth chevron rotation transitions, and gold badges.
  - Dynamic focus styling for search matches (`border-primary ring-2 ring-primary/20 bg-amber-500/5`).
  - Dark mode support using established `.dark` tokens (`Dark Espresso #17110B`, `Warm Cocoa #231B14`, and `Luminous Bronze #C29567`).

### 1.3 `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)
- **Focus Area:** Reactive state architecture, context optimization, and performance.
- **Application:**
  - Implementing `SiteContentContext.tsx` with memoized `t(key, fallback)` translation hook.
  - Preventing redundant re-renders of checkout modals or heavy menu sections when micro-copy is fetched.
  - Debounced search query matching across the nested micro-copy structure in `SiteContentModule.tsx`.

### 1.4 `design-mobile-apps` (`.agents/skills/design-mobile-apps/`)
- **Focus Area:** Mobile ergonomics and touch-target accessibility.
- **Application:**
  - Ensuring the accordion trigger has a generous touch area (`min-h-[48px]`).
  - Keeping form labels and input fields legible without horizontal overflow on small mobile viewports (375px+).

---

## 2. Architectural Documents & Standards Consulted
- `AGENT_RULES.md`: Invariants regarding Arabic-First (RTL), token sovereignty, and state centralization.
- `tasks/TASK-018-storefront-granular-copywriting-cms-and-advanced-settings/SPEC.md`: Authoritative specification authored by Agent Alpha.
- `src/types/admin.ts`: Source of truth for `SiteContentSettings` and `DEFAULT_UI_STRINGS`.
