import { testimonials } from "../data/testimonials";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/** Renders nothing until real testimonials are added to data/testimonials.ts. */
export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="REFERENCES" title="What people say." />
      <div className="divide-y divide-white/10 border-t border-white/10">
        {testimonials.map((t) => (
          <Reveal key={t.name}>
            <figure className="py-10">
              <blockquote className="max-w-3xl font-display text-2xl font-medium leading-snug text-white/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 font-mono text-xs tracking-widest text-white/50">{t.name} — {t.role}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
