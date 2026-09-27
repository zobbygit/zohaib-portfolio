// import { lazy, Suspense } from "react";
// import { hasWebGL, prefersReducedMotion } from "../lib/reducedMotion";

// const ProjectObject = lazy(() => import("./ProjectObject"));
// const AgentForgeScene = lazy(() => import("./scenes/AgentForgeScene"));
// const FarmDropScene = lazy(() => import("./scenes/FarmDropScene"));
// const ConnectraScene = lazy(() => import("./scenes/ConnectraScene"));

// /** Project-specific 3D scenes for slugs that have one; otherwise the generic photo-panel object. */
// const CUSTOM_SCENES: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
//   agentforge: AgentForgeScene,
//   farmdrop: FarmDropScene,
//   connectra: ConnectraScene,
// };

// export default function ProjectPreview({ slug, src, alt }: { slug: string; src: string; alt: string }) {
//   const webglReady = hasWebGL() && !prefersReducedMotion();
//   const CustomScene = CUSTOM_SCENES[slug];

//   if (webglReady && CustomScene) {
//     return (
//       <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-white/10 bg-navy/40" role="img" aria-label={`${alt} — animated diagram`}>
//         <Suspense fallback={<div className="h-full w-full" aria-busy="true" />}>
//           <CustomScene />
//         </Suspense>
//         <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] tracking-widest text-white/40">SYSTEM DIAGRAM</p>
//       </div>
//     );
//   }

//   if (!src) {
//     return (
//       <div className="grid h-[24rem] place-items-center rounded-2xl border border-dashed border-white/20 font-mono text-xs tracking-widest text-white/40">
//         PREVIEW PENDING
//       </div>
//     );
//   }
//   if (!webglReady) {
//     return (
//       <div className="h-[24rem] overflow-hidden rounded-2xl border border-white/10 [perspective:1000px]">
//         <img src={src} alt={alt} className="h-full w-full object-cover object-top [transform:rotateY(-8deg)]" />
//       </div>
//     );
//   }
//   return (
//     <Suspense fallback={<div className="h-[24rem] rounded-2xl border border-white/10 bg-navy/40" aria-busy="true" />}>
//       <ProjectObject src={src} alt={alt} />
//     </Suspense>
//   );
// }



import { lazy, Suspense } from "react";
import { hasWebGL, prefersReducedMotion } from "../lib/reducedMotion";

const ProjectObject = lazy(() => import("./ProjectObject"));

export default function ProjectPreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const webglReady = hasWebGL() && !prefersReducedMotion();

  if (!src) {
    return (
      <div className="grid h-[24rem] place-items-center rounded-2xl border border-dashed border-white/20 font-mono text-xs tracking-widest text-white/40">
        PREVIEW PENDING
      </div>
    );
  }

  if (!webglReady) {
    return (
      <div className="h-[24rem] overflow-hidden rounded-2xl border border-white/10 [perspective:1000px]">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-top [transform:rotateY(-8deg)]"
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className="h-[24rem] rounded-2xl border border-white/10 bg-navy/40"
          aria-busy="true"
        />
      }
    >
      <ProjectObject src={src} alt={alt} />
    </Suspense>
  );
}