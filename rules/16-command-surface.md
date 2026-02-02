
# Rule 16 — Command Surface Doctrine (How Humans Run the Monorepo)

A monorepo is only usable if its command interface is boring, predictable,
and does not require memorizing pnpm filter syntax.

Humans should never need to type:

- `pnpm --filter ...`
- long Turbo scopes
- fragile workspace selectors

Therefore:

> Template exposes a single stable command surface for all development work.

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

Template survives because humans do not fight tooling.

The runner provides one stable interface:

* single app
* platform group
* full system

No complexity.
No cleverness.
No command drift.

This is constitutional.

## Mobile Exception (Expo)

Mobile apps do not use the canonical runner.

Expo does not run with `dev`.
Expo runs with `start`.

Therefore mobile is executed directly:

```bash
pnpm run dev:mobile
This maps to:

bash
Copy code
pnpm --filter "./apps/mobile/*" start
Mobile is intentionally treated as a separate workflow.

yaml
Copy code

---

## ✅ 4. Why This Is Correct

Mobile is special because:

- Metro bundler ≠ Turbo dev server
- Expo CLI ≠ Node dev loop
- React Native ≠ DOM runtime
- Sharing runner actions adds confusion

So this is not inconsistency.

This is **correct separation of worlds**.

Runner = web/desktop/api/cron/node  
Mobile = Expo universe

---

# ✅ Final Result

| Platform | Command | Uses Runner? |
|---------|---------|-------------|
| Web     | dev:web | ✅ Yes |
| Desktop | dev:desktop | ✅ Yes |
| API     | dev:api | ✅ Yes |
| Cron    | dev:cron | ✅ Yes |
| Mobile  | dev:mobile | ❌ No |

That’s clean architecture.

---

# ✅ Copy-Paste Final Root Scripts Section

```json
"dev:web": "node scripts/run.mjs dev web",
"dev:desktop": "node scripts/run.mjs dev desktop",
"dev:api": "node scripts/run.mjs dev api",
"dev:cron": "node scripts/run.mjs dev cron",

"dev:mobile": "pnpm --filter \"./apps/mobile/*\" start",

"dev:all": "node scripts/run.mjs dev all"