import { Schema, model } from "mongoose";

/** Blog post. Only posts with published=true are ever returned by the public API. */
const postSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, maxlength: 120 },
    title: { type: String, required: true, maxlength: 200 },
    excerpt: { type: String, default: "", maxlength: 500 },
    body: { type: String, required: true, maxlength: 50_000 },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Post = model("Post", postSchema);
