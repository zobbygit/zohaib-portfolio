import { Router } from "express";
import { contactBodySchema } from "../validators/contact.schema.js";
import { storeContact } from "../services/contact.service.js";
import { isEmailConfigured, sendContactEmail } from "../services/email.service.js";
import { contactLimiter } from "../middleware/rateLimit.js";
import { log } from "../utils/logger.js";
import { emitActivity } from "../realtime/socket.js";

export const contactRouter = Router();

contactRouter.post("/", contactLimiter, async (req, res, next) => {
  try {
    const body = contactBodySchema.parse(req.body);
    if (body.website) {
      // Honeypot tripped: pretend success without doing anything.
      res.status(202).json({ success: true, emailSent: true, stored: false });
      return;
    }

    const stored = await storeContact(body);

    // The actual EmailJS send now happens here, server-side, using the account's
    // private key — never in the browser. If EmailJS isn't configured, the message
    // is still stored (when a database is connected) and the visitor is told plainly
    // that sending isn't set up yet, rather than a fake success.
    if (!isEmailConfigured()) {
      log("info", "contact_received", { stored: stored ? 1 : 0, emailSent: 0 });
      res.status(202).json({ success: true, emailSent: false, stored, reason: "not_configured" });
      return;
    }

    const emailSent = await sendContactEmail(body);
    log("info", "contact_received", { stored: stored ? 1 : 0, emailSent: emailSent ? 1 : 0 });
    if (emailSent) emitActivity("contact.received");

    res.status(emailSent ? 202 : 502).json({ success: emailSent, emailSent, stored });
  } catch (err) {
    next(err);
  }
});