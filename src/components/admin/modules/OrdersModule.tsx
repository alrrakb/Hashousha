import React, { useState } from 'react'
import { ShoppingBag, PlusCircle } from 'lucide-react'
import { Order, OrderStatus } from '../../../types/order'
import { Dish } from '../../../types/menu'
import { dishes as defaultDishes } from '../../../data/menu'
import { OrdersPipeline } from '../../kitchen/OrdersPipeline'
import { OrderDetailsDrawer } from '../../kitchen/OrderDetailsDrawer'
import { CreateManualOrderModal } from './CreateManualOrderModal'
import { updateOrderStatusInSupabase } from '../../../services/orderService'

export interface OrdersModuleProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
  dishes?: Dish[]
  onOrderCreated?: (order: Order) => void
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({
  orders,
  onUpdateOrderStatus,
  dishes = defaultDishes,
  onOrderCreated,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)

  const handleUpdate = (orderId: string, status: OrderStatus) => {
    onUpdateOrderStatus(orderId, status)
    updateOrderStatusInSupabase(orderId, status).catch((err) => {
      console.warn('Update order status Supabase notice:', err)
    })

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null))
    }
  }

  return (
    <div className="space-y-6">
      {/* Module Title Header with Royal Create Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-primary/10">
        <div>
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <span>إدارة الطلبات والمبيعات</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            متابعة مراحل تحضير الطلبات، التواصل السريع مع العملاء عبر الهاتف والواتساب، وتسجيل الطلبات اليدوية.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="size-4" />
          <span>تسجيل طلب يدوي جديد</span>
        </button>
      </div>

      {/* Orders Pipeline (6-stage tabs + search + cards) */}
      <OrdersPipeline
        orders={orders}
        onSelectOrder={setSelectedOrder}
        onUpdateStatus={handleUpdate}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdate}
      />

      {/* Create Manual Order Modal */}
      <CreateManualOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        dishes={dishes}
        onOrderCreated={(newOrder) => {
          if (onOrderCreated) {
            onOrderCreated(newOrder)
          }
        }}
      />
    </div>
  )
}
