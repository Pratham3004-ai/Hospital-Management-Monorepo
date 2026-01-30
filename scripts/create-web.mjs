#!/usr/bin/env node

/**
 * StudioVault Web App Creator (Next.js + Tailwind)
 *
 * Creates a monorepo-safe Next.js app under /apps.
 * Automatically installs shared packages and patches next.config.ts.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";

const appName = process.argv[2];

if (!appName) {
  console.error("❌ Missing app name.");
  console.error("Usage: pnpm create:web <app-name>");
  process.exit(1);
}

/**
 * Step 1: Ensure /apps exists
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");
const baseDir = path.join("apps", "web");

if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
/**
 * Step 2: Scaffold Next.js app (Windows-safe: run inside /apps)
 */
process.chdir(baseDir);

console.log("✅ Creating Next.js + Tailwind app:", appName);

execSync(
  `pnpm create next-app@latest ${appName} \
    --ts \
    --eslint \
    --tailwind \
    --src-dir \
    --app \
    --use-pnpm`,
  { stdio: "inherit" }
);

/**
 * Step 3: Install StudioVault shared workspace packages
 */
process.chdir(appName);

console.log("\n✅ Installing shared StudioVault packages...");

execSync(
  "pnpm add @studiovault/ui @studiovault/utils @studiovault/types --workspace",
  { stdio: "inherit" }
);

/**
 * Step 4: Patch next.config.ts for monorepo transpilation
 */
console.log("\n✅ Patching next.config.ts for workspace compatibility...");

const nextConfigPath = "next.config.ts";

if (fs.existsSync(nextConfigPath)) {
  fs.writeFileSync(
    nextConfigPath,
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * StudioVault Monorepo Fix:
   * Workspace packages must be transpiled explicitly.
   */
  transpilePackages: [
    "@studiovault/ui",
    "@studiovault/utils",
    "@studiovault/types",
  ],
};

export default nextConfig;
`
  );
} else {
  console.warn("⚠️ next.config.ts not found, skipping patch.");
}

console.log("\n✅ Web app fully ready.");
console.log("Next steps:");
console.log(`cd apps/${appName}`);
console.log("pnpm dev");
