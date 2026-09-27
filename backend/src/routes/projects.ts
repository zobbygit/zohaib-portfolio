import { Router } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";

export const projectsRouter = Router();

/** Read-only. Returns an empty list when no database is connected, so the frontend falls back. */
projectsRouter.get("/", async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.json({ success: true, data: [] });
      return;
    }
    const data = await Project.find({}, { _id: 0, __v: 0 }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});
