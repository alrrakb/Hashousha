"use client"

import { useState } from "react"
import { DishCard } from "@/components/dish-card"
import { categories, dishes, type CategoryId } from "@/lib/menu"
import { cn } from "@/lib/utils"

export function MenuSection() {
  const [active, setActive] = useState<CategoryId>("all")
  const visible = active === "all" ? dishes : dishes.filter((d) => d.category === active)

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
        <p className="text-xs text-muted-foreground">{visible.length.toLocaleString("ar-SA")} أطباق</p>
      </div>

      <nav
        aria-label="تصنيفات الأطباق"
        className="sticky top-0 z-30 mt-4 border-y border-primary/10 bg-background/85 backdrop-blur-md"
      >
        <ul className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const isActive = cat.id === active
            return (
              <li key={cat.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(cat.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-primary/20 bg-secondary/60 text-foreground/80 hover:border-primary/50",
                  )}
                >
                  {cat.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mx-auto grid w-full max-w-5xl gap-5 px-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  )
}
