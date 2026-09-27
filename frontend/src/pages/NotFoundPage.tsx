import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { hasWebGL, prefersReducedMotion } from "../lib/reducedMotion";

const Scene = lazy(() => import("../components/Scene"));

export default function NotFoundPage() {
  const webgl = hasWebGL() && !prefersReducedMotion();
  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center">
      {webgl && <div className="absolute inset-0 -z-10"><Suspense fallback={null}><Scene lite /></Suspense></div>}
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-red-400">SYSTEM ERROR</p>
        <p className="mt-4 font-display text-[clamp(6rem,25vw,16rem)] font-bold leading-none">404</p>
        <p className="mt-4 text-white/70">Looks like this route doesn&apos;t exist.</p>
        <Link to="/" className="mt-8 inline-block rounded-full border border-white/25 px-6 py-3 font-mono text-xs tracking-widest hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">RETURN TO SYSTEM</Link>
      </div>
    </div>
  );
}
