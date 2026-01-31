# Rule 08 — Worker Layer Split (HTTP vs Cron)

Cloudflare Workers support multiple trigger types:

- HTTP requests (`fetch`)
- Scheduled triggers (`cron`)
- Queues, workflows, etc.

Mixing trigger types inside one Worker creates confusion and instability.

Therefore:

> This template enforces a strict Worker split.

---

# ✅ The Law

Workers are divided into two categories:

## 1. HTTP API Workers

Location:

```

apps/api/<name>

````

Created via:

```bash
pnpm create:worker <name>
````

These workers must only implement:

```ts
fetch()
```

They run only when called by HTTP requests.

---

## 2. Scheduled Cron Workers

Location:

```
apps/cron/<name>
```

Created via:

```bash
pnpm create:cron-worker <name> --cron "<expr>"
```

These workers must only implement:

```ts
scheduled()
```

They run only on timers.

---

# ✅ One Worker = One Schedule

Every cron worker has exactly one cron expression.

Examples:

```bash
pnpm create:cron-worker cleanup --cron "0 */5 * * *"
pnpm create:cron-worker sync    --cron "*/30 * * * *"
pnpm create:cron-worker daily   --cron "0 2 * * *"
```

Do not create one Worker with multiple unrelated schedules.

Instead:

* create multiple workers
* keep responsibilities isolated

---

# ✅ Why This Rule Is Sacred

Triggers are fundamentally different runtime contracts:

* HTTP workers respond to requests
* Cron workers are background jobs

Mixing them leads to:

* unclear deployment behavior
* unclear ownership of tasks
* accidental trigger overlap
* debugging nightmares

A monorepo template must enforce clarity.

---

# ✅ Cron Trigger Configuration

Cron workers must patch Wrangler config safely:

```jsonc
"triggers": {
  "crons": ["0 */5 * * *"]
}
```

HTTP workers must have no triggers block.

This ensures:

* zero accidental cron execution
* zero accidental schedule drift

---

# ✅ Organizational Benefit

This split provides long-term cleanliness:

```
apps/api/
  auth/
  signing/
  edge/

apps/cron/
  cleanup/
  analytics/
  sync/
```

The repo remains readable even with many jobs.

---

# ✅ What Breaks If Violated

If HTTP + cron are mixed:

* responsibilities blur
* schedules become hidden inside API workers
* accidental background execution happens
* Worker reasoning becomes impossible

The system loses predictability.

---

# ✅ Final Statement

HTTP workers serve requests.

Cron workers run jobs.

Separate them forever.

This is constitutional clarity.