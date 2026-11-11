import React from 'react'
import { CheckCircle2, XCircle, RotateCcw, UtensilsCrossed, AlertTriangle } from 'lucide-react'
import { useMenuStore } from '../../store/useMenuStore'
import { formatPrice } from '../../data/menu'
import { updateDishStockInSupabase } from '../../services/orderService'
import { cn } from '../../lib/utils'

export const StockManager: React.FC = () => {
  const dishes = useMenuStore((state) => state.dishes)
  const toggleDishStock = useMenuStore((state) => state.toggleDishStock)
  const resetMenuToDefaults = useMenuStore((state) => state.resetMenuToDefaults)

  const outOfStockCount = dishes.filter((d) => !d.inStock).length

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Summary & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-card p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">إدارة توفر أطباق المطبخ اليومية</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            تحديث توفر الأطباق ينعكس فورياً على المتجر، ويعطل زر الطلب ويظهر شارة "نفد اليوم" للعملاء.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {outOfStockCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-700">
              <AlertTriangle className="size-3.5" />
              <span>{outOfStockCount} أطباق غير متوفرة</span>
            </span>
          )}
          <button
            type="button"
            onClick={resetMenuToDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>إعادة ضبط الكل</span>
          </button>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dishes.map((dish) => {
          const isAvailable = dish.inStock

          return (
            <div
              key={dish.id}
              className={cn(
                'rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition-all',
                isAvailable
                  ? 'bg-card border-border/80 shadow-sm'
                  : 'bg-muted/40 border-rose-300/60 opacity-90'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className={cn(
                    'size-12 rounded-xl object-cover border border-border/60 shrink-0 transition-all',
                    !isAvailable && 'grayscale'
                  )}
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-xs text-foreground truncate">{dish.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatPrice(dish.price)} · {dish.unit}</p>
                  <p
                    className={cn(
                      'text-[10px] font-bold',
                      isAvailable ? 'text-emerald-700' : 'text-rose-700'
                    )}
                  >
                    {isAvailable ? 'جاهز ومتوفر بالمطبخ' : 'نفد من المطبخ اليوم'}
                  </p>
                </div>
              </div>

              {/* Toggle Stock Switch Button */}
              <button
                type="button"
                onClick={() => {
                  toggleDishStock(dish.id)
                  updateDishStockInSupabase(dish.id, !dish.inStock).catch((err) => {
                    console.warn('Dish stock Supabase sync notice:', err)
                  })
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-sm shrink-0 min-h-[44px]',
                  isAvailable
                    ? 'bg-emerald-600/10 text-emerald-800 border border-emerald-600/30 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                    : 'bg-rose-600 text-white hover:bg-emerald-600 transition-colors'
                )}
                aria-label={`تغيير حالة توفر ${dish.name}`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>متوفر</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    <span>نفد اليوم</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
