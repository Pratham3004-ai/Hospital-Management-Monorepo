#!/usr/bin/env node

/**
 * Template Doctor Script — Constitutional Validator
 *
 * Purpose:
 * Catch violations BEFORE CI.
 *
 * Checks:
 *  1. Toolchain lock (Node + pnpm)
 *  2. Shared package runtime purity
 *  3. Mobile boundary enforcement (no shared UI)
 *  4. React runtime duplication
 *  5. React peer dependency law (UI must not bundle React)
 *
 * Run:
 *   pnpm check:doctor
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/* --------------------------------------------
 * Utilities
 * ------------------------------------------ */

function fail(msg) {
  console.error("\n❌ Doctor Failed:");
  console.error("   " + msg + "\n");
  process.exit(1);
}

function ok(msg) {
  console.log("✅ " + msg);
}

function warn(msg) {
  console.warn("⚠️ " + msg);
}

/**
 * Recursively collect all .ts/.tsx files inside a directory
 */
function getSourceFilesRecursive(dir) {
  let results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...getSourceFilesRecursive(fullPath));
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }

  return results;
}

/* --------------------------------------------
 * 1. Toolchain Verification
 * ------------------------------------------ */

console.log("\n🔎 Checking toolchain...");

const nodeVersion = process.version;
if (!nodeVersion.startsWith("v20.")) {
  fail(`Node version must be 20.x. Found: ${nodeVersion}`);
}
ok(`Node version OK (${nodeVersion})`);

let pnpmVersion = "";
try {
  pnpmVersion = execSync("pnpm -v").toString().trim();
} catch {
  fail("pnpm is not installed or not in PATH.");
}

if (pnpmVersion !== "9.15.4") {
  fail(`pnpm must be 9.15.4. Found: ${pnpmVersion}`);
}
ok(`pnpm version OK (${pnpmVersion})`);

/* --------------------------------------------
 * 2. Shared Package Runtime Purity Scan
 * ------------------------------------------ */

console.log("\n🔎 Scanning shared packages for forbidden runtime imports...");

const forbiddenImports = [
  "fs",
  "path",
  "node:fs",
  "node:path",
  "child_process",
  "node:child_process",
];

/**
 * Matches:
 * import x from "fs"
 * require("fs")
 */
function containsForbiddenImport(raw, mod) {
  const pattern = new RegExp(
    String.raw`from\s+["']${mod}["']|require\(\s*["']${mod}["']\s*\)`,
    "g",
  );

  return pattern.test(raw);
}

const packagesDir = path.join("packages");

if (!fs.existsSync(packagesDir)) {
  fail("packages/ folder not found.");
}

const packageList = fs.readdirSync(packagesDir);

for (const pkg of packageList) {
  const srcDir = path.join(packagesDir, pkg, "src");

  if (!fs.existsSync(srcDir)) continue;

  const files = getSourceFilesRecursive(srcDir);

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");

    for (const bad of forbiddenImports) {
      if (containsForbiddenImport(raw, bad)) {
        fail(
          `Forbidden import "${bad}" found in:\n` +
            `   ${filePath}\n\n` +
            `Shared packages MUST remain runtime-agnostic.`,
        );
      }
    }
  }
}

ok("Shared package purity upheld (no forbidden runtime imports).");

/* --------------------------------------------
 * 3. Mobile Boundary Enforcement
 * ------------------------------------------ */

console.log("\n🔎 Enforcing mobile boundary (Expo must not import @template/ui)...");

const mobileDir = path.join("apps", "mobile");

if (fs.existsSync(mobileDir)) {
  const mobileApps = fs.readdirSync(mobileDir);

  for (const app of mobileApps) {
    const appPath = path.join(mobileDir, app);

    if (!fs.statSync(appPath).isDirectory()) continue;

    const files = getSourceFilesRecursive(appPath);

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, "utf8");

      if (raw.includes(`@template/ui`)) {
        fail(
          `Expo app "${app}" illegally imports @template/ui:\n\n` +
            `   ${filePath}\n\n` +
            `Mobile apps may ONLY share contracts:\n` +
            `types, utils, schema. UI must be local.`,
        );
      }
    }
  }

  ok("Mobile boundary upheld (no shared UI imports).");
} else {
  warn("apps/mobile not present yet. Skipping mobile boundary enforcement.");
}

/* --------------------------------------------
 * 4. React Runtime Duplication Check
 * ------------------------------------------ */

console.log("\n🔎 Checking for duplicate React runtime versions...");

const lockfilePath = "pnpm-lock.yaml";

if (!fs.existsSync(lockfilePath)) {
  warn("pnpm-lock.yaml not found. Skipping React duplication check.");
} else {
  const rawLock = fs.readFileSync(lockfilePath, "utf8");

  /**
   * Detect real React installs (NOT @types/react)
   */
  const matches =
    rawLock.match(/(?<!@types\/)react@[0-9]+\.[0-9]+\.[0-9]+/g) || [];

  const unique = [...new Set(matches)];

  if (unique.length === 0) {
    warn("React runtime not found yet (no apps installed).");
  } else if (unique.length !== 1) {
    fail(
      `Multiple React runtimes detected:\n` +
        unique.map((x) => `   ${x}`).join("\n") +
        `\n\nThis WILL cause Invalid Hook Call bugs.`,
    );
  } else if (unique[0] !== "react@19.1.0") {
    fail(
      `React version drift detected.\n\n` +
        `Expected: react@19.1.0\n` +
        `Found:    ${unique[0]}\n\n` +
        `Run clean install:\n` +
        `rm -rf node_modules pnpm-lock.yaml && pnpm install`,
    );
  } else {
    ok("Single React runtime detected (react@19.1.0).");
  }
}

/* --------------------------------------------
 * 5. React Peer Dependency Law
 * ------------------------------------------ */

console.log("\n🔎 Checking React peer dependency law (UI must not bundle React)...");

const uiPkgPath = path.join("packages", "ui", "package.json");

if (!fs.existsSync(uiPkgPath)) {
  warn("packages/ui not present yet. Skipping UI peer dependency check.");
} else {
  const uiPkg = JSON.parse(fs.readFileSync(uiPkgPath, "utf8"));

  if (uiPkg.dependencies?.react) {
    fail("packages/ui MUST NOT list react in dependencies — only peerDependencies.");
  }

  ok("React peer dependency law upheld (UI does not bundle React).");
}

/* --------------------------------------------
 * Final Success
 * ------------------------------------------ */

console.log("\n🎉 Doctor: All constitutional checks passed.\n");
process.exit(0);
