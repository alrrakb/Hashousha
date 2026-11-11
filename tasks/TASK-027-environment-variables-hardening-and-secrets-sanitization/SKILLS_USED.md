# Phase B: Skills Mobilization & Environmental Readiness

> **Task ID:** `TASK-027-environment-variables-hardening-and-secrets-sanitization`  
> **Milestone:** Milestone 23 — Environment Variables Hardening & Secrets Sanitization  
> **Implementing Agent:** Agent Beta (Senior Full-Stack Implementer)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Date:** 2026-11-11  

---

## 1. Active Skills Mobilized

### 1.1 `vercel-react-best-practices`
- **Location:** `.agents/skills/vercel-react-best-practices/`
- **Application:** Client bundle hygiene; preventing secret leaks into client chunks; enforcing build-time environment variable validation and runtime guards without breaking static compilation.

### 1.2 `supabase`
- **Location:** Global plugin skills (`plugins/supabase/skills/supabase/`)
- **Application:** Supabase client initialization patterns using `createClient`; handling public anon key lifecycle safely; ensuring auth persistence and token refresh operations remain unaffected.

### 1.3 `storefront-best-practices`
- **Location:** `.agents/skills/storefront-best-practices/`
- **Application:** Security boundaries in e-commerce applications; protecting backend connection parameters; deterministic operational scripts execution.

---

## 2. Technical Standards & Invariants Enforced

1. **Vite Variable Scoping:** All client-accessible environment variables must start with the `VITE_` prefix (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Variables without this prefix will remain completely unexposed to the browser client bundle.
2. **Double Resolution for CLI Scripts:** Utility scripts in `scripts/` will resolve variables via:
   `process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL`
   allowing execution across both frontend Vite conventions and standard backend Node/CI environments.
3. **Fail-Fast Runtime Diagnostics:** Throw actionable developer exceptions if required environment variables are undefined or empty.
4. **Git Non-Tracking Guarantee:** Verify `.env` is uncommitted and protected in `.gitignore`.
