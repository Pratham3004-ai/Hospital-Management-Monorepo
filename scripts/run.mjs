#!/usr/bin/env node

import { execSync } from "node:child_process";

const [, , action, platform, appName] = process.argv;

/**
 * Examples:
 *
 * pnpm run dev:web shop
 * pnpm run dev:web
 * pnpm run dev:all
 */

function fail(msg) {
  console.error("\n❌ StudioVault Runner Failed:");
  console.error("   " + msg + "\n");
  process.exit(1);
}

if (!action) fail("Missing action (dev/build/lint/type-check).");
if (!platform) fail("Missing platform (web/desktop/mobile/api/cron/all).");

const roots = {
  web: "apps/web",
  desktop: "apps/desktop",
  mobile: "apps/mobile",
  api: "apps/api",
  cron: "apps/cron",
};

function run(cmd) {
  console.log("\n▶ Running:", cmd, "\n");
  execSync(cmd, { stdio: "inherit" });
}

/* -----------------------------
   ALL APPS IN MONOREPO
------------------------------ */

if (platform === "all") {
  run(`turbo ${action}`);
  process.exit(0);
}

/* -----------------------------
   PLATFORM VALIDATION
------------------------------ */

const base = roots[platform];
if (!base) fail(`Unknown platform "${platform}"`);

/* -----------------------------
   SINGLE APP MODE
------------------------------ */

if (appName) {
  run(`pnpm --filter "./${base}/${appName}" ${action}`);
  process.exit(0);
}

/* -----------------------------
   PLATFORM MODE (ALL APPS)
------------------------------ */

run(`pnpm --filter "./${base}/*" ${action}`);
process.exit(0);
