import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/** Sends a real GET request to the backend health route and shows the raw exchange. */
export default function HttpDemo() {
  const [state, setState] = useState<{ status: string; ms: number; body: string; headers: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    const started = performance.now();
    try {
      const res = await fetch(`${API}/health`);
      const body = await res.text();
      const headers = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
      setState({ status: `${res.status} ${res.statusText}`, ms: Math.round(performance.now() - started), body, headers });
    } catch {
      setError("The API is unreachable. Start the backend, then try again.");
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
        <span className="rounded bg-white/10 px-2 py-1">GET</span>
        <span className="text-white/70">{API}/health</span>
        <button type="button" onClick={run} className="rounded-full bg-white px-4 py-2 text-xs tracking-widest text-ink hover:bg-accent">SEND REQUEST</button>
      </div>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {state && (
        <div className="grid gap-3 md:grid-cols-2">
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-ink p-4 text-xs text-white/80">{`HTTP ${state.status}\ntime: ${state.ms} ms\n\n${state.headers}`}</pre>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-ink p-4 text-xs text-emerald-300">{state.body}</pre>
        </div>
      )}
    </div>
  );
}
