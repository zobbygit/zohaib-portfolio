import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WorkGrid from "../components/WorkGrid";
import Testimonials from "../components/Testimonials";
import TechUniverse from "../components/TechUniverse";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import KineticPhrases from "../components/KineticPhrases";
import { fetchProjects } from "../lib/api";
import { projects as staticProjects } from "../data/projects";
import { profile, identity } from "../data/profile";
import { hasWebGL, isTouchDevice, prefersReducedMotion } from "../lib/reducedMotion";

const WorldScene = lazy(() => import("../components/world/WorldScene"));
const StoryProgress = lazy(() => import("../components/world/StoryProgress"));

const STAGES = ["FRONTEND", "BACKEND", "DATABASE", "APIs", "SECURITY", "TESTING", "CI/CD", "DEPLOY"];

/**
 * The homepage as one continuous scroll-story rather than stacked sections: a single
 * fixed 3D world sits behind the page, and the camera inside it travels based on how
 * far the visitor has scrolled through this container. DOM content overlays the world
 * with large typography timed to roughly the same ranges the 3D chapters use.
 *
 * This is the first phase of a larger redesign — the Work, Lab, Journey, Education,
 * and Contact ROUTES still use their existing, more conventional layouts. Extending
 * the same one-world approach to every route is future work.
 */
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  const touch = isTouchDevice();
  const { data } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, retry: false });
  const list = (data && data.length > 0 ? data : staticProjects).slice(0, 3);

  useEffect(() => setWebgl(hasWebGL() && !prefersReducedMotion()), []);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed world: stays put while the page scrolls past it. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {webgl ? (
          <Suspense fallback={null}>
            <WorldScene containerRef={containerRef} lite={touch} />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_20%,#101a30,#05070d_65%)]" />
        )}
      </div>
      {webgl && (
        <Suspense fallback={null}>
          <StoryProgress containerRef={containerRef} />
        </Suspense>
      )}

      {/* ARRIVAL */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-accent">// SYSTEM PROFILE</p>
        <h1 className="mt-6 font-display text-[clamp(3.5rem,14vw,11rem)] font-bold leading-[0.82] tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-4 font-mono text-sm tracking-[0.35em] text-white/60">{profile.role}</p>
        <p className="mt-8 max-w-md text-white/50">Scroll to begin.</p>
      </section>

      {/* IDENTITY — a physical portrait panel, then kinetic phrases, no card grid */}
      <section className="relative flex min-h-[110svh] flex-col items-center justify-center gap-16 px-6 md:min-h-[140svh]">
        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm border border-white/10">
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            className="h-full w-full object-cover contrast-125"
            loading="eager"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div className="max-w-3xl text-center">
          <Reveal><p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold leading-tight">I BUILD THINGS.</p></Reveal>
          <KineticPhrases phrases={["FROM", "INTERFACE", "TO", "API", "TO", "DATABASE", "TO", "DEPLOYMENT."]} />
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs tracking-widest text-white/40">
            {identity.map((item, i) => (
              <span key={item}>{item.toUpperCase()}{i < identity.length - 1 && <span className="mx-3 text-accent">·</span>}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ENGINEERING — the pipeline lives in the 3D world; here just the label and the same 8 stages as text */}
      <section className="relative flex min-h-[120svh] flex-col items-center justify-center px-6 text-center md:min-h-[160svh]">
        <p className="font-mono text-xs tracking-[0.3em] text-accent">// HOW I BUILD SOFTWARE</p>
        <Reveal><p className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-bold">A system, assembled.</p></Reveal>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 font-mono text-sm tracking-widest text-white/60">
          {STAGES.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p className="mt-6 max-w-lg text-white/50">Frontend connects to backend. Backend reads and writes a database. Security wraps the system; tests validate it; CI/CD carries it to deployment.</p>
      </section>

      {/* SKILLS — same technology constellation, without the bordered card wrapper */}
      <section className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 md:min-h-[120svh]">
        <p className="font-mono text-xs tracking-[0.3em] text-accent">// TECHNOLOGY UNIVERSE</p>
        <Reveal><p className="mt-4 mb-10 text-center font-display text-[clamp(2rem,6vw,4rem)] font-bold">Tools I build with.</p></Reveal>
        <TechUniverse />
      </section>

      {/* WORK — the gateway object approaches in the 3D world; the list follows */}
      <section className="relative mx-auto min-h-[100svh] max-w-4xl px-6 pt-24">
        <p className="font-mono text-xs tracking-[0.3em] text-accent">// SELECTED WORK</p>
        <Reveal><p className="mt-4 mb-4 font-display text-[clamp(2rem,6vw,4.5rem)] font-bold">Enter the work.</p></Reveal>
        <WorkGrid projects={list} />
      </section>

      <Testimonials />

      {/* CONTACT teaser — the world empties out behind this */}
      <section className="relative flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-[clamp(2.5rem,9vw,7rem)] font-bold leading-[0.9]">LET&apos;S BUILD<br />SOMETHING.</p>
        <div className="mt-10"><MagneticButton to="/contact">START A CONVERSATION</MagneticButton></div>
      </section>
    </div>
  );
}
