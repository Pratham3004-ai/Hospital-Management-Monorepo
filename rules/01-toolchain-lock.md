# Rule 01 — Toolchain Lock (Hard Non-Negotiable)

This monorepo template is only stable under a fixed toolchain.

Tooling drift is the number one reason monorepos collapse over time.

This rule exists to ensure:

- reproducibility
- Windows stability
- zero “works on my machine” failures
- long-term template survivability

---

# ✅ The Law

All contributors and all machines MUST use:

| Tool     | Required Version |
|----------|------------------|
| Node.js  | **20.20.x LTS**  |
| pnpm     | **9.15.4**       |

No other versions are supported.

---

# ✅ Enforcement (Root)

The root `package.json` enforces this:

```json
{
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": "20.x"
  }
}
````

This prevents silent toolchain mismatches.

---

# ✅ Installation Policy

Node MUST be installed only via:

* Official Node.js Windows MSI installer

pnpm MUST be installed globally via:

```bash
npm install -g pnpm@9.15.4
```

---

# ❌ Forbidden Tools

The following are explicitly forbidden:

* `nvm-windows`
* Corepack-based pnpm switching
* Multiple Node installations
* “Whatever version is installed already”

Reason:

These systems introduce invisible state drift.

Templates cannot survive under invisible drift.

---

# ✅ Why This Rule Is Sacred

JavaScript tooling is not deterministic across versions.

The same repo can behave differently depending on:

* Node minor version changes
* pnpm resolution changes
* transitive dependency shifts

A monorepo template must be:

* portable
* reproducible
* predictable

Therefore:

> Toolchain freedom is not allowed.

---

# ✅ What Breaks If Violated

If Node/pnpm versions drift, you will see failures like:

* Dependency resolution mismatches
* Build output differences
* Turbo cache inconsistencies
* Windows-only binary failures
* Scaffolded apps behaving differently across machines

This template exists to prevent exactly that.

---

# ✅ Final Statement

This template is not “compatible with Node generally.”

It is compatible with one locked baseline.

If the toolchain must be upgraded, it must be done deliberately,
centrally, and once — never gradually.

Toolchain lock is the foundation.

Do not weaken it.