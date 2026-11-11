import Image from "next/image"
import { Droplets, Gift, Sun, Truck } from "lucide-react"

const highlights = [
  { icon: Sun, label: "طازج يومياً" },
  { icon: Droplets, label: "زيت زيتون بكر" },
  { icon: Gift, label: "بوكسات وصواني فاخرة" },
  { icon: Truck, label: "توصيل سريع بالرياض" },
]

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5" aria-labelledby="hero-title">
      <div className="relative overflow-hidden rounded-[2rem] bg-foreground">
        <Image
          src="/images/hero.png"
          alt="صينية ورق عنب فاخرة مزيّنة بالرمان والنعناع"
          width={1200}
          height={900}
          priority
          className="h-[22rem] w-full object-cover opacity-80 md:h-[28rem]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10">
          <p dir="ltr" className="self-end font-serif text-xs tracking-[0.3em] text-[#E9D3B4] uppercase md:self-start">
            Riyadh · Artisanal Kitchen
          </p>
          <h1
            id="hero-title"
            className="text-balance text-4xl leading-[1.25] font-extrabold text-[#E9D3B4] md:text-6xl"
          >
            نكهة الجمعات الأصيلة
            <span className="block text-background">طازجة يومياً</span>
          </h1>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-background/80 md:text-base">
            أطباق منزلية فاخرة تُحضَّر بأيادٍ سعودية، لتليق بضيافتكم ومجالسكم.
          </p>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {highlights.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2.5 rounded-2xl border border-primary/15 bg-secondary/70 px-3.5 py-3"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-[13px] font-semibold text-foreground">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
