// import { useCallback, useEffect, useState } from "react";
// import { prefersReducedMotion } from "../lib/reducedMotion";
// import { hasSeenIntro, markIntroSeen } from "../lib/sessionFlags";

// const STEPS = ["INITIALIZING", "LOADING SYSTEM", "ENTERING PORTFOLIO"];

// /** Fast cinematic intro. Skippable, once per session, and skipped for reduced motion. */
// export default function Intro({ onDone }: { onDone: () => void }) {
//   const [progress, setProgress] = useState(0);
//   const [closing, setClosing] = useState(false);

//   const finish = useCallback(() => {
//     markIntroSeen();
//     setClosing(true);
//     window.setTimeout(onDone, 600);
//   }, [onDone]);

//   useEffect(() => {
//     if (prefersReducedMotion()) {
//       markIntroSeen();
//       onDone();
//       return;
//     }
//     const start = performance.now();
//     let raf = 0;
//     const tick = (now: number) => {
//       const p = Math.min(1, (now - start) / 1300);
//       setProgress(p);
//       if (p < 1) raf = requestAnimationFrame(tick);
//       else finish();
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [finish, onDone]);

//   const step = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
//   return (
//     <div className="fixed inset-0 z-[200] pointer-events-auto" role="dialog" aria-label="Intro">
//       <div className={`absolute inset-x-0 top-0 h-1/2 bg-ink transition-transform duration-700 ease-in-out ${closing ? "-translate-y-full" : ""}`} />
//       <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-ink transition-transform duration-700 ease-in-out ${closing ? "translate-y-full" : ""}`} />
//       <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-white transition-opacity duration-300 ${closing ? "opacity-0" : ""}`}>
//         <p className="font-mono text-xs tracking-[0.3em] text-accent">// {STEPS[step]}</p>
//         <p className="font-display text-5xl font-bold sm:text-7xl">ZOHAIB</p>
//         <p className="font-mono text-xs tracking-[0.25em] text-white/50">SYSTEM / PORTFOLIO</p>
//         <div className="mt-4 h-px w-56 bg-white/10">
//           <div className="h-px bg-accent" style={{ width: `${progress * 100}%` }} />
//         </div>
//       </div>
//       <button
//         type="button"
//         onClick={finish}
//         className="absolute bottom-6 right-6 font-mono text-xs tracking-widest text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
//       >
//         SKIP INTRO
//       </button>
//     </div>
//   );
// }



import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "../lib/reducedMotion";
import { markIntroSeen } from "../lib/sessionFlags";

const TOTAL_MS = 3200;
const EXIT_MS = 1600;
const OBJECT_EXIT_MS = 900;

/* ────────────────────────────────────────────────
   CSS
   Stack (bottom → top):
     1  base dark fade     (reveals homepage when faded)
     5  curtain panels
     6  valance
     8  vignette
    10  big counter
    15  3D scene
    20  loading strip
    40  grain
    45  skip
   ──────────────────────────────────────────────── */
