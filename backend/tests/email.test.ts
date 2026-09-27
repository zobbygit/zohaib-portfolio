import { describe, expect, it } from "vitest";
import { isEmailConfigured, sendContactEmail } from "../src/services/email.service.js";

describe("email service", () => {
  it("reports not configured when no EmailJS env vars are set (as in this test run)", () => {
    expect(isEmailConfigured()).toBe(false);
  });

  it("returns false rather than throwing when not configured", async () => {
    const sent = await sendContactEmail({ name: "Ada", email: "ada@example.com", projectType: "", message: "Hello there friend", website: "" });
    expect(sent).toBe(false);
  });
});