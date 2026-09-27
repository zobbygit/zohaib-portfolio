import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env.js";

export const AUTH_COOKIE = "token";

export interface AdminClaims {
  sub: string;
  role: "admin";
}

/** Requires a valid admin JWT in an httpOnly cookie. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.cookies as Record<string, string | undefined> | undefined)?.[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }
  try {
    const claims = jwt.verify(token, jwtSecret(), { algorithms: ["HS256"] }) as AdminClaims;
    if (claims.role !== "admin") throw new Error("role");
    res.locals.admin = claims;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Authentication required" });
  }
}
