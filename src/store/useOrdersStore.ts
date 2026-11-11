import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, OrderStatus } from '../types/order'

export interface OrdersStoreState {
  orders: Order[]
  addOrder: (order: Order) => void
  setOrders: (orders: Order[]) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrder: (orderId: string) => Order | undefined
}

export const useOrdersStore = create<OrdersStoreState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order: Order) =>
        set((state) => {
          // Avoid duplicate entries
          const exists = state.orders.some((o) => o.id === order.id || o.orderNumber === order.orderNumber)
          if (exists) {
            return {
              orders: state.orders.map((o) => (o.id === order.id ? order : o)),
            }
          }
          return { orders: [order, ...state.orders] }
        }),

      setOrders: (newOrders: Order[]) =>
        set((state) => {
          const existingMap = new Map(state.orders.map((o) => [o.id, o]))
          const merged = newOrders.map((incoming) => {
            const existing = existingMap.get(incoming.id)
            if (existing && incoming.items.length === 0 && existing.items.length > 0) {
              return { ...incoming, items: existing.items }
            }
            return incoming
          })
          const newIds = new Set(merged.map((o) => o.id))
          const localOnly = state.orders.filter((o) => !newIds.has(o.id))
          return { orders: [...merged, ...localOnly] }
        }),

      updateOrderStatus: (orderId: string, status: OrderStatus) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status, updatedAt: new Date().toISOString() }
              : o
          ),
        })),

      getOrder: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId)
      },
    }),
    {
      name: 'hashousha_orders',
    }
  )
)