const CSS = `
.curtain-wrap {
  position: absolute; inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
}

.curtain-panel {
  position: absolute;
  top: 0; bottom: 0;
  width: 50.5%;
  background:
    repeating-linear-gradient(
      90deg,
      #070b14 0px, #0b1220 8px, #101a30 22px,
      #0b1220 36px, #070b14 50px, #0d1526 64px, #0b1220 78px
    );
  box-shadow: inset 0 0 120px rgba(0,0,0,0.9);
  transition: transform 1400ms cubic-bezier(0.83, 0, 0.17, 1);
  will-change: transform;
}
.curtain-panel::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.03) 0%,
    transparent 20%, transparent 80%,
    rgba(0,0,0,0.6) 100%
  );
  pointer-events: none;
}
.curtain-panel--left  { left: 0; }
.curtain-panel--right { right: 0; }
.curtain-panel.is-out { transform: translateY(-105%); }
.curtain-panel--right.is-out { transition-delay: 90ms; }

.curtain-valance {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 14vh;
  background:
    repeating-linear-gradient(
      90deg,
      #060a12 0px, #0a101e 10px, #0f1830 26px,
      #0a101e 42px, #060a12 58px
    );
  box-shadow: 0 20px 60px rgba(0,0,0,0.9);
  transition: transform 1200ms cubic-bezier(0.83, 0, 0.17, 1);
  z-index: 6;
  pointer-events: none;
}
.curtain-valance.is-out { transform: translateY(-110%); }

/* Base dark layer — fades out on closing so the homepage shows through
   once the curtains begin to lift. */
.base-dark {
  position: absolute; inset: 0;
  background: #05070d;
  z-index: 1;
  transition: opacity 600ms ease;
  pointer-events: none;
}

.vignette {
  position: absolute; inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 30%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.9) 100%
  );
  pointer-events: none;
  z-index: 8;
}

/* Big centered outlined counter (behind the 3D object) */
.big-counter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
  transition: opacity 500ms ease;
}
.big-counter__num {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(7rem, 22vw, 22rem);
  line-height: 0.85;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(201,168,76,0.35);
  font-variant-numeric: tabular-nums;
  user-select: none;
}
.big-counter__pct {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(1.5rem, 4vw, 3.5rem);
  color: rgba(201,168,76,0.45);
  margin-left: 0.3em;
  user-select: none;
}

/* Loading bar */
.bar-track {
  position: relative; height: 1px; width: 100%;
  background: rgba(255,255,255,0.09);
}
.bar-fill {
  position: absolute; top: 0; left: 0; height: 1px;
  background: linear-gradient(
    90deg,
    rgba(201,168,76,0.0) 0%,
    rgba(201,168,76,0.4) 20%,
    #c9a84c 60%,
    #f0d99a 100%
  );
  transition: width 120ms linear;
}
.bar-head {
  position: absolute; top: 50%;
  width: 6px; height: 6px; border-radius: 50%;
  background: #f0d99a;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 10px 2px rgba(201,168,76,0.6),
    0 0 30px 6px rgba(201,168,76,0.25);
  transition: left 120ms linear;
}

.grain {
  position: absolute; inset: -50%;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='1'/></svg>");
  background-size: 260px 260px;
  opacity: 0.07; mix-blend-mode: overlay;
  pointer-events: none; z-index: 40;
  animation: grain-shift 0.5s steps(4) infinite;
}
@keyframes grain-shift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-3%, 2%); }
  50%  { transform: translate(2%, -2%); }
  75%  { transform: translate(-1%, 3%); }
  100% { transform: translate(0, 0); }
}

.fade-in { animation: fade-in-kf 800ms ease both; }
@keyframes fade-in-kf {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .grain { animation: none !important; }
}
`;

/* ────────────────────────────────────────────────
   3D — gold gyroscope
   ──────────────────────────────────────────────── */

function Gyroscope({ closing }: { closing: boolean }) {
  const rootRef = useRef<THREE.Group>(null);
  const spin1 = useRef<THREE.Group>(null);
  const spin2 = useRef<THREE.Group>(null);
  const spin3 = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const closeStart = useRef<number | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (spin1.current) spin1.current.rotation.y = t * 0.55;
    if (spin2.current) spin2.current.rotation.y = -t * 0.42;
    if (spin3.current) spin3.current.rotation.y = t * 0.68;

    const pulse = 1 + Math.sin(t * 2.4) * 0.08;
    if (coreRef.current) coreRef.current.scale.setScalar(pulse);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.6 + Math.sin(t * 2.4) * 0.15);
    }

    if (!rootRef.current) return;

    if (closing) {
      if (closeStart.current === null) closeStart.current = t;
      const elapsed = (t - closeStart.current) * 1000;
      const p = Math.min(1, elapsed / OBJECT_EXIT_MS);
      const eased = 1 - Math.pow(1 - p, 3);

      rootRef.current.scale.setScalar(Math.max(0.001, 1 - eased));
      rootRef.current.position.y = eased * 2.2;
      rootRef.current.rotation.y += 0.05;
    } else {
      closeStart.current = null;
      rootRef.current.scale.setScalar(1);
      rootRef.current.position.y = 0;
      rootRef.current.rotation.y = t * 0.12;
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={spin1}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.018, 16, 160]} />
          <meshStandardMaterial
            color="#c9a84c" metalness={1} roughness={0.18}
            emissive="#c9a84c" emissiveIntensity={0.15}
          />
        </mesh>
      </group>
      <group ref={spin2}>
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
          <torusGeometry args={[1.1, 0.016, 16, 160]} />
          <meshStandardMaterial
            color="#e8d9a0" metalness={1} roughness={0.22}
            emissive="#e8d9a0" emissiveIntensity={0.12}
          />
        </mesh>
      </group>
      <group ref={spin3}>
        <mesh rotation={[0, Math.PI / 3, Math.PI / 5]}>
          <torusGeometry args={[0.78, 0.014, 16, 160]} />
          <meshStandardMaterial
            color="#c9a84c" metalness={1} roughness={0.25}
            emissive="#c9a84c" emissiveIntensity={0.18}
          />
        </mesh>
      </group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshBasicMaterial color="#f5e6b8" />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Particles({ count = 180 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02} color="#e8d9a0" transparent opacity={0.45}
        sizeAttenuation depthWrite={false}
      />
    </points>
  );
}

