import { supabase } from './supabase'
import { Order, OrderStatus } from '../types/order'

export interface CloudOrderRow {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_district: string
  customer_address: string
  customer_notes: string | null
  subtotal: number
  delivery_fee: number
  total_amount: number
  payment_method: string
  status: string
  created_at: string
}

export interface CloudOrderItemRow {
  id?: string
  order_id: string
  dish_id: string
  dish_name: string
  dish_image: string
  unit: string
  unit_price: number
  quantity: number
  total_price: number
}

/**
 * Persists an order and its line items to Supabase cloud database.
 */
export async function saveOrderToSupabase(
  order: Order
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Insert into orders table
    const { error: orderError } = await supabase.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_district: order.customer.district,
      customer_address: order.customer.addressDetails,
      customer_notes: order.customer.notes || null,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      status: order.status,
      created_at: order.createdAt,
    })

    if (orderError) {
      console.warn('Supabase orders table insert warning:', orderError.message)
      return { success: false, error: orderError.message }
    }

    // 2. Insert into order_items table
    const itemRows: Omit<CloudOrderItemRow, 'id'>[] = order.items.map((item) => ({
      order_id: order.id,
      dish_id: item.dishId,
      dish_name: item.dishName,
      dish_image: item.dishImage,
      unit: item.unit,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      total_price: item.totalPrice,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(itemRows)

    if (itemsError) {
      console.warn('Supabase order_items table insert warning:', itemsError.message)
      return { success: false, error: itemsError.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error'
    console.warn('Failed to save order to Supabase cloud (offline fallback active):', message)
    return { success: false, error: message }
  }
}

/**
 * Fetches all orders along with their items from Supabase cloud database.
 */
export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError || !ordersData) {
      console.warn('Failed to fetch orders from Supabase:', ordersError?.message)
      return []
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')

    if (itemsError || !itemsData) {
      console.warn('Failed to fetch order_items from Supabase:', itemsError?.message)
    }

    const allItems = itemsData || []

    return ordersData.map((row: CloudOrderRow) => {
      const orderItems = allItems
        .filter((item: CloudOrderItemRow) => item.order_id === row.id)
        .map((item: CloudOrderItemRow) => ({
          dishId: item.dish_id,
          dishName: item.dish_name,
          dishImage: item.dish_image,
          unit: item.unit,
          unitPrice: Number(item.unit_price),
          quantity: Number(item.quantity),
          totalPrice: Number(item.total_price),
        }))

      return {
        id: row.id,
        orderNumber: row.order_number,
        customer: {
          name: row.customer_name,
          phone: row.customer_phone,
          district: row.customer_district,
          addressDetails: row.customer_address,
          notes: row.customer_notes || undefined,
        },
        items: orderItems,
        subtotal: Number(row.subtotal),
        deliveryFee: Number(row.delivery_fee),
        totalAmount: Number(row.total_amount),
        paymentMethod: row.payment_method as Order['paymentMethod'],
        status: row.status as OrderStatus,
        createdAt: row.created_at,
        updatedAt: row.created_at,
      }
    })
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err)
    return []
  }
}

/**
 * Updates order status in Supabase.
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      console.warn('Failed to update order status in Supabase:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn('Network error updating order status in Supabase:', err)
    return false
  }
}

/**
 * Synchronizes dish stock status to Supabase dishes table.
 */
export async function updateDishStockInSupabase(
  dishId: string,
  inStock: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dishes')
      .update({ in_stock: inStock })
      .eq('id', dishId)

    if (error) {
      console.warn('Failed to update dish stock in Supabase:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn('Network error updating dish stock in Supabase:', err)
    return false
  }
}
