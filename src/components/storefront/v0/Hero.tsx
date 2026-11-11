import { useState } from 'react'
import { ChefHat, Droplets, Gift, Truck, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSkeleton } from './StorefrontSkeletons'
import { useSiteContent } from '../../../context/SiteContentContext'
import { cn } from '../../../lib/utils'

export interface HeroProps {
  isLoading?: boolean
}

export interface BrandPillar {
  icon: LucideIcon
  title: string
  subtitle: string
}

export const BRAND_PILLARS: BrandPillar[] = [
  {
    icon: ChefHat,
    title: 'طهي يدوي طازج',
    subtitle: 'تحضير يومي بأيادٍ سعودية',
  },
  {
    icon: Droplets,
    title: 'مكونات بكر أصيلة',
    subtitle: 'زيت زيتون بكر ممتاز ودبس رمان جبلي',
  },
  {
    icon: Gift,
    title: 'تقديم يبيّض الوجه',
    subtitle: 'صواني فاخرة لمجالسكم',
  },
  {
    icon: Truck,
    title: 'توصيل مجهّز بالرياض',
    subtitle: 'سيارات مبردة لحفظ الطراوة',
  },
]

export function Hero({ isLoading = false }: HeroProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const { content: siteContent } = useSiteContent()

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="hero-skeleton-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <HeroSkeleton />
        </motion.div>
      ) : (
        <motion.section
          key="hero-live-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="mx-auto w-full max-w-5xl px-5"
          aria-labelledby="hero-title"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#2e1e0d] shadow-2xl">
            {/* Shimmer Placeholder while hero background photo loads */}
            {!imgLoaded && (
              <div className="absolute inset-0 skeleton-shimmer z-0" aria-hidden="true" />
            )}

            <img
              src={siteContent.heroImage || '/images/hero.png'}
              alt={siteContent.heroAlt || 'بابكا حرفية مجدولة ومخبوزات وكوكيز فاخر من هشوشة'}
              loading="eager"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "h-[22rem] w-full object-cover opacity-85 md:h-[28rem] transition-opacity duration-700",
                !imgLoaded ? "opacity-0" : "opacity-85"
              )}
            />
            {/* Multi-layer luxury dark scrim for maximum readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2e1e0d] via-[#2e1e0d]/70 to-black/20" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10 z-10">
              <p dir="ltr" className="self-end font-serif text-xs tracking-[0.3em] text-[#E9D3B4] font-bold uppercase md:self-start drop-shadow-sm">
                {siteContent.heroTag || 'Riyadh · Artisanal Babka & Bakery'}
              </p>

              <h1
                id="hero-title"
                className="text-balance text-3xl sm:text-4xl md:text-5xl leading-[1.2] font-extrabold text-[#E9D3B4] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
              >
                {siteContent.heroTitle || 'ترف البابكا والمخبوزات الفاخرة'}
                <span className="block text-[#FAF7F2] drop-shadow-md text-2xl sm:text-3xl md:text-4xl mt-1">
                  {siteContent.heroSubtitle || 'تُخبز طازجة يومياً'}
                </span>
              </h1>

              <p className="max-w-md text-pretty text-xs sm:text-sm md:text-base font-medium leading-relaxed text-[#FAF7F2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {siteContent.heroDescription || 'روائع البابكا والمخبوزات الحرفية، تُخبز بشغف وإتقان يومياً لتليق بأرقى مجالس الضيافة.'}
              </p>
            </div>
          </div>

          <ul
            className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 md:gap-3"
            aria-label="ركائز الضيافة الفاخرة"
          >
            {BRAND_PILLARS.map(({ icon: Icon, title, subtitle }, idx) => {
              const dynamicPillar = siteContent.pillars?.[idx]
              const displayTitle = dynamicPillar?.title || title
              const displaySubtitle = dynamicPillar?.subtitle || subtitle
              return (
                <li
                  key={title}
                  className="group flex items-center gap-2.5 rounded-2xl border border-primary/15 dark:border-primary/25 bg-card p-3 sm:p-3.5 shadow-[0_2px_8px_-4px_rgba(46,30,13,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.5)] hover:border-primary/35 transition-all duration-300"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                    <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col min-w-0 text-right">
                    <span className="text-xs sm:text-[13px] font-bold text-foreground leading-snug">
                      {displayTitle}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight line-clamp-1 truncate">
                      {displaySubtitle}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Hero
