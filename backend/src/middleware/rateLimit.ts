import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many requests" },
});

/** Strict limiter for the contact endpoint to slow down spam. */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.CONTACT_RATE_LIMIT_PER_HOUR,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many messages. Please try again later." },
});
