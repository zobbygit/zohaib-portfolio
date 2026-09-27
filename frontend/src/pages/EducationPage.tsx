import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { education } from "../data/profile";
import { certifications, competitions } from "../data/content";
import { hasWebGL, isTouchDevice, prefersReducedMotion } from "../lib/reducedMotion";

const EducationWorld = lazy(() => import("../components/world/EducationWorld"));

/**
 * The timeline as one continuous line the visitor travels down, not a stack of
 * cards. A lit segment tracks how far they've come; the entry in focus comes
 * forward (scale + shift) while the others recede — a light 3D read using only
 * CSS transforms, so it stays fast on every device without an extra WebGL canvas.
 */
export default function EducationPage() {
  const [active, setActive] = useState(0);
  const [webgl, setWebgl] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => setWebgl(hasWebGL() && !prefersReducedMotion()), []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const node = refs.current[active];
    const track = trackRef.current;
    if (!node || !track || !beamRef.current) return;
    const height = node.offsetTop + node.offsetHeight / 2;
    beamRef.current.style.height = `${height}px`;
  }, [active]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl px-6 pb-24 pt-32">
      {webgl && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <Suspense fallback={null}>
            <EducationWorld containerRef={containerRef} count={education.length} lite={isTouchDevice()} />
          </Suspense>
        </div>
      )}
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// EDUCATION</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">The path so far.</h1>

      <div ref={trackRef} className="relative mt-16 pl-8 md:pl-12">
        <div className="absolute left-0 top-0 h-full w-px bg-white/10 md:left-0" />
        <div ref={beamRef} className="absolute left-0 top-0 w-px bg-accent shadow-[0_0_10px_#38e1d0] transition-[height] duration-500" style={{ height: 0 }} />
        <ol>
          {education.map((e, i) => {
            const isActive = active === i;
            return (
              <li
                key={e.title}
                ref={(el) => (refs.current[i] = el)}
                data-index={i}
                className="relative mb-24 origin-left transition-all duration-500 last:mb-0"
                style={{ transform: isActive ? "scale(1) translateX(0.25rem)" : "scale(0.96)", opacity: active >= i ? (isActive ? 1 : 0.45) : 0.25 }}
              >
                <span className={`absolute -left-8 top-2 h-3 w-3 rounded-full transition md:-left-12 ${active >= i ? "bg-accent shadow-[0_0_16px_#38e1d0]" : "bg-white/20"}`} />
                <p className="font-mono text-sm tracking-widest text-accent">{e.year}</p>
                <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{e.title}</h2>
                <p className="mt-1 text-white/60">{e.place}</p>
                <p className="mt-4 text-white/80">{e.detail}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.subjects.map((s) => <li key={s} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-white/60">{s}</li>)}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-24 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-2">
        <section>
          <h2 className="font-mono text-xs tracking-[0.25em] text-accent">CERTIFICATIONS</h2>
          <ul className="mt-4 grid gap-2 text-white/80">
            {certifications.map((c) => <li key={c} className="flex gap-3"><span className="text-accent">▹</span>{c}</li>)}
          </ul>
        </section>
        <section>
          <h2 className="font-mono text-xs tracking-[0.25em] text-accent">COMPETITIONS</h2>
          <ul className="mt-4 grid gap-2 text-white/80">
            {competitions.map((c) => <li key={c} className="flex gap-3"><span className="text-accent">▹</span>{c}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
