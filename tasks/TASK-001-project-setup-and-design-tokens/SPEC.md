# TASK-001 SPECIFICATION: Project Setup & Design Token Foundation

> **Task ID:** `TASK-001-project-setup-and-design-tokens`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 1  

---

## 1. Executive Summary & Objective

The objective of this task is to scaffold the production foundation for the **Hashousha (هشوشة)** food e-commerce application. 

Agent Beta will establish a clean Vite + React 18+ + TypeScript environment, wire Tailwind CSS with the gourmet design tokens specified in `docs/DESIGN_SYSTEM.md`, configure native Arabic RTL typography (`Cairo` & `Readex Pro`), integrate foundational core dependencies (`lucide-react`, `zustand`, `framer-motion`), establish the root layout and luxury header, and verify a zero-warning, zero-error production build.

---

## 2. Technical Invariants & Guardrails

1. **Token Strictness:** Colors in `tailwind.config.js` must match the exact hex codes in `docs/DESIGN_SYSTEM.md`. No arbitrary inline hex codes in JSX.
2. **Arabic RTL Native:** `index.html` must declare `dir="rtl"` and `lang="ar"`. Layouts, paddings, and header icon orientations must default to RTL.
3. **TypeScript Strictness:** Strict mode enabled in `tsconfig.json`. No `any` types in newly declared contracts.
4. **Zero Build Warning:** `npm run build` must output cleanly to `dist/` with no unresolved imports or broken CSS directives.

---

## 3. Impacted Files & Architecture Touchpoints

| File Path | Action | Description |
|:---|:---:|:---|
| `package.json` | CREATE | Package scripts and core/dev dependencies |
| `vite.config.ts` | CREATE | Vite configuration with `@vitejs/plugin-react` and path alias `@` |
| `tsconfig.json` | CREATE | TypeScript config with path aliases and DOM libs |
| `tsconfig.node.json` | CREATE | TypeScript config for Vite configuration files |
| `tailwind.config.js` | CREATE | Custom design tokens: Olive, Pomegranate, Honey, Surfaces, Shadows |
| `postcss.config.js` | CREATE | PostCSS configuration for Tailwind and Autoprefixer |
| `index.html` | CREATE | Native Arabic document shell, Google Fonts links, viewport |
| `src/index.css` | CREATE | Tailwind layers, font family declarations, RTL base styling |
| `src/types/index.ts` | CREATE | Export barrel for all core domain types |
| `src/types/product.ts` | CREATE | Category, Product, OptionGroup, OptionChoice contracts |
| `src/types/cart.ts` | CREATE | CartItem, SelectedChoiceRef, CartSummary contracts |
| `src/types/store.ts` | CREATE | StoreSettings, CustomerOrderInfo contracts |
| `src/constants/theme.ts` | CREATE | Exported JS color constants for dynamic styles |
| `src/components/layout/Header.tsx` | CREATE | Luxury header with logo, open badge, contact link, cart trigger |
| `src/App.tsx` | CREATE | App shell showcasing header and design system token validation board |
| `src/main.tsx` | CREATE | React DOM mount entrypoint |
| `tasks/TASK-001-project-setup-and-design-tokens/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills and docs |
| `tasks/TASK-001-project-setup-and-design-tokens/EXECUTION.log` | CREATE (Beta) | Real-time CLI logs and verification traces |
| `tasks/TASK-001-project-setup-and-design-tokens/POST_MORTEM.md` | CREATE (Beta) | Post-implementation ADR and verification confirmation |

---

## 4. Required Package Manifest

### Core Dependencies:
- `react`: `^18.3.1`
- `react-dom`: `^18.3.1`
- `lucide-react`: `^0.446.0` (or latest)
- `zustand`: `^4.5.5` (or latest)
- `framer-motion`: `^11.5.4` (or latest)
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^2.5.2`

### Dev Dependencies:
- `vite`: `^5.4.6`
- `@vitejs/plugin-react`: `^4.3.1`
- `typescript`: `^5.5.4`
- `@types/react`: `^18.3.5`
- `@types/react-dom`: `^18.3.0`
- `tailwindcss`: `^3.4.11`
- `postcss`: `^8.4.47`
- `autoprefixer`: `^10.4.20`

---

## 5. Detailed Implementation Instructions for Agent Beta

### 5.1 Project Scaffolding
- Create `package.json` with scripts:
  - `"dev": "vite"`
  - `"build": "tsc && vite build"`
  - `"preview": "vite preview"`
