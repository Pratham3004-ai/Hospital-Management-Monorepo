# Rule 02 — Workspace Layout (Canonical Taxonomy)

A monorepo template lives or dies by structure.

If folder layout becomes inconsistent, everything breaks:

- scripts cannot assume paths
- CI cannot reliably validate scope
- shared packages become tangled
- humans stop understanding the repo

Therefore the workspace topology is sacred.

---

# ✅ The Law

This repository has exactly one official structure:

```

apps/
web/        → Next.js apps (spawned via script)
desktop/    → Electron desktop apps (spawned via script)
mobile/     → Expo mobile apps (spawned via script)

api/        → Cloudflare HTTP Workers (spawned via script)
cron/       → Cloudflare Scheduled Workers (spawned via script)

node/
processor → Permanent Node background compute layer

packages/
typescript-config → Shared TS config baselines
eslint-config     → Shared ESLint rules
prettier-config   → Shared Prettier rules

types             → Runtime-agnostic contracts only
utils             → Runtime-agnostic helpers only
ui                → Shared React UI components (React peer)

env      → Future: environment contracts
database → Schema + contracts only (no drivers)
storage  → Storage contracts only (no bindings)

scripts/
→ Official app creation wrappers

rules/
→ Template constitution

````

This structure must not drift.

---

# ✅ Workspace Definition (pnpm)

The workspace is defined in:

`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "apps/*/*"
  - "packages/*"
  - "scripts"
````

Meaning:

* All apps under `/apps`
* All shared code under `/packages`
* All scaffolding under `/scripts`

No other top-level package roots are allowed.

---

# ✅ Why Apps Are Split by Category

Apps are grouped by runtime, not by product name:

* `web/` → Browser SSR apps
* `desktop/` → Electron runtime apps
* `mobile/` → React Native runtime apps
* `api/` → Edge workers (HTTP only)
* `cron/` → Scheduled workers (time triggers)
* `node/processor` → Heavy compute runtime

Reason:

> Runtimes have incompatible constraints.
> The folder layout must reflect runtime boundaries.

---

# ✅ Processor Exception

Unlike other apps, the Node processor is permanent:

```
apps/node/processor
```

It is not created repeatedly.

It is the single canonical background compute layer for all projects.

This avoids duplication and vendor lock.

---

# ✅ Expansion Rules (Future Safety)

When adding new runtime categories:

* Add a new folder under `apps/`
* Provide a creation script under `scripts/`
* Document it in `rules/00-constitution.md`

Never create “random app folders” directly under `/apps`.

Examples of forbidden growth:

```
apps/new-app-root/
apps/backend/
apps/random-tests/
```

Everything must belong to a defined runtime category.

---

# ✅ What Breaks If Violated

If layout drifts, the monorepo collapses into:

* inconsistent app setups
* broken scaffold scripts
* impossible CI assumptions
* tangled shared dependencies
* human confusion

The template stops being reusable.

---

# ✅ Final Statement

This is not a “flexible folder suggestion.”

This is the canonical monorepo shape.

All future applications are spawned inside it.

Structure is stability.

Do not drift.
