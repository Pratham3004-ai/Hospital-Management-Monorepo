# Template Monorepo Constitution (`rules/`)

This folder contains the non-negotiable laws of the template.

These rules are not optional preferences.

They are the constraints that make this monorepo:

- stable on Windows
- reproducible across machines
- reusable across products
- resistant to tooling drift

Nothing in this repository should be modified without reading these.

---

# ✅ Required Reading Order

Start here:

## 1. Constitution

```txt
00-constitution.md
````

This defines the purpose and the sacred invariants.

---

# ✅ Rule Index

## Toolchain + Stability

* `01-toolchain-lock.md`
  Hard pinned Node + pnpm. No drift allowed.

* `05-windows-rollup-doctrine.md`
  Scoped Rollup override that keeps tsup stable on Windows.

* `11-no-syncpack.md`
  Syncpack is removed permanently. Stability is enforced via lockfile + CI.

---

## Shared Package Laws

* `02-shared-packages-runtime.md`
  Shared code must remain runtime-agnostic.

* `04-build-dist-contract.md`
  All build outputs must land in `dist/`.

* `06-react-peer-dependency.md`
  React is always a peer dependency. Never bundled.

---

## App Architecture + Creation

* `07-app-creation-scripts-only.md`
  Apps are created only via official scripts.

* `08-workers-http-vs-cron.md`
  Workers are split: API vs cron. Never mix triggers.

* `09-node-processor-permanent.md`
  One permanent heavy compute layer exists: `apps/node/processor`.

---

## Enforcement

* `10-ci-enforcement.md`
  CI is mandatory: frozen install, type-check, lint, build.

---

## Script Surface

* `12-scripts-reference.md`
  All `pnpm create:*` entrypoints documented.

---

# ✅ Final Statement

This template survives because these rules exist.

Tooling ecosystems drift constantly.

The constitution is what keeps this repo shippable.

Read it before editing anything.
