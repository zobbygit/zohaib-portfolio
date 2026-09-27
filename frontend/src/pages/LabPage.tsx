import { lazy, Suspense, useCallback, useRef, useState, type ReactNode } from "react";
import JsonExplorer from "../lab/JsonExplorer";
import HttpDemo from "../lab/HttpDemo";
import AuthFlow from "../lab/AuthFlow";
import SocketDemo from "../lab/SocketDemo";
import DbRelations from "../lab/DbRelations";
import SvgAnimation from "../lab/SvgAnimation";
import LiveActivity from "../lab/LiveActivity";
import type { LabNode } from "../components/world/LabWorld";
import { hasWebGL, prefersReducedMotion } from "../lib/reducedMotion";

const Scene = lazy(() => import("../components/Scene"));
const LabWorld = lazy(() => import("../components/world/LabWorld"));

const NODES: LabNode[] = [
  { id: "exp-json", label: "JSON explorer" },
  { id: "exp-http", label: "HTTP request / response" },
  { id: "exp-auth", label: "Authentication flow" },
  { id: "exp-stream", label: "Live message stream" },
  { id: "exp-db", label: "Database relationships" },
  { id: "exp-svg", label: "SVG animation" },
  { id: "exp-activity", label: "Live activity" },
  { id: "exp-3d", label: "3D interaction" },
];

function Experiment({ id, no, title, note, children, flash }: { id: string; no: string; title: string; note: string; children: ReactNode; flash: boolean }) {
  return (
    <section id={id} className={`scroll-mt-28 border-t border-white/10 py-12 transition-colors duration-700 first:border-t-0 first:pt-0 ${flash ? "bg-accent/5" : ""}`}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-4xl font-bold text-white/10">{no}</span>
        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-white/50">{note}</p>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function LabPage() {
  const [flashId, setFlashId] = useState<string | null>(null);
  const flashTimer = useRef(0);
  const webglReady = hasWebGL() && !prefersReducedMotion();

  const jumpTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    setFlashId(id);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlashId(null), 1200);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// LAB</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">Experiments.</h1>
      <p className="mt-6 max-w-2xl text-white/70">Small, working frontend interactions, arranged here as a physical set of objects rather than a scrolling list. Each one is labelled by what it actually does.</p>

      {webglReady && (
        <div className="mt-10">
          <Suspense fallback={<div className="h-[46vh]" aria-busy="true" />}>
            <LabWorld nodes={NODES} onSelect={jumpTo} lite={false} />
          </Suspense>
        </div>
      )}

      {/* Keyboard- and touch-accessible equivalent of the 3D nodes above: a floating
          canvas can't be tabbed to or read by a screen reader, so every node also
          exists here as a real, focusable button with the same effect. */}
      <nav aria-label="Jump to an experiment" className="mt-8 flex flex-wrap gap-2">
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => jumpTo(n.id)}
            className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs tracking-widest text-white/60 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {n.label.toUpperCase()}
          </button>
        ))}
      </nav>

      <div className="mt-4">
        <Experiment id="exp-json" no="01" title="JSON explorer" note="Parses whatever you paste and renders it as a tree. Runs locally." flash={flashId === "exp-json"}>
          <JsonExplorer />
        </Experiment>
        <Experiment id="exp-http" no="02" title="HTTP request / response" note="Sends a real GET request to the backend health route." flash={flashId === "exp-http"}>
          <HttpDemo />
        </Experiment>
        <Experiment id="exp-auth" no="03" title="Authentication flow" note="Conceptual token exchange, stepped one message at a time." flash={flashId === "exp-auth"}>
          <AuthFlow />
        </Experiment>
        <Experiment id="exp-stream" no="04" title="Live message stream" note="Simulated events. This is not a WebSocket connection." flash={flashId === "exp-stream"}>
          <SocketDemo />
        </Experiment>
        <Experiment id="exp-db" no="05" title="Database relationships" note="Schema sketch. Hover a table to highlight its links." flash={flashId === "exp-db"}>
          <DbRelations />
        </Experiment>
        <Experiment id="exp-svg" no="06" title="SVG animation" note="Stroke-draw animation, replayable." flash={flashId === "exp-svg"}>
          <SvgAnimation />
        </Experiment>
        <Experiment id="exp-activity" no="07" title="Live activity" note="Real WebSocket connection to the backend. Shows visitor presence and contact events." flash={flashId === "exp-activity"}>
          <LiveActivity />
        </Experiment>
        <Experiment id="exp-3d" no="08" title="3D interaction" note="Scroll or move the pointer to see the scene respond." flash={flashId === "exp-3d"}>
          {webglReady ? (
            <div className="relative h-72 overflow-hidden rounded-xl border border-white/10">
              <Suspense fallback={<p className="p-6 font-mono text-xs text-white/50">LOADING 3D…</p>}><Scene /></Suspense>
            </div>
          ) : (
            <p className="text-white/60">3D is unavailable on this device or with reduced motion enabled.</p>
          )}
        </Experiment>
      </div>
    </div>
  );
}
