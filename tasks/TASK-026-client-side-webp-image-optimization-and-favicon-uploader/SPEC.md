# TASK-026 Specification: Client-Side WebP Image Optimization, Favicon Uploader & Master Dark Mode Circuit Breaker

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-10-14  
> **Status:** Approved for Implementation (Phase A Complete)  

---

## 1. Executive Summary & Problem Context

### 1.1 Context & Founder Pain Points
1. **Manual Image Pre-Processing Overhead & Mobile Payload**:  
   The Founder previously had to manually convert camera and asset photos to `.webp` before uploading to avoid sluggish upload times and large file sizes. Raw camera captures (especially from modern smartphones) are typically between **4MB and 12MB** in uncompressed JPEG, PNG, or iOS HEIC formats. When uploaded directly, they drain cloud storage bandwidth and drastically hurt Core Web Vitals (LCP/FCP) on mobile networks for Riyadh storefront visitors.
2. **Apple iOS HEIC/HEIF Web Incompatibility**:  
   iPhone devices capture photos in High Efficiency Image Container (`.heic`/`.heif`) by default. These files fail to render in Chromium, Android, and desktop browsers, leading to broken images if uploaded uncompressed.
3. **Missing Native Favicon File Uploader**:  
   Under the Admin Media Hub (`SiteContentModule.tsx`), the Favicon card provides only a manual text input for a URL, lacking a native computer file upload trigger.
4. **Absence of a Master Dark Mode Circuit Breaker**:  
   The Founder requires an authoritative master switch in the Admin Theme settings to completely disable Dark Mode across the entire platform. When deactivated:
   - All theme toggle buttons across the storefront and admin must unmount completely.
   - Any manual or automated attempt to force dark mode (via CSS class manipulation, DevTools, browser extensions, or `localStorage`) must be actively intercepted and neutralized by the theme engine.

### 1.2 Architectural Objectives
- Deliver a zero-latency, client-side pre-upload optimization pipeline (`src/utils/imageOptimizer.ts`) that intercepts files in the browser, transcodes `.heic` via dynamic on-demand import of `heic2any`, resizes dimensions proportionally via Canvas, and encodes high-efficiency WebP payloads (70%–90% reduction, ~80KB–180KB typical target) before reaching Supabase Storage.
- Seamlessly wire this optimizer into:
  1. **Dish Product Images** (`ProductEditModal.tsx`).
  2. **Hero Banner Image** (`SiteContentModule.tsx`).
  3. **Store Logo Image** (`SiteContentModule.tsx`).
  4. **Favicon Tab Icon** (`SiteContentModule.tsx`).
- Provide an integrated native upload button and live tab `<link rel="icon">` synchronization for the Favicon.
- Implement a tamper-proof **Master Dark Mode Circuit Breaker** spanning Supabase persistence, provider hierarchy re-ordering, active `MutationObserver` DOM shielding, and component unmounting.

---

## 2. System Architecture & Target Files Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Client-Side Upload Flow                               │
│                                                                                 │
│   [User Selects File] (PNG / JPG / JPEG / HEIC)                                 │
│            │                                                                    │
│            ▼                                                                    │
│   [Is File HEIC/HEIF?] ──YES──► Dynamic import('heic2any') ──► Decoded Blob     │
│            │ NO                                                    │            │
│            └───────────────────────┬───────────────────────────────┘            │
│                                    ▼                                            │
│                      [Canvas Dimension Resizing]                                │
│                  (Aspect-ratio preserved, preset bounds)                        │
│                                    │                                            │
│                                    ▼                                            │
│                       [Canvas toBlob('image/webp')]                             │
│                         (Quality 0.82 - 0.90)                                   │
│                                    │                                            │
│                                    ▼                                            │
│                       [Optimized WebP File Created]                             │
│                  (Savings: 70%-92% / ~80KB - 180KB)                             │
│                                    │                                            │
│                  ┌─────────────────┴─────────────────┐                          │
│                  ▼                                   ▼                          │
│      [Display Savings Badge UI]          [Upload to Supabase Storage]           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Impacted Files Table

