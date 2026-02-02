# Rule 15 — Mobile Apps Share Contracts Only (UI Is Forbidden)

Expo (React Native) is not the Web.

It is a separate runtime with different rendering primitives, bundling rules,
styling systems, and library compatibility boundaries.

Trying to share a single React UI package across:

- Next.js (DOM)
- Electron (DOM)
- Expo (Native)

creates permanent instability.

Therefore:

> Mobile apps may share contracts, not components.

This rule exists to preserve monorepo survivability.

---

# ✅ The Law

All applications under:

```

apps/mobile/*

````

MUST only import **contract-only shared packages**, such as:

✅ Allowed:

- `@studiovault/types`
- `@studiovault/utils`
- `@studiovault/database` (schema/contracts only)
- `@studiovault/storage` (contracts only)
- validation schemas (Zod, etc.)

These packages must remain runtime-agnostic.

---

# ❌ Forbidden: Shared UI in Expo

Mobile apps MUST NOT import:

- `@studiovault/ui`
- any shared React web UI library
- DOM-based styling or component systems

Example violation:

```ts
import { Button } from "@studiovault/ui"; // forbidden
````

React Native does not render DOM elements.
Shared UI assumptions collapse immediately.

---

# ✅ Mobile UI Must Be Local

All UI in Expo must live inside:

```
apps/mobile/<name>/
```

Mobile apps may use:

* React Native components
* Expo Router UI
* NativeWind (optional)
* platform-specific design systems

But UI is not shared with web/desktop.

---

# ✅ Why This Rule Is Sacred

Sharing UI across web and native introduces:

* Metro bundler workspace instability
* incompatible animation libraries (framer-motion is web-only)
* styling system mismatch (Tailwind ≠ React Native)
* different event + input models
* platform-specific dependencies

The monorepo becomes a cross-platform framework project.

That is not the goal.

The goal is:

> Stable shared contracts + independent runtime UIs.

---

# ✅ Enforcement

This rule is enforced by:

* `scripts/doctor.mjs`

Doctor must fail if any file under `apps/mobile/*` imports:

```
@studiovault/ui
```

This prevents future contamination.

---

# ✅ What Breaks If Violated

If shared UI is imported into Expo:

* bundling failures (Metro cannot resolve/workspace cleanly)
* runtime crashes from DOM assumptions
* dependency incompatibilities
* permanent maintenance burden

Mobile becomes the source of instability for the entire template.

---

# ✅ Final Statement

Mobile belongs in the monorepo.

But mobile shares only contracts:

* types
* schemas
* validation
* domain logic

Web and desktop may share UI.

Expo must not.

Portability is law.
UI is runtime-local.

