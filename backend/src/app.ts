import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { contactRouter } from "./routes/contact.js";
import { healthRouter } from "./routes/health.js";
import { projectsRouter } from "./routes/projects.js";
import { blogRouter } from "./routes/blog.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { analyticsRouter } from "./routes/analytics.js";

export function createApp(corsOrigins: string[] = env.CORS_ORIGINS.split(",").map((o) => o.trim())) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow same-origin / server-to-server requests (no Origin header).
        if (!origin || corsOrigins.includes(origin)) cb(null, true);
        else cb(new Error("CORS origin not allowed"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );
  app.use(express.json({ limit: "16kb" }));
  app.use(cookieParser());
  app.use("/api", apiLimiter);
  app.use("/api/health", healthRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
