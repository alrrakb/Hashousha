/**
 * HASHOUSHA (هشوشة) — Design Tokens Constants
 * Reflects docs/DESIGN_SYSTEM.md
 */

export const THEME_COLORS = {
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
  ivory: '#FDFBF7',
  surface: {
    warm: '#FDFBF7',
    card: '#FFFFFF',
    muted: '#F7F4EC',
    border: '#EAE4D7',
  },
  text: {
    primary: '#1A1816',
    secondary: '#4A453F',
    muted: '#7D756C',
    onDark: '#FFFFFF',
  },
} as const;

export const SHADOW_TOKENS = {
  gourmetSm: '0 2px 8px -2px rgba(45, 30, 15, 0.06)',
  gourmetMd: '0 6px 18px -4px rgba(45, 30, 15, 0.08), 0 2px 6px -1px rgba(45, 30, 15, 0.04)',
  gourmetLg: '0 12px 32px -6px rgba(45, 30, 15, 0.12), 0 4px 12px -2px rgba(45, 30, 15, 0.06)',
  gourmetFloat: '0 20px 48px -8px rgba(45, 30, 15, 0.18)',
} as const;

export const BRAND_INFO = {
  nameAr: 'هشوشة',
  taglineAr: 'محاشي فاخرة & حلويات شرقية',
  fullTitleAr: 'هشوشة للمحاشي والحلويات الفاخرة',
  currencyDefault: 'ر.س',
} as const;
