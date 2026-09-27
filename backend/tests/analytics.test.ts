import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const app = createApp(["http://localhost:5173"]);

describe("POST /api/analytics/pageview", () => {
  it("accepts a valid path", async () => {
    const res = await request(app).post("/api/analytics/pageview").send({ path: "/work/agentforge" });
    expect(res.status).toBe(202);
  });

  it("rejects a path that is not a simple route", async () => {
    const res = await request(app).post("/api/analytics/pageview").send({ path: "https://evil.example/x" });
    expect(res.status).toBe(400);
  });
});
