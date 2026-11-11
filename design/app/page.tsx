import { CartProvider } from "@/components/cart-context"
import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { OrderBar } from "@/components/order-bar"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="pb-36">
        <Hero />
        <MenuSection />
        <footer className="mx-auto mt-14 flex w-full max-w-5xl flex-col items-center gap-1 px-5 text-center">
          <span className="text-xl font-black text-primary">هشوشة</span>
          <p className="text-xs text-muted-foreground">مطبخ منزلي فاخر · الرياض، المملكة العربية السعودية</p>
        </footer>
      </main>
      <OrderBar />
    </CartProvider>
  )
}
