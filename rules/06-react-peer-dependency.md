# Rule 06 — React Peer Dependency Law (UI Never Bundles React)

React is not a normal dependency in monorepos.

React is a runtime.

If React is duplicated across packages, the application breaks in surreal ways:

- hooks explode
- context stops working
- rendering becomes undefined
- errors appear that look like witchcraft

Therefore:

> Shared UI packages must never bundle React.

---

# ✅ The Law

The shared UI package:

```

packages/ui

````

MUST declare React as a peer dependency:

```json
"peerDependencies": {
  "react": "18.x",
  "react-dom": "18.x"
}
````

React must be provided by consuming apps.

---

# ✅ What This Prevents

If UI packages include React directly as a normal dependency:

```json
"dependencies": {
  "react": "18.x"
}
```

Then multiple React copies get installed:

* one in the app
* one in the UI package

This produces the infamous failure:

> Invalid hook call. Hooks can only be called inside the body of a function component.

Which is not a “small warning.”

It is runtime collapse.

---

# ✅ Correct Dependency Model

Apps own React:

* Next.js app installs React
* Electron renderer installs React
* Expo app installs React

Shared UI only consumes React:

* components
* hooks
* styling

But never ships its own React runtime.

---

# ✅ Entry Point Rule

UI packages must use `.tsx` entrypoints:

```ts
src/index.tsx
```

Not `.ts`.

Reason:

* ensures correct JSX typing
* prevents accidental non-React builds
* makes intent explicit

---

# ✅ Why This Rule Is Sacred

React is not just a library.

It is an identity.

Two React runtimes in one process is like:

* two gravity constants
* two conflicting realities

The app cannot stay coherent.

Peer dependency is the only correct solution.

---

# ✅ What Breaks If Violated

If React is bundled into shared packages:

* hooks fail unpredictably
* Next.js hydration breaks
* Electron apps mis-render
* Expo bundler duplicates runtime
* debugging becomes impossible

This is one of the hardest monorepo failure modes.

Therefore:

> React duplication is forbidden by constitution.

---

# ✅ Final Statement

UI packages provide components.

Apps provide React.

This law prevents one of the most catastrophic frontend bugs possible.

Do not violate it.
