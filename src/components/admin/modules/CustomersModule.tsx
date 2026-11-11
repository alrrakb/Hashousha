import React, { useState, useMemo } from 'react'
import { Users, Phone, MessageCircle, Search, MapPin, Calendar } from 'lucide-react'
import { Order } from '../../../types/order'
import { aggregateCustomersFromOrders } from '../../../services/adminService'
import { formatPrice } from '../../../data/menu'

export interface CustomersModuleProps {
  orders: Order[]
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const allCustomers = useMemo(() => aggregateCustomersFromOrders(orders), [orders])

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return allCustomers
    const q = searchQuery.toLowerCase().trim()
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.primaryDistrict.toLowerCase().includes(q)
    )
  }, [allCustomers, searchQuery])

  const totalSpendAll = allCustomers.reduce((acc, c) => acc + c.lifetimeSpend, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-foreground flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <span>سجل ودليل العملاء (CRM)</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          بيانات العملاء في الرياض، حجم الطلبات التراكمي، إجمالي الإنفاق، وروابط الاتصال السريعة بالواتساب.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">إجمالي العملاء المسجلين</span>
          <p className="text-2xl font-black text-foreground">{allCustomers.length.toLocaleString('ar-SA')}</p>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">إجمالي مشتريات العملاء</span>
          <p className="text-2xl font-black text-primary">{formatPrice(totalSpendAll)}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">متوسط إنفاق العميل</span>
          <p className="text-2xl font-black text-foreground">
            {formatPrice(allCustomers.length > 0 ? Math.round(totalSpendAll / allCustomers.length) : 0)}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="البحث باسم العميل، رقم الجوال أو الحي..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 pr-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-secondary/60 text-muted-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3 px-4">العميل</th>
              <th className="py-3 px-4">رقم الجوال</th>
              <th className="py-3 px-4">حي التوصيل</th>
              <th className="py-3 px-4">عدد الطلبات</th>
              <th className="py-3 px-4">إجمالي الإنفاق</th>
              <th className="py-3 px-4">آخر طلب</th>
              <th className="py-3 px-4 text-left">تواصل سريع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  لا يوجد عملاء يطابقون معايير البحث
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const phoneClean = cust.phone.replace(/\D/g, '')
                const waUrl = `https://wa.me/966${phoneClean.startsWith('0') ? phoneClean.slice(1) : phoneClean}`
                const telUrl = `tel:${cust.phone}`
                const formattedDate = new Date(cust.lastOrderDate).toLocaleDateString('ar-SA')

                return (
                  <tr key={cust.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{cust.name}</td>
                    <td className="py-3 px-4 font-mono font-bold" dir="ltr">
                      {cust.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3 text-primary" />
                        <span>حي {cust.primaryDistrict}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {cust.totalOrders}
                    </td>
                    <td className="py-3 px-4 font-black text-primary">
                      {formatPrice(cust.lifetimeSpend)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{formattedDate}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={telUrl}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="اتصال هاتفي"
                        >
                          <Phone className="size-4 text-primary" />
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                          title="محادثة واتساب"
                        >
                          <MessageCircle className="size-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
