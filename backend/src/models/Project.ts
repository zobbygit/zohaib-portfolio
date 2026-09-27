import { Schema, model } from "mongoose";

/** Project case study. Kept flexible so real content can be added later without code changes. */
const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    category: { type: String, default: "TBD" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    features: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    solutions: { type: [String], default: [] },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Project = model("Project", projectSchema);
