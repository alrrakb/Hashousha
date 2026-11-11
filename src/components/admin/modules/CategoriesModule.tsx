import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Tag,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
  Search,
  Check,
  Layers,
  Loader2,
  Filter,
} from 'lucide-react'
import { Dish } from '../../../types/menu'
import { AdminCategory, AdminBadge } from '../../../types/admin'
import {
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
  saveDishesBulkToSupabase,
} from '../../../services/adminService'
import { useMenuStore } from '../../../store/useMenuStore'
import {
  getBadges,
  addBadge,
  deleteBadge,
  getBadgeIcon,
  BADGE_ICON_MAP,
} from '../../../services/badgeService'
import { cn } from '../../../lib/utils'

export interface CategoriesModuleProps {
  categories: AdminCategory[]
  onUpdateCategories: (categories: AdminCategory[]) => void
  dishes?: Dish[]
  onUpdateDishes?: (dishes: Dish[]) => void
}

export const CategoriesModule: React.FC<CategoriesModuleProps> = ({
  categories,
  onUpdateCategories,
  dishes = [],
  onUpdateDishes,
}) => {
  // Sub-tab: Categories vs Badges
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'badges'>('categories')

  // Category State
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [slug, setSlug] = useState('')
  const [sortOrder, setSortOrder] = useState(10)
  const [isActive, setIsActive] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Category Products Association State
  const [managingProductsCategory, setManagingProductsCategory] = useState<AdminCategory | null>(null)
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set())
  const [dishSearchQuery, setDishSearchQuery] = useState('')
  const [onlyLinkedFilter, setOnlyLinkedFilter] = useState(false)
  const [isSavingProducts, setIsSavingProducts] = useState(false)
  const [saveProductsSuccess, setSaveProductsSuccess] = useState<string | null>(null)

  // Badge State
  const [badges, setBadges] = useState<AdminBadge[]>(getBadges)
  const [editingBadge, setEditingBadge] = useState<AdminBadge | null | undefined>(undefined)
  const [deletingBadgeId, setDeletingBadgeId] = useState<string | null>(null)
  const [badgeLabel, setBadgeLabel] = useState('')
  const [badgeEnglishLabel, setBadgeEnglishLabel] = useState('')
  const [badgeSlug, setBadgeSlug] = useState('')
  const [badgeIconName, setBadgeIconName] = useState('Star')
  const [badgeDescription, setBadgeDescription] = useState('')
  const [badgeErrorMsg, setBadgeErrorMsg] = useState<string | null>(null)

  // Sync badges on custom event
  useEffect(() => {
    const handleUpdate = () => {
      setBadges(getBadges())
    }
    window.addEventListener('hashousha_badges_updated', handleUpdate)
    return () => window.removeEventListener('hashousha_badges_updated', handleUpdate)
  }, [])

  // ---------------------------------------------------------------------------
  // Category Handlers
  // ---------------------------------------------------------------------------
  const openCategoryModal = (cat?: AdminCategory) => {
    if (cat) {
      setEditingCategory(cat)
      setName(cat.name)
      setEnglishName(cat.englishName)
      setSlug(cat.slug)
      setSortOrder(cat.sortOrder)
      setIsActive(cat.isActive)
    } else {
      setEditingCategory(null)
      setName('')
      setEnglishName('')
      setSlug('')
      setSortOrder((categories.length + 1) * 10)
      setIsActive(true)
    }
    setErrorMsg(null)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم التصنيف بالعربية')
      return
    }

    const finalSlug = slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-')
    const finalId = editingCategory ? editingCategory.id : `cat_${Date.now()}`

    const catObj: AdminCategory = {
      id: finalId,
      name: name.trim(),
      englishName: englishName.trim() || name.trim(),
      slug: finalSlug,
      sortOrder: Number(sortOrder),
      isActive,
    }

    const updated = editingCategory
      ? categories.map((c) => (c.id === editingCategory.id ? catObj : c))
      : [...categories, catObj]

    updated.sort((a, b) => a.sortOrder - b.sortOrder)
    onUpdateCategories(updated)
    setEditingCategory(undefined)

    await saveCategoryToSupabase(catObj)
  }

  const handleDeleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id)
    onUpdateCategories(updated)
    setDeletingId(null)
    await deleteCategoryFromSupabase(id)
  }

  const handleToggleActiveCategory = async (cat: AdminCategory) => {
    const toggled = { ...cat, isActive: !cat.isActive }
    const updated = categories.map((c) => (c.id === cat.id ? toggled : c))
    onUpdateCategories(updated)
    await saveCategoryToSupabase(toggled)
  }

  // ---------------------------------------------------------------------------
  // Category Products Handlers (Multi-Category Engine)
  // ---------------------------------------------------------------------------
  const openProductsModalForCategory = (cat: AdminCategory) => {
    const initiallyLinked = (dishes || [])
      .filter(
        (d) =>
          (Array.isArray(d.categories) && d.categories.includes(cat.id)) ||
          d.category === cat.id
      )
      .map((d) => d.id)

    setSelectedDishIds(new Set(initiallyLinked))
    setManagingProductsCategory(cat)
    setDishSearchQuery('')
    setOnlyLinkedFilter(false)
    setSaveProductsSuccess(null)
  }

  const toggleDishSelection = (dishId: string) => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev)
      if (next.has(dishId)) {
        next.delete(dishId)
      } else {
        next.add(dishId)
      }
      return next
    })
  }

  const handleSelectAllVisible = (visibleIds: string[]) => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev)
      visibleIds.forEach((id) => next.add(id))
      return next
    })
  }

  const handleDeselectAllVisible = (visibleIds: string[]) => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev)
      visibleIds.forEach((id) => next.delete(id))
      return next
    })
  }

  const handleSaveCategoryProducts = async () => {
    if (!managingProductsCategory) return
    setIsSavingProducts(true)
    setSaveProductsSuccess(null)

    const catId = managingProductsCategory.id

    const updatedDishes: Dish[] = (dishes || []).map((dish) => {
      const isSelected = selectedDishIds.has(dish.id)
      const currentCats =
        Array.isArray(dish.categories) && dish.categories.length > 0
          ? [...dish.categories]
          : dish.category
          ? [dish.category]
          : []

      let nextCats = [...currentCats]
      if (isSelected) {
        if (!nextCats.includes(catId)) {
          nextCats.push(catId)
        }
      } else {
        nextCats = nextCats.filter((id) => id !== catId)
      }

      // If categories array becomes empty, retain previous category as fallback
      let nextPrimary = dish.category
      if (nextCats.length > 0) {
        if (!nextCats.includes(dish.category)) {
          nextPrimary = nextCats[0]
        }
      } else {
        nextPrimary = dish.category || catId
      }

      return {
        ...dish,
        category: nextPrimary,
        categories: nextCats,
      }
    })

    // Identify changed dishes
    const changedDishes = updatedDishes.filter((dish) => {
      const original = (dishes || []).find((d) => d.id === dish.id)
      if (!original) return true
      const origCats = (original.categories || [original.category]).sort().join(',')
      const newCats = (dish.categories || [dish.category]).sort().join(',')
      return origCats !== newCats || original.category !== dish.category
    })

    try {
      if (changedDishes.length > 0) {
        await saveDishesBulkToSupabase(changedDishes)
      }

      // Optimistic update in parent
      onUpdateDishes?.(updatedDishes)

      // Update global zustand store for instantaneous storefront reflection
      useMenuStore.getState().setDishes(updatedDishes)

      setSaveProductsSuccess(
        `تم بنجاح تحديث ومزامنة ${selectedDishIds.size} منتج لتصنيف "${managingProductsCategory.name}" مع المتجر وقاعدة البيانات!`
      )

      setTimeout(() => {
        setManagingProductsCategory(null)
      }, 1200)
    } catch (err) {
      console.error('Error saving category products:', err)
    } finally {
      setIsSavingProducts(false)
    }
  }

  // Filtered dishes for the category products modal
  const filteredModalDishes = (dishes || []).filter((dish) => {
    if (onlyLinkedFilter && !selectedDishIds.has(dish.id)) {
      return false
    }
    if (dishSearchQuery.trim()) {
      const q = dishSearchQuery.toLowerCase().trim()
      const matchName = dish.name.toLowerCase().includes(q)
      const matchEng = (dish.englishName || '').toLowerCase().includes(q)
      const matchDesc = (dish.description || '').toLowerCase().includes(q)
      const matchSlug = (dish.slug || '').toLowerCase().includes(q)
      return matchName || matchEng || matchDesc || matchSlug
    }
    return true
  })

  // ---------------------------------------------------------------------------
  // Badge Handlers
  // ---------------------------------------------------------------------------
  const openBadgeModal = (b?: AdminBadge) => {
    if (b) {
      setEditingBadge(b)
      setBadgeLabel(b.label)
      setBadgeEnglishLabel(b.englishLabel || '')
      setBadgeSlug(b.id)
      setBadgeIconName(b.iconName || 'Star')
      setBadgeDescription(b.description || '')
    } else {
      setEditingBadge(null)
      setBadgeLabel('')
      setBadgeEnglishLabel('')
      setBadgeSlug('')
      setBadgeIconName('Star')
      setBadgeDescription('')
    }
    setBadgeErrorMsg(null)
  }

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!badgeLabel.trim()) {
      setBadgeErrorMsg('يرجى إدخال عنوان الشارة بالعربية')
      return
    }

    const finalSlug =
      (badgeSlug.trim() ||
        badgeEnglishLabel.trim().toLowerCase().replace(/\s+/g, '-') ||
        `badge_${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')

    if (!editingBadge && badges.some((b) => b.id === finalSlug)) {
      setBadgeErrorMsg('معرّف الشارة (Slug) مستخدم بالفعل، يرجى اختيار معرّف آخر')
      return
    }

    const badgeObj: AdminBadge = {
      id: editingBadge ? editingBadge.id : finalSlug,
      label: badgeLabel.trim(),
      englishLabel: badgeEnglishLabel.trim() || badgeLabel.trim(),
      iconName: badgeIconName,
      description: badgeDescription.trim(),
      isDefault: editingBadge?.isDefault || false,
    }

    const nextBadges = addBadge(badgeObj)
    setBadges(nextBadges)
    setEditingBadge(undefined)
  }

  const handleDeleteBadge = (id: string) => {
    const nextBadges = deleteBadge(id)
    setBadges(nextBadges)
    setDeletingBadgeId(null)
  }

  const PreviewIcon = getBadgeIcon(badgeIconName)

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Pill Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center p-1 rounded-2xl bg-secondary/80 dark:bg-card border border-primary/20">
          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeSubTab === 'categories'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FolderTree className={cn('size-4', activeSubTab === 'categories' ? 'text-primary-foreground' : 'text-primary')} />
            <span>تصنيفات القائمة ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('badges')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeSubTab === 'badges'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Tag className={cn('size-4', activeSubTab === 'badges' ? 'text-primary-foreground' : 'text-primary')} />
            <span>شارات التمييز والوسوم ({badges.length})</span>
          </button>
        </div>

        {activeSubTab === 'categories' ? (
          <button
            type="button"
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98"
          >
            <Plus className="size-4" />
            <span>إضافة تصنيف جديد</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openBadgeModal()}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98"
          >
            <Plus className="size-4" />
            <span>إضافة شارة تمييز جديدة</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* VIEW 1: CATEGORIES TABLE                                           */}
      {/* =================================================================== */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <FolderTree className="size-4 text-primary" />
              <span>تبويب وأقسام قائمة الطعام</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              ترتيب وتبويب الأقسام، والتي تنعكس فورياً على شريط التصنيفات في المتجر الرئيسي.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-secondary/60 text-muted-foreground font-bold border-b border-border/80">
                <tr>
                  <th className="py-3 px-4">اسم التصنيف</th>
                  <th className="py-3 px-4">الاسم بالإنجليزية</th>
                  <th className="py-3 px-4">الرابط (Slug)</th>
                  <th className="py-3 px-4">الترتيب</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">المنتجات المرتبطة</th>
                  <th className="py-3 px-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{cat.name}</td>
                    <td className="py-3 px-4 font-serif text-[11px] text-muted-foreground" dir="ltr">
                      {cat.englishName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-primary" dir="ltr">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">{cat.sortOrder}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActiveCategory(cat)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border',
                          cat.isActive
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
                        )}
                      >
                        {cat.isActive ? (
                          <>
                            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            <span>نشط بالمتجر</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
                            <span>معطّل</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Linked Products Count & Management Button */}
                    <td className="py-3 px-4 text-center">
                      {(() => {
                        const linkedCount = (dishes || []).filter(
                          (d) =>
                            (Array.isArray(d.categories) && d.categories.includes(cat.id)) ||
                            d.category === cat.id
                        ).length

                        return (
                          <button
                            type="button"
                            onClick={() => openProductsModalForCategory(cat)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary px-3 py-1.5 text-xs font-bold transition-all shadow-xs group cursor-pointer"
                            title={`إدارة وإضافة المنتجات المرتبطة بتصنيف "${cat.name}"`}
                          >
                            <Package className="size-3.5 transition-transform group-hover:scale-110" />
                            <span>ربط المنتجات</span>
                            <span className="rounded-full bg-primary/20 group-hover:bg-black/20 dark:group-hover:bg-white/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                              {linkedCount}
                            </span>
                          </button>
                        )
                      })()}
                    </td>

                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openProductsModalForCategory(cat)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                          title="إدارة المنتجات المرتبطة"
                        >
                          <Layers className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openCategoryModal(cat)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          title="تعديل التصنيف"
                        >
                          <Edit2 className="size-4 text-primary" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(cat.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="حذف التصنيف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: BADGES MANAGEMENT GRID                                      */}
      {/* =================================================================== */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-foreground flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              <span>شارات التمييز الترويجية (Badges Showcase)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              التحكم في شارات الأطباق (مثل الأكثر طلباً، حامض حلو، جديد)، وإضافة شارات مخصصة لتمييز المنتجات في الواجهة وتصفيتها.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => {
              const IconComp = getBadgeIcon(b.iconName)
              return (
                <div
                  key={b.id}
                  className="rounded-2xl border border-primary/15 bg-card p-4 space-y-3 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Live Preview Pill */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-[#1f150c]/95 text-white border border-[#9e774c]/60 shadow-md backdrop-blur-md">
                        <IconComp className="size-3.5 text-amber-400" />
                        <span>{b.label}</span>
                      </div>

                      {b.isDefault ? (
                        <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                          شارة أساسية
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          شارة مخصصة ✨
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-foreground">{b.label}</h3>
                      {b.englishLabel && (
                        <p className="text-[11px] font-serif text-muted-foreground" dir="ltr">
                          {b.englishLabel}
                        </p>
                      )}
                    </div>

                    {b.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-primary" dir="ltr">
                      slug: {b.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openBadgeModal(b)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        title="تعديل الشارة"
                      >
                        <Edit2 className="size-4 text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBadgeId(b.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                        title="حذف الشارة"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: CATEGORY ADD / EDIT                                        */}
      {/* =================================================================== */}
      {editingCategory !== undefined &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingCategory(undefined)
            }}
          >
            <div
              className="rounded-[2rem] border border-primary/25 bg-card p-6 shadow-2xl max-w-md w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCategory(undefined)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="size-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/30 p-2.5 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-700 dark:text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveCategory} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">اسم التصنيف بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ورق عنب فاخر"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    placeholder="Vine Leaves"
                    value={englishName}
                    onChange={(e) => {
                      setEnglishName(e.target.value)
                      if (!editingCategory) {
                        setSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, '-'))
                      }
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">الرابط (Slug)</label>
                    <input
                      type="text"
                      placeholder="warak"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">الترتيب الرقمي</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-primary focus:ring-primary size-4"
                    />
                    <span>تفعيل وعرض في المتجر</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(undefined)}
                      className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      حفظ التصنيف
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* =================================================================== */}
      {/* MODAL 2: BADGE ADD / EDIT                                           */}
      {/* =================================================================== */}
      {editingBadge !== undefined &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingBadge(undefined)
            }}
          >
            <div
              className="rounded-[2rem] border border-primary/25 bg-card p-6 shadow-2xl max-w-md w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  {editingBadge ? 'تعديل شارة التمييز' : 'إضافة شارة تمييز جديدة'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingBadge(undefined)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="size-4" />
                </button>
              </div>

              {badgeErrorMsg && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/30 p-2.5 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <AlertCircle className="size-4 text-rose-700 dark:text-rose-400 shrink-0" />
                  <span>{badgeErrorMsg}</span>
                </div>
              )}

              {/* Live Preview in Modal */}
              <div className="p-3.5 rounded-2xl border border-primary/20 bg-secondary/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-bold">معاينة مباشرة للشارة:</span>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-[#1f150c]/95 text-white border border-[#9e774c]/60 shadow-md backdrop-blur-md">
                  <PreviewIcon className="size-3.5 text-amber-400" />
                  <span>{badgeLabel || 'شارة جديدة'}</span>
                </div>
              </div>

              <form onSubmit={handleSaveBadge} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">عنوان الشارة بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: إصدار محدود أو شوكولاتة بلجيكية"
                    value={badgeLabel}
                    onChange={(e) => {
                      setBadgeLabel(e.target.value)
                      if (!editingBadge && !badgeSlug) {
                        setBadgeSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, '-'))
                      }
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">الاسم بالإنجليزية</label>
                    <input
                      type="text"
                      placeholder="Limited Edition"
                      value={badgeEnglishLabel}
                      onChange={(e) => setBadgeEnglishLabel(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">المعرّف البرمجي (Slug)</label>
                    <input
                      type="text"
                      placeholder="limited"
                      value={badgeSlug}
                      disabled={!!editingBadge}
                      onChange={(e) => setBadgeSlug(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none disabled:opacity-60"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Icon Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">اختيار أيقونة الشارة</label>
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {Object.keys(BADGE_ICON_MAP).map((iconKey) => {
                      const Icon = BADGE_ICON_MAP[iconKey]
                      const isSelected = badgeIconName === iconKey
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setBadgeIconName(iconKey)}
                          className={cn(
                            'flex flex-col items-center justify-center p-2 rounded-xl border transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/40'
                              : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
                          )}
                          title={iconKey}
                        >
                          <Icon className="size-4" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">الوصف / الاستخدام (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: يظهر للأطباق المتوفرة في مواسم الأعياد"
                    value={badgeDescription}
                    onChange={(e) => setBadgeDescription(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setEditingBadge(undefined)}
                    className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    {editingBadge ? 'حفظ التعديلات' : 'إضافة الشارة'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Category Confirmation */}
      {deletingId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingId(null)
            }}
          >
            <div
              className="rounded-2xl border border-rose-500/30 bg-card p-6 shadow-2xl max-w-sm w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-bold text-foreground">تأكيد حذف التصنيف</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا التصنيف؟ لن تتأثر الأطباق التابعة له.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-foreground hover:bg-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(deletingId)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Badge Confirmation */}
      {deletingBadgeId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingBadgeId(null)
            }}
          >
            <div
              className="rounded-2xl border border-rose-500/30 bg-card p-6 shadow-2xl max-w-sm w-full space-y-4 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-bold text-foreground">تأكيد حذف شارة التمييز</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذه الشارة؟ لن تظهر مجدداً في خيارات المنتجات أو فلاتر المتجر.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingBadgeId(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-foreground hover:bg-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBadge(deletingBadgeId)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =================================================================== */}
      {/* MODAL 3: CATEGORY PRODUCTS ASSOCIATION (MULTI-CATEGORY ENGINE)      */}
      {/* =================================================================== */}
      {managingProductsCategory &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in-50"
            role="dialog"
            aria-modal="true"
            dir="rtl"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSavingProducts) {
                setManagingProductsCategory(null)
              }
            }}
          >
            <div
              className="rounded-[2rem] border border-primary/30 bg-card p-5 sm:p-7 shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] space-y-4 text-right animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border/80 pb-4 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Package className="size-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-foreground">
                      إدارة المنتجات المرتبطة: {managingProductsCategory.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    حدد أو ألغِ تحديد الأطباق التابعة لهذا التصنيف. يمكن للمنتج الواحد الانتماء لعدة تصنيفات في آن واحد (Multi-Category).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="hidden sm:inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-mono text-muted-foreground border border-border/60"
                    dir="ltr"
                  >
                    {managingProductsCategory.slug}
                  </span>
                  <button
                    type="button"
                    disabled={isSavingProducts}
                    onClick={() => setManagingProductsCategory(null)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Success Notification Banner */}
              {saveProductsSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/30 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in-50">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{saveProductsSuccess}</span>
                </div>
              )}

              {/* Search & Bulk Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 bg-secondary/30 p-3 rounded-2xl border border-border/60">
                {/* Search Field */}
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المنتج أو النكهة..."
                    value={dishSearchQuery}
                    onChange={(e) => setDishSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pr-9 pl-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                  {dishSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDishSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter and Bulk Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOnlyLinkedFilter(!onlyLinkedFilter)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-colors cursor-pointer',
                      onlyLinkedFilter
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Filter className="size-3" />
                    <span>المرتبطة فقط</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const visibleIds = filteredModalDishes.map((d) => d.id)
                      handleSelectAllVisible(visibleIds)
                    }}
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary cursor-pointer"
                  >
                    تحديد الكل
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const visibleIds = filteredModalDishes.map((d) => d.id)
                      handleDeselectAllVisible(visibleIds)
                    }}
                    className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary cursor-pointer"
                  >
                    إلغاء الكل
                  </button>

                  <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl px-2.5 py-1.5 whitespace-nowrap">
                    {selectedDishIds.size} من {dishes.length} محدد
                  </span>
                </div>
              </div>

              {/* Scrollable Products List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[240px] max-h-[50vh] scrollbar-thin">
                {filteredModalDishes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2">
                    <Package className="size-8 text-muted-foreground/40 stroke-1" />
                    <p className="text-xs font-medium">لم يتم العثور على أطباق مطابقة للبحث</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {filteredModalDishes.map((dish) => {
                      const isSelected = selectedDishIds.has(dish.id)
                      const otherCategoryIds = (
                        Array.isArray(dish.categories) && dish.categories.length > 0
                          ? dish.categories
                          : dish.category
                          ? [dish.category]
                          : []
                      ).filter((cId) => cId !== managingProductsCategory.id)

                      const otherCategories = categories.filter((c) =>
                        otherCategoryIds.includes(c.id)
                      )

                      return (
                        <div
                          key={dish.id}
                          onClick={() => toggleDishSelection(dish.id)}
                          className={cn(
                            'group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none text-right',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs'
                              : 'border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/30'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox Icon */}
                            <div
                              className={cn(
                                'size-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background group-hover:border-primary/60'
                              )}
                            >
                              {isSelected && <Check className="size-3.5 stroke-[3]" />}
                            </div>

                            {/* Thumbnail */}
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className={cn(
                                'size-11 rounded-xl object-cover border border-border/80 shrink-0',
                                !dish.inStock && 'grayscale opacity-75'
                              )}
                            />

                            {/* Info */}
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">
                                {dish.name}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <span className="font-bold text-primary">
                                  {dish.price} ر.س
                                </span>
                                <span>·</span>
                                <span>{dish.unit}</span>
                              </div>

                              {/* Other linked categories tags */}
                              {otherCategories.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                  <span className="text-[9px] text-muted-foreground/80">ينتمي أيضاً:</span>
                                  {otherCategories.map((oc) => (
                                    <span
                                      key={oc.id}
                                      className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.2 text-[9px] font-semibold text-foreground/80 border border-border/50"
                                    >
                                      {oc.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-between shrink-0">
                <span className="text-xs text-muted-foreground font-medium">
                  {selectedDishIds.size === 0 ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      تنبيه: لم يتم ربط أي منتج بهذا التصنيف حالياً.
                    </span>
                  ) : (
                    <span>
                      سيظهر هذا التصنيف بالمتجر ومعه <strong>{selectedDishIds.size}</strong> منتج.
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSavingProducts}
                    onClick={() => setManagingProductsCategory(null)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={isSavingProducts}
                    onClick={handleSaveCategoryProducts}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingProducts ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>جاري حفظ ومزامنة التصنيف...</span>
                      </>
                    ) : (
                      <>
                        <Check className="size-4" />
                        <span>حفظ التغييرات ومزامنة التصنيف</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
