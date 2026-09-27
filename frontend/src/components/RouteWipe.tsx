import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../lib/reducedMotion";
import { takePendingTransitionImage } from "../lib/transitionImage";

/**
 * Route transition: a wipe, not a fade — closer to passing through a threshold than
 * the banned "simply fade between routes" pattern. When the visitor came from a Work
 * row, the clicked thumbnail is carried over (see lib/transitionImage.ts) and grows
 * from its exact on-screen position to fullscreen during the wipe, so opening a
 * project reads as moving toward it rather than a plain navigation.
 */
export default function RouteWipe() {
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const first = useRef(true);
  const [flying, setFlying] = useState<{ src: string } | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion() || !panelRef.current) return;

    const carried = takePendingTransitionImage();
    const panel = panelRef.current;
    panel.style.transition = "none";
    panel.style.transform = "scaleY(1)";

    if (carried) {
      setFlying({ src: carried.src });
      requestAnimationFrame(() => {
        const img = imgRef.current;
        if (img) {
          img.style.position = "fixed";
          img.style.left = `${carried.rect.left}px`;
          img.style.top = `${carried.rect.top}px`;
          img.style.width = `${carried.rect.width}px`;
          img.style.height = `${carried.rect.height}px`;
          img.style.transition = "none";
          // Force layout, then animate to fullscreen.
          void img.offsetWidth;
          img.style.transition = "all 420ms cubic-bezier(0.65,0,0.35,1)";
          img.style.left = "0px";
          img.style.top = "0px";
          img.style.width = "100vw";
          img.style.height = "100vh";
          img.style.borderRadius = "0px";
        }
      });
    }

    requestAnimationFrame(() => {
      panel.style.transformOrigin = "bottom";
      panel.style.transition = "transform 320ms cubic-bezier(0.65,0,0.35,1)";
      panel.style.transform = "scaleY(0)";
    });

    const clear = window.setTimeout(() => setFlying(null), 420);
    return () => window.clearTimeout(clear);
  }, [pathname]);

  return (
    <>
      <div ref={panelRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] origin-top" style={{ background: "var(--wipe-bg)", transform: "scaleY(0)" }} />
      {flying && (
        <img ref={imgRef} src={flying.src} alt="" aria-hidden="true" className="pointer-events-none z-[151] rounded object-cover" style={{ position: "fixed" }} />
      )}
    </>
  );
}
