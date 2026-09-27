import { useInView } from "../hooks/useInView";

/**
 * Words stagger in together once the line scrolls into view — a single
 * IntersectionObserver (via useInView) driving a per-word CSS transition delay,
 * rather than one hook per word. A robust stand-in for "each phrase is its own
 * scroll beat" without a GSAP timeline synced to the 3D camera.
 */
export default function KineticPhrases({ phrases }: { phrases: string[] }) {
  const { ref, inView } = useInView<HTMLParagraphElement>(true, 0.6);
  return (
    <p ref={ref} className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-display text-[clamp(1.4rem,4.5vw,2.75rem)] font-bold leading-tight text-white/50">
      {phrases.map((word, i) => (
        <span
          key={word}
          className="inline-block transition-all duration-500"
          style={{ opacity: inView ? 1 : 0.15, transform: inView ? "translateY(0)" : "translateY(0.3em)", transitionDelay: `${i * 90}ms` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
