import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DishCard } from './DishCard'
import { MenuGridSkeleton, CategoryPillsSkeleton } from './StorefrontSkeletons'
import { categories as defaultCategories } from '../../../data/menu'
import { useMenuStore } from '../../../store/useMenuStore'
import { CategoryId, Dish } from '../../../types/menu'
import { fetchCategoriesFromSupabase } from '../../../services/adminService'
import { cn } from '../../../lib/utils'

export interface MenuSectionProps {
  onSelectDish?: (dish: Dish) => void
  isLoading?: boolean
}

interface CategoryPill {
  id: string
  label: string
}

export function MenuSection({ onSelectDish, isLoading: externalLoading }: MenuSectionProps = {}) {
  const [active, setActive] = useState<CategoryId>('all')
  const [categoriesList, setCategoriesList] = useState<CategoryPill[]>(defaultCategories)
  const [isLoadingCats, setIsLoadingCats] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const dishes = useMenuStore((state) => state.dishes)

  // Perceptible luxury presentation window on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 750)
    return () => clearTimeout(timer)
  }, [])

  const effectiveLoading = externalLoading !== undefined ? externalLoading : isInitialLoading

  // Fetch updated categories from Supabase on mount
  useEffect(() => {
    let isMounted = true
    setIsLoadingCats(true)
    fetchCategoriesFromSupabase()
      .then((cloudCats) => {
        if (!isMounted) return
        if (cloudCats && cloudCats.length > 0) {
          const activeCats = cloudCats
            .filter((c) => c.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((c) => ({
              id: c.id,
              label: c.name,
            }))

          setCategoriesList([{ id: 'all', label: 'الكل' }, ...activeCats])
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCats(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visible =
    active === 'all'
      ? dishes
      : dishes.filter(
          (d) =>
            d.category === active ||
            (Array.isArray(d.categories) && d.categories.includes(active))
        )

  return (
    <section id="menu" aria-labelledby="menu-title" className="mt-10">
      <div className="mx-auto flex w-full max-w-5xl items-end justify-between px-5">
        <div>
          <p dir="ltr" className="text-right font-serif text-xs tracking-[0.3em] text-primary uppercase">
            The Menu
          </p>
          <h2 id="menu-title" className="text-2xl font-extrabold text-foreground">
            قائمة الأطباق
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">{visible.length.toLocaleString('ar-SA')} أطباق</p>
      </div>

      <nav
        aria-label="تصنيفات الأطباق"
        className="sticky top-0 z-30 mt-4 border-y border-primary/10 bg-background/85 backdrop-blur-md"
      >
        {effectiveLoading || (isLoadingCats && categoriesList.length <= 1) ? (
          <CategoryPillsSkeleton />
        ) : (
          <ul className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoriesList.map((cat) => {
              const isActive = cat.id === active
              return (
                <li key={cat.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(cat.id as CategoryId)}
                    aria-pressed={isActive}
                    className={cn(
                      'relative min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                      isActive
                        ? 'border-primary'
                        : 'border-primary/20 bg-secondary/60 text-foreground/80 hover:border-primary/50 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-full bg-primary shadow-sm"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10',
                        isActive
                          ? 'text-primary-foreground font-bold'
                          : 'text-foreground/80 hover:text-foreground'
                      )}
                    >
                      {cat.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </nav>

      <AnimatePresence mode="wait">
        {effectiveLoading || dishes.length === 0 ? (
          <motion.div
            key="menu-skeleton-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <MenuGridSkeleton count={6} />
          </motion.div>
        ) : (
          <motion.div
            key={`menu-real-grid-${active}`}
            layout
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.02,
                },
              },
            }}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
            className="mx-auto grid grid-cols-1 w-full max-w-5xl gap-5 px-5 pt-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                  className="h-full"
                >
                  <DishCard
                    dish={dish}
                    onSelectDish={onSelectDish}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MenuSection