| File Path | Action | Architectural Responsibility |
|:---|:---:|:---|
| `package.json` | **VERIFIED** | `"heic2any": "^0.0.4"` is verified installed in `node_modules` |
| `src/types/heic2any.d.ts` | **CREATE** | Ambient TypeScript declaration for the dynamic `heic2any` module |
| `supabase/migrations/20261014_dark_mode_toggle.sql` | **CREATE** | DDL migration adding `dark_mode_enabled` boolean column to `public.site_content` |
| `src/types/admin.ts` | **MODIFY** | Add `darkModeEnabled?: boolean` to `SiteContentSettings` and `DEFAULT_SITE_CONTENT` |
| `src/utils/imageOptimizer.ts` | **CREATE** | High-performance in-browser pipeline: dynamic HEIC decoding, Canvas aspect scaling, and WebP compression |
| `src/services/adminService.ts` | **MODIFY** | Cloud serialization/deserialization of `dark_mode_enabled`; image upload error resiliency |
| `src/main.tsx` | **MODIFY** | Reorder provider hierarchy (`SiteContentProvider` outside `ThemeProvider`) for reactive theme governance |
| `src/context/ThemeContext.tsx` | **MODIFY** | Integrate `darkModeEnabled` circuit breaker, no-op setters, and active DOM `MutationObserver` guard |
| `src/components/common/ThemeToggle.tsx` | **MODIFY** | Strict unmount (`return null`) when `darkModeEnabled === false` |
| `src/components/admin/modules/SiteContentModule.tsx` | **MODIFY** | Favicon uploader card & file picker; WebP optimization for Hero/Logo/Favicon; Master Dark Mode toggle switch; savings pill badges |
| `src/components/admin/modules/ProductEditModal.tsx` | **MODIFY** | Integrate WebP optimizer into dish image upload flow with real-time compression feedback badge |
| `src/context/SiteContentContext.tsx` | **MODIFY** | Reactive `<link rel="icon">` synchronization dynamically updating the browser tab |
| `tasks/INDEX.md` | **MODIFY** | Update TASK-026 ledger status |
| `PROJECT_STATE.json` | **MODIFY** | Synchronize milestone, active task, and lifecycle state |

---

## 3. Detailed Component Specifications

### 3.1 Dynamic HEIC Ambient Type (`src/types/heic2any.d.ts`)
Create a strict ambient declaration:
```typescript
declare module 'heic2any' {
  interface Heic2AnyOptions {
    blob: Blob
    toType?: string
    quality?: number
    multiple?: boolean
  }

  function heic2any(options: Heic2AnyOptions): Promise<Blob | Blob[]>
  export default heic2any
}
```

---

### 3.2 In-Browser Image Optimizer Pipeline (`src/utils/imageOptimizer.ts`)

#### 3.2.1 Design & Interfaces
```typescript
export interface ImageOptimizationOptions {
  maxWidth?: number       // Default: 1400 (Dishes/Hero), 800 (Logo), 128 (Favicon)
  maxHeight?: number      // Default: 1400
  quality?: number        // Default: 0.84 (Dishes), 0.85 (Hero), 0.90 (Logo/Favicon)
  format?: 'image/webp'   // Default: 'image/webp'
}

export interface OptimizationResult {
  file: File              // The resulting WebP File object ready for upload
  originalSize: number    // Size in bytes
  optimizedSize: number   // Size in bytes
  savingsPercent: number  // E.g. 84.5 (%)
  width: number           // Final canvas width
  height: number          // Final canvas height
  previewUrl: string      // Local object URL for zero-delay preview
}
```

#### 3.2.2 Execution Steps
1. **Format Detection & HEIC Transcoding**:
   - Check if `file.name.toLowerCase().match(/\.(heic|heif)$/)` or `file.type.includes('heic') || file.type.includes('heif')`.
   - If HEIC: dynamically load `const heic2any = (await import('heic2any')).default`.
   - Convert blob via `await heic2any({ blob: inputFile, toType: 'image/jpeg', quality: 0.92 })`.
   - Handle array vs single blob return types.
2. **Image Loading & Canvas Resizing**:
   - Load the blob into an `HTMLImageElement` via `URL.createObjectURL`.
   - Compute bounding box preserving original aspect ratio:
     $$\text{ratio} = \min\left(1, \frac{\text{maxWidth}}{\text{width}}, \frac{\text{maxHeight}}{\text{height}}\right)$$
     $$\text{targetWidth} = \text{round}(\text{width} \times \text{ratio}), \quad \text{targetHeight} = \text{round}(\text{height} \times \text{ratio})$$
   - Draw onto `document.createElement('canvas')` with high-quality smoothing:
     `ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';`
