import { aboutSections } from "../data/content";
import { profile } from "../data/profile";
import Reveal from "../components/Reveal";
import { useInView } from "../hooks/useInView";

export default function AboutPage() {
  const intro = useInView<HTMLDivElement>();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// ABOUT</p>
      <Reveal>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
          Interface to infrastructure, with <span className="text-accent">care</span> at every layer.
        </h1>
      </Reveal>
      <div className="mt-16 grid gap-16 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
        <div ref={intro.ref} className={`relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-navy transition duration-1000 ${intro.inView ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <p className="absolute inset-0 -z-10 grid place-items-center font-mono text-xs tracking-widest text-white/40">06 — PERSONAL PHOTO</p>
        </div>
        <div className="grid gap-12">
          {aboutSections.map((s) => (
            <section key={s.no}>
              <p className="font-mono text-xs tracking-widest text-accent">{s.no} — {s.title}</p>
              <Reveal><p className="mt-3 text-lg leading-relaxed text-white/80">{s.body}</p></Reveal>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
