import React from 'react';
import {
  UtensilsCrossed,
  Leaf,
  Soup,
  Layers,
  Cookie,
  Salad,
  LucideIcon,
} from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Mapping category icon strings to Lucide components
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Leaf,
  Soup,
  Layers,
  Cookie,
  Salad,
};

export const CategoryPills: React.FC = () => {
  const categories = useCatalogStore((state) => state.categories);
  const activeCategoryId = useCatalogStore((state) => state.activeCategoryId);
  const setActiveCategory = useCatalogStore((state) => state.setActiveCategory);
  const products = useCatalogStore((state) => state.products);

  // Compute product count per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  return (
    <nav
      className="sticky top-[72px] sm:top-20 z-30 w-full backdrop-blur-md bg-surface-warm/95 border-b border-surface-border py-3 transition-all duration-200"
      aria-label="تصنيفات قائمة الطعام"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className="flex items-center gap-2.5 overflow-x-auto scrollbar-none overscroll-x-contain py-1 -my-1"
          role="tablist"
          dir="rtl"
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            const IconComponent = CATEGORY_ICON_MAP[cat.icon] || UtensilsCrossed;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={twMerge(
                  clsx(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-readex font-semibold shrink-0 select-none transition-all duration-200 min-h-[44px]',
                    isActive
                      ? 'bg-olive-900 text-surface-warm shadow-gourmet-sm border border-olive-800 ring-2 ring-olive-900/10'
                      : 'bg-surface-card text-text-secondary hover:text-olive-900 hover:bg-olive-50/80 border border-surface-border active:scale-95'
                  )
                )}
              >
                <IconComponent
                  className={clsx(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-honey-400' : 'text-olive-700'
                  )}
                />
                <span>{cat.nameAr}</span>
                <span
                  className={clsx(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-bold font-readex transition-colors',
                    isActive
                      ? 'bg-olive-800 text-honey-200'
                      : 'bg-surface-muted text-text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryPills;
