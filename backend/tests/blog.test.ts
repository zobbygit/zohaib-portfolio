import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp(["http://localhost:5173"]);

describe("GET /api/blog", () => {
  it("returns an empty list without a database", async () => {
    const res = await request(app).get("/api/blog");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [] });
  });
});

describe("GET /api/blog/:slug", () => {
  it("returns 404 without a database", async () => {
    const res = await request(app).get("/api/blog/some-post");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns 404 for a malformed slug", async () => {
    const res = await request(app).get("/api/blog/..%2Fsecret");
    expect(res.status).toBe(404);
  });
});