3. **WebP Encoding & File Wrapping**:
   - Call `canvas.toBlob(blob => ..., 'image/webp', quality)`.
   - Generate sanitized file name: `original_name_without_ext.webp`.
   - Wrap into `new File([blob], fileName, { type: 'image/webp', lastModified: Date.now() })`.
   - Compute `savingsPercent = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))`.
4. **Fault Tolerance**:
   - If `toBlob` fails or canvas encoding throws (e.g. extreme memory limit), catch the error, log a warning, and gracefully return the original file as fallback without breaking the upload flow.

#### 3.2.3 Presets
```typescript
export const OPTIMIZER_PRESETS = {
  dish: { maxWidth: 1400, maxHeight: 1400, quality: 0.84 },
  hero: { maxWidth: 1920, maxHeight: 1080, quality: 0.85 },
  logo: { maxWidth: 800, maxHeight: 800, quality: 0.90 },
  favicon: { maxWidth: 128, maxHeight: 128, quality: 0.90 },
}
```

---

### 3.3 Provider Hierarchy Inversion & Context Sync (`src/main.tsx`)

In order for `ThemeProvider` to reactively consume the cloud `darkModeEnabled` setting without prop-drilling or parallel subscriptions, invert the providers in `src/main.tsx`:

```tsx
// src/main.tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SiteContentProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </SiteContentProvider>
);
```

---

### 3.4 Master Dark Mode Circuit Breaker

#### 3.4.1 Schema Migration (`supabase/migrations/20261014_dark_mode_toggle.sql`)
```sql
-- Migration: Add dark_mode_enabled column to site_content
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS dark_mode_enabled BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.site_content.dark_mode_enabled IS 'Master platform switch for dark mode availability';
```

#### 3.4.2 Model & Service Types (`src/types/admin.ts` & `src/services/adminService.ts`)
- In `SiteContentSettings`: add `darkModeEnabled?: boolean`.
- In `DEFAULT_SITE_CONTENT`: add `darkModeEnabled: true`.
- In `fetchSiteContent`:
  ```ts
  darkModeEnabled: row.dark_mode_enabled !== undefined && row.dark_mode_enabled !== null 
    ? Boolean(row.dark_mode_enabled) 
    : true,
  ```
- In `saveSiteContent`:
  ```ts
  dark_mode_enabled: settings.darkModeEnabled ?? true,
  ```

#### 3.4.3 Strict Engine Protection (`src/context/ThemeContext.tsx`)
1. Consume `useSiteContent()` inside `ThemeProvider`:
   ```ts
   const { content } = useSiteContent()
   const darkModeEnabled = content.darkModeEnabled ?? true
   ```
2. Circuit Breaker Behavior when `darkModeEnabled === false`:
   - Force root element:
     ```ts
     root.classList.remove('dark')
     root.style.colorScheme = 'light'
     ```
   - Persist light theme in storage: `localStorage.setItem('hashousha_theme', 'light')`.
   - Prevent dark mode switching:
     ```ts
     const toggleTheme = () => {
       if (!darkModeEnabled) return
       setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
     }
     const setTheme = (mode: ThemeMode) => {
       if (!darkModeEnabled && mode === 'dark') return
       setThemeState(mode)
     }
     ```
   - Active DOM Shielding (`MutationObserver`):
     ```ts
     useEffect(() => {
       if (darkModeEnabled) return
       const root = document.documentElement
       root.classList.remove('dark')
       root.style.colorScheme = 'light'

       const observer = new MutationObserver(() => {
         if (root.classList.contains('dark')) {
           root.classList.remove('dark')
         }
         if (root.style.colorScheme !== 'light') {
           root.style.colorScheme = 'light'
         }
       })
       observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] })
       return () => observer.disconnect()
     }, [darkModeEnabled])
     ```
3. Expose `darkModeEnabled` in `ThemeContextValue`:
   ```ts
   export interface ThemeContextValue {
     theme: ThemeMode
     isDark: boolean
     darkModeEnabled: boolean
     toggleTheme: () => void
     setTheme: (theme: ThemeMode) => void
   }
   ```

