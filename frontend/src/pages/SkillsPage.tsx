import { useState } from "react";
import { skillGroups, skillRelations } from "../data/profile";

/** Skills shown as relationships, not proficiency bars. Select a skill to see what it connects to. */
export default function SkillsPage() {
  const all = skillGroups.flatMap((g) => g.items);
  const [selected, setSelected] = useState<string | null>(null);
  const related = selected ? skillRelations[selected] ?? [] : [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs tracking-[0.25em] text-accent">// SKILLS</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">How the pieces connect.</h1>
      <p className="mt-6 max-w-2xl text-white/70">Select a skill to see the tools it is usually paired with. No percentages: the useful signal is how things fit together.</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-10">
          {skillGroups.map((g) => (
            <div key={g.title}>
              <h2 className="font-mono text-xs tracking-[0.25em] text-white/50">{g.title.toUpperCase()}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setSelected(selected === item ? null : item)}
                      aria-pressed={selected === item}
                      className={`rounded-lg border px-3 py-2 font-mono text-sm transition ${selected === item ? "border-accent bg-accent/10 text-accent" : "border-white/15 hover:border-white/40"}`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <aside aria-live="polite" className="rounded-2xl border border-white/10 bg-navy/40 p-8 lg:sticky lg:top-32 lg:self-start">
          {selected ? (
            <>
              <p className="font-mono text-xs tracking-widest text-accent">{selected.toUpperCase()}</p>
              <h2 className="mt-3 font-display text-2xl font-bold">Often used with</h2>
              {related.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {related.map((r) => <li key={r} className="rounded-md border border-white/15 px-2 py-1 font-mono text-xs">{r}</li>)}
                </ul>
              ) : (
                <p className="mt-4 text-white/60">Connections for this skill are not listed yet.</p>
              )}
            </>
          ) : (
            <p className="text-white/60">{all.length} skills across {skillGroups.length} groups. Select one to explore its connections.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
