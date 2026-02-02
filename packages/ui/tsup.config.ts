import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],

  // ✅ Generate normal .d.ts (NOT .d.mts)
  dts: {
    resolve: true,
  },

  outExtension: () => ({
    js: ".js",
    dts: ".d.ts",
  }),

  clean: true,
});
