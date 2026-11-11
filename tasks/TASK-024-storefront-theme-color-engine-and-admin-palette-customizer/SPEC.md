# TASK-024 Specification: Storefront Theme Color Engine & Admin Palette Customizer

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Implementer)  
> **Date:** 2026-10-12  
> **Status:** Approved for Implementation  

---

## 1. Context & Objective

### 1.1 Context
The Founder requested an autonomous theme customization engine enabling direct control over all store colors (for both Light Mode and Dark Mode) from the Admin Dashboard under "إدارة المحتوى والمظهر" (Content & Appearance Management). Additionally, the default Dark Mode background is to be enriched from cold dark espresso to a warm, royal honey-roasted amber tone (`#1a120b`) aligned with the gold-embossed brand emblem.

### 1.2 Objective
1. **Dynamic CSS Variables Engine**: Inject CSS custom properties dynamically into `<style id="hashousha-custom-theme">` targeting `:root` (Light Mode) and `.dark` (Dark Mode), ensuring zero-overhead, instant live styling without Tailwind refactors.
2. **Cloud Persistence in Supabase**: Store theme configuration under `site_content.theme_colors` (JSONB) in Supabase.
3. **Admin Palette Customizer in `SiteContentModule.tsx`**:
   - **1-Click Luxury Presets**:
     - 🍯 *باقة العسل الملكي والورق الكتاني (Royal Honey Linen)* — Inspired by the emblem logo card.
     - ☕ *باقة الإسبريسو والكراميل الذهبي (Golden Caramel & Espresso)*.
     - 🥐 *باقة المخبوزات الحرفية الكلاسيكية (Artisanal Bakes Classic)*.
   - **Granular Color Pickers**: Individual visual pickers & Hex inputs for:
     - Background (الخلفية الأساسية)
     - Card / Dish Background (خلفية البطاقات والأطباق)
     - Primary Accent (اللون الذهبي/العسلي المميز)
     - Text / Foreground (لون النصوص والعناوين)
     - Border (الحدود والفواصل)
   - **Live Interactive Mini-Card Preview**: An in-dashboard preview widget rendering a mini babka dish card in real time, togglable between Light and Dark mode.
4. **Verification**: 100% build pass (`npm run build` exit code 0) and zero TypeScript errors.

---

## 2. Impacted Files & Architecture

| File Path | Action | Description |
|:---|:---:|:---|
| `supabase/migrations/20261012_theme_colors.sql` | **CREATE** | DDL to add `theme_colors JSONB` column to `site_content` |
| `src/types/admin.ts` | **MODIFY** | Add `ThemeColorPalette`, `StoreThemeColors`, `DEFAULT_THEME_COLORS`, and `THEME_PRESETS` |
| `src/services/adminService.ts` | **MODIFY** | Update `fetchSiteContent` and `saveSiteContent` to serialize/deserialize `theme_colors` |
| `src/context/SiteContentContext.tsx` | **MODIFY** | Inject dynamic CSS variables into `<style id="hashousha-custom-theme">` on theme change |
| `src/components/admin/modules/SiteContentModule.tsx` | **MODIFY** | Implement the Theme & Palette Customizer UI section with presets, pickers, and live preview |
| `tasks/INDEX.md` | **MODIFY** | Append TASK-024 row to ledger |

---

## 3. Detailed Technical Requirements

