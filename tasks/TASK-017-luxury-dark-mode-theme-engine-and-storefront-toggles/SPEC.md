# Specification: TASK-017 — Luxury Dark Mode Theme Engine & Storefront Toggles

> **Task ID:** `TASK-017-luxury-dark-mode-theme-engine-and-storefront-toggles`  
> **Milestone:** Milestone 13 — Luxury Dark Mode Theme Engine & Storefront Toggles  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Status:** 🟡 `In-Progress (Phase A Approved)`  
> **Created:** 2026-10-09T06:40:00+03:00  

---

## 1. Executive Summary & Founder Mandate

As part of the continuous evolution of **HASHOUSHA (هشوشة)** into a world-class luxury artisanal food boutique, the Founder & Brand Chief of Staff has issued an executive directive to introduce a **Hotel-Grade Dark Mode Theme Engine**.

### Creative Intent & The "Candle-Lit Banquet" Metaphor
Standard web applications implement dark mode as flat, sterile `#000000` or generic cold tech-grey (`#111827`, `#1f2937`). For Hashousha, this is strictly unacceptable.
The Hashousha night experience must evoke an **intimate, candle-lit private dining room in Riyadh**:
- **Background:** Deep roasted Dark Espresso (`#17110B`), warm, earthy, and rich.
- **Card Surfaces & Modals:** Warm Velvety Cocoa (`#231B14`), creating soft contrast without harsh borders.
- **Primary Accents & Gilding:** Illuminated Gilded Bronze (`#C29567`), radiating warmth like polished copper and golden crusts.
- **Typography:** Warm Ivory (`#FAF7F2`) for titles, softened warm almond (`#A89887`) for secondary descriptions.
- **Prohibition:** Strictly zero pitch black (`#000000`), zero slate grey, zero high-contrast harsh whites.

---

## 2. Technical Architecture & Four Pillars

```
+-------------------------------------------------------------------------+
|                              Theme Engine                               |
|                  (localStorage: 'hashousha_theme')                     |
|                                                                         |
|      +---------------------+              +-----------------------+     |
|      |  System Preference  |  Fallback    | User Stored Selection |     |
|      | prefers-color-scheme| -----------> |    'light' | 'dark'   |     |
|      +---------------------+              +-----------------------+     |
|                                                       |                 |
|                                          document.documentElement       |
|                                             classList.add('dark')       |
+-------------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+----------------------+                             +-------------------+
|     SiteHeader       |                             |  MerchantCenter   |
|   Storefront Toggle  |                             |   Navbar Toggle   |
|  (Sun/Moon Rotation) |                             |  (Live Switcher)  |
+----------------------+                             +-------------------+
```

---

### Pillar 1: Hotel-Grade Dark Theme Color Palette & Design Tokens

#### 1.1 Tailwind Configuration (`tailwind.config.js`)
Activate class-based dark mode strategy:
```javascript
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // ...
}
```

#### 1.2 CSS Custom Properties (`src/index.css`)
Define the `.dark` class overriding `:root` design tokens with the warm hotel palette:

```css
.dark {
  color-scheme: dark;
  --background: #17110b;        /* Dark Espresso (Warm Roasted) */
  --foreground: #faf7f2;        /* Warm Ivory */
  --card: #231b14;              /* Warm Cocoa Card Surface */
  --card-foreground: #faf7f2;   /* Warm Ivory Card Text */
  --popover: #231b14;           /* Warm Cocoa Modal & Popover */
  --popover-foreground: #faf7f2;
  --primary: #c29567;           /* Illuminated Gilded Bronze */
  --primary-foreground: #17110b;/* Dark Espresso text on primary */
  --secondary: #2b221a;         /* Deep Roasted Pecan */
  --secondary-foreground: #faf7f2;
  --muted: #2b221a;             /* Subtle Dark Muted Surface */
  --muted-foreground: #a89887;  /* Warm Almond Muted Text */
  --accent: #931f2d;            /* Royal Pomegranate Accent */
  --accent-foreground: #faf7f2;
  --destructive: #b91c1c;       /* Muted Crimson */
  --border: #382b20;            /* Warm Walnut Border */
  --input: #382b20;             /* Warm Walnut Input Border */
  --ring: #c29567;              /* Gilded Focus Ring */
}
```

#### 1.3 Dark Linen Texture & Skeleton Shimmer Adaptation
```css
.dark .linen {
  background-color: var(--background);
  background-image:
    repeating-linear-gradient(0deg, rgba(194, 149, 103, 0.04) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(194, 149, 103, 0.035) 0 1px, transparent 1px 4px),
    radial-gradient(ellipse at top, rgba(35, 27, 20, 0.85) 0%, transparent 70%);
}

.dark .skeleton-shimmer {
  background-color: #261e16;
}

.dark .skeleton-shimmer::after {
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(194, 149, 103, 0.12) 35%,
    rgba(194, 149, 103, 0.22) 50%,
    rgba(194, 149, 103, 0.12) 65%,
    transparent 100%
  );
}

.dark ::-webkit-scrollbar-thumb {
  background: #382b20;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #c29567;
}
```

---

### Pillar 2: Theme Context & Engine (`src/context/ThemeContext.tsx`)

