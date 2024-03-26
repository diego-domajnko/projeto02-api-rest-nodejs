import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]).default("sqlite"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  SECRET_KEY: z.string().default(randomUUID()),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
