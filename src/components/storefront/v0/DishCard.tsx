import { useState } from 'react'
import { Minus, Plus, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../cart-context'
import { formatPrice } from '../../../data/menu'
import { Dish } from '../../../types/menu'
import { getBadgeDisplayConfig } from '../../../services/badgeService'
import { useSiteContent } from '../../../context/SiteContentContext'
import { cn } from '../../../lib/utils'

export interface DishCardProps {
  dish: Dish
  onSelectDish?: (dish: Dish) => void
}

export function DishCard({ dish, onSelectDish }: DishCardProps) {
  const { t } = useSiteContent()
  const { quantities, add, remove } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    return dish.variants && dish.variants.length > 0 ? dish.variants[0].id : ''
  })
  const [imgLoaded, setImgLoaded] = useState(false)

  const activeVariant = dish.variants?.find((v) => v.id === selectedVariantId) ?? dish.variants?.[0]
  const activePrice = activeVariant ? activeVariant.price : dish.price
  const activeServingInfo = activeVariant?.servingInfo ?? dish.servingInfo
  const lineKey = activeVariant ? `${dish.id}__${activeVariant.id}` : dish.id
  const quantity = quantities[lineKey] ?? 0

  const handleCardClick = () => {
    if (onSelectDish) {
      onSelectDish(dish)
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        "group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/15 bg-card shadow-[0_1px_0_rgba(46,30,13,0.04),0_20px_40px_-24px_rgba(46,30,13,0.35)] dark:shadow-[0_1px_0_rgba(194,149,103,0.06),0_20px_40px_-24px_rgba(0,0,0,0.7)] transition-all",
        onSelectDish && "cursor-pointer hover:border-primary/40 hover:shadow-xl"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ebdccb] dark:bg-secondary/50 shrink-0">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
        )}
        <img
          src={dish.image || "/images/warak-enab.png"}
          alt={dish.imageAlt || dish.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            "relative z-10 h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
            !imgLoaded ? "opacity-0" : "opacity-100",
            !dish.inStock && "grayscale opacity-75"
          )}
        />
        <ul className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
          {!dish.inStock && (
            <li className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold bg-[#4c0519]/95 text-[#fecdd3] backdrop-blur-md border border-rose-500/50 shadow-md">
              {t('dishCard.soldOutBadge', 'نفد اليوم')}
            </li>
          )}
          {dish.badges.map((kind) => {
            const cfg = getBadgeDisplayConfig(kind)
            const { label, Icon, className, iconColor } = cfg
            return (
              <li
                key={kind}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md",
                  className,
                )}
              >
                <Icon
                  className={cn("size-3.5 shrink-0", iconColor)}
                  aria-hidden="true"
                  fill={kind === "popular" ? "currentColor" : "none"}
                />
                <span>{label}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <p
            dir="ltr"
            className="text-right font-serif text-xs tracking-[0.2em] text-primary uppercase line-clamp-1 truncate"
            title={dish.englishName}
          >
            {dish.englishName}
          </p>
          <h3
            className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.25rem] flex items-center"
            title={dish.name}
          >
            {dish.name}
          </h3>
          <p
            className="text-pretty text-[13px] leading-relaxed text-muted-foreground line-clamp-2 min-h-[2.6rem]"
            title={dish.description}
          >
            {dish.description}
          </p>
        </div>

        {/* Multi-Size Variant Selector Pills & Serving Info */}
        <div className="flex flex-col gap-2 pt-1">
          {dish.variants && dish.variants.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5"
              onClick={(e) => e.stopPropagation()}
              role="radiogroup"
              aria-label={`خيارات أحجام ${dish.name}`}
            >
              {dish.variants.map((v) => {
                const isSelected = v.id === (activeVariant?.id ?? dish.variants![0].id)
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={cn(
                      "rounded-xl px-2.5 py-1 text-xs font-bold transition-all border cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-primary/20 bg-secondary/50 text-foreground/80 hover:border-primary/40 hover:bg-secondary"
                    )}
                  >
                    {v.name}
                  </button>
                )
              })}
            </div>
          )}

          {activeServingInfo && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 w-fit">
              <Users className="size-3.5 shrink-0" />
              <span>{activeServingInfo}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-primary/20 pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-foreground">{formatPrice(activePrice)}</span>
            <span className="text-[11px] text-muted-foreground">{activeVariant ? activeVariant.name : dish.unit}</span>
          </div>

          {!dish.inStock ? (
            <button
              type="button"
              disabled
              onClick={(e) => e.stopPropagation()}
              className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-4 py-2.5 text-xs font-bold text-muted-foreground cursor-not-allowed opacity-75"
            >
              {t('dishCard.unavailableBtn', 'غير متوفر اليوم')}
            </button>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {quantity === 0 ? (
                <motion.button
                  key={`add-btn-${lineKey}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", damping: 20, stiffness: 350 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    add(dish.id, activeVariant?.id)
                  }}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-primary bg-transparent px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t('dishCard.addBtn', 'أضف للطلب')}
                </motion.button>
              ) : (
                <motion.div
                  key={`stepper-${lineKey}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20, stiffness: 350 }}
                  className="flex min-h-[44px] items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground shadow-sm"
                  role="group"
                  aria-label={`كمية ${dish.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    whileTap={{ scale: 0.84 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      add(dish.id, activeVariant?.id)
                    }}
                    aria-label="زيادة"
                    className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35 cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </motion.button>

                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.7, y: -2 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="min-w-6 text-center text-sm font-bold inline-block"
                    aria-live="polite"
                  >
                    {quantity.toLocaleString("ar-SA")}
                  </motion.span>

                  <motion.button
                    whileTap={{ scale: 0.84 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(dish.id, activeVariant?.id)
                    }}
                    aria-label="إنقاص"
                    className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25 active:bg-background/35 cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </article>
  )
}

export default DishCard
