#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * StudioVault API Worker Creator
 *
 * Usage:
 *   pnpm create:worker edge
 *   pnpm create:worker auth
 *
 * Creates:
 *   apps/api/<name>
 *
 * Guarantees:
 * - Official Cloudflare CLI only
 * - HTTP-only Worker (no cron triggers)
 * - Installs shared workspace deps
 * - Patches tsconfig to extend monorepo baseline
 * - Writes fetch() entrypoint
 */

const args = process.argv.slice(2);
const workerName = args[0];

if (!workerName) {
  console.error("❌ Missing worker name.");
  console.error("Usage: pnpm create:worker <name>");
  process.exit(1);
}

/**
 * Folder Convention:
 * apps/api/<workerName>
 */
const appDirName = workerName;

/**
 * Ensure folders exist
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(path.join("apps", "api")))
  fs.mkdirSync(path.join("apps", "api"));

console.log("✅ Creating StudioVault API Worker:", appDirName);

/**
 * Step 1: Scaffold Worker with official Cloudflare CLI
 */
process.chdir(path.join("apps", "api"));

execSync(`pnpm create cloudflare@latest ${appDirName}`, {
  stdio: "inherit",
});

/**
 * Step 2: Enter worker directory
 */
process.chdir(appDirName);

/**
 * Step 3: Install shared StudioVault dependencies
 */
console.log("\n✅ Installing shared StudioVault workspace dependencies...");

execSync("pnpm add @studiovault/utils @studiovault/types --workspace", {
  stdio: "inherit",
});

execSync("pnpm add -D @studiovault/typescript-config --workspace", {
  stdio: "inherit",
});

/**
 * Step 4: Patch tsconfig.json to extend monorepo baseline
 */
console.log("✅ Patching tsconfig.json to StudioVault baseline...");

const tsconfigPath = "tsconfig.json";

fs.writeFileSync(
  tsconfigPath,
  `{
  "extends": "@studiovault/typescript-config/base.json",

  "compilerOptions": {
    "types": ["./worker-configuration.d.ts"]
  },

  "include": ["worker-configuration.d.ts", "src/**/*.ts"],
  "exclude": ["test"]
}
`
);


/**
 * Step 5: Ensure wrangler.jsonc has NO triggers
 */
console.log("✅ Ensuring HTTP-only worker (no cron triggers)...");

const wranglerConfigPath = "wrangler.jsonc";

if (fs.existsSync(wranglerConfigPath)) {
  const raw = fs.readFileSync(wranglerConfigPath, "utf8");

  // Remove triggers block if present
  const cleaned = raw.replace(
    /,\s*"triggers"\s*:\s*\{[\s\S]*?\}\s*/g,
    ""
  );

  fs.writeFileSync(wranglerConfigPath, cleaned);
}

/**
 * Step 6: Write HTTP fetch() worker entry
 */
console.log("✅ Writing API worker entry...");

fs.writeFileSync(
  path.join("src", "index.ts"),
  `import { slugify } from "@studiovault/utils";
import type { ApiResponse } from "@studiovault/types";

export default {
  async fetch(): Promise<Response> {
    const value = slugify("StudioVault API Worker: ${appDirName}");

    const body: ApiResponse<string> = {
      success: true,
      data: value
    };

    return Response.json(body);
  }
};
`
);

console.log("\n🎉 API Worker created successfully!");
console.log("Next steps:");
console.log(`cd apps/api/${appDirName}`);
console.log("pnpm dev");
