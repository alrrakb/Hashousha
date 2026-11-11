# Autonomous Skills Engine Registry — HASHOUSHA (حشوشة)

> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Status:** ACTIVE & GOVERNED  
> **Location:** `.agents/skills/`  
> **Protocol:** Mandatory Just-In-Time Skill Acquisition (`AGENT_RULES.md` Phase B)  

---

## 1. Overview & Skill Registry

In accordance with the **Dynamic Skill Mobilization Protocol**, specialized, peer-reviewed engineering skills have been audited and installed into the repository to guarantee maximum frontend performance, mobile ergonomics, design token adherence, and e-commerce conversion.

### Installed Skills Portfolio:

| Skill Directory | Source Repository | Installs / Reputation | Primary Focus & Domain Utility |
|:---|:---|:---:|:---|
| [`vercel-react-best-practices/`](./vercel-react-best-practices/) | `vercel-labs/agent-skills` | **743.4K** installs | High-performance React 18+ patterns, state atomicity, memory leak prevention, memoization, and optimal rendering lifecycle. |
| [`tailwind-design-system/`](./tailwind-design-system/) | `wshobson/agents` | **65.6K** installs | Design token architecture, responsive utility hierarchies, composable layout primitives, and strict avoidance of arbitrary CSS values. |
| [`design-mobile-apps/`](./design-mobile-apps/) | `designed-by-ai/skills` | **421.2K** installs | Touch ergonomics (44px+ hit targets), mobile-first viewport scaling, bottom drawer interaction patterns, and fluid mobile gestures. |
| [`storefront-best-practices/`](./storefront-best-practices/) | `medusajs/medusa-agent-skills` | **4.1K** installs | E-commerce storefront architecture, product card hierarchy, variant/option selector UX, persistent cart synchronicity, and frictionless checkout pathways. |

---

## 2. Operational Guidelines for Agent Beta (Senior Implementer)

Whenever executing a task:
1. **Mandatory Consultation**: Read the relevant `SKILL.md` inside `.agents/skills/<skill-name>/` before generating components or configuring state.
2. **Phase B Cataloging**: List the specific skill rules being applied in `tasks/TASK-XXX-<slug>/SKILLS_USED.md`.
3. **Application Matrix by Module**:
   - **Storefront & Product Grid**: Mobilize `storefront-best-practices` & `tailwind-design-system`.
   - **Cart Drawer & Bottom Sticky Bar**: Mobilize `design-mobile-apps` & `vercel-react-best-practices`.
   - **Option/Customization Modal**: Mobilize `storefront-best-practices` & `design-mobile-apps`.
   - **State Stores (Zustand)**: Mobilize `vercel-react-best-practices`.

---

## 3. Maintenance & New Skill Acquisition Protocol

To add or update skills for future milestones:
```bash
# Discover relevant skills:
npx skills find "<topic>"

# Audit and install directly into project:
npx skills add <owner/repo> --skill <skill-name> -y --copy
```
All newly added skills must be approved by **Agent Alpha** and recorded in this register.
