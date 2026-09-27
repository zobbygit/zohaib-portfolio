import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("GET /api/projects", () => {
  it("returns an empty list when no database is connected", async () => {
    const res = await request(createApp(["http://localhost:5173"])).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [] });
  });
});
