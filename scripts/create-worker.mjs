#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * StudioVault Cron Worker Creator
 *
 * Usage:
 *   pnpm create:cron-worker cleanup --cron "0 * /5 * * *"(there is no space between the * and / in * /5 , it is stuffed so that the comment does not break)
 *   pnpm create:cron-worker sync --cron "* /30 * * * *"
 *   pnpm create:cron-worker daily --cron "0 2 * * *"
 *
 * Creates:
 *   apps/cron/<name>
 *
 * Guarantees:
 * - Official Cloudflare CLI only
 * - Installs shared workspace deps
 * - Adds StudioVault TS config devDependency
 * - Patches tsconfig to extend monorepo baseline
 * - Adds cron trigger into wrangler.jsonc
 * - Writes scheduled-only entrypoint
 */

const args = process.argv.slice(2);

const workerName = args[0];
const cronFlagIndex = args.indexOf("--cron");
const cronExpr = cronFlagIndex !== -1 ? args[cronFlagIndex + 1] : null;

if (!workerName) {
    console.error("❌ Missing worker name.");
    console.error(
        'Usage: pnpm create:cron-worker <name> --cron "*/30 * * * *"',
    );
    process.exit(1);
}

if (!cronExpr) {
    console.error("❌ Missing --cron argument.");
    console.error(
        'Example: pnpm create:cron-worker cleanup --cron "0 */5 * * *"',
    );
    process.exit(1);
}

/**
 * Basic cron validation: must be 5 fields
 */
const cronParts = cronExpr.trim().split(/\s+/);
if (cronParts.length !== 5) {
    console.error("❌ Invalid cron expression:", cronExpr);
    console.error("Cron must have exactly 5 fields:");
    console.error('Example: "*/30 * * * *"');
    process.exit(1);
}

/**
 * Folder Convention:
 * apps/cron/<workerName>
 */
const appDirName = workerName;

/**
 * Ensure folders exist
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(path.join("apps", "cron")))
    fs.mkdirSync(path.join("apps", "cron"));

console.log("✅ Creating StudioVault Cron Worker:", appDirName);
console.log("⏱️ Schedule:", cronExpr);

/**
 * Step 1: Scaffold Worker with official Cloudflare CLI
 */
process.chdir(path.join("apps", "cron"));

console.log(`
Cloudflare CLI will prompt you.

Select:
- ** Hello World example **
- ** Worker only **
- ** TypeScript **
- ** Git: Yes **
- ** Deploy: No **
`);


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
 * Step 5: Patch wrangler.jsonc with cron trigger
 */
console.log("✅ Patching wrangler.jsonc with cron schedule...");

const wranglerConfigPath = "wrangler.jsonc";

if (!fs.existsSync(wranglerConfigPath)) {
    console.error("❌ wrangler.jsonc not found. Cloudflare template changed.");
    process.exit(1);
}

const raw = fs.readFileSync(wranglerConfigPath, "utf8");
let patched = raw;

if (!raw.includes('"triggers"')) {
    patched = raw.replace(
        /"compatibility_date":\s*"([^"]+)",?/,
        `"compatibility_date": "$1",\n\n  "triggers": {\n    "crons": ["${cronExpr}"]\n  },`,
    );
}

fs.writeFileSync(wranglerConfigPath, patched);

/**
 * Step 6: Write scheduled-only worker entry
 */
console.log("✅ Writing scheduled worker entry...");

const entryPath = path.join("src", "index.ts");

fs.writeFileSync(
    entryPath,
    `import { slugify } from "@studiovault/utils";

export default {
  /**
   * StudioVault Cron Worker
   * Schedule: ${cronExpr}
   */
  async scheduled(): Promise<void> {
    const name = slugify("${appDirName}");
    console.log("⏱️ Cron tick from:", name);

    // TODO: Implement scheduled job here
  }
};
`,
);

console.log("\n🎉 Cron Worker created successfully!");
console.log("Next steps:");
console.log(`cd apps/cron/${appDirName}`);
console.log("pnpm dev");
