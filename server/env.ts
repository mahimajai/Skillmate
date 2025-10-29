import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1),
  DB_NAME: z.string().default("skillmate"),
  ALLOWED_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
});

export function getAllowedOrigins(): string[] | "*" {
  if (!env.ALLOWED_ORIGINS) return "*";
  const list = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length ? list : "*";
}
