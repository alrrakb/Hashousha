import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface FreeDeliveryProgressBarProps {
  totalPrice: number
  threshold?: number
  className?: string
  compact?: boolean
}

export const FreeDeliveryProgressBar: React.FC<FreeDeliveryProgressBarProps> = ({
  totalPrice,
  threshold = 150,
  className,
  compact = false,
}) => {
  const remaining = Math.max(0, threshold - totalPrice)
  const percentage = Math.min(100, Math.round((totalPrice / threshold) * 100))
  const isUnlocked = totalPrice >= threshold

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-500 font-sans text-right select-none',
        isUnlocked
          ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-amber-500/15 border border-emerald-500/35 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
          : 'bg-[#2a2017]/90 dark:bg-[#1f1710]/95 border border-primary/25 shadow-sm',
        compact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4',
        className
      )}
      dir="rtl"
    >
      {/* Header Info & Text */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {isUnlocked ? (
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shrink-0"
            >
              <CheckCircle2 className="size-3.5 sm:size-4" />
            </motion.div>
          ) : (
            <div className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-primary/20 text-[#E9D3B4] dark:text-primary shadow-xs shrink-0">
              <Truck className="size-3.5 sm:size-4 animate-pulse" />
            </div>
          )}

          <p className="text-xs sm:text-[13px] font-bold leading-tight truncate">
            {isUnlocked ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-black flex items-center gap-1">
                <span>🎉 مبروك! حصلت على توصيل مجاني لطلبك في الرياض!</span>
                <Sparkles className="size-3.5 text-amber-500 fill-amber-400 shrink-0 inline" />
              </span>
            ) : (
              <span className="text-[#faf7f2] dark:text-foreground">
                متبقي{' '}
                <span className="font-black text-amber-400 text-sm sm:text-base px-0.5">
                  {remaining.toLocaleString('ar-SA')} ر.س
                </span>{' '}
                وتستمتع بالتوصيل المجاني لجمعتك بالرياض 🚗✨
              </span>
            )}
          </p>
        </div>

        <span
          className={cn(
            'text-[11px] sm:text-xs font-black shrink-0 px-2 py-0.5 rounded-full',
            isUnlocked
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
              : 'bg-white/10 text-[#E9D3B4] dark:text-primary border border-white/10'
          )}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress Track (RTL filling from right to left) */}
      <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-black/30 dark:bg-black/50 p-0.5">
        <motion.div
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className={cn(
            'h-full rounded-full transition-colors relative',
            isUnlocked
              ? 'bg-gradient-to-l from-emerald-400 via-emerald-500 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-l from-amber-400 via-[#c29567] to-[#9e774c]'
          )}
        >
          {/* Subtle Shimmer Ray */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>

      {/* Footer Milestone Indicators */}
      <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-muted-foreground/80 pt-1.5 font-medium px-0.5">
        <span className={cn(isUnlocked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-white/60 dark:text-muted-foreground')}>
          {totalPrice > 0 ? `${totalPrice.toLocaleString('ar-SA')} ر.س` : 'ابدأ طلبك'}
        </span>
        <span className="flex items-center gap-1 text-primary font-bold">
          <span>الهدف: {threshold.toLocaleString('ar-SA')} ر.س (توصيل مجاني)</span>
        </span>
      </div>
    </div>
  )
}

export default FreeDeliveryProgressBar
