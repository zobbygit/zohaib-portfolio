import { Router } from "express";
import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { HttpError } from "../middleware/errorHandler.js";

export const blogRouter = Router();

const PUBLIC_FIELDS = { _id: 0, __v: 0, published: 0, createdAt: 0, updatedAt: 0 };
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Published posts, newest first. Empty list when no database is connected. */
blogRouter.get("/", async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.json({ success: true, data: [] });
      return;
    }
    const data = await Post.find({ published: true }, PUBLIC_FIELDS).sort({ publishedAt: -1 }).limit(100).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug;
    if (!SLUG_PATTERN.test(slug)) throw new HttpError(404, "Post not found");
    if (mongoose.connection.readyState !== 1) throw new HttpError(404, "Post not found");
    const post = await Post.findOne({ slug, published: true }, PUBLIC_FIELDS).lean();
    if (!post) throw new HttpError(404, "Post not found");
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});