#### Specifications:
1. **Storage Key:** `'hashousha_theme'`
2. **Type Definition:**
   ```typescript
   export type ThemeMode = 'light' | 'dark';
   
   export interface ThemeContextValue {
     theme: ThemeMode;
     toggleTheme: () => void;
     setTheme: (theme: ThemeMode) => void;
   }
   ```
3. **Initialization Logic:**
   - First, inspect `localStorage.getItem('hashousha_theme')`. If equal to `'dark'` or `'light'`, honor it.
   - Second, if absent, evaluate `window.matchMedia('(prefers-color-scheme: dark)').matches`. If `true`, default to `'dark'`; otherwise `'light'`.
4. **DOM Synchronization:**
   - Whenever `theme` changes, synchronize `document.documentElement`:
     ```typescript
     if (theme === 'dark') {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
     localStorage.setItem('hashousha_theme', theme);
     ```
5. **System Preference Listener:**
   - Listen to `matchMedia.addEventListener('change', ...)` to react if system preference toggles while no manual override is saved.
6. **Provider Injection:**
   - Mount `<ThemeProvider>` at the root of the React tree in `src/App.tsx` (wrapping all routes: Storefront, Landing Page, Merchant Center).

---

### Pillar 3: Storefront Header Luxury Toggle (`SiteHeader.tsx`)

#### Specifications:
1. **Location:**
   In `src/components/storefront/v0/SiteHeader.tsx`, locate the empty spacer element:
   ```tsx
   {/* Visual balance spacer */}
   <div className="w-10" aria-hidden="true" />
   ```
   Replace this spacer with the interactive, luxury theme toggle button.
2. **Motion & Interaction:**
   - Built with `motion.button` using hotel-grade spring physics:
     * `whileHover={{ scale: 1.05 }}`
     * `whileTap={{ scale: 0.92 }}`
   - Icon animation wrapped in `AnimatePresence mode="wait"`:
     * When transitioning from light to dark: `Sun` rotates smoothly into view.
     * When transitioning from dark to light: `Moon` rotates smoothly into view.
     * `initial={{ rotate: -70, opacity: 0, scale: 0.8 }}`
     * `animate={{ rotate: 0, opacity: 1, scale: 1 }}`
     * `exit={{ rotate: 70, opacity: 0, scale: 0.8 }}`
     * `transition={{ duration: 0.25, ease: "easeOut" }}`
3. **Visual Styling:**
   - Circular button: `size-10 flex items-center justify-center rounded-full border border-border/80 bg-card/60 backdrop-blur-sm text-foreground/80 hover:text-primary hover:border-primary/40 transition-colors shadow-sm`
4. **Accessibility:**
   - Accessible Arabic `aria-label`: `theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'`

---

### Pillar 4: Merchant Center Header Toggle (`MerchantCenter.tsx`)

#### Specifications:
1. **Location:**
   In the sticky top navbar of `src/components/admin/MerchantCenter.tsx`, place the toggle in the header actions cluster alongside `RefreshCw` and `ExternalLink`.
2. **Design:**
   - Matches Merchant Center button styling: `rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all`.
   - Tooltip / `title`: `التبديل للوضع الليلي` / `التبديل للوضع النهاري`.
   - Smooth rotation motion on icon toggle.

---

## 3. Target Files & Interfaces

| Component / Target File | Action | Description |
|:---|:---:|:---|
| `tailwind.config.js` | **Modify** | Add `darkMode: 'class'` |
| `src/index.css` | **Modify** | Add `.dark` design tokens, dark `.linen`, dark scrollbars, and dark skeleton shimmer |
| `src/context/ThemeContext.tsx` | **Create** | ThemeProvider, useTheme hook, localStorage persistence, OS listener |
| `src/components/common/ThemeToggle.tsx` | **Create** | Reusable hotel-grade animated Sun/Moon toggle with Framer Motion |
| `src/components/storefront/v0/SiteHeader.tsx` | **Modify** | Embed ThemeToggle replacing start spacer |
| `src/components/admin/MerchantCenter.tsx` | **Modify** | Embed ThemeToggle in Merchant Center top navbar |
| `src/App.tsx` | **Modify** | Wrap tree in `<ThemeProvider>` |

---

## 4. Acceptance Criteria & Quality Gates

- [ ] `tailwind.config.js` contains `darkMode: 'class'`.
- [ ] `src/index.css` defines `.dark` with Dark Espresso `#17110B`, Warm Cocoa `#231B14`, Gilded Bronze `#C29567`, and Warm Ivory `#FAF7F2`.
- [ ] Strict prohibition: Zero instances of flat `#000000` or tech grey `#1f2937` in the dark palette.
- [ ] `src/context/ThemeContext.tsx` handles initial load from `'hashousha_theme'`, system fallback, and classList synchronization.
- [ ] Storefront header features tactile Sun/Moon toggle in place of the empty spacer with spring rotation.
- [ ] Merchant Center header includes the theme switcher, instantly transforming admin UI into dark mode.
- [ ] Switching between modes preserves existing state (cart items, active tabs, filters).
- [ ] `npm run build` (`tsc && vite build`) executes cleanly with 0 errors and 0 warnings.
