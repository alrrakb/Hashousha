# TASK-007 SPECIFICATION: Cloud Launch, Route Security & Supabase Realtime Engine

> **Task ID:** `TASK-007-cloud-launch-and-security-hardening`  
> **Phase:** Phase A (Architectural Specification)  
> **Author:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Implementer)  
> **Status:** READY FOR IMPLEMENTATION  
> **Target Milestone:** Milestone 4 (Phase 4: Cloud & Security Overhaul)  

---

## 1. Executive Summary & Objective

In accordance with the mandatory directive from the Founder and Brand Chief of Staff, **Agent Beta** will execute the **Cloud Launch & Security Hardening (التدشين السحابي والأمني الشامل)** for Hashousha (هشوشة).

This task transforms Hashousha from a purely client-side prototype into an enterprise cloud-backed platform powered by **Supabase**:
1. **Route Security & Admin Isolation**:
   - Immediately remove all admin affordances (the `ChefHat` icon in `SiteHeader` and the footer admin button in `App.tsx`) from the public storefront.
   - Confine all administrative and kitchen access strictly to a dedicated, protected route: `/admin`.
2. **Hotel-Grade Admin Authentication Portal (`src/components/admin/AdminLoginPage.tsx`)**:
   - Build a luxury hotel-grade login interface matching the v0 brand aesthetic (`#fdfbf7`, `#2e1e0d`, bronze accents).
   - Gate `/admin` using Supabase Auth (`supabase.auth.signInWithPassword`), rejecting any unauthenticated visitors.
3. **Supabase Cloud Integration (`src/services/supabase.ts`)**:
   - Connect to active project: `https://oulzpjcmnxvvrpdyfpcg.supabase.co`.
   - Persist customer orders (`orders` & `order_items`) directly to Supabase with automatic LocalStorage offline fallback.
   - Synchronize dish availability (`dishes.in_stock`) between kitchen and storefront.
4. **Supabase Realtime Engine & Audio Chime (`src/utils/audioChime.ts`)**:
   - Kitchen dashboard subscribes to Realtime Postgres Changes (`INSERT` on `orders`).
   - Trigger a crisp, pleasant culinary audio chime ("دينغ دونغ 🛎️") via the HTML5 Web Audio API whenever a new order lands in the kitchen.
   - Instant live order card insertion without manual browser refreshes.

---

## 2. Pre-Configured Supabase Environment & Credentials

The Lead Architect has already created the database schema, RLS policies, Realtime publications, and seeded the initial dishes on the cloud instance:

- **Supabase Project URL:** `https://oulzpjcmnxvvrpdyfpcg.supabase.co`
- **Supabase Anon Public Key:**  
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bHpwamNtbnh2dnJwZHlmcGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNTMzNzAsImV4cCI6MjEwNjcyOTM3MH0.K2TQn8Utznb3u8Xs6s47qi2a3UAqV_ynjiyani1kN5Y`
- **Default Admin Account:**  
  - Email: `admin@hashousha.com`  
  - Password: `Hashousha@2026`
- **Database Tables Already Live:**
  - `public.dishes` (`id`, `name`, `english_name`, `description`, `price`, `unit`, `category`, `image`, `badges`, `in_stock`)
  - `public.orders` (`id`, `order_number`, `customer_name`, `customer_phone`, `customer_district`, `customer_address`, `customer_notes`, `subtotal`, `delivery_fee`, `total_amount`, `payment_method`, `status`, `created_at`)
  - `public.order_items` (`id`, `order_id`, `dish_id`, `dish_name`, `dish_image`, `unit`, `unit_price`, `quantity`, `total_price`)

---

## 3. Mandatory Just-In-Time Skills to Mobilize (Phase B Directive)

Agent Beta MUST mobilize and document the following skills in `SKILLS_USED.md`:

1. **`medusajs/medusa-agent-skills/storefront-best-practices`**:
   - Order submission lifecycle: optimistic UI updates, dual-write to Supabase + LocalStorage fallback, error boundary handling.
   - Authentication session lifecycle management (`onAuthStateChange`).
2. **`designed-by-ai/skills/design-mobile-apps`**:
   - Hotel-grade authentication form: floating label or crisp Arabic placeholders, touch-accessible password reveal button, numeric keyboard optimization.
3. **`wshobson/agents/tailwind-design-system`**:
   - Visual consistency with v0 luxury tokens: `--card: #fdfbf7`, `--background: #faf7f2`, `--primary: #9e774c`, `--accent: #931f2d`, `--foreground: #2e1e0d`.
4. **`vercel-labs/agent-skills/vercel-react-best-practices`**:
   - Zero-dependency Web Audio API synthetic chime generator (synthesizing pleasant dual-frequency sine chime `880Hz -> 659Hz` with decay, avoiding external asset load failures).
   - Clean unsubscribe lifecycle for Supabase Realtime channels in `useEffect`.

---

## 4. Detailed Technical Specifications

### 4.1 Dependency Installation
Agent Beta must install the official Supabase JavaScript SDK:
```bash
npm install @supabase/supabase-js
```

### 4.2 Route Security & Isolation Architecture (`src/App.tsx`)
- Detect current path via `window.location.pathname` (or `window.location.hash` / lightweight route listener).
- Path `/admin` (or `/#admin`):
  - Renders `<AdminRoute />`.
  - Checks Supabase auth session:
    - If user is logged in: renders `<KitchenDashboard onSignOut={...} />`.
    - If user is NOT logged in: renders `<AdminLoginPage onLoginSuccess={...} />`.
