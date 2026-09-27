import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

/** Masked reveal: content slides up from behind a clipping mask when it enters view. */
export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: inView ? "translateY(0)" : "translateY(105%)", transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
