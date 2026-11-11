import { ChevronUp, Minus, Plus, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../cart-context'
import { useSiteContent } from '../../../context/SiteContentContext'
import { formatPrice } from '../../../data/menu'
import { cn } from '../../../lib/utils'

export interface OrderBarProps {
  onOpenCheckout?: () => void
}

export function OrderBar({ onOpenCheckout }: OrderBarProps = {}) {
  const { lines, totalItems, totalPrice, add, remove, isSummaryOpen, setSummaryOpen } = useCart()
  const { t } = useSiteContent()
  const isEmpty = totalItems === 0
  const open = isSummaryOpen && !isEmpty

  const summary = lines
    .map((l) => `${l.dish.name}${l.variant ? ` (${l.variant.name})` : ''} ×${l.quantity.toLocaleString("ar-SA")}`)
    .join("، ")

  return (
    <AnimatePresence>
      {!isEmpty && (
        <motion.aside
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none"
          aria-label="شريط الطلب السريع"
        >
          <div className="mx-auto max-w-xl pointer-events-auto overflow-hidden rounded-[1.75rem] border border-primary/25 bg-[#231b14] dark:bg-[#1a130c] text-[#faf7f2] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  id="order-summary"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="max-h-64 divide-y divide-white/10 dark:divide-primary/15 overflow-y-auto px-4 pt-3"
                >
                  {lines.map(({ lineKey, dish, variant, quantity, unitPrice }) => (
                    <motion.li
                      layout
                      key={lineKey}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {dish.name}
                          {variant && (
                            <span className="text-xs font-normal text-[#E9D3B4]/80 dark:text-primary/80 mr-1.5">
                              ({variant.name})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#E9D3B4] dark:text-primary">{formatPrice(unitPrice * quantity)}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/10 dark:bg-primary/10 p-0.5">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          onClick={() => add(dish.id, variant?.id)}
                          aria-label={`زيادة ${dish.name}`}
                          className="flex size-7 items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-primary/20 transition-colors"
                        >
                          <Plus className="size-3.5" />
                        </motion.button>
                        <span className="min-w-5 text-center text-sm font-bold">{quantity.toLocaleString("ar-SA")}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          onClick={() => remove(dish.id, variant?.id)}
                          aria-label={`إنقاص ${dish.name}`}
                          className="flex size-7 items-center justify-center rounded-full hover:bg-white/15 dark:hover:bg-primary/20 transition-colors"
                        >
                          <Minus className="size-3.5" />
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 p-2.5">
              <button
                type="button"
                onClick={() => setSummaryOpen(!isSummaryOpen)}
                aria-expanded={open}
                aria-controls="order-summary"
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-1 text-right"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {totalItems.toLocaleString("ar-SA")}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="flex items-center gap-1 text-base font-extrabold whitespace-nowrap">
                    {formatPrice(totalPrice)}
                    <ChevronUp
                      className={cn("size-4 text-[#E9D3B4] dark:text-primary transition-transform duration-300", open && "rotate-180")}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="truncate text-[11px] text-white/65 dark:text-muted-foreground">{summary}</span>
                </span>
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onOpenCheckout}
                className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-extrabold text-accent-foreground transition-all shadow-sm cursor-pointer hover:brightness-110"
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
                <span>{t('orderBar.checkoutBtn', 'إتمام الطلب')}</span>
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default OrderBar
