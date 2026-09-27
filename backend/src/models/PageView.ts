import { Schema, model } from "mongoose";

/** Privacy-friendly counter: one document per (day, path). No IPs, cookies, or user agents are stored. */
const pageViewSchema = new Schema({
  day: { type: String, required: true },
  path: { type: String, required: true, maxlength: 200 },
  count: { type: Number, default: 0 },
});
pageViewSchema.index({ day: 1, path: 1 }, { unique: true });

export const PageView = model("PageView", pageViewSchema);
