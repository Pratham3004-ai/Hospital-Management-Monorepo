# Rule 03 — Shared Packages Must Be Runtime-Agnostic

Shared packages are the heart of the monorepo.

They are also the easiest way to destroy the monorepo.

If shared code accidentally becomes Node-only, Worker-only, or Browser-only,
the entire template collapses into runtime incompatibility.

Therefore:

> Shared packages must remain pure and portable forever.

---

# ✅ The Law

All code inside:

```

packages/*

````

MUST be runtime-agnostic.

That means:

- No Node-only dependencies
- No Worker-only bindings
- No Browser globals
- No filesystem access
- No hidden environment assumptions

Shared packages must survive across:

- Next.js (Node + Edge hybrid)
- Electron (Node + Browser hybrid)
- Expo (React Native runtime)
- Cloudflare Workers (Edge runtime)
- Lambda/Cloud Run (Node runtime)

---

# ❌ Forbidden Imports

Shared packages MUST NOT import:

- `fs`
- `path`
- `crypto` (Node-only variant)
- `process` assumptions
- Cloudflare bindings (`env`, `caches`, `ctx`)
- Browser globals (`window`, `document`)

Example violation:

```ts
import fs from "node:fs"; // forbidden
````

Example violation:

```ts
console.log(window.location); // forbidden
```

Shared code must not depend on runtime globals.

---

# ✅ Allowed Content

Shared packages may contain only:

✅ Pure utilities

* string helpers
* math helpers
* formatting

✅ Types and contracts

* API request/response shapes
* shared domain models

✅ Schema definitions

* validation schemas
* portable table constants

✅ React UI components

* components only
* React is a peer dependency

✅ Portable constants

* table names
* enum-like values

---

# ✅ Runtime Bindings Belong in Apps

If you need:

* filesystem access
* database drivers
* Cloudflare Worker bindings
* S3/R2 SDK usage
* environment variable resolution

That code belongs inside:

```
apps/*
```

Never inside:

```
packages/*
```

Shared packages define contracts.
Apps implement runtime bindings.

---

# ✅ Why This Rule Is Sacred

Every runtime has hard limits:

* Workers cannot access Node APIs
* Browsers cannot access filesystem
* React Native has different globals
* Node services can do heavy compute

If shared code imports runtime-specific APIs,
you lose portability instantly.

Then every new platform becomes a rewrite.

The template becomes unusable.

---

# ✅ Enforcement Mechanisms

This template enforces purity via:

* ESLint restricted imports
* Separate TS config baselines
* Workspace discipline
* Human constitutional review

Example ESLint rule:

```js
"no-restricted-imports": [
  "error",
  { paths: ["fs", "path"] }
]
```

---

# ✅ What Breaks If Violated

Violating runtime purity causes:

* Cloudflare Workers build failures
* Expo bundler crashes
* Next.js edge runtime incompatibility
* Duplicate runtime polyfills
* Impossible future platform expansion

The monorepo becomes a Node-only project.

That defeats the entire purpose.

---

# ✅ Final Statement

Shared packages are not convenience dumping grounds.

They are portable contracts.

Apps contain bindings.
Packages contain laws.

Portability is sacred.

Do not contaminate shared code.

```

