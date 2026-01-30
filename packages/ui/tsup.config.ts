import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,

  outExtension: () => ({
    js: ".js",
    dts: ".d.ts",
  }),
});
