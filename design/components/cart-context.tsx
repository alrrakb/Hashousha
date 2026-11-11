"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { dishes, type Dish } from "@/lib/menu"

type CartLine = { dish: Dish; quantity: number }

type CartContextValue = {
  lines: CartLine[]
  quantities: Record<string, number>
  totalItems: number
  totalPrice: number
  add: (id: string) => void
  remove: (id: string) => void
  isSummaryOpen: boolean
  setSummaryOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const MAX_PER_ITEM = 20

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isSummaryOpen, setSummaryOpen] = useState(false)

  const add = useCallback((id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.min((prev[id] ?? 0) + 1, MAX_PER_ITEM) }))
  }, [])

  const remove = useCallback((id: string) => {
    setQuantities((prev) => {
      const next = { ...prev }
      const current = next[id] ?? 0
      if (current <= 1) delete next[id]
      else next[id] = current - 1
      return next
    })
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const lines = dishes
      .filter((dish) => quantities[dish.id])
      .map((dish) => ({ dish, quantity: quantities[dish.id] }))
    return {
      lines,
      quantities,
      totalItems: lines.reduce((sum, l) => sum + l.quantity, 0),
      totalPrice: lines.reduce((sum, l) => sum + l.quantity * l.dish.price, 0),
      add,
      remove,
      isSummaryOpen,
      setSummaryOpen,
    }
  }, [quantities, add, remove, isSummaryOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
