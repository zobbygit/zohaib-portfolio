import { z } from "zod";
import { sanitizeText } from "../utils/sanitize.js";

export const contactBodySchema = z.object({
  name: z.string().min(2).max(80).transform(sanitizeText),
  email: z.string().email().max(120).transform((v) => v.trim().toLowerCase()),
  projectType: z.string().max(60).optional().default("").transform(sanitizeText),
  message: z.string().min(10).max(2000).transform(sanitizeText),
  // Honeypot: real visitors never fill this field.
  website: z.string().max(200).optional().default(""),
});

export type ContactBody = z.infer<typeof contactBodySchema>;
