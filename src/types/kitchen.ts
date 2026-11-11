import { OrderStatus } from './order'

export interface StatusMeta {
  label: string
  badgeClass: string
  bgLight: string
  textClass: string
  nextStatus?: OrderStatus
  nextActionLabel?: string
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: "جديد",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    bgLight: "bg-amber-50/70",
    textClass: "text-amber-800",
    nextStatus: "processing",
    nextActionLabel: "بدء التحضير بالمطبخ",
  },
  processing: {
    label: "قيد التحضير",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
    bgLight: "bg-purple-50/70",
    textClass: "text-purple-800",
    nextStatus: "confirmed",
    nextActionLabel: "جاهز للتسليم",
  },
  confirmed: {
    label: "جاهز للتوصيل",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    bgLight: "bg-blue-50/70",
    textClass: "text-blue-800",
    nextStatus: "shipped",
    nextActionLabel: "تسليم للمندوب",
  },
  shipped: {
    label: "جاري التوصيل",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-300",
    bgLight: "bg-sky-50/70",
    textClass: "text-sky-800",
    nextStatus: "delivered",
    nextActionLabel: "تأكيد الاستلام",
  },
  delivered: {
    label: "تم التوصيل",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    bgLight: "bg-emerald-50/70",
    textClass: "text-emerald-800",
  },
  cancelled: {
    label: "ملغي",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
    bgLight: "bg-rose-50/70",
    textClass: "text-rose-800",
  },
}

export interface KitchenKPIs {
  totalRevenue: number
  activeOrdersCount: number
  totalOrdersCount: number
  deliveredOrdersCount: number
  topDishes: { name: string; count: number }[]
}
