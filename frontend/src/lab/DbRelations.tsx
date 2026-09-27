import { useState } from "react";

const TABLES = [
  { id: "user", x: 40, y: 40, fields: ["_id", "name", "email"] },
  { id: "project", x: 260, y: 40, fields: ["_id", "title", "ownerId"] },
  { id: "message", x: 480, y: 40, fields: ["_id", "email", "message"] },
];
const RELATIONS = [
  { from: "user", to: "project", label: "1 → many" },
  { from: "project", to: "message", label: "1 → many" },
];

/** Schema sketch of relationships. Hover a table to highlight its links. */
export default function DbRelations() {
  const [hover, setHover] = useState<string | null>(null);
  const pos = (id: string) => TABLES.find((t) => t.id === id)!;
  return (
    <svg viewBox="0 0 660 200" className="w-full" role="img" aria-label="Database relationship sketch">
      {RELATIONS.map((r) => {
        const a = pos(r.from), b = pos(r.to);
        const lit = hover === r.from || hover === r.to;
        return (
          <g key={`${r.from}-${r.to}`}>
            <line x1={a.x + 180} y1={a.y + 50} x2={b.x} y2={b.y + 50} stroke={lit ? "#38e1d0" : "rgba(255,255,255,0.25)"} strokeWidth="2" />
            <text x={(a.x + b.x + 180) / 2} y={a.y + 40} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="JetBrains Mono, monospace">{r.label}</text>
          </g>
        );
      })}
      {TABLES.map((t) => (
        <g key={t.id} onPointerEnter={() => setHover(t.id)} onPointerLeave={() => setHover(null)}>
          <rect x={t.x} y={t.y} width="180" height={30 + t.fields.length * 18} rx="8" fill="#0a1020" stroke={hover === t.id ? "#38e1d0" : "rgba(255,255,255,0.2)"} />
          <text x={t.x + 12} y={t.y + 20} fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="12">{t.id.toUpperCase()}</text>
          {t.fields.map((f, i) => <text key={f} x={t.x + 12} y={t.y + 40 + i * 18} fill="rgba(255,255,255,0.6)" fontFamily="JetBrains Mono, monospace" fontSize="11">{f}</text>)}
        </g>
      ))}
    </svg>
  );
}