### 3.1 Type Definitions (`src/types/admin.ts`)
```ts
export interface ThemeColorPalette {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  border: string
}

export interface StoreThemeColors {
  light: ThemeColorPalette
  dark: ThemeColorPalette
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  colors: StoreThemeColors
}

export const DEFAULT_THEME_COLORS: StoreThemeColors = {
  light: {
    background: '#faf7f2',
    foreground: '#2e1e0d',
    card: '#fdfbf7',
    cardForeground: '#2e1e0d',
    primary: '#9e774c',
    primaryForeground: '#faf7f2',
    border: '#e8ddd0',
  },
  dark: {
    background: '#1a120b', // Deep honey-roasted amber noir
    foreground: '#faf7f2',
    card: '#241a12',       // Dark chocolate honey card
    cardForeground: '#faf7f2',
    primary: '#c29567',    // Warm honey gold
    primaryForeground: '#1a120b',
    border: '#3d2c1e',
  },
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal-honey',
    name: 'العسل الملكي والكتان (شعار هشوشة)',
    description: 'درجات الكتان العسلي الفاتح مع توهج ذهبي دافئ وخلفية ليلية عنبرية فاخرة',
    colors: {
      light: {
        background: '#f6f1e8',
        foreground: '#2b1d0c',
        card: '#fdfbf7',
        cardForeground: '#2b1d0c',
        primary: '#b0834f',
        primaryForeground: '#fdfbf7',
        border: '#e6dac8',
      },
      dark: {
        background: '#18110a',
        foreground: '#f6f1e8',
        card: '#24180f',
        cardForeground: '#f6f1e8',
        primary: '#d4a366',
        primaryForeground: '#18110a',
        border: '#3b281a',
      },
    },
  },
  {
    id: 'espresso-caramel',
    name: 'الإسبريسو والكراميل الذهبي',
    description: 'درجات قهوة البن المحمص الغنية مع لمسات الكراميل الدافئة',
    colors: {
      light: {
        background: '#faf7f2',
        foreground: '#24170b',
        card: '#ffffff',
        cardForeground: '#24170b',
        primary: '#946338',
        primaryForeground: '#ffffff',
        border: '#e8dccf',
      },
      dark: {
        background: '#140e08',
        foreground: '#faf7f2',
        card: '#1e140d',
        cardForeground: '#faf7f2',
        primary: '#be8751',
        primaryForeground: '#140e08',
        border: '#332014',
      },
    },
  },
  {
    id: 'classic-luxury',
    name: 'المخبوزات الحرفية الكلاسيكية',
    description: 'الهوية الكلاسيكية المعتمدة لمخبوزات وبابكا هشوشة',
    colors: DEFAULT_THEME_COLORS,
  },
]
```

### 3.2 Database DDL (Supabase)
```sql
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS theme_colors JSONB;
```

### 3.3 Dynamic CSS Variable Injector (`src/context/SiteContentContext.tsx`)
Whenever `content.themeColors` changes or loads:
```ts
useEffect(() => {
  if (!content.themeColors) return
  const styleId = 'hashousha-custom-theme-vars'
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }

  const { light, dark } = content.themeColors
  styleEl.textContent = `
    :root {
      --background: ${light.background};
      --foreground: ${light.foreground};
      --card: ${light.card};
      --card-foreground: ${light.cardForeground};
      --primary: ${light.primary};
      --primary-foreground: ${light.primaryForeground};
      --border: ${light.border};
      --ring: ${light.primary};
    }
    .dark {
      --background: ${dark.background};
      --foreground: ${dark.foreground};
      --card: ${dark.card};
      --card-foreground: ${dark.cardForeground};
      --primary: ${dark.primary};
      --primary-foreground: ${dark.primaryForeground};
      --border: ${dark.border};
      --ring: ${dark.primary};
    }
  `
}, [content.themeColors])
```

### 3.4 Admin Module UI (`src/components/admin/modules/SiteContentModule.tsx`)
Create a dedicated accordion/section:
- Title: **🎨 ألوان وهوية المتجر (Theme & Palette Customizer)**
- Section 1: **الباقات الجاهزة (1-Click Presets)**: Buttons rendering preset name, description, and mini color swatches. Clicking applies the preset to the form state.
- Section 2: **محدد الألوان اليدوي**: Tabs for "الوضع النهاري (Light)" and "الوضع الليلي (Dark)". Each tab has pickers for:
  - لون الخلفية الأساسية (Background)
  - لون البطاقات (Card Background)
  - اللون الذهبي/العسلي المميز (Primary Accent)
  - لون النصوص (Foreground)
  - لون الحدود (Border)
- Section 3: **المعاينة التفاعلية المصغرة (Live Mini Preview)**:
  A card showing a mini preview of a babka item, price badge, and add-to-cart button using the currently edited colors, with an instant toggle between Light and Dark preview.
- Reset Button: "استعادة الألوان الافتراضية".
- Integrated into the existing "حفظ التغييرات" flow.

---

## 4. Acceptance Criteria
- [ ] Supabase table `site_content` supports `theme_colors`.
- [ ] Admin dashboard contains the Theme & Palette Customizer with 3 luxury presets.
- [ ] Manual color pickers and hex inputs update colors reactively.
- [ ] Interactive live mini-preview card reflects colors in real time.
- [ ] Saving updates Supabase and immediately alters the live storefront colors without requiring a page refresh.
- [ ] `npm run build` succeeds with exit code 0 and 0 TypeScript errors.
