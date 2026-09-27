import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { journeySteps } from "../data/content";
import { getScrollProgress } from "../lib/scrollProgress";
import { hasWebGL, isTouchDevice, prefersReducedMotion } from "../lib/reducedMotion";

const JourneyWorld = lazy(() => import("../components/world/JourneyWorld"));

/**
 * Cinematic timeline. The progress bar is written straight to the DOM on every
 * frame (not through setState — see the note in StoryProgress.tsx for why that
 * matters for smoothness); the active-step index only updates React state when
 * it actually changes.
 */
export default function JourneyPage() {
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => setWebgl(hasWebGL() && !prefersReducedMotion()), []);

  useEffect(() => {
    const tick = () => {
      const progress = getScrollProgress();
      if (barRef.current) barRef.current.style.width = `${progress * 100}%`;
      const next = Math.min(journeySteps.length - 1, Math.floor(progress * journeySteps.length));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl px-6 pb-32 pt-32">
      {webgl && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <Suspense fallback={null}>
            <JourneyWorld containerRef={containerRef} count={journeySteps.length} lite={isTouchDevice()} />
          </Suspense>
        </div>
      )}
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// JOURNEY</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95]">Travelling through the build.</h1>
      <div className="sticky top-24 z-10 mt-8 h-px w-full bg-white/10">
        <div ref={barRef} className="h-px bg-accent" style={{ width: "0%" }} />
      </div>
      <ol className="mt-16 grid gap-32">
        {journeySteps.map((s, i) => (
          <li key={s.key} className={`transition-all duration-700 ${i <= active ? "translate-x-0 opacity-100" : `opacity-25 ${i % 2 ? "translate-x-6" : "-translate-x-6"}`}`}>
            <p className="font-mono text-xs tracking-widest text-accent">{s.year}</p>
            <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold">{s.key}</h2>
            <p className="mt-4 max-w-xl text-lg text-white/70">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
