import { useEffect, useState } from "react";

const MESSAGES = ["user.joined", "project.updated", "message.created", "user.typing", "message.created"];

/** Simulated message stream to show live-update visualisation. Not a real WebSocket connection. */
export default function SocketDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const id = window.setInterval(() => {
      const event = MESSAGES[i % MESSAGES.length];
      i += 1;
      setLog((prev) => [`${new Date().toLocaleTimeString()}  ${event}`, ...prev].slice(0, 8));
    }, 900);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div className="grid gap-3">
      <button type="button" onClick={() => setRunning((r) => !r)} className="justify-self-start rounded-full border border-white/25 px-4 py-2 font-mono text-xs tracking-widest hover:border-accent">
        {running ? "STOP STREAM" : "START SIMULATED STREAM"}
      </button>
      <p className="font-mono text-[11px] tracking-widest text-amber-300">DEMONSTRATION: EVENTS ARE GENERATED IN THE BROWSER.</p>
      <ul className="min-h-[10rem] rounded-xl border border-white/10 bg-ink p-4 font-mono text-xs text-white/80" aria-live="polite">
        {log.length === 0 ? <li className="text-white/40">No events yet.</li> : log.map((l, i) => <li key={i + l}>{l}</li>)}
      </ul>
    </div>
  );
}
