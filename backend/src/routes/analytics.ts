import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { PageView } from "../models/PageView.js";

export const analyticsRouter = Router();

const pathSchema = z.object({
  path: z.string().max(200).regex(/^\/[a-z0-9/_-]*$/i, "invalid path"),
});

/** Counts a page view for a route path. Stores no IP address, cookie, or user agent. */
analyticsRouter.post("/pageview", async (req, res, next) => {
  try {
    const { path } = pathSchema.parse(req.body);
    if (mongoose.connection.readyState !== 1) {
      res.status(202).json({ success: true, counted: false });
      return;
    }
    const day = new Date().toISOString().slice(0, 10);
    await PageView.updateOne({ day, path }, { $inc: { count: 1 } }, { upsert: true });
    res.status(202).json({ success: true, counted: true });
  } catch (err) {
    next(err);
  }
});
