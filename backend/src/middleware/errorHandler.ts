import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { log } from "../utils/logger.js";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: "Route not found" });
}

/** Centralized error handling. Never leaks stack traces or internal details. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ success: false, error: "Validation failed", details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })) });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ success: false, error: err.message });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ success: false, error: "Malformed JSON" });
    return;
  }
  if (err instanceof Error && "type" in err && (err as { type?: string }).type === "entity.too.large") {
    res.status(413).json({ success: false, error: "Payload too large" });
    return;
  }
  log("error", "unhandled_error", { name: err instanceof Error ? err.name : "unknown" });
  res.status(500).json({ success: false, error: "Internal server error" });
}
