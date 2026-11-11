import React, { createContext, useContext, useMemo } from 'react'
import {
  useCartStore,
  getCartLines,
  getCartTotalItems,
  getCartTotalPrice,
} from '../store/useCartStore'
import { CartContextValue } from '../types/menu'

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const quantities = useCartStore((state) => state.quantities)
  const isSummaryOpen = useCartStore((state) => state.isSummaryOpen)
  const add = useCartStore((state) => state.add)
  const remove = useCartStore((state) => state.remove)
  const clearCart = useCartStore((state) => state.clearCart)
  const setSummaryOpen = useCartStore((state) => state.setSummaryOpen)

  const value = useMemo<CartContextValue>(() => {
    const lines = getCartLines(quantities)
    const totalItems = getCartTotalItems(quantities)
    const totalPrice = getCartTotalPrice(quantities)

    return {
      lines,
      quantities,
      totalItems,
      totalPrice,
      add,
      remove,
      clearCart,
      isSummaryOpen,
      setSummaryOpen,
    }
  }, [quantities, isSummaryOpen, add, remove, clearCart, setSummaryOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
