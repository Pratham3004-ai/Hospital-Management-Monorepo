const execPath = process.env.npm_execpath || "";

if (execPath.includes("pnpm")) {
  console.log("✅ pnpm verified.");
  process.exit(0);
}

console.error("\n❌ Template forbids npm/yarn/bun installs.");
console.error("Only pnpm is allowed.\n");
process.exit(1);
