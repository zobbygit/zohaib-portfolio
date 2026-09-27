import { useEffect, useRef, useState } from "react";
import { engineeringPipeline } from "../data/content";

/** Pipeline as one connected list, not a grid of bordered buttons — the active stage
 *  is simply larger and colored; the rest recede. Advances on scroll or click. */
export default function Pipeline() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (manual) return;
        entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index)));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [manual]);

  return (
    <div>
      <ol className="flex flex-wrap items-baseline gap-x-8 gap-y-4 border-b border-white/10 pb-8">
        {engineeringPipeline.map((s, i) => (
          <li key={s.stage} ref={(el) => (refs.current[i] = el)} data-index={i}>
            <button
              type="button"
              onClick={() => { setManual(true); setActive(i); }}
              aria-pressed={active === i}
              className={`font-mono tracking-widest transition-all ${
                active === i ? "text-2xl text-accent" : "text-sm text-white/35 hover:text-white/60"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {s.stage}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-6 min-h-[3rem] max-w-2xl text-lg text-white/80" aria-live="polite">{engineeringPipeline[active].detail}</p>
    </div>
  );
}
