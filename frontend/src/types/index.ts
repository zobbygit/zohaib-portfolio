export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  image: string;
  gallery: string[];
  githubUrl: string;
  liveUrl: string;
  features: string[];
  challenges: string[];
  solutions: string[];
  problem?: string;
  solution?: string;
  architecture?: string[];
  results?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  publishedAt: string;
}

export type TechCategory = "Frontend" | "Backend" | "Databases" | "DevOps" | "Testing" | "Tools" | "Design";

export interface TechNode {
  name: string;
  category: TechCategory;
}

export type ContactStatus = "idle" | "sending" | "success" | "error";
