## ✅ FILE 14 — `rules/12-scripts-reference.md`

This is the canonical command surface of the template.

Copy-paste exactly:

```md
# Rule 12 — Script Reference (Official App Creation Surface)

This template does not allow manual scaffolding.

All applications must be created through official script entrypoints.

These scripts are the **only approved creation interface**.

They wrap upstream CLIs and apply StudioVault monorepo laws:

- correct folder placement
- workspace dependency wiring
- TS config alignment
- runtime separation

---

# ✅ Script Inventory (Canonical)

All creation scripts live in:

```

scripts/

```

Exposed through root commands:

```

pnpm create:*

```

---

# ✅ 1. Web App (Next.js + Tailwind)

Creates a Next.js app inside:

```

apps/web/<name>

````

Command:

```bash
pnpm create:web studio-web
````

Guarantees:

* Official `create-next-app`

* Tailwind enabled

* Workspace packages installed:

  * `@studiovault/ui`
  * `@studiovault/utils`
  * `@studiovault/types`

* Next.js patched with:

```ts
transpilePackages: [
  "@studiovault/ui",
  "@studiovault/utils",
  "@studiovault/types"
]
```

This is mandatory for monorepo TS package imports.

---

# ✅ 2. Desktop App (Electron + Vite)

Creates an Electron app inside:

```
apps/desktop/<name>
```

Command:

```bash
pnpm create:desktop studio-desktop
```

Guarantees:

* Official `create-electron-vite`

* Renderer can import workspace packages

* Shared deps installed:

  * `@studiovault/ui`
  * `@studiovault/utils`
  * `@studiovault/types`

* TS config patched minimally (preserves Vite defaults)

---

# ✅ 3. Mobile App (Expo React Native)

Creates an Expo app inside:

```
apps/mobile/<name>
```

Command:

```bash
pnpm create:mobile studio-mobile
```

Guarantees:

* Official `create-expo-app`
* Workspace deps installed:

  * `@studiovault/ui`
  * `@studiovault/utils`
  * `@studiovault/types`

Expo config is preserved (no destructive overwrite).

---

# ✅ 4. HTTP API Worker (Cloudflare Edge)

Creates an HTTP-only Worker inside:

```
apps/api/<name>
```

Command:

```bash
pnpm create:worker edge
```

Guarantees:

* Official `create-cloudflare`
* Worker implements only:

```ts
fetch()
```

* Shared workspace deps installed:

  * `@studiovault/utils`
  * `@studiovault/types`

* No cron triggers exist

---

# ✅ 5. Cron Worker (Scheduled Job)

Creates a scheduled worker inside:

```
apps/cron/<name>
```

Command pattern:

```bash
pnpm create:cron-worker cleanup --cron "0 */5 * * *"
pnpm create:cron-worker sync    --cron "*/30 * * * *"
pnpm create:cron-worker daily   --cron "0 2 * * *"
```

Guarantees:

* Official `create-cloudflare`
* Worker implements only:

```ts
scheduled()
```

* Wrangler patched with:

```jsonc
"triggers": {
  "crons": ["<expression>"]
}
```

* One worker = one schedule

---

# ✅ Permanent Node Processor Layer

Unlike other apps, heavy background compute is not scaffolded repeatedly.

It exists permanently at:

```
apps/node/processor
```

This is the canonical home for:

* exports
* analytics pipelines
* PDF generation
* long compute jobs

Vendor runtime adapters live in:

```
src/runtime/
```

Core job logic lives in:

```
src/jobs/
```

---

# ✅ Script Design Rules

All scripts must obey:

* Wrap official CLIs only
* Never implement fake scaffolds
* Patch configs minimally (do not degrade defaults)
* Always install shared workspace dependencies
* Maintain runtime separation laws

Scripts are enforcement, not convenience.

---

# ✅ Final Statement

The script layer is the official creation interface of the template.

Humans do not copy folders.
Humans do not scaffold manually.

Everything begins through:

```bash
pnpm create:*
```

That is how the template survives time.
