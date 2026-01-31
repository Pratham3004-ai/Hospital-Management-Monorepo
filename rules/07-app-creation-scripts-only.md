# Rule 07 — App Creation Law (Scripts Only)

Humans must never manually scaffold apps inside this monorepo.

Not because humans are bad.

Because humans are inconsistent.

Tooling changes over time:

- Next.js prompts drift
- Cloudflare templates change
- Vite defaults evolve
- Dependency versions shift

If apps are created manually, every project becomes unique.

The template collapses.

Therefore:

> All apps must be created through official scripts.

---

# ✅ The Law

New apps MUST be created only via:

```bash
pnpm create:web <name>
pnpm create:desktop <name>
pnpm create:mobile <name>

pnpm create:worker <name>
pnpm create:cron-worker <name> --cron "<expr>"
````

No exceptions.

---

# ✅ Official Runtime Categories

Apps must live under canonical folders:

* `apps/web/*`
* `apps/desktop/*`
* `apps/mobile/*`
* `apps/api/*`
* `apps/cron/*`

Humans must not create random new roots.

---

# ✅ Why Scripts Exist

Scripts are not “convenience.”

Scripts are stability enforcement.

They guarantee:

* correct folder placement
* workspace dependency wiring
* correct shared package imports
* consistent TypeScript config patching
* correct monorepo compatibility fixes

The scripts wrap official CLIs only:

* `pnpm create next-app`
* `pnpm create electron-vite`
* `pnpm create expo-app`
* `pnpm create cloudflare`

No custom fake scaffolds.

---

# ✅ Script Guarantees

Every creation script must do the following:

1. Scaffold using the official CLI
2. Install shared workspace dependencies:

```bash
pnpm add @studiovault/utils @studiovault/types ...
```

3. Patch configs minimally (never destroy defaults)
4. Ensure workspace compatibility

Scripts are the only approved automation layer.

---

# ✅ Cron Worker Special Law

Cron workers are organizationally separate:

* `apps/api` = HTTP only
* `apps/cron` = Scheduled only

One cron worker = one schedule.

Never mix triggers.

This prevents confusion.

---

# ✅ Why Manual Creation Is Forbidden

Manual scaffolding causes:

* mismatched TS configs
* missing workspace dependencies
* broken Next.js transpilation
* inconsistent Worker triggers
* long-term drift across projects

The template becomes unreliable.

Scripts prevent drift.

---

# ✅ What Breaks If Violated

If apps are created manually:

* your repo becomes inconsistent immediately
* future automation cannot assume structure
* onboarding becomes unpredictable
* CI failures become common
* template reuse dies

The monorepo stops being a template.

---

# ✅ Final Statement

Humans are not scaffolding engines.

Scripts are the canonical entrypoints.

Every app must begin the same way,
or the template becomes chaos.

Do not create apps manually.