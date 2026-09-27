import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface ActivityEvent { type: string; at: string }

const URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000";

/** Real WebSocket connection to the backend: shows visitor presence and content-free activity events. */
export default function LiveActivity() {
  const [online, setOnline] = useState<number | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket: Socket;
    try {
      socket = io(URL, { path: "/socket.io", transports: ["websocket"], timeout: 4000 });
    } catch {
      return;
    }
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("presence", (p: { online: number }) => setOnline(p.online));
    socket.on("activity", (e: ActivityEvent) => setEvents((prev) => [e, ...prev].slice(0, 8)));
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="grid gap-3">
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest">
        <span className={`h-2 w-2 rounded-full ${connected ? "bg-accent" : "bg-white/20"}`} />
        {connected ? `LIVE — ${online ?? 1} VIEWER${online === 1 ? "" : "S"} ONLINE` : "NOT CONNECTED — START THE BACKEND"}
      </p>
      <ul className="min-h-[8rem] rounded-xl border border-white/10 bg-ink p-4 font-mono text-xs text-white/80" aria-live="polite">
        {events.length === 0 ? <li className="text-white/40">No activity yet. Submitting the contact form will show up here.</li> : events.map((e, i) => (
          <li key={i + e.at}>{new Date(e.at).toLocaleTimeString()} — {e.type}</li>
        ))}
      </ul>
    </div>
  );
}
