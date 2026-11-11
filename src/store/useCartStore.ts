import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dishes } from '../data/menu'
import { CartLine } from '../types/menu'

export const MAX_PER_ITEM = 20

export interface CartStoreState {
  quantities: Record<string, number>
  isSummaryOpen: boolean
  add: (id: string, variantId?: string) => void
  remove: (id: string, variantId?: string) => void
  setQuantity: (lineKey: string, qty: number) => void
  clearCart: () => void
  setSummaryOpen: (open: boolean) => void
}

export function buildLineKey(dishId: string, variantId?: string): string {
  return variantId ? `${dishId}__${variantId}` : dishId
}

export function parseLineKey(lineKey: string): { dishId: string; variantId?: string } {
  const parts = lineKey.split('__')
  if (parts.length >= 2) {
    return { dishId: parts[0], variantId: parts.slice(1).join('__') }
  }
  return { dishId: lineKey }
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      quantities: {},
      isSummaryOpen: false,

      add: (id: string, variantId?: string) =>
        set((state) => {
          const key = id.includes('__') ? id : buildLineKey(id, variantId)
          return {
            quantities: {
              ...state.quantities,
              [key]: Math.min((state.quantities[key] ?? 0) + 1, MAX_PER_ITEM),
            },
          }
        }),

      remove: (id: string, variantId?: string) =>
        set((state) => {
          const key = id.includes('__') ? id : buildLineKey(id, variantId)
          const next = { ...state.quantities }
          const current = next[key] ?? 0
          if (current <= 1) {
            delete next[key]
          } else {
            next[key] = current - 1
          }
          return { quantities: next }
        }),

      setQuantity: (lineKey: string, qty: number) =>
        set((state) => {
          const next = { ...state.quantities }
          if (qty <= 0) {
            delete next[lineKey]
          } else {
            next[lineKey] = Math.min(qty, MAX_PER_ITEM)
          }
          return { quantities: next }
        }),

      clearCart: () => set({ quantities: {}, isSummaryOpen: false }),

      setSummaryOpen: (open: boolean) => set({ isSummaryOpen: open }),
    }),
    {
      name: 'hashousha-cart-storage',
    }
  )
)

export function getCartLines(quantities: Record<string, number>): CartLine[] {
  // Dishes map
  const dishMap = new Map(dishes.map((d) => [d.id, d]))
  const lines: CartLine[] = []

  for (const [key, qty] of Object.entries(quantities)) {
    if (!qty || qty <= 0) continue
    const { dishId, variantId } = parseLineKey(key)
    const dish = dishMap.get(dishId)
    if (!dish) continue

    const variant = variantId && dish.variants ? dish.variants.find((v) => v.id === variantId) : undefined
    const unitPrice = variant ? variant.price : dish.price

    lines.push({
      lineKey: key,
      dish,
      quantity: qty,
      variant,
      unitPrice,
    })
  }

  return lines
}

export function getCartTotalItems(quantities: Record<string, number>): number {
  return Object.values(quantities).reduce((sum, q) => sum + (q > 0 ? q : 0), 0)
}

export function getCartTotalPrice(quantities: Record<string, number>): number {
  const lines = getCartLines(quantities)
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
}
