import mongoose from "mongoose";
import { Message } from "../models/Message.js";
import type { ContactBody } from "../validators/contact.schema.js";

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/** Stores a validated contact submission. Returns false when no database is connected. */
export async function storeContact(body: ContactBody): Promise<boolean> {
  if (!isDatabaseConnected()) return false;
  await Message.create({
    name: body.name,
    email: body.email,
    projectType: body.projectType,
    message: body.message,
  });
  return true;
}
