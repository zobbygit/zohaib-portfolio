import { z } from "zod";
import { sanitizeText } from "../utils/sanitize.js";

const text = (max: number) => z.string().max(max).transform(sanitizeText);
const list = (max: number) => z.array(text(max)).max(30).default([]);

export const projectInputSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase words separated by hyphens"),
  title: text(120).pipe(z.string().min(1)),
  description: text(300).default(""),
  longDescription: text(4000).default(""),
  technologies: list(40),
  category: text(60).default("TBD"),
  image: text(300).default(""),
  gallery: list(300),
  githubUrl: z.string().url().max(300).or(z.literal("")).default(""),
  liveUrl: z.string().url().max(300).or(z.literal("")).default(""),
  features: list(200),
  challenges: list(400),
  solutions: list(400),
  problem: text(2000).default(""),
  solution: text(2000).default(""),
  architecture: list(300),
  results: list(300),
});

export const postInputSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase words separated by hyphens"),
  title: text(200).pipe(z.string().min(1)),
  excerpt: text(500).default(""),
  body: text(50_000).pipe(z.string().min(1)),
  tags: list(30),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
});

export const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "invalid id");
