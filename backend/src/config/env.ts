import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string().optional().default(""),
  CONTACT_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(5),
  JWT_SECRET: z.string().optional().default(""),
  EMAILJS_SERVICE_ID: z.string().optional().default(""),
  EMAILJS_TEMPLATE_ID: z.string().optional().default(""),
  EMAILJS_PUBLIC_KEY: z.string().optional().default(""),
  EMAILJS_PRIVATE_KEY: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  }
  const env = parsed.data;
  if (env.NODE_ENV === "production" && env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
  return env;
}

export const env = loadEnv();

/** Secret used for admin tokens. Development falls back to a clearly-marked local value. */
export function jwtSecret(): string {
  return env.JWT_SECRET || "development-only-secret-do-not-use-in-production";
}