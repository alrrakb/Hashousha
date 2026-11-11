import { Star, Citrus, Flame, Sparkles, Award, Heart, Leaf, Crown, Gift, Coffee, Tag, LucideIcon } from 'lucide-react'
import { AdminBadge } from '../types/admin'

export const BADGE_STORAGE_KEY = 'hashousha_admin_badges'
export const BADGE_CHANNEL_NAME = 'hashousha_badges_channel'

export const DEFAULT_ADMIN_BADGES: AdminBadge[] = [
  {
    id: 'popular',
    label: 'الأكثر طلباً ٤٫٩',
    englishLabel: 'Bestseller',
    description: 'يظهر للطبق الأكثر مبيعاً مع نجمة ذهبية فندقية وتقييم عالي',
    colorPreset: 'amber',
    iconName: 'Star',
    sortOrder: 1,
    isDefault: true,
  },
  {
    id: 'signature',
    label: 'توقيع هشوشة ✨',
    englishLabel: 'Signature Dish',
    description: 'الوصفة الحرفية الأيقونية المبتكرة لمخبز هشوشة',
    colorPreset: 'primary',
    iconName: 'Sparkles',
    sortOrder: 2,
    isDefault: true,
  },
  {
    id: 'savory',
    label: 'مالح فاخر 🧀',
    englishLabel: 'Artisanal Savory',
    description: 'مخبوزات مالحة بالأجبان المعتقة والبيستو والزعتر البلدي',
    colorPreset: 'emerald',
    iconName: 'Award',
    sortOrder: 3,
    isDefault: true,
  },
  {
    id: 'sweet',
    label: 'حلو ملكي 🍫',
    englishLabel: 'Royal Sweet',
    description: 'مخبوزات حلوة فاخرة بالنوتيلا والبيكان والكاسترد والقرفة',
    colorPreset: 'purple',
    iconName: 'Crown',
    sortOrder: 4,
    isDefault: true,
  },
  {
    id: 'new',
    label: 'جديد المخبز 🌿',
    englishLabel: 'New Bake',
    description: 'أحدث ابتكارات البابكا المنضمة حديثاً لقائمتنا الفاخرة',
    colorPreset: 'emerald',
    iconName: 'Leaf',
    sortOrder: 5,
    isDefault: true,
  },
]

export const BADGE_ICON_MAP: Record<string, LucideIcon> = {
  Star,
  Citrus,
  Flame,
  Sparkles,
  Award,
  Heart,
  Leaf,
  Crown,
  Gift,
  Coffee,
  Tag,
}

export function getBadgeIcon(iconName?: string): LucideIcon {
  if (iconName && BADGE_ICON_MAP[iconName]) {
    return BADGE_ICON_MAP[iconName]
  }
  return Award
}

export function getBadges(): AdminBadge[] {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_BADGES
  try {
    const raw = localStorage.getItem(BADGE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error reading badges from storage:', err)
  }
  return DEFAULT_ADMIN_BADGES
}

export function saveBadges(badges: AdminBadge[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(badges))
    window.dispatchEvent(new CustomEvent('hashousha_badges_updated', { detail: badges }))

    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(BADGE_CHANNEL_NAME)
      bc.postMessage({ type: 'BADGES_UPDATE', badges })
      bc.close()
    }
  } catch (err) {
    console.warn('Error saving badges to storage:', err)
  }
}

export function addBadge(badge: AdminBadge): AdminBadge[] {
  const current = getBadges()
  const exists = current.some((b) => b.id === badge.id)
  const next = exists
    ? current.map((b) => (b.id === badge.id ? badge : b))
    : [...current, badge]
  saveBadges(next)
  return next
}

export function deleteBadge(id: string): AdminBadge[] {
  const current = getBadges()
  const next = current.filter((b) => b.id !== id)
  saveBadges(next)
  return next
}

export interface BadgeDisplayConfig {
  id: string
  label: string
  Icon: LucideIcon
  className: string
  iconColor: string
}

