import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { technicalSkillCategories } from "../data/profile";
import { useInView } from "../hooks/useInView";
import { prefersReducedMotion, isTouchDevice } from "../lib/reducedMotion";

/**
 * "0.9 — Technical Skills": each category is a panel that tilts smoothly in 3D
 * toward the pointer (CSS perspective + rotateX/rotateY, no WebGL) and lifts into
 * place as it scrolls into view. Chosen over a WebGL scene for the same reason as
 * the Education timeline: this is dense, readable text, and CSS 3D gives a real,
 * smooth tilt without risking legibility or frame rate on any device.
 */
function TiltPanel({ title, items, index }: { title: string; items: string[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(true, 0.2);
  const flat = prefersReducedMotion() || isTouchDevice();

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (flat || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${py * -10}deg) translateZ(6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={viewRef}
      className="transition-all duration-700"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(1.5rem)", transitionDelay: `${index * 80}ms` }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)" }}
      >
        <h3 className="font-mono text-xs tracking-[0.2em] text-accent">{title.toUpperCase()}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="rounded-md border border-white/10 bg-ink/40 px-2.5 py-1.5 font-mono text-xs text-white/80">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TechnicalSkills3D() {
  return (
    <section className="mt-24 border-t border-white/10 pt-12">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">0.9 — TECHNICAL SKILLS</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">The full inventory.</h2>
      <p className="mt-3 max-w-2xl text-white/60">Tilt follows the pointer on desktop; the list stays static and fully readable on touch devices and with reduced motion enabled.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {technicalSkillCategories.map((cat, i) => (
          <TiltPanel key={cat.title} title={cat.title} items={cat.items} index={i} />
        ))}
      </div>
    </section>
  );
}