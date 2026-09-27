import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("CORS", () => {
  it("does not grant an origin that is not on the allow-list", async () => {
    const res = await request(createApp(["http://localhost:5173"]))
      .get("/api/health")
      .set("Origin", "https://evil.example");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("grants an allow-listed origin", async () => {
    const res = await request(createApp(["http://localhost:5173"]))
      .get("/api/health")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});
