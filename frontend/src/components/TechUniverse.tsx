import { useMemo, useState } from "react";
import { techNodes } from "../data/profile";
import type { TechCategory } from "../types";

const CATEGORIES: TechCategory[] = ["Frontend", "Backend", "Databases", "DevOps", "Testing", "Tools", "Design"];

/**
 * Technology constellation. Nodes sit on a ring per category; hovering a node
 * highlights every node in the same category and draws connecting lines.
 */
export default function TechUniverse() {
  const [hover, setHover] = useState<string | null>(null);
  const nodes = useMemo(() => {
    return techNodes.map((n) => {
      const catIndex = CATEGORIES.indexOf(n.category);
      const angle = (catIndex / CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 34 + (techNodes.filter((m) => m.category === n.category).indexOf(n) % 2) * 10;
      return { ...n, x: 50 + Math.cos(angle) * radius * 1.4, y: 50 + Math.sin(angle) * radius };
    });
  }, []);
  const hoveredCategory = nodes.find((n) => n.name === hover)?.category;

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="mx-auto aspect-square w-full max-w-[560px]" role="img" aria-label="Technology constellation grouped by category">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
        {nodes.filter((n) => n.category === hoveredCategory).map((n, i, arr) =>
          arr.slice(i + 1).map((m) => (
            <line key={`${n.name}-${m.name}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="#38e1d0" strokeOpacity="0.5" strokeWidth="0.25" />
          )),
        )}
        {nodes.map((n) => {
          const lit = hoveredCategory === undefined || n.category === hoveredCategory;
          return (
            <g key={n.name} onPointerEnter={() => setHover(n.name)} onPointerLeave={() => setHover(null)} className="cursor-pointer">
              <circle cx={n.x} cy={n.y} r={lit ? 1.6 : 1.1} fill={lit ? "#38e1d0" : "#334"} />
              <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="2.4" fill={lit ? "#fff" : "rgba(255,255,255,0.3)"} fontFamily="JetBrains Mono, monospace">{n.name}</text>
            </g>
          );
        })}
      </svg>
      <ul className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[11px] tracking-widest text-white/60">
        {CATEGORIES.map((c) => <li key={c} className={c === hoveredCategory ? "text-accent" : ""}>{c.toUpperCase()}</li>)}
      </ul>
    </div>
  );
}
