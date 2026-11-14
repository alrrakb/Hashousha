/**
 * Image SEO Utilities for Hashousha Storefront
 * Generates keyword-rich, accessible, and Google Images optimized alt texts.
 */

export interface DishImageAltInput {
  name: string
  imageAlt?: string
  category?: string
}

/**
 * Returns an SEO-optimized, accessible Alt text for any dish image.
 * Uses explicit imageAlt if present, or generates a context-aware fallback.
 */
export function getOptimizedDishImageAlt(dish: DishImageAltInput): string {
  if (dish.imageAlt && dish.imageAlt.trim().length > 0) {
    return dish.imageAlt.trim()
  }

  const name = dish.name ? dish.name.trim() : 'مخبوزات هشوشة'
  const isBoxOrMini =
    name.includes('بوكس') ||
    name.includes('ميني') ||
    dish.category === 'babka-boxes' ||
    dish.category === 'boxes'

  if (isBoxOrMini) {
    return `${name} ميني فاخر للجمعات والضيافة والمناسبات مخبوز طازجاً من مخبز هشوشة بالرياض`
  }

  return `${name} فاخرة وطازجة تُخبز يومياً بعجين بريوش طبيعي من مخبز هشوشة بالرياض`
}
