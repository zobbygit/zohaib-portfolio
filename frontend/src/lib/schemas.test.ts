import { describe, expect, it } from "vitest";
import { contactSchema } from "./schemas";

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    const result = contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "Hello, I would like to build something." });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email and a short message", () => {
    const result = contactSchema.safeParse({ name: "Ada", email: "not-an-email", message: "hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toEqual(expect.arrayContaining(["email", "message"]));
    }
  });
});
