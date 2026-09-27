import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

/**
 * Creates or updates the single admin account.
 * Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='long passphrase' MONGODB_URI=... npm run create-admin
 */
async function main(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const uri = process.env.MONGODB_URI ?? "";
  if (!email || !uri) throw new Error("ADMIN_EMAIL and MONGODB_URI are required");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { email, passwordHash, role: "admin" }, { upsert: true });
  console.log(`Admin ready: ${email}`);
  await mongoose.disconnect();
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : "create-admin failed");
  process.exit(1);
});
