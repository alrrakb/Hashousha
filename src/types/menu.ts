export type CategoryId =
  | "all"
  | "plain-dough-babka"
  | "cocoa-dough-babka"
  | "sweet-babka"
  | "savory-babka"
  | "babka-boxes"
  | "cookies"

export interface Category {
  id: CategoryId
  label: string
}

export type BadgeKind = "popular" | "signature" | "savory" | "sweet" | "new" | "tangy" | "spicy" | string

export interface DishVariant {
  id: string              // e.g. "mini", "medium", "family", "box-12", "box-24"
  name: string            // e.g. "ميني", "حجم وسط", "حجم عائلي", "بوكس 12 قطعة"
  englishName?: string
  price: number
  servingInfo?: string    // e.g. "تكفي شخص واحد", "تكفي 4-6 أشخاص", "تكفي 8-10 أشخاص"
  inStock?: boolean
}

export interface Dish {
  id: string
  name: string
  englishName: string
  slug?: string
  description: string
  longDescription?: string
  servingInfo?: string
  price: number
  unit: string
  category: CategoryId | string
  categories?: string[]
  image: string
  imageAlt?: string
  badges: BadgeKind[]
  inStock: boolean
  variants?: DishVariant[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  highlights?: string[]
  preparationTip?: string
  showPreparationTip?: boolean
}

export const DISH_HIGHLIGHT_KEYS = [
  'fresh',
  'ingredients',
  'packaging',
  'delivery',
] as const

export type DishHighlightKey = (typeof DISH_HIGHLIGHT_KEYS)[number]

export interface CartLine {
  dish: Dish
  variant?: DishVariant
  lineKey: string         // dishId or `${dishId}__${variantId}`
  quantity: number
  unitPrice: number
}

export interface CartContextValue {
  lines: CartLine[]
  quantities: Record<string, number>
  totalItems: number
  totalPrice: number
  add: (id: string, variantId?: string) => void
  remove: (id: string, variantId?: string) => void
  clearCart: () => void
  isSummaryOpen: boolean
  setSummaryOpen: (open: boolean) => void
}
