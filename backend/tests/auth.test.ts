import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp(["http://localhost:5173"]);

describe("admin authentication", () => {
  it("rejects login when no database is connected", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "a@example.com", password: "whatever-123" });
    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("blocks admin routes without a token", async () => {
    const res = await request(app).get("/api/admin/projects");
    expect(res.status).toBe(401);
  });

  it("blocks admin routes with a forged token", async () => {
    const res = await request(app).get("/api/admin/posts").set("Cookie", "token=not-a-real-jwt");
    expect(res.status).toBe(401);
  });

  it("validates login input", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "nope" });
    expect(res.status).toBe(400);
  });
});
