import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  Star,
  Search,
  CheckCircle2,
  EyeOff,
  Trash2,
  RefreshCw,
  X,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { AdminReview } from '../../../types/admin'
import {
  fetchAllReviews,
  updateReviewPublishStatus,
  deleteReview,
} from '../../../services/adminService'
import { cn } from '../../../lib/utils'

export interface ReviewsModuleProps {
  initialReviews?: AdminReview[]
  onCountChange?: (hiddenCount: number) => void
}

export const ReviewsModule: React.FC<ReviewsModuleProps> = ({
  initialReviews,
  onCountChange,
}) => {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews || [])
  const [loading, setLoading] = useState(!initialReviews)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDishFilter, setSelectedDishFilter] = useState('all')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'published' | 'hidden'>('all')
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all')

  // Deletion modal state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadReviews = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await fetchAllReviews()
      setReviews(data)
    } catch (err) {
      console.warn('Error loading reviews in ReviewsModule:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!initialReviews) {
      loadReviews()
    }
  }, [initialReviews])

  // Notify parent of hidden reviews count for sidebar badge
  useEffect(() => {
    const hiddenCount = reviews.filter((r) => !r.isPublished).length
    if (onCountChange) {
      onCountChange(hiddenCount)
    }
  }, [reviews, onCountChange])

  // Unique dishes for dropdown filter
  const uniqueDishes = useMemo(() => {
    const map = new Map<string, string>()
    reviews.forEach((r) => {
      if (r.dishId && r.dishName) {
        map.set(r.dishId, r.dishName)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [reviews])

  // KPIs
  const totalCount = reviews.length
  const publishedCount = reviews.filter((r) => r.isPublished).length
  const hiddenCount = reviews.filter((r) => !r.isPublished).length
  const averageRating = useMemo(() => {
    if (totalCount === 0) return 5.0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / totalCount).toFixed(1)
  }, [reviews, totalCount])

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchesName = r.customerName.toLowerCase().includes(q)
        const matchesComment = r.comment.toLowerCase().includes(q)
        const matchesDish = r.dishName.toLowerCase().includes(q)
        if (!matchesName && !matchesComment && !matchesDish) return false
      }

      // Dish filter
      if (selectedDishFilter !== 'all' && r.dishId !== selectedDishFilter) {
        return false
      }

      // Status filter
      if (selectedStatusFilter === 'published' && !r.isPublished) return false
      if (selectedStatusFilter === 'hidden' && r.isPublished) return false

      // Rating filter
      if (selectedRatingFilter !== 'all') {
        if (selectedRatingFilter === 3) {
          if (r.rating > 3) return false
        } else if (r.rating !== selectedRatingFilter) {
          return false
        }
      }

      return true
    })
  }, [reviews, searchQuery, selectedDishFilter, selectedStatusFilter, selectedRatingFilter])

  // Toggle publish status
  const handleToggleStatus = async (review: AdminReview) => {
    const newStatus = !review.isPublished
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, isPublished: newStatus } : r))
    )

    const res = await updateReviewPublishStatus(review.id, newStatus)
    if (!res.success) {
      // Revert on error
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isPublished: review.isPublished } : r))
      )
      setActionError(res.error || 'فشل في تحديث حالة النشر')
    }
  }

  // Delete review
  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    setActionError(null)

    const res = await deleteReview(deletingId)
    setIsDeleting(false)

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== deletingId))
      setDeletingId(null)
    } else {
      setActionError(res.error || 'فشل في حذف التقييم')
    }
  }

  const formatReviewDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <Star className="size-5 text-amber-500 fill-amber-400" />
            <span>لوحة إدارة ومراجعة تقييمات العملاء</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            مراقبة آراء وتجارب ذواقة الرياض، التحكم في ظهور التقييمات بصفحات الأطباق، وحجب الرسائل غير اللائقة
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadReviews(true)}
          disabled={refreshing || loading}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className={cn('size-3.5', refreshing && 'animate-spin text-primary')} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {actionError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-50 p-4 text-xs font-bold text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="p-1 text-red-600 hover:text-red-900"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground">إجمالي التقييمات</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <MessageSquare className="size-4 text-muted-foreground/60" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground">متوسط التقييم العام</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 flex items-center gap-1">
              <span>{averageRating}</span>
              <Star className="size-4 fill-amber-400 text-amber-400 inline" />
            </span>
            <Sparkles className="size-4 text-amber-500/60" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground">تقييمات معروضة بالمتجر</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{publishedCount}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              نشط
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-card p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground">تقييمات محجوبة/مخفية</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{hiddenCount}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
              مخفي
            </span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="size-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم، الصنف، أو محتوى التعليق..."
              className="w-full rounded-xl border border-border bg-background pr-10 pl-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Dish Dropdown Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDishFilter}
              onChange={(e) => setSelectedDishFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">جميع الأطباق ({uniqueDishes.length})</option>
              {uniqueDishes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Segment Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'published' | 'hidden')}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="published">المنشور فقط ({publishedCount})</option>
              <option value="hidden">المخفي فقط ({hiddenCount})</option>
            </select>
          </div>

          {/* Rating Dropdown Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRatingFilter}
              onChange={(e) => {
                const val = e.target.value
                setSelectedRatingFilter(val === 'all' ? 'all' : Number(val))
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">كل النجوم</option>
              <option value="5">5 نجوم ★★★★★</option>
              <option value="4">4 نجوم ★★★★</option>
              <option value="3">3 نجوم فأقل ★★★</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Moderation List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse">
            جاري جلب تقييمات العملاء من السحابة...
          </p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center space-y-2">
          <Star className="size-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-sm font-bold text-foreground">لا توجد تقييمات تطابق معايير البحث</h3>
          <p className="text-xs text-muted-foreground">
            جرّب تغيير فلاتر التصفية أو مسح عبارة البحث لرؤية كافة التقييمات.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className={cn(
                'rounded-2xl border bg-card p-4 sm:p-5 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4',
                r.isPublished ? 'border-border/80' : 'border-amber-500/30 bg-amber-500/[0.04]'
              )}
            >
              {/* Right Side Info */}
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-black text-sm text-foreground">{r.customerName}</span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                    <CheckCircle2 className="size-3" />
                    <span>عميل موثّق 🌿</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">
                    {r.dishName}
                  </span>

                  <div className="flex items-center text-amber-400 gap-0.5 mr-auto sm:mr-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'size-3.5',
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        )}
                      />
                    ))}
                    <span className="text-xs font-bold text-muted-foreground mr-1">({r.rating})</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                  "{r.comment}"
                </p>

                <div className="text-[11px] text-muted-foreground">
                  تاريخ التسجيل: {formatReviewDate(r.createdAt)}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60 w-full md:w-auto justify-end">
                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(r)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                    r.isPublished
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  )}
                  title={r.isPublished ? 'انقر لإخفاء التقييم من المتجر' : 'انقر لنشر التقييم في المتجر'}
                >
                  {r.isPublished ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>منشور بالمتجر</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5 text-amber-600" />
                      <span>مخفي عن الزوار</span>
                    </>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeletingId(r.id)}
                  className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  title="حذف التقييم نهائياً"
                  aria-label="حذف التقييم"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal (Portaled) */}
      {deletingId &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) setDeletingId(null)
            }}
          >
            <div
              className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto size-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="size-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-foreground">حذف التقييم نهائياً؟</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  هل أنت متأكد من حذف هذا التقييم من السحابة؟ لا يمكن استرجاع المراجعة بعد حذفها.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
export default ReviewsModule
