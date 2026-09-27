import { useState } from "react";

/** SVG stroke-draw and morph experiment. Toggle to replay the animation. */
export default function SvgAnimation() {
  const [key, setKey] = useState(0);
  return (
    <div className="grid gap-4">
      <svg key={key} viewBox="0 0 300 300" className="mx-auto w-full max-w-[300px]" role="img" aria-label="Animated geometric mark">
        <path d="M150 20 L280 150 L150 280 L20 150 Z" fill="none" stroke="#38e1d0" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset="1">
          <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.8s" fill="freeze" />
        </path>
        <circle cx="150" cy="150" r="50" fill="none" stroke="#7c6cff" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset="1">
          <animate attributeName="stroke-dashoffset" from="1" to="0" begin="1.8s" dur="1.2s" fill="freeze" />
        </circle>
      </svg>
      <button type="button" onClick={() => setKey((k) => k + 1)} className="justify-self-center rounded-full border border-white/25 px-4 py-2 font-mono text-xs tracking-widest hover:border-accent">REPLAY</button>
    </div>
  );
}
