# HASHOUSHA (هشوشة) — Food & Appetizing Design System

> **Brand Identity:** Hashousha (هشوشة للمحاشي والحلويات الفاخرة)  
> **Aesthetic Philosophy:** Warm Gourmet Opulence, Heritage Arabic Hospitality & Culinary Freshness  
> **Author:** Agent Alpha (Creative Director & Lead Architect)  
> **Status:** APPROVED & LOCKED  

---

## 1. Creative Direction & Brand Atmosphere

The visual world of **Hashousha** evokes the sensory richness of home-cooked gourmet Middle Eastern feasts:
- The deep, lustrous green of simmered grapevine leaves wrapped by hand.
- The gleaming crimson ruby of slow-reduced pomegranate molasses (دبس رمان بلدي).
- The golden amber glow of warm honey and toasted nuts on freshly baked oriental desserts.
- The welcoming warmth of ivory linen tablecloths (`#FDFBF7`) rather than cold, clinical digital white.

Every interface element is calibrated to trigger visual appetite and communicate artisanal prestige.

---

## 2. Color Palette Tokens

All colors are systematically organized into semantic and brand scales, fully wired into Tailwind CSS.

### 2.0 Official Brand Logo Chromatic Signature (الذهب البرونزي والكتان الفاخر)
Extracted directly from the official brand logo (`public/images/logo.jpeg`):
- **Calligraphy & Emblem Tone:** Artisanal Warm Bronze & Muted Caramel Gold (`#9E774C`).
- **Canvas Backdrop:** Textured Warm Linen & Desert Ivory (`#FAF7F2` / `#F5EFEB`).
- **Sub-tagline:** `SWEET & SAVORY BAKES` accented with a minimalist diamond star divider.

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `bronze-50` | `#FAF6F0` | Warm linen background tint for luxury cards |
| `bronze-100` | `#F4EBDD` | Soft borders & elegant card containers |
| `bronze-500` | `#B88E5D` | Medium gold metallic badge highlights |
| `bronze-600` | `#9E774C` | **Core Logo Calligraphy Tone** (Hero titles, emblem icons) |
| `bronze-800` | `#6A4926` | High-contrast luxury headings and prices |
| `bronze-950` | `#2E1E0D` | Deep espresso text and culinary shadow base |

### 2.1 Primary Brand: Vine & Olive Greens (ورق العنب والزيتون)
Inspired by natural grape leaves and cold-pressed extra virgin olive oil. Used for brand headers, primary accents, category tabs, and confirmation highlights.

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `olive-50` | `#F3F8F4` | Delicate background tint for highlights |
| `olive-100` | `#E3EFE6` | Active tab backgrounds, subtle borders |
| `olive-200` | `#C8DFCD` | Soft borders & card divider accents |
| `olive-500` | `#528D63` | Medium green icon accents |
| `olive-700` | `#2D5E3B` | Brand hero olive, active status indicators |
| `olive-800` | `#21492E` | Secondary dark text, rich olive buttons |
| `olive-900` | `#173420` | Primary brand green, header gradients, dominant logo color |
| `olive-950` | `#0E2214` | Deep forest shadow tone & footer base |

### 2.2 Secondary Accent: Pomegranate Red (دبس الرمان)
The sensory pop of tart, rich pomegranate molasses. Used for primary CTA buttons (Order Now / Add to Cart), discount badges, spicy indicators, and cart counters.

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `pomegranate-50` | `#FDF2F4` | Notification backdrops, spicy dish badge pill |
| `pomegranate-100` | `#FCE4E8` | Selected option border, highlight wash |
| `pomegranate-500` | `#DC2643` | Vibrant accent, spicy icon flame |
| `pomegranate-600` | `#BE1835` | **Primary CTA Button** (Add to Cart / WhatsApp Checkout) |
| `pomegranate-700` | `#9B132B` | Hover & active button press state |
| `pomegranate-900` | `#580B19` | Deep berry contrast text |

### 2.3 Secondary Accent: Honey & Amber Gold (عسل وقطر فاخر)
The rich golden sweetness of oriental baklava, basbousa, and toasted butter. Used for star ratings, "Best Seller" badges, special offers, and celebratory highlights.

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `honey-50` | `#FEF9EE` | Warm highlight cards & promo banner background |
| `honey-100` | `#FDF0D4` | Badge background (الأكثر طلباً) |
| `honey-500` | `#E59B18` | Gold star rating, award ribbons |
| `honey-600` | `#C47D0B` | Price highlight numbers, gold typography |
| `honey-800` | `#784B07` | Deep gold borders and text labels |

### 2.4 Neutral Surfaces & Culinary Warmth
Stark clinical white (`#FFFFFF`) is banned on broad page backdrops. The background is steeped in warm ivory:

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `surface-warm` | `#FDFBF7` | **Primary Global Page Background** (Warm Ivory) |
| `surface-card` | `#FFFFFF` | Elevated Dish Card & Drawer Surface |
| `surface-muted` | `#F7F4EC` | Inactive option pill, input background, table strips |
| `surface-border` | `#EAE4D7` | Warm delicate card borders and dividers |

### 2.5 Typography & Contrast Grays
High-contrast charcoal tones calibrated for effortless legibility under bright outdoor mobile conditions.

