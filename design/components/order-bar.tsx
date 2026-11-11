"use client"

import { ChevronUp, MessageCircle, Minus, Plus } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { formatPrice, WHATSAPP_NUMBER } from "@/lib/menu"
import { cn } from "@/lib/utils"

export function OrderBar() {
  const { lines, totalItems, totalPrice, add, remove, isSummaryOpen, setSummaryOpen } = useCart()
  const isEmpty = totalItems === 0
  const open = isSummaryOpen && !isEmpty

  const message = [
    "مرحباً هشوشة، أرغب بطلب:",
    ...lines.map((l) => `• ${l.dish.name} × ${l.quantity} — ${formatPrice(l.dish.price * l.quantity)}`),
    `الإجمالي: ${formatPrice(totalPrice)}`,
  ].join("\n")
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  const summary = isEmpty
    ? "أضف أطباقك المفضلة لبدء الطلب"
    : lines.map((l) => `${l.dish.name} ×${l.quantity.toLocaleString("ar-SA")}`).join("، ")

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-primary/25 bg-foreground text-background shadow-[0_24px_60px_-20px_rgba(46,30,13,0.6)]">
        {open && (
          <ul id="order-summary" className="max-h-64 divide-y divide-background/10 overflow-y-auto px-4 pt-3">
            {lines.map(({ dish, quantity }) => (
              <li key={dish.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{dish.name}</p>
                  <p className="text-xs text-[#E9D3B4]">{formatPrice(dish.price * quantity)}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-background/10 p-0.5">
                  <button
                    type="button"
                    onClick={() => add(dish.id)}
                    aria-label={`زيادة ${dish.name}`}
                    className="flex size-7 items-center justify-center rounded-full hover:bg-background/15"
                  >
                    <Plus className="size-3.5" />
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold">{quantity.toLocaleString("ar-SA")}</span>
                  <button
                    type="button"
                    onClick={() => remove(dish.id)}
                    aria-label={`إنقاص ${dish.name}`}
                    className="flex size-7 items-center justify-center rounded-full hover:bg-background/15"
                  >
                    <Minus className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3 p-2.5">
          <button
            type="button"
            onClick={() => setSummaryOpen(!isSummaryOpen)}
            disabled={isEmpty}
            aria-expanded={open}
            aria-controls="order-summary"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-1 text-right disabled:cursor-default"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {totalItems.toLocaleString("ar-SA")}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-1 text-base font-extrabold whitespace-nowrap">
                {formatPrice(totalPrice)}
                {!isEmpty && (
                  <ChevronUp
                    className={cn("size-4 text-[#E9D3B4] transition-transform", open && "rotate-180")}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="truncate text-[11px] text-background/65">{summary}</span>
            </span>
          </button>

          <a
            href={isEmpty ? undefined : whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={isEmpty}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition-all",
              isEmpty ? "pointer-events-none opacity-50" : "hover:brightness-110",
            )}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            اطلب الآن عبر الواتساب
          </a>
        </div>
      </div>
    </div>
  )
}
