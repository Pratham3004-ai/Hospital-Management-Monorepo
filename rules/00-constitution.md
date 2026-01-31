# StudioVault Monorepo Constitution (Rules Index)

This folder contains the **non-negotiable laws** of the template.

These are not suggestions.

They are constraints discovered through real-world failure modes of the JavaScript + monorepo ecosystem.

The goal is simple:

> Prevent tooling entropy from destroying product velocity.

Every future project spawned from this template must respect these rules.

---

# ✅ How to Use This Folder

- `SETUP.md` is the entrypoint.
- `/rules` is the constitution.
- Every rule file is atomic and sacred.
- Do not merge rules into one giant document.
- Do not weaken these constraints for convenience.

When adding new tools or platforms:

1. Find the relevant rule category
2. Extend it carefully
3. Never violate an existing law without replacing it with a stronger one

---

# ✅ Constitutional Laws (Canonical)

## 01 — Toolchain Lock

**File:** `rules/01-toolchain-lock.md`

Defines:

- Node version constraint
- pnpm version constraint
- Forbidden version managers
- Reproducibility doctrine

This rule prevents invisible machine drift.

---

## 02 — Workspace Topology

**File:** `rules/02-workspace-layout.md`

Defines:

- Official folder layout under `/apps` and `/packages`
- Why taxonomy must remain stable
- Expansion rules for future apps

This prevents structural chaos.

---

## 03 — Shared Package Purity

**File:** `rules/03-shared-packages-runtime-agnostic.md`

Defines:

- What shared code is allowed to import
- Forbidden runtime-specific APIs
- Why portability is mandatory

This prevents cross-runtime contamination.

---

## 04 — Build Output Contract

**File:** `rules/04-build-dist-contract.md`

Defines:

- Every buildable package outputs to `dist/`
- No hidden build artifacts
- Why predictable outputs matter for monorepo stability

This prevents bundler ambiguity.

---

## 05 — Windows Stability Doctrine (Rollup + Tsup)

**File:** `rules/05-windows-rollup-doctrine.md`

Defines:

- Scoped override: `tsup>rollup = 3.29.4`
- Why global Rollup pins are forbidden
- Why this is sacred for Windows reproducibility

This prevents toolchain breakage.

---

## 06 — React Peer Dependency Law

**File:** `rules/06-react-peer-dependency.md`

Defines:

- Shared UI never bundles React
- Apps provide React
- Why duplicate React runtimes are catastrophic

This prevents hook/runtime duplication bugs.

---

## 07 — App Creation Law (Scripts Only)

**File:** `rules/07-app-creation-scripts-only.md`

Defines:

- Humans never manually copy apps
- Only official CLI wrappers are allowed
- Why scaffold drift must be contained

This prevents inconsistent projects.

---

## 08 — Worker Layer Split

**File:** `rules/08-workers-http-vs-cron.md`

Defines:

- HTTP Workers live in `apps/api/`
- Cron Workers live in `apps/cron/`
- One worker = one schedule
- Organizational clarity

This prevents trigger confusion.

---

## 09 — Processor Permanence (Node Background Layer)

**File:** `rules/09-node-processor-permanent.md`

Defines:

- `apps/node/processor` is permanent
- Jobs are vendor-neutral
- Runtime adapters are swappable

This prevents vendor lock and duplication.

---

## 10 — CI Enforcement Doctrine

**File:** `rules/10-ci-enforcement.md`

Defines:

- Frozen lockfile install
- Build + lint + type-check must run
- No deployment in template CI

This prevents template drift.

---

## 11 — Syncpack Removal Decision

**File:** `rules/11-no-syncpack.md`

Defines:

- Syncpack is forbidden
- Version stability comes from lockfile + CI
- Workspace protocol mismatches are not tolerated

This prevents dependency tool fighting.

---

# ✅ Sacred Rule Format

Every rule file must include:

1. The law (what is required)
2. The reason (why it cannot change)
3. What breaks if violated

No timelines.
No trial-and-error history.
Only final constraints.

---

# ✅ Final Note

This monorepo template is built for one purpose:

> Let you build applications without spending your life debugging build tools.

Respect the constitution.

Ship products.