function Scene({ closing }: { closing: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} color="#fff6e0" />
      <pointLight position={[-5, -3, 4]} intensity={0.5} color="#c9a84c" />
      <pointLight position={[5, -4, -4]} intensity={0.35} color="#6aa0ff" />
      <Gyroscope closing={closing} />
      <Particles />
    </Canvas>
  );
}

/* ────────────────────────────────────────────────
   Intro
   ──────────────────────────────────────────────── */

export default function Intro({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markIntroSeen();
    setClosing(true);
    window.setTimeout(onDone, EXIT_MS);
  }, [onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      markIntroSeen();
      onDone();
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / TOTAL_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish, onDone]);

  const pct = Math.round(progress * 100);

  return (
    <div
      role="dialog"
      aria-label="Intro"
      className="fixed inset-0 z-[200] overflow-hidden"
      /* No background — let the curtains and base layer handle it */
    >
      <style>{CSS}</style>

      {/* ── 1. Base dark layer (fades on exit to reveal homepage) ── */}
      <div
        className="base-dark"
        style={{ opacity: closing ? 0 : 1 }}
        aria-hidden
      />

      {/* ── 2. Curtain panels (z-5, BEHIND content) ── */}
      <div className="curtain-wrap">
        <div className={`curtain-panel curtain-panel--left ${closing ? "is-out" : ""}`} />
        <div className={`curtain-panel curtain-panel--right ${closing ? "is-out" : ""}`} />
      </div>

      {/* ── 3. Valance (z-6) ── */}
      <div className={`curtain-valance ${closing ? "is-out" : ""}`} />

      {/* ── 4. Vignette (z-8) ── */}
      <div className="vignette" />

      {/* ── 5. Big centered counter (z-10) ── */}
      <div className="big-counter" style={{ opacity: closing ? 0 : 1 }} aria-hidden>
        <span className="big-counter__num">{String(pct).padStart(2, "0")}</span>
        <span className="big-counter__pct">%</span>
      </div>

      {/* ── 6. 3D scene (z-15, ON TOP of curtains) ── */}
      <div className="absolute inset-0 z-[15]">
        <Scene closing={closing} />
      </div>

      {/* ── 7. Loading strip (z-20, ON TOP of curtains) ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-8 pb-10 transition-opacity duration-500 sm:px-14 sm:pb-14 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.35em] text-white/45">
            <span className="fade-in">LOADING EXPERIENCE</span>
            <span
              className="fade-in tabular-nums text-[#c9a84c]"
              style={{ animationDelay: "120ms" }}
            >
              {String(pct).padStart(3, "0")}%
            </span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${progress * 100}%` }} />
            <div className="bar-head" style={{ left: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ── 8. Skip (z-45) ── */}
      <button
        type="button"
        onClick={finish}
        className={`absolute bottom-4 right-6 z-[45] font-mono text-[10px] tracking-[0.3em] text-white/35 transition-all duration-500 hover:text-[#c9a84c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a84c] ${
          closing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        SKIP [ESC]
      </button>

      {/* ── 9. Grain (z-40) ── */}
      <div className="grain" />
    </div>
  );
}