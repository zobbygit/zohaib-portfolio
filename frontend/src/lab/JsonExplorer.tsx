import { useMemo, useState } from "react";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const SAMPLE = `{
  "project": "portfolio",
  "stack": ["React", "Express", "MongoDB"],
  "live": false,
  "version": 3
}`;

function Node({ label, value, depth }: { label?: string; value: Json; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = typeof value === "object" && value !== null;
  const entries: [string, Json][] = isObj ? (Array.isArray(value) ? value.map((v, i) => [String(i), v]) : Object.entries(value)) : [];
  return (
    <div style={{ marginLeft: depth ? 16 : 0 }} className="font-mono text-sm">
      {isObj ? (
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-left hover:text-accent">
          {label !== undefined && <span className="text-violet-300">{label}: </span>}
          <span className="text-white/50">{Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}</span>
        </button>
      ) : (
        <p>
          {label !== undefined && <span className="text-violet-300">{label}: </span>}
          <span className={typeof value === "string" ? "text-emerald-300" : "text-amber-300"}>{JSON.stringify(value)}</span>
        </p>
      )}
      {isObj && open && entries.map(([k, v]) => <Node key={k} label={k} value={v} depth={depth + 1} />)}
    </div>
  );
}

/** Paste JSON and explore it as a collapsible tree. Parses locally; nothing is sent anywhere. */
export default function JsonExplorer() {
  const [text, setText] = useState(SAMPLE);
  const parsed = useMemo<{ ok: true; value: Json } | { ok: false; error: string }>(() => {
    try {
      return { ok: true, value: JSON.parse(text) as Json };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [text]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 font-mono text-xs tracking-widest text-white/60">
        INPUT
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} spellCheck={false} className="rounded-xl border border-white/15 bg-ink p-3 font-mono text-sm text-white outline-none focus:border-accent" />
      </label>
      <div className="grid content-start gap-2">
        <p className="font-mono text-xs tracking-widest text-white/60">TREE</p>
        <div className="min-h-[15rem] rounded-xl border border-white/10 bg-ink p-3" aria-live="polite">
          {parsed.ok ? <Node value={parsed.value} depth={0} /> : <p role="alert" className="text-red-400">{parsed.error}</p>}
        </div>
      </div>
    </div>
  );
}
