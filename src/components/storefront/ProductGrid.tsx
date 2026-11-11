import React, { useMemo } from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useCatalogStore } from '../../store/useCatalogStore';
import { UtensilsCrossed, Sparkles, RotateCcw } from 'lucide-react';

export interface ProductGridProps {
  onAddToCart?: (product: Product) => void;
  onOpenDetails?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onAddToCart,
  onOpenDetails,
}) => {
  const products = useCatalogStore((state) => state.products);
  const activeCategoryId = useCatalogStore((state) => state.activeCategoryId);
  const searchQuery = useCatalogStore((state) => state.searchQuery);
  const categories = useCatalogStore((state) => state.categories);
  const resetFilters = useCatalogStore((state) => state.resetFilters);

  // Memoized filter calculation per Vercel best practices
  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      // Stock check
      if (!product.inStock) return false;

      // Category filter check
      const matchesCategory =
        activeCategoryId === 'all' || product.categoryId === activeCategoryId;

      if (!matchesCategory) return false;

      // Search query check
      if (!trimmedQuery) return true;

      const matchesAr = product.nameAr.toLowerCase().includes(trimmedQuery);
      const matchesDesc = product.descriptionAr.toLowerCase().includes(trimmedQuery);
      const matchesEn = product.nameEn
        ? product.nameEn.toLowerCase().includes(trimmedQuery)
        : false;

      return matchesAr || matchesDesc || matchesEn;
    });
  }, [products, activeCategoryId, searchQuery]);

  // Active Category Name
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0];
  }, [categories, activeCategoryId]);

  return (
    <section className="space-y-6" dir="rtl" aria-label="قائمة الأطباق">
      {/* Category Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-olive-700" />
          <h2 className="text-xl sm:text-2xl font-display font-black text-olive-950">
            {currentCategory?.nameAr || 'قائمة الطعام'}
          </h2>
          {searchQuery && (
            <span className="text-xs font-readex text-text-muted">
              (نتائج البحث عن: "{searchQuery}")
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-readex text-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-honey-500" />
          <span>
            يتم عرض{' '}
            <strong className="text-olive-900 font-bold">
              {filteredProducts.length}
            </strong>{' '}
            أطباق طازجة
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-card rounded-3xl border border-surface-border shadow-gourmet-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-olive-50 border border-olive-200 flex items-center justify-center text-olive-700 shadow-sm">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-lg font-display font-bold text-olive-950">
              لم نجد أطباقاً تطابق بحثك
            </h3>
            <p className="text-xs font-readex text-text-secondary leading-relaxed">
              جرّب البحث بكلمات أخرى أو تصفح كافة الأصناف الشهية من ورق العنب والملفوف والحلويات.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-olive-900 hover:bg-olive-800 text-surface-warm font-readex font-bold text-xs shadow-gourmet-sm active:scale-95 transition-all min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>عرض جميع الأطباق</span>
          </button>
        </div>
      ) : (
        /* Responsive Product Grid: 1 col on mobile, 2 col on tablet, 3-4 on desktop */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
