import { z } from "zod";

// 🔹 Zod User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export const Tables = {
  users: "users",
} as const;

export * from "./schema.js";