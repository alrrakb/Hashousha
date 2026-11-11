# Architectural Post-Mortem: TASK-024 — Storefront Theme Color Engine & Admin Palette Customizer

> **Task ID:** `TASK-024-storefront-theme-color-engine-and-admin-palette-customizer`  
> **Milestone:** Milestone 20 — Storefront Theme Color Engine & Admin Palette Customizer  
> **Authority:** Agent Beta (Senior Full-Stack Implementer) & Agent Alpha (Lead Software Architect)  
> **Sign-Off Date:** 2026-10-12T19:57:00+03:00  
> **Status:** ✅ `Completed`  

---

## 1. Executive Summary & Impact

TASK-024 delivers a comprehensive, real-time storefront theme and palette customization system for Hashousha (هشوشة). Store managers now possess granular, visual control over both Light Mode and Dark Mode palettes directly from the Admin Dashboard under "إدارة المظهر والمحتوى", backed by cloud persistence in Supabase PostgreSQL and instant DOM stylesheet injection.

Crucially, the default Dark Mode baseline has been elevated from a cold dark espresso tone into a warm, royal honey-roasted amber noir (`#1a120b`) that harmonizes with the luxury gold foil embossed brand emblem.

---

## 2. Architectural Decisions (ADRs)

### ADR-024-01: Dynamic CSS Variable Injection Engine via `<style>`
- **Context:** Tailwind CSS compiles at build time. To allow merchants to change store colors dynamically at runtime without rebuilds or costly CSS-in-JS runtimes, colors must map to CSS variables.
- **Decision:** Implement a reactive injector inside `SiteContentContext.tsx` that maintains a `<style id="hashousha-custom-theme-vars">` node targeting `:root` (Light Mode) and `.dark` (Dark Mode).
- **Consequence:** All existing Tailwind utility classes (`bg-background`, `text-foreground`, `bg-card`, `text-primary`, `border-border`) instantly reflect color changes with zero layout shift, zero re-render overhead, and zero page reload requirement.

### ADR-024-02: Honey-Roasted Amber Noir (`#1a120b`) Dark Mode Alignment
- **Context:** The previous dark mode background was `#17110b`. The brand's official emblem features warm honey gold typography on rich dark cocoa and amber.
- **Decision:** Standardized the dark mode baseline:
  - `--background`: `#1a120b` (Deep honey-roasted amber noir)
  - `--card`: `#241a12` (Dark chocolate honey card)
  - `--primary`: `#c29567` (Warm honey gold)
  - `--border`: `#3d2c1e`
- **Consequence:** Visual unity between the floating brand emblem, social sharing preview cards, and the actual storefront experience.

### ADR-024-03: Cloud Schema Persistence via JSONB
- **Context:** Palette customization involves multiple color values across two modes (light and dark). Flattening them into individual SQL columns would clutter the schema and make future extensions cumbersome.
- **Decision:** Added a `theme_colors JSONB` column to table `public.site_content`.
- **Consequence:** Clean serialization of the `StoreThemeColors` interface with strong typing in TypeScript and flexible backwards-compatible fallback to `DEFAULT_THEME_COLORS`.

### ADR-024-04: Tripartite Admin UX Architecture
- **Context:** Merchants range from non-technical owners desiring 1-click curated themes to design-conscious operators who demand exact hex-level precision.
- **Decision:** Built a tripartite interface in `SiteContentModule.tsx`:
  1. **1-Click Curated Presets:** Royal Honey Linen (شعار هشوشة), Golden Caramel & Espresso, and Artisanal Bakes Classic.
  2. **Granular Visual & Hex Pickers:** Tabbed between Light & Dark modes for Background, Card, Primary Accent, Text, and Border.
  3. **Live Interactive Mini-Card Preview:** An inline mockup displaying a mini babka card, price, and CTA with an instant light/dark preview toggle.
- **Consequence:** Exceptional usability, immediate visual confidence, and zero guesswork for the merchant.

---

## 3. Discoveries & Mitigations

1. **Multi-Component Reactivity without Full Page Refresh:**
   - *Discovery:* When a merchant saves theme colors in `SiteContentModule`, the storefront context needed to update immediately without forcing a page reload.
   - *Mitigation:* Dispatched a `hashousha_content_updated` CustomEvent on `window`. `SiteContentContext` listens to this event and instantly injects the updated CSS variables into the DOM.
2. **Color Picker and Hex Input Bidirectional Sync:**
   - *Discovery:* Hex inputs require uppercase normalization and `#` formatting, while `<input type="color">` strictly requires 7-character `#rrggbb` hex codes.
   - *Mitigation:* Implemented safe bidirectional handlers that update both the visual swatch and the text input seamlessly.

---

## 4. Verification & Quality Gates

| Verification Check | Target | Actual Result | Status |
|:---|:---:|:---:|:---:|
| Supabase `site_content.theme_colors` column | JSONB column present | Verified via `information_schema.columns` | ✅ Pass |
| Supabase `theme_colors` Read/Write | Live persistence | Verified via `test-theme-colors.ts` (`#1a120b`) | ✅ Pass |
| 3 Curated Luxury Presets | 1-Click apply | Implemented in `THEME_PRESETS` & UI | ✅ Pass |
| Granular Color Pickers (Light & Dark) | 5 semantic tokens | Background, Card, Primary, Text, Border | ✅ Pass |
| Live Interactive Mini-Preview | Reacts to color changes | Real-time preview with Light/Dark toggle | ✅ Pass |
| Reset to Defaults Button | Restores `DEFAULT_THEME_COLORS` | Implemented with `RotateCcw` button | ✅ Pass |
| Production Build (`npm run build`) | Exit Code 0, 0 TS errors | Built in 16.55s, 2033 modules, Exit Code 0 | ✅ Pass |

---

## 5. Artifacts Created & Modified

1. `tasks/TASK-024-storefront-theme-color-engine-and-admin-palette-customizer/SPEC.md`
2. `tasks/TASK-024-storefront-theme-color-engine-and-admin-palette-customizer/SKILLS_USED.md`
3. `tasks/TASK-024-storefront-theme-color-engine-and-admin-palette-customizer/EXECUTION.log`
4. `tasks/TASK-024-storefront-theme-color-engine-and-admin-palette-customizer/POST_MORTEM.md`
5. `supabase/migrations/20261012_theme_colors.sql`
6. `scripts/test-theme-colors.ts`
7. `src/types/admin.ts` (modified)
8. `src/services/adminService.ts` (modified)
9. `src/index.css` (modified)
10. `src/context/SiteContentContext.tsx` (modified)
11. `src/components/admin/modules/SiteContentModule.tsx` (modified)
12. `tasks/INDEX.md` (updated)
