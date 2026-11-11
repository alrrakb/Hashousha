import { Leaf, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../cart-context'
import { SiteHeaderSkeleton } from './StorefrontSkeletons'
import { ThemeToggle } from '../../common/ThemeToggle'

export interface SiteHeaderProps {
  isLoading?: boolean
}

export function SiteHeader({ isLoading = false }: SiteHeaderProps) {
  const { totalItems, setSummaryOpen } = useCart()

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="site-header-skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <SiteHeaderSkeleton />
        </motion.div>
      ) : (
        <motion.header
          key="site-header-live"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-6 pb-4"
        >
          {/* Right Slot: Hotel-Grade Luxury Theme Toggle (Preserves 40px balance even when dark mode is disabled) */}
          <div className="flex size-10 items-center justify-start shrink-0">
            <ThemeToggle variant="round" />
          </div>

          <a href="/" className="flex flex-col items-center gap-1 text-center" aria-label="هشوشة — الصفحة الرئيسية">
            <span className="flex items-center gap-2 text-primary">
              <Leaf className="size-4 -scale-x-100 rotate-[-30deg]" strokeWidth={1.25} aria-hidden="true" />
              <span className="font-sans text-3xl font-black leading-none tracking-tight">هشوشة</span>
              <Leaf className="size-4 rotate-[30deg]" strokeWidth={1.25} aria-hidden="true" />
            </span>
            <span dir="ltr" className="font-serif text-[9px] whitespace-nowrap tracking-[0.2em] text-foreground/70 uppercase sm:text-[10px] sm:tracking-[0.35em]">
              Hashousha — Sweet &amp; Savory Bakes
            </span>
          </a>

          {/* Left Slot: Cart Trigger Button */}
          <div className="flex size-10 items-center justify-end shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setSummaryOpen(true)}
              aria-label={`سلة الطلب، ${totalItems} عناصر`}
              className="relative flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary cursor-pointer"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              <AnimatePresence mode="popLayout">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    aria-live="polite"
                    className="absolute -top-0.5 -left-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background"
                  >
                    {totalItems.toLocaleString("ar-SA")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

export default SiteHeader
