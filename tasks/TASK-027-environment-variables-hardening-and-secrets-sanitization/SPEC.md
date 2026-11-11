# TASK-027 Specification: Environment Variables Hardening & Secrets Sanitization

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Full-Stack Implementer)  
> **Date:** 2026-11-11  
> **Status:** Approved for Implementation (Phase A Complete)  

---

## 1. Executive Summary & Problem Context

### 1.1 Problem Statement
During initial prototyping and rapid development cycles, cloud infrastructure connection parameters (specifically the Supabase project endpoint URL and public anonymous JWT key) were hardcoded directly within:
1. Production client code (`src/services/supabase.ts`) as inline string constants and fallbacks.
2. Administrative maintenance and verification scripts within the `scripts/` directory (`sync-babka-catalog.mjs`, `sync-babka-catalog.ts`, `sync-categories.ts`, `sync-dishes.ts`, `test-seo-rls.ts`, `test-theme-colors.ts`).

### 1.2 Security & Operational Risks
- **Repository Exposure Risk:** Hardcoded credentials committed to version control repositories expose project endpoints and service configurations to external reconnaissance and potential unauthorized quota exhaustion.
- **Environment Rigidity:** Inability to switch seamlessly between Staging, Testing, and Production environments without modifying source files.
- **Vite Client Bundle Leakage & Drift:** Vite builds inject environment variables prefixed with `VITE_` at compile-time. Lack of strict type definitions and runtime assertions can lead to silent runtime failures or undefined references in production deployments.

### 1.3 Architectural Objectives
1. **Total Secrets Sanitization:** Strip all hardcoded Supabase project URLs and Anon Keys from source code and utility scripts.
2. **Environment Variable Centralization:** Configure `.env` with explicit Vite-prefixed keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) while preserving existing VPS remote bridge deployment parameters.
3. **Public Template Specification (`.env.example`):** Provide an authoritative, sanitized environment template for team onboarding and CI/CD pipelines.
4. **Resilient Client Runtime Assertion:** Implement deterministic runtime checks in `src/services/supabase.ts` that immediately alert developers if configuration variables are missing.
5. **Type Safety & Intellisense (`src/vite-env.d.ts`):** Augment Vite's ambient environment interface with strong TypeScript data contracts.
6. **Automated CLI Script Hardening:** Equip all maintenance scripts in `scripts/` with `dotenv` loading and unified fallback resolution (`VITE_SUPABASE_URL` / `SUPABASE_URL`).
7. **Git Shielding Verification:** Verify that `.gitignore` strictly protects `.env`, `.env.local`, and related secret manifests.

---

## 2. System Architecture & Target Files Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           Environment Loading Topology                           │
│                                                                                  │
│   [.env (Protected on Local Machine / CI Secrets)]                              │
│         │                                                                        │
│         ├──► Vite Build Engine (import.meta.env.VITE_*)                          │
│         │         │                                                              │
│         │         ▼                                                              │
│         │    [src/services/supabase.ts]                                          │
│         │    - Runtime validation check                                          │
│         │    - Throws visible warning/error if unpopulated                       │
│         │    - Zero hardcoded fallback strings                                   │
│         │         │                                                              │
│         │         ▼                                                              │
│         │    [Storefront & Admin Web App]                                        │
│         │                                                                        │
│         └──► Node CLI Engine (dotenv/config -> process.env.*)                    │
│                   │                                                              │
│                   ▼                                                              │
│              [scripts/sync-*.ts & test-*.ts]                                     │
│              - Loads process.env.VITE_SUPABASE_URL || SUPABASE_URL               │
│              - Deterministic exit(1) on missing config                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Impacted Files Table

| File Path | Action | Architectural Responsibility |
|:---|:---:|:---|
| `.env` | **MODIFY** | Append `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` while preserving existing VPS credentials |
| `.env.example` | **CREATE** | Public, sanitized template documenting required environment variables for Vite and scripts |
| `.gitignore` | **VERIFY** | Confirm strict shielding of `.env`, `.env.local`, `.env.*.local` |
| `src/vite-env.d.ts` | **MODIFY** | Define strict `ImportMetaEnv` interface for type safety across Vite client code |
| `src/services/supabase.ts` | **MODIFY** | Strip inline hardcoded URLs and keys; bind exclusively to `import.meta.env` with runtime guard |
| `scripts/sync-babka-catalog.mjs` | **MODIFY** | Load environment via `dotenv`; read from `process.env` with validation |
| `scripts/sync-babka-catalog.ts` | **MODIFY** | Load environment via `dotenv/config`; read from `process.env` with validation |
| `scripts/sync-categories.ts` | **MODIFY** | Load environment via `dotenv/config`; read from `process.env` with validation |
| `scripts/sync-dishes.ts` | **MODIFY** | Load environment via `dotenv/config`; read from `process.env` with validation |
| `scripts/test-seo-rls.ts` | **MODIFY** | Load environment via `dotenv/config`; read from `process.env` with validation |
| `scripts/test-theme-colors.ts` | **MODIFY** | Load environment via `dotenv/config`; read from `process.env` with validation |
| `tasks/INDEX.md` | **MODIFY** | Register TASK-027 and update status ledger |
| `PROJECT_STATE.json` | **MODIFY** | Update active milestone, task, and security audit flags |

---

## 3. Implementation Invariants & Guardrails

1. **Zero Hardcoded Secrets Invariant:** No fallback literal string matching `https://*.supabase.co` or JWT tokens `eyJhbGci...` may remain anywhere in `src/` or `scripts/`.
2. **Build Isolation Invariant:** `npm run build` must compile cleanly with zero TypeScript errors without requiring live network connections to Supabase.
3. **VPS Bridge Preservation Invariant:** The existing VPS deployment variables (`VPS_HOST`, `VPS_HOST_IP`, `VPS_USER`, `VPS_PASSWORD`, `VPS_APP_DIR`) in `.env` must be completely preserved without modification.
4. **Descriptive Failure Invariant:** If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing at runtime, the application must log a loud, clear, human-readable error indicating which variable is missing and how to rectify it in `.env`.

---

## 4. Acceptance Criteria (Verification Checklist)

- [ ] `.env` updated with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [ ] `.env.example` created with sanitized placeholder values and documentation notes.
- [ ] `.gitignore` confirms shielding for all `.env*` files except `.env.example`.
- [ ] `src/vite-env.d.ts` typed with `ImportMetaEnv`.
- [ ] `src/services/supabase.ts` purified of hardcoded credentials with explicit runtime check.
- [ ] All 6 scripts in `scripts/` refactored to consume `process.env` via `dotenv`.
- [ ] Verification script (`npx tsx scripts/sync-categories.ts` or `scripts/test-seo-rls.ts`) executes successfully using `.env`.
- [ ] `npm run build` exits with code 0 (Zero TypeScript errors, zero asset errors).
- [ ] `tasks/INDEX.md` and `PROJECT_STATE.json` synchronized.
