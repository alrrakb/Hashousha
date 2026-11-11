"use client"

import { Leaf, Menu, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-context"

export function SiteHeader() {
  const { totalItems, setSummaryOpen } = useCart()

  return (
    <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-6 pb-4">
      <button
        type="button"
        aria-label="القائمة"
        className="flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>

      <a href="/" className="flex flex-col items-center gap-1" aria-label="هشوشة — الصفحة الرئيسية">
        <span className="flex items-center gap-2 text-primary">
          <Leaf className="size-4 -scale-x-100 rotate-[-30deg]" strokeWidth={1.25} aria-hidden="true" />
          <span className="font-sans text-3xl font-black leading-none tracking-tight">هشوشة</span>
          <Leaf className="size-4 rotate-[30deg]" strokeWidth={1.25} aria-hidden="true" />
        </span>
        <span dir="ltr" className="font-serif text-[9px] whitespace-nowrap tracking-[0.2em] text-foreground/70 uppercase sm:text-[10px] sm:tracking-[0.35em]">
          Hashousha — Sweet &amp; Savory Bakes
        </span>
      </a>

      <button
        type="button"
        onClick={() => setSummaryOpen(true)}
        aria-label={`سلة الطلب، ${totalItems} عناصر`}
        className="relative flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
      >
        <ShoppingBag className="size-5" strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  )
}