| Token | Hex Value | Semantic Usage |
|:---|:---|:---|
| `text-primary` | `#1A1816` | Main dish titles, prices, critical headers |
| `text-secondary` | `#4A453F` | Dish descriptions, ingredients, option names |
| `text-muted` | `#7D756C` | Preparation times, serving counts, disabled states |
| `text-on-dark` | `#FFFFFF` | Text on olive and pomegranate CTA buttons |

---

## 3. Typography Specification

### 3.1 Font Family
Hashousha uses modern Arabic typography engineered for hospitality and luxury:
- **Primary Typeface:** `Cairo` (Google Fonts) with secondary `Readex Pro` for numbers and UI labels.
- **System Fallback:** `system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif`.
- **Direction:** Arabic native Right-to-Left (`dir="rtl"`).

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Readex+Pro:wght@400;500;600;700&display=swap');

body {
  font-family: 'Cairo', 'Readex Pro', system-ui, sans-serif;
  direction: rtl;
}
```

### 3.2 Typographic Hierarchy Table
| Style | Size (rem / px) | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| **Display 1** | `2.25rem / 36px` | 900 (Black) | 1.25 | Hero Header, Festive Announcements |
| **Heading 1** | `1.75rem / 28px` | 800 (ExtraBold) | 1.3 | Category Section Titles |
| **Heading 2** | `1.25rem / 20px` | 700 (Bold) | 1.35 | Dish Card Title, Modal Title |
| **Subtitle** | `1.0rem / 16px` | 600 (SemiBold) | 1.4 | Option Group Title, Price in Cards |
| **Body Large** | `0.9375rem / 15px` | 400 (Regular) | 1.55 | Dish Descriptions, Ingredients |
| **Body Small** | `0.8125rem / 13px` | 500 (Medium) | 1.5 | Meta labels, Servings, Prep Time |
| **Badge / Micro** | `0.6875rem / 11px` | 700 (Bold) | 1.2 | Badges (`الأكثر طلباً`, `حار 🌶️`) |

---

## 4. Elevation, Radii & Shadows

Gourmet food components should appear softly elevated, like artisanal plates on a dining table.

### 4.1 Border Radius Tokens
- **Dish Cards:** `rounded-2xl` (16px) or `rounded-3xl` (24px) for premium soft contours.
- **Buttons & Pills:** `rounded-full` (9999px) for friendly tactile touch ergonomics.
- **Modals & Drawers:** `rounded-t-3xl` (24px) for bottom sheets on mobile.
- **Option Checkboxes/Radios:** `rounded-xl` (12px).

### 4.2 Warm Shadow Tokens
Standard cold gray shadows (`rgba(0,0,0,0.1)`) flatten food visuals. Hashousha uses warm amber-charcoal shadows:

```javascript
// Warm Gourmet Shadow Tokens
boxShadow: {
  'gourmet-sm': '0 2px 8px -2px rgba(45, 30, 15, 0.06)',
  'gourmet-md': '0 6px 18px -4px rgba(45, 30, 15, 0.08), 0 2px 6px -1px rgba(45, 30, 15, 0.04)',
  'gourmet-lg': '0 12px 32px -6px rgba(45, 30, 15, 0.12), 0 4px 12px -2px rgba(45, 30, 15, 0.06)',
  'gourmet-float': '0 20px 48px -8px rgba(45, 30, 15, 0.18)',
}
```

---

## 5. Component Design Rules & Patterns

### 5.1 Dish Card Pattern
- **Aspect Ratio:** Dish photo must maintain `aspect-[4/3]` or `aspect-square`, cropped with subtle inner border (`ring-1 ring-black/5`).
- **Visual Badges:** Floated at the top right of the card:
  - `الأكثر طلباً`: Amber background (`bg-honey-100 text-honey-800 border border-honey-500/20`).
  - `حار 🌶️`: Pomegranate background (`bg-pomegranate-50 text-pomegranate-700 border border-pomegranate-500/20`).
  - `جديد`: Olive background (`bg-olive-50 text-olive-800 border border-olive-500/20`).
- **Action Zone:** Clear separation between dish details and the action button (`+ إضافة` or `تخصيص`).

### 5.2 Primary Action Buttons (CTA)
- Background: `bg-pomegranate-600 hover:bg-pomegranate-700 active:scale-[0.98]`.
- Text: White bold font with high-contrast icon.
- Shadow: `shadow-gourmet-md shadow-pomegranate-600/20`.

### 5.3 Sticky Bottom Cart Bar (Mobile Storefront)
- Always visible when cart has `>= 1` items.
- Displays:
  1. Item count badge (pill).
  2. Total sum in Arabic currency (`١٤٥ ر.س`).
  3. Action label ("إتمام الطلب عبر الواتساب" or "عرض السلة").
- Transition: Slide up with spring physics (`framer-motion`).

### 5.4 Customization Sheet (Bottom Modal)
- Appears as a bottom sheet on mobile screens (`max-h-[85vh] overflow-y-auto`) and a centered dialog on desktop.
- Header showcases dish thumbnail, Arabic title, and dynamic price that updates instantaneously as add-ons and portions are selected.
