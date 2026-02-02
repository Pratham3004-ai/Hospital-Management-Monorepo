# Rule 04 — Build Output Contract (`dist/` Is Mandatory)

Build outputs are not optional metadata.

They are the contract between:

- packages
- apps
- CI
- future consumers

If outputs drift, tooling breaks silently.

Therefore:

> Every buildable package must emit to `dist/`.

No exceptions.

---

# ✅ The Law

All shared runtime packages must build into:

```

dist/

```

This applies to:

- `@template/utils`
- `@template/ui`
- `@template/database`
- `@template/storage`
- future shared packages

The template contract is:

```

src/   → source
dist/  → build output (always)

````

---

# ✅ Required Package Fields

Every buildable package must declare:

```json
"main": "./dist/index.js",
"types": "./dist/index.d.ts",
"exports": {
  ".": {
    "default": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
````

This ensures:

* Node resolution works
* TypeScript resolution works
* Bundlers resolve correctly

---

# ✅ Build Tool Standard: tsup

All shared packages use:

* `tsup` for bundling
* ESM output
* DTS type generation

Standard config example:

```ts
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  outExtension: () => ({
    js: ".js",
    dts: ".d.ts"
  })
});
```

---

# ✅ Why `dist/` Is Sacred

Monorepos collapse when output conventions differ:

* some packages emit `build/`
* some emit `lib/`
* some emit `.mjs`
* some emit nothing

Consumers then fail unpredictably.

By enforcing `dist/` everywhere:

* Turbo caching is predictable
* CI validation is consistent
* Apps can import packages reliably
* Output paths never drift

---

# ✅ Turbo Output Enforcement

Turbo is configured to treat builds as:

```json
"outputs": ["dist/**"]
```

Meaning:

* caching works only if outputs are stable
* builds are invalid if artifacts go elsewhere

---

# ✅ What Breaks If Violated

If packages do not emit to `dist/`, you get:

* missing export resolution errors
* type declarations not found
* broken workspace imports
* Turbo cache corruption
* unpredictable publishing behavior

The template stops being reusable.

---

# ✅ Final Statement

`dist/` is not a suggestion.

It is the boundary between source and artifact.

Stable build outputs are the spine of the monorepo.

Do not drift.
