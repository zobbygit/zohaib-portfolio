import { useEffect, useRef, useState, type RefObject } from "react";
import { CHAPTERS } from "./chapters";
import { getElementScrollProgress } from "../../lib/homeScroll";

/**
 * Chapter index: where the visitor is, how far they've travelled, what's next.
 * Performance matters here — this used to call setState on every animation frame,
 * which re-rendered the whole nav 60 times a second and was the main source of
 * scroll jank on the homepage. It now writes the progress bar height straight to
 * the DOM via a ref every frame, and only touches React state (the active chapter
 * label) when the active chapter actually changes — a few times per scroll, not
 * sixty times a second.
 */
export default function StoryProgress({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      const progress = getElementScrollProgress(containerRef.current);
      if (barRef.current) barRef.current.style.height = `${progress * 100}%`;

      let next = 0;
      for (let i = 0; i < CHAPTERS.length; i += 1) if (progress >= CHAPTERS[i].start) next = i;
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActiveIndex(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [containerRef]);

  const jumpTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const total = el.getBoundingClientRect().height - window.innerHeight;
    const y = el.offsetTop + CHAPTERS[i].start * total;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav aria-label="Story chapters" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex">
      {CHAPTERS.map((ch, i) => (
        <button key={ch.id} type="button" onClick={() => jumpTo(i)} data-cursor="view" aria-current={i === activeIndex} className="group flex items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          <span className={`font-mono text-[10px] tracking-widest transition-opacity ${i === activeIndex ? "opacity-100 text-accent" : "opacity-40 text-white group-hover:opacity-70"}`}>
            {String(i + 1).padStart(2, "0")} / {ch.label}
          </span>
          <span className={`h-px transition-all ${i === activeIndex ? "w-8 bg-accent" : "w-3 bg-white/40"}`} />
        </button>
      ))}
      <div className="mt-2 h-24 w-px bg-white/10">
        <div ref={barRef} className="w-px bg-accent" style={{ height: "0%" }} />
      </div>
    </nav>
  );
}
