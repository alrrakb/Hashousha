import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { Dish } from '../../../types/menu'
import { AdminCategory, AdminBadge } from '../../../types/admin'
import { formatPrice } from '../../../data/menu'
import { ProductEditModal } from './ProductEditModal'
import { saveDishToSupabase, deleteDishFromSupabase } from '../../../services/adminService'
import { getBadges, BADGE_CHANNEL_NAME, getBadgeDisplayConfig } from '../../../services/badgeService'
import { useMenuStore } from '../../../store/useMenuStore'
import { cn } from '../../../lib/utils'

export interface ProductsModuleProps {
  dishes: Dish[]
  categories: AdminCategory[]
  onUpdateDishes: (dishes: Dish[]) => void
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  dishes,
  categories,
  onUpdateDishes,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState('all')
  const [badgesList, setBadgesList] = useState<AdminBadge[]>(() => getBadges())

  const [editingDish, setEditingDish] = useState<Dish | null | undefined>(undefined)
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdate = () => {
      setBadgesList(getBadges())
    }
    window.addEventListener('hashousha_badges_updated', handleUpdate)
    let bc: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(BADGE_CHANNEL_NAME)
      bc.onmessage = (event) => {
        if (event.data?.type === 'BADGES_UPDATE') {
          setBadgesList(getBadges())
        }
      }
    }
    return () => {
      window.removeEventListener('hashousha_badges_updated', handleUpdate)
      bc?.close()
    }
  }, [])

  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory !== 'all') {
      const isLinked =
        (Array.isArray(dish.categories) && dish.categories.includes(selectedCategory)) ||
        dish.category === selectedCategory
      if (!isLinked) return false
    }
    if (selectedBadge !== 'all') {
      if (selectedBadge === 'none') {
        if (dish.badges && dish.badges.length > 0) return false
      } else {
        if (!dish.badges || !dish.badges.includes(selectedBadge)) return false
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = dish.name.toLowerCase().includes(q)
      const matchEng = dish.englishName.toLowerCase().includes(q)
      const matchDesc = dish.description.toLowerCase().includes(q)
      const matchSlug = dish.slug?.toLowerCase().includes(q)
      return matchName || matchEng || matchDesc || matchSlug
    }
    return true
  })

  const handleSaveDish = async (savedDish: Dish) => {
    // 1. Optimistic local update
    const existingIndex = dishes.findIndex((d) => d.id === savedDish.id)
    let nextDishes: Dish[] = []
    if (existingIndex >= 0) {
      nextDishes = dishes.map((d) => (d.id === savedDish.id ? savedDish : d))
    } else {
      nextDishes = [savedDish, ...dishes]
    }
    onUpdateDishes(nextDishes)
    useMenuStore.getState().setDishes(nextDishes)

    // 2. Cloud save to Supabase
    await saveDishToSupabase(savedDish)
  }

  const handleDeleteDish = async (dishId: string) => {
    const nextDishes = dishes.filter((d) => d.id !== dishId)
    onUpdateDishes(nextDishes)
    useMenuStore.getState().setDishes(nextDishes)
    setDeletingDishId(null)
    await deleteDishFromSupabase(dishId)
  }

  const handleToggleStock = async (dish: Dish) => {
    const toggled = { ...dish, inStock: !dish.inStock }
    const nextDishes = dishes.map((d) => (d.id === dish.id ? toggled : d))
    onUpdateDishes(nextDishes)
    useMenuStore.getState().setDishes(nextDishes)
    await saveDishToSupabase(toggled)
  }

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <UtensilsCrossed className="size-5 text-primary" />
            <span>إدارة قائمة الأطباق والكتالوج</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            إضافة أطباق جديدة، تعديل الأسعار، الصور وروابط السيو، وتحديث توفر المطبخ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingDish(null)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98"
        >
          <Plus className="size-4" />
          <span>إضافة صنف جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="البحث باسم الصنف، الرابط، أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 pr-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              مسح
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">جميع التصنيفات ({dishes.length})</option>
            {categories.map((c) => {
              const count = dishes.filter((d) => d.category === c.id).length
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              )
            })}
          </select>

          {/* Badge Filter */}
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="all">جميع الشارات ({dishes.length})</option>
            <option value="none">
              بدون أي شارة ({dishes.filter((d) => !d.badges || d.badges.length === 0).length})
            </option>
            {badgesList.map((b) => {
              const count = dishes.filter((d) => d.badges?.includes(b.id)).length
              return (
                <option key={b.id} value={b.id}>
                  🏷️ {b.label} ({count})
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-secondary/60 text-muted-foreground font-bold border-b border-border/80">
              <tr>
                <th className="py-3 px-4">الصنف</th>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">السعر</th>
                <th className="py-3 px-4">شارات التمييز</th>
                <th className="py-3 px-4">رابط السيو (Slug)</th>
                <th className="py-3 px-4">حالة التوفر</th>
                <th className="py-3 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    لا توجد أصناف تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => {
                  const catObj = categories.find((c) => c.id === dish.category)

                  return (
                    <tr key={dish.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Dish Thumbnail & Names */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className={cn(
                              'size-11 rounded-xl object-cover border border-border/60 shrink-0',
                              !dish.inStock && 'grayscale opacity-75'
                            )}
                          />
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-foreground text-xs sm:text-sm">{dish.name}</p>
                            <span className="text-[10px] text-primary/80 font-semibold">{dish.unit}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-semibold text-foreground/80">
                        {(() => {
                          const dishCats =
                            Array.isArray(dish.categories) && dish.categories.length > 0
                              ? dish.categories
                              : dish.category
                              ? [dish.category]
                              : []
                          const linkedCats = categories.filter((c) => dishCats.includes(c.id))

                          if (linkedCats.length === 0) {
                            return (
                              <span className="text-muted-foreground text-[11px]">
                                {catObj ? catObj.name : dish.category}
                              </span>
                            )
                          }

                          return (
                            <div className="flex flex-wrap items-center gap-1">
                              {linkedCats.map((c) => (
                                <span
                                  key={c.id}
                                  className="inline-flex items-center rounded-md bg-secondary border border-border/80 px-2 py-0.5 text-[10px] font-bold text-foreground"
                                >
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          )
                        })()}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-black text-foreground">
                        {formatPrice(dish.price)}
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        {dish.badges && dish.badges.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[170px]">
                            {dish.badges.map((bId) => {
                              const bCfg = getBadgeDisplayConfig(bId, badgesList)
                              return (
                                <span
                                  key={bId}
                                  className={cn(
                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm',
                                    bCfg.className
                                  )}
                                >
                                  <bCfg.Icon className={cn('size-2.5 shrink-0', bCfg.iconColor)} />
                                  <span>{bCfg.label}</span>
                                </span>
                              )
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60">—</span>
                        )}
                      </td>

                      {/* SEO Slug */}
                      <td className="py-3 px-4">
                        <a
                          href={`/dish/${dish.slug || dish.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1"
                          dir="ltr"
                        >
                          <span>/{dish.slug || dish.id}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(dish)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors',
                            dish.inStock
                              ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-800 border-rose-500/30'
                          )}
                        >
                          {dish.inStock ? (
                            <>
                              <CheckCircle2 className="size-3 text-emerald-600" />
                              <span>متوفر</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-3 text-rose-600" />
                              <span>نفد اليوم</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingDish(dish)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            aria-label={`تعديل ${dish.name}`}
                          >
                            <Edit2 className="size-4 text-primary" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingDishId(dish.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            aria-label={`حذف ${dish.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
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

      {/* Edit/Add Modal */}
      {editingDish !== undefined && (
        <ProductEditModal
          dish={editingDish}
          categories={categories}
          isOpen={true}
          onClose={() => setEditingDish(undefined)}
          onSave={handleSaveDish}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingDishId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingDishId(null)
            }}
          >
            <div
              className="rounded-2xl border border-rose-500/30 bg-card p-6 shadow-2xl max-w-sm w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-bold text-foreground">تأكيد حذف الصنف</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الصنف من الكتالوج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingDishId(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-foreground hover:bg-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteDish(deletingDishId)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
