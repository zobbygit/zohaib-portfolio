import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Project } from "../models/Project.js";
import { Post } from "../models/Post.js";
import { Message } from "../models/Message.js";
import { PageView } from "../models/PageView.js";
import { HttpError } from "../middleware/errorHandler.js";
import { objectIdSchema, postInputSchema, projectInputSchema } from "../validators/admin.schema.js";

export const adminRouter = Router();
adminRouter.use(requireAuth);

const checkId = (id: string): string => objectIdSchema.parse(id);

// Projects
adminRouter.get("/projects", async (_req, res, next) => {
  try {
    res.json({ success: true, data: await Project.find().sort({ createdAt: -1 }).lean() });
  } catch (err) { next(err); }
});
adminRouter.post("/projects", async (req, res, next) => {
  try {
    const doc = await Project.create(projectInputSchema.parse(req.body));
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
});
adminRouter.put("/projects/:id", async (req, res, next) => {
  try {
    const doc = await Project.findByIdAndUpdate(checkId(req.params.id), projectInputSchema.parse(req.body), { new: true, runValidators: true }).lean();
    if (!doc) throw new HttpError(404, "Project not found");
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
});
adminRouter.delete("/projects/:id", async (req, res, next) => {
  try {
    const doc = await Project.findByIdAndDelete(checkId(req.params.id));
    if (!doc) throw new HttpError(404, "Project not found");
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Blog posts
adminRouter.get("/posts", async (_req, res, next) => {
  try {
    res.json({ success: true, data: await Post.find().sort({ publishedAt: -1 }).lean() });
  } catch (err) { next(err); }
});
adminRouter.post("/posts", async (req, res, next) => {
  try {
    const doc = await Post.create(postInputSchema.parse(req.body));
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
});
adminRouter.put("/posts/:id", async (req, res, next) => {
  try {
    const doc = await Post.findByIdAndUpdate(checkId(req.params.id), postInputSchema.parse(req.body), { new: true, runValidators: true }).lean();
    if (!doc) throw new HttpError(404, "Post not found");
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
});
adminRouter.delete("/posts/:id", async (req, res, next) => {
  try {
    const doc = await Post.findByIdAndDelete(checkId(req.params.id));
    if (!doc) throw new HttpError(404, "Post not found");
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Contact inbox
adminRouter.get("/messages", async (_req, res, next) => {
  try {
    res.json({ success: true, data: await Message.find().sort({ createdAt: -1 }).limit(200).lean() });
  } catch (err) { next(err); }
});
adminRouter.patch("/messages/:id", async (req, res, next) => {
  try {
    const { read } = z.object({ read: z.boolean() }).parse(req.body);
    const doc = await Message.findByIdAndUpdate(checkId(req.params.id), { read }, { new: true }).lean();
    if (!doc) throw new HttpError(404, "Message not found");
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
});
adminRouter.delete("/messages/:id", async (req, res, next) => {
  try {
    const doc = await Message.findByIdAndDelete(checkId(req.params.id));
    if (!doc) throw new HttpError(404, "Message not found");
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Analytics summary (last N days)
adminRouter.get("/analytics", async (req, res, next) => {
  try {
    const days = z.coerce.number().int().min(1).max(365).default(30).parse(req.query.days ?? 30);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const rows = await PageView.find({ day: { $gte: since } }).lean();
    const totals = new Map<string, number>();
    for (const r of rows) totals.set(r.path, (totals.get(r.path) ?? 0) + r.count);
    const data = [...totals.entries()].map(([path, views]) => ({ path, views })).sort((a, b) => b.views - a.views);
    res.json({ success: true, data: { days, totalViews: data.reduce((s, r) => s + r.views, 0), paths: data } });
  } catch (err) { next(err); }
});