- Configure `vite.config.ts` with React plugin and resolve alias `@` pointing to `src`.

### 5.2 Tailwind Configuration (`tailwind.config.js`)
Wire all tokens defined in `docs/DESIGN_SYSTEM.md`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#F3F8F4',
          100: '#E3EFE6',
          200: '#C8DFCD',
          500: '#528D63',
          700: '#2D5E3B',
          800: '#21492E',
          900: '#173420',
          950: '#0E2214',
        },
        pomegranate: {
          50: '#FDF2F4',
          100: '#FCE4E8',
          500: '#DC2643',
          600: '#BE1835',
          700: '#9B132B',
          900: '#580B19',
        },
        honey: {
          50: '#FEF9EE',
          100: '#FDF0D4',
          500: '#E59B18',
          600: '#C47D0B',
          800: '#784B07',
        },
        surface: {
          warm: '#FDFBF7',
          card: '#FFFFFF',
          muted: '#F7F4EC',
          border: '#EAE4D7',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Readex Pro', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'system-ui', 'sans-serif'],
        body: ['Readex Pro', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gourmet-sm': '0 2px 8px -2px rgba(45, 30, 15, 0.06)',
        'gourmet-md': '0 6px 18px -4px rgba(45, 30, 15, 0.08), 0 2px 6px -1px rgba(45, 30, 15, 0.04)',
        'gourmet-lg': '0 12px 32px -6px rgba(45, 30, 15, 0.12), 0 4px 12px -2px rgba(45, 30, 15, 0.06)',
        'gourmet-float': '0 20px 48px -8px rgba(45, 30, 15, 0.18)',
      },
    },
  },
  plugins: [],
}
```

### 5.3 Arabic Typography & HTML Shell (`index.html`)
- Must contain:
  - `<html lang="ar" dir="rtl">`
  - Meta tags for viewport and culinary mobile experience.
  - Title: `هشوشة | محاشي وحلويات فاخرة`
  - Preconnected Google Fonts links for `Cairo` (weights 400, 600, 700, 800, 900) and `Readex Pro` (weights 400, 500, 600, 700).

### 5.4 Luxury Header Component (`src/components/layout/Header.tsx`)
- Sticky top bar with glassmorphism blur backdrop (`backdrop-blur-md bg-surface-warm/95 border-b border-surface-border`).
- Right (in RTL): Brand identity block featuring:
  - Decorative emblem / culinary icon (Grape leaf icon or stylized Pot/Bowl).
  - Brand Name: `هشوشة` in bold Cairo font.
  - Subtitle: `محاشي فاخرة & حلويات` in muted Readex Pro.
- Center / Sub-badge: "🟢 نستقبل طلباتكم الآن (توصيل طازج)".
- Left (in RTL): Cart trigger button with badge counter placeholder and WhatsApp direct support link.

### 5.5 Design Token Verification Screen (`src/App.tsx`)
- Render the `Header`.
- Render a luxurious verification hero welcoming customers with authentic Arabic hospitality.
- Render color token swatches and sample interactive elements (sample dish badge, sample CTA button with pomegranate glow, sample price pill) confirming that all design tokens are working seamlessly in the browser.

---

## 6. Acceptance Criteria (Verification Checklist)

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `package.json` contains all required dependencies with accurate scripts.
- [ ] Dependencies install cleanly via `npm install` with zero unresolved peer dependency conflicts.
- [ ] `index.html` has `dir="rtl"` and `lang="ar"` with Google Fonts Cairo & Readex Pro loaded.
- [ ] `tailwind.config.js` and `postcss.config.js` are properly wired with `olive`, `pomegranate`, `honey`, `surface` colors and `gourmet` shadow tokens.
- [ ] Core TypeScript data models (`types/product.ts`, `types/cart.ts`, `types/store.ts`) match `docs/SYSTEM_ARCHITECTURE.md`.
- [ ] Header component renders with authentic Arabic typography and responsive layout.
- [ ] `App.tsx` renders a design token verification board demonstrating colors, typography, badges, and buttons.
- [ ] `npm run build` runs through TypeScript checks and compiles cleanly with 0 errors.
- [ ] Phase B (`SKILLS_USED.md`), Phase C (`EXECUTION.log`), and Phase D (`POST_MORTEM.md`) are populated in `tasks/TASK-001-project-setup-and-design-tokens/`.
- [ ] `tasks/INDEX.md` is updated upon completion.