- Path `/` (Storefront):
  - Clean consumer view (`SiteHeader`, `Hero`, `MenuSection`, `OrderBar`, `CheckoutModal`).
  - **CRITICAL:** Remove `ChefHat` icon from `SiteHeader.tsx`.
  - **CRITICAL:** Remove the admin button from the storefront `footer` in `App.tsx`.
  - Zero admin links or hints on the public page.

### 4.3 Supabase Service Layer (`src/services/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://oulzpjcmnxvvrpdyfpcg.supabase.co'
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bHpwamNtbnh2dnJwZHlmcGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNTMzNzAsImV4cCI6MjEwNjcyOTM3MH0.K2TQn8Utznb3u8Xs6s47qi2a3UAqV_ynjiyani1kN5Y'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
```

### 4.4 Cloud Order Dispatch (`src/services/orderService.ts`)
When customer places order in `CheckoutModal.tsx`:
1. Call `saveOrderToSupabase(order: Order)`:
   - Insert into `orders` table.
   - Insert lines into `order_items` table.
2. If Supabase insert succeeds, also update LocalStorage (`hashousha_orders`).
3. If Supabase insert fails (e.g. offline/network issue), catch error, log warning, and ensure LocalStorage is saved so the customer order is NEVER dropped.

### 4.5 Synthetic Audio Chime Utility (`src/utils/audioChime.ts`)
Zero-dependency, browser-native audio chime using `window.AudioContext`:
```typescript
export function playKitchenChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    // Note 2: A5 (880 Hz) after 0.15s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (err) {
    console.warn('Audio chime playback suppressed by browser policy:', err);
  }
}
```

### 4.6 Supabase Realtime Subscription in `KitchenDashboard.tsx`
- On mount, fetch all existing orders from Supabase (or populate `useOrdersStore`).
- Subscribe to Realtime postgres changes:
  ```typescript
  const channel = supabase
    .channel('kitchen-orders-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      async (payload) => {
        // 1. Fetch complete order with items
        // 2. Play audible kitchen chime: playKitchenChime()
        // 3. Display toast / notification
        // 4. Update orders state
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => {
        // Sync status update across devices
      }
    )
    .subscribe();
  ```
- Clean up `supabase.removeChannel(channel)` on unmount.

### 4.7 Admin Login Portal (`src/components/admin/AdminLoginPage.tsx`)
- Container: Elegant centered card on `.linen` canvas.
- Logo: Hashousha leaf wordmark with subtitle "بوابة المطبخ والإدارة".
- Inputs:
  - البريد الإلكتروني (`admin@hashousha.com`)
  - كلمة المرور (مع زر إظهار/إخفاء 👁️)
- Button: "دخول إلى لوحة المطبخ 👨‍🍳" (shows loading spinner during auth request).
- Error alert: Displays clear Arabic explanation if password is wrong.

---

## 5. Impacted Files Matrix

| File Path | Action | Description |
|:---|:---:|:---|
| `package.json` | MODIFY | Add `@supabase/supabase-js` dependency |
| `src/services/supabase.ts` | CREATE | Supabase client instance with keys and config |
| `src/services/orderService.ts` | CREATE | Cloud order persistence and fetching functions |
| `src/utils/audioChime.ts` | CREATE | Native Web Audio API chime sound generator |
| `src/components/admin/AdminLoginPage.tsx` | CREATE | Luxury hotel-grade admin login screen |
| `src/components/storefront/v0/SiteHeader.tsx` | MODIFY | Remove ChefHat button from public consumer header |
| `src/App.tsx` | MODIFY | Remove footer admin link, implement `/admin` protected routing gate |
| `src/components/kitchen/KitchenDashboard.tsx` | MODIFY | Add Supabase Realtime listener, chime trigger, and Sign Out button |
| `src/components/checkout/CheckoutModal.tsx` | MODIFY | Dispatch order to Supabase on checkout submit |
| `tasks/TASK-007-cloud-launch-and-security-hardening/SKILLS_USED.md` | CREATE (Beta) | Mobilized skills catalog |
| `tasks/TASK-007-cloud-launch-and-security-hardening/EXECUTION.log` | CREATE (Beta) | Chronological execution log |
| `tasks/TASK-007-cloud-launch-and-security-hardening/POST_MORTEM.md` | CREATE (Beta) | Verification matrix and sign-off |

---

## 6. Acceptance Criteria Checklist

Agent Beta cannot mark this task complete without verifying every single box:

- [ ] `@supabase/supabase-js` is installed and clean in `package.json`.
- [ ] Public storefront contains ZERO admin buttons (no `ChefHat` in `SiteHeader`, no admin link in `footer`).
- [ ] Navigating to `/admin` renders the luxury `AdminLoginPage` when not authenticated.
- [ ] Logging in with `admin@hashousha.com` / `Hashousha@2026` grants access to `KitchenDashboard`.
- [ ] Invalid login credentials show clear Arabic error messages.
- [ ] Sign out button in `KitchenDashboard` clears session and returns to login screen.
- [ ] Customer orders submitted via `CheckoutModal` are saved to the cloud `public.orders` and `public.order_items` tables in Supabase.
- [ ] Kitchen dashboard receives new orders in real-time via Supabase Realtime without refreshing.
- [ ] When a new order arrives, `playKitchenChime()` produces an audible culinary chime.
- [ ] Toggling dish stock in the kitchen updates `dishes.in_stock` in Supabase.
- [ ] `npm run build` succeeds with zero TypeScript errors and zero warnings.
- [ ] Phase B, Phase C, and Phase D documentation is completed in `tasks/TASK-007-cloud-launch-and-security-hardening/`.
