import React from 'react'

/**
 * SiteHeaderSkeleton — Luxury shimmer skeleton for the top header branding and cart button
 */
export const SiteHeaderSkeleton: React.FC = () => {
  return (
    <header
      className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-6 pb-4"
      aria-hidden="true"
    >
      {/* Visual balance spacer */}
      <div className="w-10" />

      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5">
          <div className="size-4 rounded-full skeleton-shimmer" />
          <div className="h-8 w-28 rounded-full skeleton-shimmer" />
          <div className="size-4 rounded-full skeleton-shimmer" />
        </div>
        <div className="h-2.5 w-48 rounded-full skeleton-shimmer" />
      </div>

      {/* Cart Button Pill */}
      <div className="size-10 rounded-full skeleton-shimmer" />
    </header>
  )
}

/**
 * HeroSkeleton — Luxury shimmer skeleton for hero banner photography and 4 highlights
 */
export const HeroSkeleton: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-5xl px-5" aria-hidden="true">
      {/* Banner Box */}
      <div className="relative overflow-hidden rounded-[2rem] h-[22rem] md:h-[28rem] skeleton-shimmer shadow-2xl">
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10 z-10">
          <div className="h-3 w-40 rounded-full bg-white/40 self-end md:self-start" />
          <div className="space-y-2">
            <div className="h-8 md:h-11 w-2/3 max-w-sm rounded-2xl bg-white/40" />
            <div className="h-6 md:h-8 w-1/3 max-w-xs rounded-2xl bg-white/30" />
          </div>
          <div className="h-3.5 w-3/5 max-w-sm rounded-full bg-white/30 mt-1" />
        </div>
      </div>

      {/* 4 Feature Highlights / Brand Pillars */}
      <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 md:gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`hero-skeleton-pillar-${idx}`}
            className="flex items-center gap-2.5 rounded-2xl border border-primary/15 dark:border-primary/25 bg-card p-3 sm:p-3.5 shadow-[0_2px_8px_-4px_rgba(46,30,13,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.5)]"
          >
            <div className="size-8 rounded-xl skeleton-shimmer shrink-0" />
            <div className="flex flex-col min-w-0 gap-1.5 flex-1">
              <div className="h-3 w-16 sm:w-20 rounded-full skeleton-shimmer" />
              <div className="h-2.5 w-24 sm:w-28 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * DishCardSkeleton — Featherlight 60fps shimmer skeleton matching DishCard geometry
 */
export const DishCardSkeleton: React.FC = () => {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/15 bg-card shadow-[0_1px_0_rgba(46,30,13,0.04),0_20px_40px_-24px_rgba(46,30,13,0.35)] dark:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)]"
      aria-hidden="true"
    >
      {/* Photography Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden skeleton-shimmer">
        {/* Mock Badge Pills in Top Right */}
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          <div className="h-6 w-20 rounded-full skeleton-shimmer border border-white/20" />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          {/* Subtitle / Category indicator */}
          <div className="h-2.5 w-24 rounded-full skeleton-shimmer self-end" />
          {/* Dish Name */}
          <div className="h-5 w-3/4 rounded-full skeleton-shimmer mt-1" />
          {/* Description Lines */}
          <div className="space-y-1.5 pt-2">
            <div className="h-3 w-full rounded-full skeleton-shimmer" />
            <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
          </div>
        </div>

        {/* Footer: Price & Add Pill */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-primary/20 pt-4">
          <div className="space-y-1">
            <div className="h-6 w-16 rounded-full skeleton-shimmer" />
            <div className="h-2.5 w-10 rounded-full skeleton-shimmer" />
          </div>
          <div className="h-11 w-28 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </article>
  )
}

/**
 * MenuGridSkeleton — Renders 6 synchronized lightweight dish skeletons
 */
export const MenuGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      className="mx-auto grid grid-cols-1 w-full max-w-5xl gap-5 px-5 pt-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="جاري تحميل الأطباق الفاخرة..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <DishCardSkeleton key={`dish-skeleton-${i}`} />
      ))}
    </div>
  )
}

/**
 * CategoryPillsSkeleton — Shimmering category pills placeholder
 */
export const CategoryPillsSkeleton: React.FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-5 py-3" aria-hidden="true">
      {[100, 110, 95, 120, 85].map((width, idx) => (
        <div
          key={`cat-skeleton-${idx}`}
          style={{ width: `${width}px` }}
          className="h-11 shrink-0 rounded-full skeleton-shimmer border border-primary/15 shadow-sm"
        />
      ))}
    </div>
  )
}

/**
 * ProductLandingSkeleton — Standalone Product Landing Page luxury shimmer
 */
export const ProductLandingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans" dir="rtl" aria-hidden="true">
      {/* Top Header Placeholder */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="h-8 w-44 rounded-full skeleton-shimmer" />
        <div className="flex gap-2">
          <div className="size-9 rounded-full skeleton-shimmer" />
          <div className="h-9 w-24 rounded-full skeleton-shimmer" />
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Photography Column */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden skeleton-shimmer border border-primary/15 shadow-xl" />
            <div className="flex justify-between items-center px-1">
              <div className="h-4 w-32 rounded-full skeleton-shimmer" />
              <div className="h-4 w-28 rounded-full skeleton-shimmer" />
            </div>
          </div>

          {/* Product Details Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded-full skeleton-shimmer" />
              <div className="h-9 w-3/4 rounded-full skeleton-shimmer" />
            </div>

            {/* Price Tag Box */}
            <div className="h-20 w-full rounded-2xl skeleton-shimmer" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full skeleton-shimmer" />
              <div className="h-3.5 w-5/6 rounded-full skeleton-shimmer" />
              <div className="h-3.5 w-2/3 rounded-full skeleton-shimmer" />
            </div>

            {/* Highlights Box */}
            <div className="h-28 w-full rounded-2xl skeleton-shimmer" />

            {/* CTA Button */}
            <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * OrderSuccessSkeleton — Luxury shimmer skeleton for the Order Success modal receipt
 */
export const OrderSuccessSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-5" aria-hidden="true">
      {/* Celebratory Emblem Placeholder */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-2">
        <div className="size-16 rounded-full skeleton-shimmer ring-8 ring-primary/5" />
        <div className="h-6 w-36 rounded-full skeleton-shimmer" />
        <div className="h-7 w-56 rounded-full skeleton-shimmer" />
        <div className="h-3.5 w-72 rounded-full skeleton-shimmer" />
      </div>

      {/* Order Number Banner */}
      <div className="h-24 w-full rounded-2xl skeleton-shimmer border border-primary/20" />

      {/* Order Summary Details Box */}
      <div className="h-40 w-full rounded-2xl skeleton-shimmer border border-primary/15" />

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <div className="h-12 w-full rounded-xl skeleton-shimmer" />
        <div className="h-12 w-full rounded-xl skeleton-shimmer" />
      </div>
    </div>
  )
}
