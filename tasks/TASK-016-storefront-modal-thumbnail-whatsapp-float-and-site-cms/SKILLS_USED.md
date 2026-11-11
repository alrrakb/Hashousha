# Phase B: Mobilized Skills Catalog — TASK-016

> **Task ID:** `TASK-016-storefront-modal-thumbnail-whatsapp-float-and-site-cms`  
> **Lifecycle Phase:** Phase B (Skills Mobilization)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Architectural Sign-off:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Timestamp:** 2026-10-09T06:29:30+03:00  

---

## 1. Inventory of Mobilized Skills

| Skill | Source | Primary Purpose for TASK-016 |
| :--- | :--- | :--- |
| **`storefront-best-practices`** | `.agents/skills/storefront-best-practices` | Modal information hierarchy (square thumbnail lockup), customer hospitality floating touchpoints, and headless CMS state management |
| **`tailwind-design-system`** | `.agents/skills/tailwind-design-system` | Emerald WhatsApp styling with ambient pulse effects, linen `#FDFBF7` admin panels, and unified border tokens |
| **`design-mobile-apps`** | `.agents/skills/design-mobile-apps` | Viewport collision prevention (`bottom-24 sm:bottom-6`) between `FloatingWhatsApp` and the sticky `OrderBar` |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices` | Responsive state management, debounced search filtering for CMS strings, and safe image fallback handling |

---

## 2. Skill Application Matrix

### 2.1 `storefront-best-practices`
- **Product Modal Ergonomics:** Replacing the towering full-width banner with an elegant square thumbnail lockup (`size-24 sm:size-32`) placed alongside product titles and serving tags brings culinary details, price, and CTA immediately above the mobile fold.
- **Concierge Channel:** Providing a direct WhatsApp gateway with pre-formatted Saudi hospitality inquiries fosters high-trust conversional engagement.

### 2.2 `design-mobile-apps`
- **Safe Area & Sticky Bar Clearance:** On mobile viewports, the sticky cart bar (`OrderBar`) occupies `bottom-0`. Positioning `FloatingWhatsApp` at `bottom-24` on mobile and `bottom-6` on desktop ensures zero occlusion and prevents misclicks.

### 2.3 `tailwind-design-system`
- **Ambient Pulsing Luxury:** The WhatsApp button features a multi-tiered emerald ring (`ring-4 ring-[#25D366]/25 animate-pulse`) and drop shadow (`shadow-xl`) that captures attention subtly without visual aggression.
- **Admin CMS Layout:** The `SiteContentModule` utilizes two clear tabbed cards with warm linen accents (`#FDFBF7`), subtle bronze borders, and intuitive image preview portals.

### 2.4 `vercel-react-best-practices`
- **Search Optimization:** Instant client-side text filtering across multiple nested string fields without unnecessary re-renders.
- **Cloud State Hygiene:** Strong TypeScript contracts mapping database snake_case columns to clean application camelCase models.
