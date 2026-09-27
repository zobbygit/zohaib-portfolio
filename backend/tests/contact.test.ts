import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { contactBodySchema } from "../src/validators/contact.schema.js";

const app = createApp(["http://localhost:5173"]);
const valid = { name: "Ada", email: "ada@example.com", message: "I would like to discuss a project." };

describe("contact validation", () => {
  it("strips HTML from free text", () => {
    const parsed = contactBodySchema.parse({ ...valid, message: "<script>x</script>Hello there friend" });
    expect(parsed.message).toBe("xHello there friend");
  });

  it("rejects a short message", () => {
    expect(contactBodySchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });
});

describe("POST /api/contact", () => {
  it("accepts a valid submission without a database or EmailJS configured, and says so plainly", async () => {
    const res = await request(app).post("/api/contact").send(valid);
    expect(res.status).toBe(202);
    expect(res.body).toMatchObject({ success: true, stored: false, emailSent: false, reason: "not_configured" });
  });

  it("returns 400 with field details for invalid input", async () => {
    const res = await request(app).post("/api/contact").send({ ...valid, email: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.details[0].field).toBe("email");
  });

  it("silently accepts honeypot submissions without storing or emailing", async () => {
    const res = await request(app).post("/api/contact").send({ ...valid, website: "spam" });
    expect(res.status).toBe(202);
    expect(res.body).toMatchObject({ success: true, emailSent: true, stored: false });
  });

  it("returns 400 for malformed JSON without leaking internals", async () => {
    const res = await request(app)
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send("{bad json");
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).not.toMatch(/stack|at /);
  });
});