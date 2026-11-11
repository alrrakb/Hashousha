import React from 'react';
import { DishBadge } from '../../types/product';
import { Star, Flame, Sparkles, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: DishBadge | 'default' | 'neutral';
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
  size = 'sm',
  icon,
}) => {
  let defaultText = '';
  let defaultIcon: React.ReactNode = null;
  let variantClasses = '';

  switch (variant) {
    case 'signature':
      defaultText = 'حامض حلو';
      defaultIcon = <Sparkles className="w-3 h-3 text-pomegranate-600 shrink-0" />;
      variantClasses = 'bg-pomegranate-50 text-pomegranate-700 border-pomegranate-500/25';
      break;
    case 'bestseller':
      defaultText = 'الأكثر طلباً';
      defaultIcon = <Star className="w-3 h-3 fill-honey-500 text-honey-500 shrink-0" />;
      variantClasses = 'bg-honey-100 text-honey-800 border-honey-500/30';
      break;
    case 'spicy':
      defaultText = 'حار';
      defaultIcon = <Flame className="w-3 h-3 text-pomegranate-600 shrink-0" />;
      variantClasses = 'bg-pomegranate-50 text-pomegranate-700 border-pomegranate-500/25';
      break;
    case 'new':
      defaultText = 'جديد';
      defaultIcon = <Sparkles className="w-3 h-3 text-olive-700 shrink-0" />;
      variantClasses = 'bg-olive-50 text-olive-800 border-olive-500/25';
      break;
    case 'special_offer':
      defaultText = 'عرض خاص';
      defaultIcon = <Tag className="w-3 h-3 text-honey-600 shrink-0" />;
      variantClasses = 'bg-honey-100 text-honey-800 border-honey-500/30';
      break;
    case 'neutral':
      variantClasses = 'bg-surface-muted text-text-secondary border-surface-border';
      break;
    default:
      variantClasses = 'bg-olive-50 text-olive-900 border-olive-200';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px]'
      : 'px-3 py-1 text-xs';

  const renderedIcon = icon !== undefined ? icon : defaultIcon;
  const content = children || defaultText;

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border font-readex font-bold tracking-tight shadow-sm select-none transition-colors duration-150',
          sizeClasses,
          variantClasses,
          className
        )
      )}
    >
      {renderedIcon}
      {content && <span>{content}</span>}
    </span>
  );
};

export default Badge;
