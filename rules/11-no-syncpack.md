# Rule 11 — Syncpack Is Forbidden (Stability Decision)

Dependency consistency tools sound attractive.

In practice, Syncpack introduced instability and friction:

- workspace protocol mismatches
- auto-rewrites of internal dependencies
- unpredictable tool behavior
- maintenance overhead exceeding benefit

Therefore:

> Syncpack is removed and forbidden.

---

# ✅ The Law

This template must never include:

- Syncpack dependency
- Syncpack config
- Syncpack CI enforcement
- Syncpack scripts

Forbidden commands:

```bash
pnpm syncpack
pnpm sync:fix
pnpm sync:check
````

Syncpack does not belong in this template.

---

# ✅ Replacement Stability Mechanisms

Version stability is enforced by:

## 1. Locked toolchain

* Node 20.x
* pnpm 9.15.4

## 2. Frozen lockfile installs

```bash
pnpm install --frozen-lockfile
```

## 3. Peer dependency discipline

React is never duplicated.

## 4. CI enforcement

* type-check
* lint
* build

## 5. Workspace protocol correctness

Internal packages always use:

```json
"workspace:^"
```

---

# ✅ Why Syncpack Was Rejected

Syncpack created major friction in real monorepo operation:

* it rewrites dependency ranges automatically
* it fights pnpm workspace conventions
* it introduces another fragile moving part

The template goal is:

> minimal tool fighting

Syncpack violates that goal.

---

# ✅ What Breaks If Reintroduced

If Syncpack returns, you will likely see:

* dependency churn
* broken workspace protocol alignment
* extra CI friction
* unnecessary maintenance complexity

The template becomes tooling-centric instead of shipping-centric.

---

# ✅ Final Statement

This template optimizes for:

* reproducibility
* Windows stability
* minimal tooling hell
* shipping applications over infrastructure perfection

Syncpack is not part of that future.

Do not reintroduce it.