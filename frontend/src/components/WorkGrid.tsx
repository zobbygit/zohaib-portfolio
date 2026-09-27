import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../types";
import { isPlaceholder } from "../data/projects";
import { setPendingTransitionImage } from "../lib/transitionImage";
import { prefersReducedMotion } from "../lib/reducedMotion";
import { useMediaQuery } from "../hooks/useMediaQuery";

/**
 * A stacked list of full-width rows, each with a cursor-following preview image —
 * a common pattern on award-winning studio and portfolio sites (Locomotive Scroll—
 * style agency sites are a well-known example), used here specifically to replace
 * an earlier version where a large translucent 3D gallery panel sat fixed behind
 * the whole page and visibly overlapped the heading text. This reads as "hover a
 * project, see it" without anything ever competing with the page's own content.
 */
export default function WorkGrid({ projects }: { projects: Project[] }) {
  const thumbRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const startFollow = () => {
    cancelAnimationFrame(raf.current);
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (previewRef.current) previewRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -110%)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const onRowMove = (e: ReactPointerEvent<HTMLAnchorElement>, image: string) => {
    if (!canHover) return;
    target.current = { x: e.clientX, y: e.clientY };
    if (previewSrc !== image) setPreviewSrc(image);
  };
  const onRowLeave = () => {
    setPreviewSrc(null);
    cancelAnimationFrame(raf.current);
  };

  const onEnterProject = (p: Project) => {
    const el = thumbRefs.current[p.id];
    if (!el || !p.image || prefersReducedMotion()) return;
    setPendingTransitionImage(p.image, el.getBoundingClientRect());
  };

  return (
    <div className="relative border-t border-white/10">
      {canHover && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={`pointer-events-none fixed left-0 top-0 z-40 h-40 w-64 overflow-hidden rounded-lg border border-white/10 shadow-2xl transition-opacity duration-200 ${previewSrc ? "opacity-100" : "opacity-0"}`}
        >
          {previewSrc && <img src={previewSrc} alt="" className="h-full w-full object-cover object-top" />}
        </div>
      )}

      {projects.map((p, i) => {
        const placeholder = isPlaceholder(p);
        return (
          <Link
            key={p.id}
            to={`/work/${p.slug}`}
            data-cursor="explore"
            onClick={() => onEnterProject(p)}
            onPointerEnter={(e) => { if (!placeholder && p.image) { startFollow(); onRowMove(e, p.image); } }}
            onPointerMove={(e) => { if (!placeholder && p.image) onRowMove(e, p.image); }}
            onPointerLeave={onRowLeave}
            className="group grid grid-cols-[3rem_auto_1fr_auto] items-center gap-4 border-b border-white/10 py-8 transition hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:gap-8"
          >
            <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
            {!placeholder && p.image ? (
              <img ref={(el) => (thumbRefs.current[p.id] = el)} src={p.image} alt="" aria-hidden="true" className="h-12 w-12 rounded object-cover object-top md:h-16 md:w-16" />
            ) : (
              <span className="h-12 w-12 rounded border border-dashed border-white/15 md:h-16 md:w-16" aria-hidden="true" />
            )}
            <span>
              <span className="block font-display text-2xl font-bold transition group-hover:text-accent md:text-4xl">
                {placeholder ? "AWAITING PROJECT DATA" : p.title}
              </span>
              <span className="mt-1 block text-sm text-white/50">{p.description}</span>
              {!placeholder && p.technologies.length > 0 && (
                <span className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] tracking-widest text-white/40">
                  {p.technologies.slice(0, 4).map((t) => <span key={t}>{t}</span>)}
                </span>
              )}
            </span>
            <span className="hidden font-mono text-[11px] tracking-widest text-white/30 transition group-hover:translate-x-1 group-hover:text-accent md:inline-block">
              {placeholder ? "PENDING" : "ENTER →"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}