import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// {eyebrow}</p>
      <Reveal>
        <h2 id={id} className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">{title}</h2>
      </Reveal>
    </div>
  );
}
