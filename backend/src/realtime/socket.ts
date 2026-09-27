import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server | null = null;

/** Attaches Socket.IO to the HTTP server. Presence counts open connections, not identities. */
export function attachRealtime(http: HttpServer, origins: string[]): Server {
  io = new Server(http, { cors: { origin: origins, methods: ["GET", "POST"] }, path: "/socket.io" });
  let online = 0;
  io.on("connection", (socket) => {
    online += 1;
    io?.emit("presence", { online });
    socket.on("disconnect", () => {
      online = Math.max(0, online - 1);
      io?.emit("presence", { online });
    });
  });
  const heartbeat = setInterval(() => io?.emit("heartbeat", { at: new Date().toISOString() }), 15_000);
  heartbeat.unref();
  return io;
}

/** Broadcasts a content-free activity event, e.g. { type: "contact.received" }. */
export function emitActivity(type: string): void {
  io?.emit("activity", { type, at: new Date().toISOString() });
}
