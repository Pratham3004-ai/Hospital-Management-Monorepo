/*
 * StudioVault Env Contracts
 * Pure schema/types only — runtime agnostic.
 */

export type EnvShape = {
  DATABASE_URL: string;
  STORAGE_BUCKET: string;
  API_SECRET: string;
};

/**
 * Apps must supply env safely.
 * This package does NOT read process.env directly.
 */
export function defineEnv<T extends EnvShape>(env: T): T {
  return env;
}