export const BADGE_PRESET_STYLES: Record<string, { className: string; iconColor: string }> = {
  amber: {
    className: 'bg-[#1f150c]/95 text-[#fdf6ec] border border-[#9e774c]/60 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-amber-400',
  },
  primary: {
    className: 'bg-[#1f150c]/95 text-white border border-[#9e774c]/60 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-primary',
  },
  rose: {
    className: 'bg-[#931f2d] text-white border border-rose-300/40 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-amber-300',
  },
  emerald: {
    className: 'bg-[#134e4a] text-white border border-emerald-300/40 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-emerald-200',
  },
  purple: {
    className: 'bg-[#4c1d95] text-white border border-purple-300/40 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-purple-200',
  },
  blue: {
    className: 'bg-[#1e3a8a] text-white border border-blue-300/40 shadow-md backdrop-blur-md font-bold',
    iconColor: 'text-blue-200',
  },
}

export function getBadgeDisplayConfig(badgeId: string, customList?: AdminBadge[]): BadgeDisplayConfig {
  const all = customList && customList.length > 0 ? customList : getBadges()
  const found = all.find((b) => b.id === badgeId)

  if (found) {
    const preset = BADGE_PRESET_STYLES[found.colorPreset || 'primary'] || BADGE_PRESET_STYLES.primary
    return {
      id: found.id,
      label: found.label,
      Icon: getBadgeIcon(found.iconName),
      className: preset.className,
      iconColor: preset.iconColor,
    }
  }

  // Fallbacks for known IDs if not yet initialized in localStorage
  if (badgeId === 'popular') {
    return {
      id: 'popular',
      label: 'الأكثر طلباً ٤٫٩',
      Icon: Star,
      className: BADGE_PRESET_STYLES.amber.className,
      iconColor: BADGE_PRESET_STYLES.amber.iconColor,
    }
  }
  if (badgeId === 'signature') {
    return {
      id: 'signature',
      label: 'توقيع هشوشة ✨',
      Icon: Sparkles,
      className: BADGE_PRESET_STYLES.primary.className,
      iconColor: 'text-amber-300',
    }
  }
  if (badgeId === 'savory') {
    return {
      id: 'savory',
      label: 'مالح فاخر 🧀',
      Icon: Award,
      className: BADGE_PRESET_STYLES.emerald.className,
      iconColor: BADGE_PRESET_STYLES.emerald.iconColor,
    }
  }
  if (badgeId === 'sweet') {
    return {
      id: 'sweet',
      label: 'حلو ملكي 🍫',
      Icon: Crown,
      className: BADGE_PRESET_STYLES.purple.className,
      iconColor: BADGE_PRESET_STYLES.purple.iconColor,
    }
  }
  if (badgeId === 'tangy') {
    return {
      id: 'tangy',
      label: 'حامض حلو',
      Icon: Citrus,
      className: BADGE_PRESET_STYLES.primary.className,
      iconColor: BADGE_PRESET_STYLES.primary.iconColor,
    }
  }
  if (badgeId === 'spicy') {
    return {
      id: 'spicy',
      label: 'حار مسمسم',
      Icon: Flame,
      className: BADGE_PRESET_STYLES.rose.className,
      iconColor: BADGE_PRESET_STYLES.rose.iconColor,
    }
  }
  if (badgeId === 'new') {
    return {
      id: 'new',
      label: 'جديد',
      Icon: Sparkles,
      className: 'bg-[#9e774c] text-white border border-amber-200/40 shadow-md backdrop-blur-md font-bold',
      iconColor: 'text-amber-200',
    }
  }

  // Fallback for custom badges
  return {
    id: badgeId,
    label: badgeId,
    Icon: Tag,
    className: BADGE_PRESET_STYLES.primary.className,
    iconColor: BADGE_PRESET_STYLES.primary.iconColor,
  }
}

