import { createServer } from "node:http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { attachRealtime } from "./realtime/socket.js";
import { log } from "./utils/logger.js";

async function start(): Promise<void> {
  if (env.MONGODB_URI) {
    await mongoose.connect(env.MONGODB_URI);
    log("info", "database_connected");
  } else {
    log("warn", "database_not_configured");
  }
  const origins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
  const http = createServer(createApp(origins));
  attachRealtime(http, origins);
  http.listen(env.PORT, () => log("info", "server_started", { port: env.PORT }));
}

start().catch((err: unknown) => {
  log("error", "startup_failed", { name: err instanceof Error ? err.name : "unknown" });
  process.exit(1);
});
