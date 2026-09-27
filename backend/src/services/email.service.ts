import { env } from "../config/env.js";
import { log } from "../utils/logger.js";
import type { ContactBody } from "../validators/contact.schema.js";

export function isEmailConfigured(): boolean {
  return Boolean(env.EMAILJS_SERVICE_ID && env.EMAILJS_TEMPLATE_ID && env.EMAILJS_PUBLIC_KEY && env.EMAILJS_PRIVATE_KEY);
}

/**
 * Sends the contact message through EmailJS's REST API from the server, using the
 * account's Private Key. This is what moves the previous client-side EmailJS keys
 * (VITE_EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY) out of the browser bundle —
 * they were readable by anyone who opened dev tools, which is the vulnerability
 * this replaces. The visitor-facing behavior is unchanged: same four form states,
 * same EmailJS account and template.
 *
 * Returns false (rather than throwing) when EmailJS isn't configured, so the
 * contact route can decide how to respond without every caller needing a try/catch
 * for "not set up yet" as a special case.
 */
export async function sendContactEmail(
  body: ContactBody
): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  const payload = {
    service_id: env.EMAILJS_SERVICE_ID,
    template_id: env.EMAILJS_TEMPLATE_ID,
    user_id: env.EMAILJS_PUBLIC_KEY,
    accessToken: env.EMAILJS_PRIVATE_KEY,
   template_params: {
  name: body.name,
  email: body.email,
  subject: body.projectType || "Portfolio Contact",
  message: body.message,
  time: new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  }),
},
  };

  const res = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();

    log("error", "emailjs_send_failed", {
      status: res.status,
      response: errorText,
    });

    return false;
  }

  return true;
}