
# Rule 16 — Command Surface Doctrine (How Humans Run the Monorepo)

A monorepo is only usable if its command interface is boring, predictable,
and does not require memorizing pnpm filter syntax.

Humans should never need to type:

- `pnpm --filter ...`
- long Turbo scopes
- fragile workspace selectors

Therefore:

> StudioVault exposes a single stable command surface for all development work.

This rule exists to prevent monorepos from becoming terminal gymnastics.

---

# ✅ The Law

All development commands must follow exactly three tiers:

---

## Tier 1 — Single App Execution

Run exactly one application:

```bash
pnpm run dev:web shop
pnpm run dev:desktop admin
pnpm run dev:api auth
````

Meaning:

* platform first
* app name second
* one runtime at a time

---

## Tier 2 — Platform Execution (All Apps)

Run all apps inside one runtime category:

```bash
pnpm run dev:web
pnpm run dev:desktop
pnpm run dev:mobile
pnpm run dev:api
pnpm run dev:cron
```

This is the standard platform workflow.

---

## Tier 3 — Full Monorepo Execution

Run everything at once:

```bash
pnpm run dev:all
pnpm run build:all
pnpm run lint:all
pnpm run type-check:all
```

Turbo orchestrates the full system.

---

# ✅ Supported Platforms

The only valid platform groups are:

* `web`      → apps/web/*
* `desktop`  → apps/desktop/*
* `mobile`   → apps/mobile/*
* `api`      → apps/api/*
* `cron`     → apps/cron/*
* `all`      → entire monorepo

No other categories may be introduced without a new constitutional rule.

---

# ✅ Enforcement Mechanism

This command surface is implemented through the canonical runner:

```
scripts/run.mjs
```

Humans must never bypass this runner with manual filtering.

Forbidden usage:

```bash
pnpm --filter ./apps/web/shop dev
pnpm turbo run dev --scope=...
```

The filter system is for scripts, not humans.

---

# ✅ Why This Rule Is Sacred

Without a stable command interface, monorepos collapse into:

* inconsistent workflows
* onboarding confusion
* copy-paste tribal knowledge
* filter mistakes
* broken developer ergonomics

A template must remain boring to operate.

---

# ✅ Final Statement

StudioVault survives because humans do not fight tooling.

The runner provides one stable interface:

* single app
* platform group
* full system

No complexity.
No cleverness.
No command drift.

This is constitutional.

