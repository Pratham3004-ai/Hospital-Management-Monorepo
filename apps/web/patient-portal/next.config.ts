import type { NextConfig } from "next";

// Template Monorepo Fix
const nextConfig: NextConfig = {
  /**
   * Template Monorepo Fix:
   * Workspace packages must be transpiled explicitly.
   */
  transpilePackages: [
  "@template/ui",
  "@template/utils",
  "@template/types",
  "@template/database",
  "@template/storage"
],
};

export default nextConfig;
