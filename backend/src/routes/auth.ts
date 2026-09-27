import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env, jwtSecret } from "../config/env.js";
import { User } from "../models/User.js";
import { AUTH_COOKIE, requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many login attempts. Try again later." },
});

const loginSchema = z.object({ email: z.string().email().max(120), password: z.string().min(1).max(200) });
const cookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000, path: "/" };

authRouter.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    // Compare even when the user is missing, so timing does not reveal which emails exist.
    const hash = user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok) throw new HttpError(401, "Invalid email or password");
    const token = jwt.sign({ sub: String(user._id), role: "admin" }, jwtSecret(), { algorithm: "HS256", expiresIn: "8h" });
    res.cookie(AUTH_COOKIE, token, cookieOptions);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions, maxAge: undefined });
  res.json({ success: true });
});

authRouter.get("/me", requireAuth, (_req, res) => {
  res.json({ success: true, data: { role: "admin" } });
});
