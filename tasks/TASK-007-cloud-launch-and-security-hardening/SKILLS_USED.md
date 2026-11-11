# Phase B: Mobilized Engineering Skills & Execution Blueprint
## TASK-007: Cloud Launch, Route Security & Supabase Realtime Engine

> **Task ID:** `TASK-007-cloud-launch-and-security-hardening`  
> **Phase:** Phase B (Skills Mobilization & Architecture Blueprint)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Authorizer:** Agent Alpha (Lead Software Architect) & Brand Chief of Staff  
> **Timestamp:** 2026-10-05T03:58:00Z  

---

### 1. Overview & Objectives

In accordance with `SPEC.md` for **TASK-007**, Agent Beta mobilizes the repository's active skill ecosystem from `.agents/skills/` to transition Hashousha (هشوشة) from a client-side prototype into an enterprise cloud-backed, secured application powered by **Supabase**.

Key deliverables:
- **Dependency Installation**: Install `@supabase/supabase-js`.
- **Public Storefront Sanitization**: Purge all administrative cues (`ChefHat` icon in `SiteHeader`, footer link in `App.tsx`) from the public consumer view.
- **Route Isolation & Security**: Confine kitchen operations strictly behind the `/admin` route (with support for `/#admin` and pathname routing).
- **Hotel-Grade Admin Authentication**: Implement `AdminLoginPage.tsx` gated by Supabase Auth with sign-in, error handling, session persistence, and sign-out.
- **Cloud Persistence & Dual-Write Fallback**: Save customer orders to `public.orders` and `public.order_items` in Supabase with offline LocalStorage fallback.
- **Supabase Realtime & Audio Chime**: Subscribe the kitchen dashboard to live Postgres changes (`INSERT` on `orders`), triggering instant UI updates and an audible synthesized culinary chime via the HTML5 Web Audio API (`audioChime.ts`).
- **Kitchen-Storefront Stock Sync**: Synchronize dish availability toggles to Supabase `public.dishes`.

---

### 2. Active Skills Inventory & Concrete Technical Mobilization

| Skill Name | Skill Path | Specific Architectural Capabilities Applied |
|:---|:---|:---|
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices/SKILL.md` | - **Order Persistence & Resiliency**: Dual-write order strategy where cloud save is paired with automatic offline LocalStorage fallback, ensuring zero dropped customer orders.<br>- **Session Lifecycle Management**: Subscribing to Supabase `onAuthStateChange` to guarantee seamless token refresh and immediate redirection upon sign-out.<br>- **Storefront Purity**: Stripping operational back-office controls from public consumer touchpoints to uphold luxury brand elevation. |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system/SKILL.md` | - **Artisanal Luxury Brand Tokens**: Warm ivory surfaces (`#faf7f2`, `#fdfbf7`), dark roast typography (`#2e1e0d`), subtle linen textured backgrounds, and refined gold/bronze focus rings (`#9e774c`).<br>- **Interactive States & Feedback**: Polished input borders, loading button spinners, and contextual Arabic error callouts in the login portal. |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps/SKILL.md` | - **Touch Ergonomics & Auth UX**: Minimum 48px touch targets, password visibility toggle (`Eye` / `EyeOff`), `inputMode="email"`, and keyboard-safe layouts for kitchen tablets and mobile devices. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | - **Zero-Dependency Web Audio Synthesis**: Dual-tone sine wave culinary chime (`659.25Hz -> 880Hz`) synthesized purely with `window.AudioContext`, avoiding audio file download latency or network 404s.<br>- **Leak-Free Realtime Subscriptions**: Strict channel cleanup and unmount disposal using `supabase.removeChannel(channel)` in React `useEffect`.<br>- **Clean TypeScript & Tree-Shaking**: Strict typing without unused locals. |

---

### 3. Implementation Phasing Strategy

1. **Step 1: Dependency Installation & Cloud Client Setup**
   - Run `npm install @supabase/supabase-js`.
   - Create `src/services/supabase.ts` with project URL and Anon key.
   - Create `src/services/orderService.ts` for cloud order creation, retrieval, and dish stock synchronization.

2. **Step 2: Web Audio Synthetic Chime Engine**
   - Create `src/utils/audioChime.ts` using native Web Audio API oscillators.

3. **Step 3: Hotel-Grade Admin Login Portal**
   - Create `src/components/admin/AdminLoginPage.tsx` with email/password auth, error alerts, and luxury v0 styling.

4. **Step 4: Public Storefront Sanitization & Protected Route Gate**
   - Clean `src/components/storefront/v0/SiteHeader.tsx`: Remove `ChefHat` button completely.
   - Clean `src/App.tsx`: Remove footer admin link.
   - Implement route switcher in `src/App.tsx`: If route is `/admin` or `/#admin`, render authentication gate (show `AdminLoginPage` if unauthenticated, or `KitchenDashboard` if authenticated). Public route `/` renders pure customer storefront.

5. **Step 5: Cloud Persistence & Realtime Integration**
   - Update `CheckoutModal.tsx` to call `saveOrderToSupabase` on checkout submission.
   - Update `KitchenDashboard.tsx` to subscribe to Supabase Realtime `INSERT` events, trigger `playKitchenChime()`, and include a prominent "تسجيل الخروج" (Sign Out) button.
   - Update `StockManager.tsx` to synchronize dish availability with Supabase.

6. **Step 6: Rigorous Verification**
   - Run `npm run build` to confirm zero TypeScript errors and zero warnings.
   - Author Phase C `EXECUTION.log` and Phase D `POST_MORTEM.md`.
