import Pipeline from "../components/Pipeline";
import SectionHeading from "../components/SectionHeading";
import { engineeringTopics } from "../data/content";




function ArchitectureDiagram() {
  const nodes = [
    { x: 40, label: "REACT + NEXT.JS", sub: "Frontend" },
    { x: 260, label: "EXPRESS API", sub: "Helmet · CORS · Zod" },
    { x: 480, label: "MONGODB", sub: "Mongoose models" },
  ];

  // Changed viewBox width from 560 to 720 to fit the third box
  return (
    <svg viewBox="0 0 720 180" className="w-full" role="img" aria-label="Frontend calls Express API, which stores data in MongoDB">
      {[0, 1].map((i) => (
        <g key={i}>
          {/* Changed x1 from nodes[i].x + 100 to nodes[i].x + 200 to start from the right edge */}
          <line x1={nodes[i].x + 200} y1="90" x2={nodes[i + 1].x} y2="90" stroke="#38e1d0" strokeOpacity="0.6" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1.6s" repeatCount="indefinite" />
          </line>
        </g>
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y="60" width="200" height="60" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" />
          <text x={n.x + 100} y="88" textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="12">{n.label}</text>
          <text x={n.x + 100} y="106" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="10">{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}




export default function EngineeringPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <SectionHeading eyebrow="ENGINEERING" title="Production thinking." />
      <Pipeline />

      <section className="mt-24">
        <SectionHeading eyebrow="SYSTEM DIAGRAM" title="Request path." />
        <ArchitectureDiagram />
      </section>

      <div className="mt-24 divide-y divide-white/10 border-t border-white/10">
        {engineeringTopics.map((t) => (
          <section key={t.title} className="grid gap-6 py-10 md:grid-cols-[12rem_1fr]">
            <h2 className="font-mono text-xs tracking-[0.25em] text-accent">{t.title}</h2>
            <ul className="grid gap-2 text-white/80 md:grid-cols-2">
              {t.items.map((i) => <li key={i} className="flex gap-3"><span className="text-accent">▹</span>{i}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-16 font-mono text-xs tracking-widest text-white/40">NO REAL SECRETS ARE EXPOSED ON THIS PAGE.</p>
    </div>
  );
}