#### 3.4.4 Component Guard (`src/components/common/ThemeToggle.tsx`)
```tsx
const { isDark, toggleTheme, darkModeEnabled } = useTheme()

if (!darkModeEnabled) {
  return null
}
```
*Result: Every ThemeToggle button on the Storefront Header, Product Landing Page, and Merchant Admin Center automatically unmounts.*

---

### 3.5 Favicon Uploader & Dynamic Head Injection

#### 3.5.1 Admin Card in `SiteContentModule.tsx`
- Replace the static text-only Favicon Card with:
  1. **Upload Trigger**: A luxury button `"رفع أيقونة المتصفح"` connected to a hidden file input (`accept=".ico,.png,.jpg,.jpeg,.webp,.heic"`).
  2. **Optimization**: Run file through `optimizeImageToWebp(file, OPTIMIZER_PRESETS.favicon)`.
  3. **Cloud Upload**: Upload to Supabase Storage and update `content.favicon`.
  4. **Live Tab Mockup**: A 48x48 preview card simulating a browser tab icon.
  5. **Savings Pill**: Display badge (e.g. `✨ تم التحويل لـ WebP (توفير 82%)`).

#### 3.5.2 Reactive `<link rel="icon">` (`src/context/SiteContentContext.tsx`)
Ensure dynamic synchronization with the browser tab:
```tsx
useEffect(() => {
  if (!content.favicon) return
  const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
  if (iconLinks.length > 0) {
    iconLinks.forEach(link => { link.href = content.favicon })
  } else {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = content.favicon
    document.head.appendChild(link)
  }
}, [content.favicon])
```

---

### 3.6 Real-Time Compression UI Feedback in Product Edit & Site Content

In both `ProductEditModal.tsx` and `SiteContentModule.tsx`:
- When an image is selected, enter an `optimizing` micro-state.
- Run `optimizeImageToWebp(file)`.
- If savings $> 15\%$, display an elegant emerald badge:
  `✨ تم ضغط الصورة تلقائياً لـ WebP: 4.8MB ← 142KB (توفير 97%)`
- Store the returned public URL and preview immediately.

---

## 4. Verification Suite & Test Matrix

Agent Beta must verify the following scenarios:

| Test ID | Test Scenario | Expected Outcome |
|:---:|:---|:---|
| **TV-01** | Upload 6MB PNG Dish Photo in `ProductEditModal` | Intercepted client-side, converted to `< 200KB` WebP, emerald savings badge displayed, image renders in card. |
| **TV-02** | Upload Apple `.heic` photo from iPhone/Mac | `heic2any` loaded dynamically, decoded to JPEG, converted to WebP, thumbnail renders without broken image icon. |
| **TV-03** | Upload Favicon via new Admin button | File picker opens, image converted to 128x128 WebP, uploaded, browser tab `<link rel="icon">` updates instantly. |
| **TV-04** | Toggle Master Dark Mode switch to OFF in Admin | Theme immediately forces Light Mode, `root.classList.contains('dark')` is false, `localStorage` holds `'light'`. |
| **TV-05** | Inspect Storefront Header & Admin with Dark Mode OFF | `ThemeToggle` button completely unmounted from DOM; no toggle icons visible. |
| **TV-06** | Attempt manual DOM manipulation (`classList.add('dark')`) | `MutationObserver` instantly detects and strips the `dark` class, keeping site light. |
| **TV-07** | Toggle Master Dark Mode switch back to ON | `ThemeToggle` buttons reappear; users can toggle between light and dark modes freely. |
| **TV-08** | Full TypeScript & Vite build compilation | `npm run build` succeeds with **0 errors** and clean bundle output. |

---

## 5. Architectural Invariants & Non-Goals

1. **Zero External Backend/Edge Functions**: The optimization is 100% client-side, saving server compute and avoiding cold-start latency.
2. **Zero Regressions**: All catalog dishes, 19 Babka items, multi-size variants, cart line items, and SEO meta tags remain intact.
3. **No Direct Production Code Editing by Alpha**: In accordance with the system protocol, Agent Alpha delivers this specification and delegates implementation exclusively to Agent Beta.

---
*Signed & Sealed,*  
**Agent Alpha**  
*Lead Software Architect & Creative Director*  
*Hashousha Engineering & Luxury Operations*
