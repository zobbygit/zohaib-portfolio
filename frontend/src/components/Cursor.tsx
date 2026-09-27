import { useEffect, useRef, useState } from "react";
import { isTouchDevice } from "../lib/reducedMotion";

const LABELS: Record<string, string> = { view: "VIEW", drag: "DRAG", explore: "EXPLORE" };

/**
 * Persistent, minimal cursor. Uses mix-blend-mode: difference so it inverts against
 * whatever is beneath it — this is what guarantees it never blends into a background,
 * dark or light, without per-section theme detection. A small dot is always visible;
 * a ring grows around it on interactive targets. Position is smoothed with a simple
 * lerp so it reads as a deliberate, persistent presence rather than a raw pointer echo.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isTouchDevice()) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(el ? LABELS[el.dataset.cursor ?? ""] ?? null : null);
    };
    window.addEventListener("pointermove", move, { passive: true });

    let raf = 0;
    const tick = () => {
      // Lerp toward the real pointer position: smooth, but never lags far behind.
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;
      const t = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      if (dotRef.current) dotRef.current.style.transform = t;
      if (ringRef.current) ringRef.current.style.transform = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block" style={{ mixBlendMode: "difference" }}>
      {/* Always-visible dot */}
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
      {/* Ring: present at rest, grows and labels on interactive targets */}
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 flex items-center justify-center rounded-full border border-white transition-[width,height] duration-200 ease-out ${
          label ? "h-16 w-16" : "h-7 w-7"
        }`}
      >
        {label && <span className="font-mono text-[9px] tracking-widest text-white">{label}</span>}
      </div>
    </div>
  );
}
