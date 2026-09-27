import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import { isTouchDevice, prefersReducedMotion } from "../lib/reducedMotion";

/** Button/link that drifts slightly toward the pointer on fine-pointer devices. */
export default function MagneticButton({ to, children, variant = "solid" }: { to: string; children: ReactNode; variant?: "solid" | "outline" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (isTouchDevice() || prefersReducedMotion() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.2;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.2;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };
  const base = "inline-block rounded-full px-6 py-3 font-mono text-xs tracking-widest transition-colors transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";
  const style = variant === "solid" ? "bg-white text-ink hover:bg-accent" : "border border-white/25 hover:border-accent hover:text-accent";
  return (
    <Link ref={ref} to={to} data-cursor="view" onPointerMove={onMove} onPointerLeave={onLeave} className={`${base} ${style}`}>
      {children}
    </Link>
  );
}
