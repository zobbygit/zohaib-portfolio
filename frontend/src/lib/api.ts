import axios from "axios";
import type { BlogPost, Project } from "../types";
import type { ContactInput } from "./schemas";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export interface ContactResult {
  emailSent: boolean;
  stored: boolean;
  reason?: string;
}

/**
 * Sends the contact form to the backend, which validates it and sends the actual
 * email through EmailJS server-side (see backend/src/services/email.service.ts).
 * The EmailJS keys are no longer present anywhere in this frontend bundle.
 */
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const res = await api.post<ContactResult & { success: boolean }>("/contact", input);
  return res.data;
}

export async function fetchProjects(): Promise<Project[]> {
  return (await api.get<{ data: Project[] }>("/projects")).data.data;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return (await api.get<{ data: BlogPost[] }>("/blog")).data.data;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  return (await api.get<{ data: BlogPost }>(`/blog/${encodeURIComponent(slug)}`)).data.data;
}

// ---- Admin ----

export interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminProjectInput {
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
  problem: string;
  solution: string;
  architecture: string[];
  results: string[];
}

export interface AdminPostInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  published: boolean;
}

export type Stored<T> = T & { _id: string };

export const auth = {
  async login(email: string, password: string): Promise<void> {
    await api.post("/auth/login", { email, password });
  },
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
  async isAdmin(): Promise<boolean> {
    try {
      await api.get("/auth/me");
      return true;
    } catch {
      return false;
    }
  },
};

export const admin = {
  projects: () => api.get<{ data: Stored<AdminProjectInput>[] }>("/admin/projects").then((r) => r.data.data),
  saveProject: (id: string | null, body: AdminProjectInput) =>
    id ? api.put(`/admin/projects/${id}`, body) : api.post("/admin/projects", body),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
  posts: () => api.get<{ data: Stored<AdminPostInput>[] }>("/admin/posts").then((r) => r.data.data),
  savePost: (id: string | null, body: AdminPostInput) =>
    id ? api.put(`/admin/posts/${id}`, body) : api.post("/admin/posts", body),
  deletePost: (id: string) => api.delete(`/admin/posts/${id}`),
  messages: () => api.get<{ data: AdminMessage[] }>("/admin/messages").then((r) => r.data.data),
  setMessageRead: (id: string, read: boolean) => api.patch(`/admin/messages/${id}`, { read }),
  deleteMessage: (id: string) => api.delete(`/admin/messages/${id}`),
  analytics: (days = 30) =>
    api.get<{ data: { days: number; totalViews: number; paths: { path: string; views: number }[] } }>(`/admin/analytics?days=${days}`).then((r) => r.data.data),
};