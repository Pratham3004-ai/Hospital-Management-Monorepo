import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.wsnsldwnfgdewbpulxep:G8$Rsnw35Qyc5mc@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  },
} satisfies Config;
