import { useState } from "react";

const STEPS = [
  { from: "Client", to: "API", label: "POST /login (credentials)" },
  { from: "API", to: "DB", label: "Look up user, verify hash" },
  { from: "API", to: "Client", label: "Issue signed token" },
  { from: "Client", to: "API", label: "GET /resource (Bearer token)" },
  { from: "API", to: "Client", label: "Verify token, respond" },
];
const LANES = ["Client", "API", "DB"];

/** Step through a token-based auth exchange. Conceptual demonstration, not a live login. */
export default function AuthFlow() {
  const [step, setStep] = useState(-1);
  const current = step >= 0 ? STEPS[step] : null;
  const laneX = (name: string) => 60 + LANES.indexOf(name) * 200;

  return (
    <div className="grid gap-4">
      <svg viewBox="0 0 640 220" className="w-full" role="img" aria-label="Token authentication sequence">
        {LANES.map((l) => (
          <g key={l}>
            <line x1={laneX(l)} y1="20" x2={laneX(l)} y2="200" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
            <text x={laneX(l)} y="14" textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono, monospace" fontSize="12">{l.toUpperCase()}</text>
          </g>
        ))}
        {current && (
          <g>
            <line x1={laneX(current.from)} y1={40 + step * 30} x2={laneX(current.to)} y2={40 + step * 30} stroke="#38e1d0" strokeWidth="2" />
            <text x={(laneX(current.from) + laneX(current.to)) / 2} y={34 + step * 30} textAnchor="middle" fill="#38e1d0" fontSize="10" fontFamily="JetBrains Mono, monospace">{current.label}</text>
          </g>
        )}
      </svg>
      <div className="flex flex-wrap gap-2 font-mono text-xs tracking-widest">
        <button type="button" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="rounded-full bg-white px-4 py-2 text-ink hover:bg-accent">NEXT STEP</button>
        <button type="button" onClick={() => setStep(-1)} className="rounded-full border border-white/25 px-4 py-2">RESET</button>
        <span className="self-center text-white/50">{step + 1}/{STEPS.length}</span>
      </div>
    </div>
  );
}
