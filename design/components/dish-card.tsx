"use client"

import Image from "next/image"
import { Citrus, Flame, Minus, Plus, Sparkles, Star } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { formatPrice, type BadgeKind, type Dish } from "@/lib/menu"
import { cn } from "@/lib/utils"

const badgeConfig: Record<BadgeKind, { label: string; icon: typeof Star; className: string }> = {
  popular: {
    label: "الأكثر طلباً ٤٫٩",
    icon: Star,
    className: "bg-foreground/85 text-[#E9D3B4]",
  },
  tangy: {
    label: "حامض حلو",
    icon: Citrus,
    className: "bg-background/90 text-foreground",
  },
  spicy: {
    label: "حار مسمسم",
    icon: Flame,
    className: "bg-accent text-accent-foreground",
  },
  new: {
    label: "جديد",
    icon: Sparkles,
    className: "bg-primary text-primary-foreground",
  },
}

export function DishCard({ dish }: { dish: Dish }) {
  const { quantities, add, remove } = useCart()
  const quantity = quantities[dish.id] ?? 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-primary/15 bg-card shadow-[0_1px_0_rgba(46,30,13,0.04),0_20px_40px_-24px_rgba(46,30,13,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
        <Image
          src={dish.image || "/placeholder.svg"}
          alt={dish.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <ul className="absolute top-3 right-3 flex flex-wrap gap-1.5">
          {dish.badges.map((kind) => {
            const { label, icon: Icon, className } = badgeConfig[kind]
            return (
              <li
                key={kind}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur",
                  className,
                )}
              >
                <Icon className="size-3" aria-hidden="true" fill={kind === "popular" ? "currentColor" : "none"} />
                {label}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <p dir="ltr" className="text-right font-serif text-xs tracking-[0.2em] text-primary uppercase">
            {dish.englishName}
          </p>
          <h3 className="text-lg font-bold text-foreground">{dish.name}</h3>
          <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">{dish.description}</p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-primary/20 pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-foreground">{formatPrice(dish.price)}</span>
            <span className="text-[11px] text-muted-foreground">{dish.unit}</span>
          </div>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => add(dish.id)}
              className="flex items-center gap-1.5 rounded-full border border-primary bg-transparent px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Plus className="size-4" aria-hidden="true" />
              أضف للطلب
            </button>
          ) : (
            <div
              className="flex items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground"
              role="group"
              aria-label={`كمية ${dish.name}`}
            >
              <button
                type="button"
                onClick={() => add(dish.id)}
                aria-label="زيادة"
                className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25"
              >
                <Plus className="size-4" />
              </button>
              <span className="min-w-6 text-center text-sm font-bold" aria-live="polite">
                {quantity.toLocaleString("ar-SA")}
              </span>
              <button
                type="button"
                onClick={() => remove(dish.id)}
                aria-label="إنقاص"
                className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-colors hover:bg-background/25"
              >
                <Minus className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
