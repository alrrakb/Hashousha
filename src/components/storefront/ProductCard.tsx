import React from 'react';
import { Product } from '../../types/product';
import { Badge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Plus, Clock, Users } from 'lucide-react';
import { clsx } from 'clsx';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
}) => {
  const hasOptions = product.optionGroups && product.optionGroups.length > 0;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col bg-surface-card rounded-2xl sm:rounded-3xl border border-surface-border shadow-gourmet-sm hover:shadow-gourmet-lg transition-all duration-300 overflow-hidden cursor-pointer selection:bg-transparent"
      dir="rtl"
    >
      {/* Visual Photography Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted ring-1 ring-black/5">
        <ImageWithFallback
          src={product.image}
          alt={product.nameAr}
          fallbackTitle={product.nameAr}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges (Top Right in RTL) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {product.badge && <Badge variant={product.badge} />}
          {product.spicyLevel === 'spicy' && !product.badge && (
            <Badge variant="spicy" />
          )}
        </div>

        {/* Quick Servings / Prep Time Pill (Bottom Left in RTL) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.prepTimeMinutes && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-olive-950/75 backdrop-blur-sm text-surface-warm text-[10px] font-readex font-medium">
              <Clock className="w-3 h-3 text-honey-400 shrink-0" />
              <span>{product.prepTimeMinutes} دقيقة</span>
            </span>
          )}
        </div>
      </div>

      {/* Content & Ordering Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Dish Title */}
          <h3 className="text-base sm:text-lg font-display font-extrabold text-olive-950 group-hover:text-olive-700 transition-colors line-clamp-1">
            {product.nameAr}
          </h3>

          {/* Sensory Description (2-line clamp) */}
          <p className="text-xs sm:text-sm font-readex text-text-secondary line-clamp-2 leading-relaxed">
            {product.descriptionAr}
          </p>

          {/* Servings meta label */}
          {product.servingsInfoAr && (
            <p className="text-[11px] font-readex text-text-muted flex items-center gap-1 pt-0.5">
              <Users className="w-3 h-3 text-olive-600 shrink-0" />
              <span>{product.servingsInfoAr}</span>
            </p>
          )}
        </div>

        {/* Price & Primary CTA Action */}
        <div className="pt-2 flex items-center justify-between border-t border-surface-border/80">
          <div className="flex flex-col">
            <span className="text-[10px] font-readex text-text-muted">السعر يبدأ من</span>
            <div className="flex items-baseline gap-1 text-pomegranate-600">
              <span className="text-lg sm:text-xl font-readex font-black">
                {product.basePrice.toFixed(2)}
              </span>
              <span className="text-xs font-readex font-bold">ر.س</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAction}
            className={clsx(
              'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full font-readex font-bold text-xs sm:text-sm shadow-gourmet-sm transition-all duration-150 active:scale-95 select-none',
              hasOptions
                ? 'bg-pomegranate-600 hover:bg-pomegranate-700 text-white shadow-pomegranate-600/20'
                : 'bg-pomegranate-600 hover:bg-pomegranate-700 text-white shadow-pomegranate-600/20'
            )}
            aria-label={`إضافة ${product.nameAr} إلى السلة`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{hasOptions ? 'اختر التفاصيل' : 'إضافة للسلة'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
