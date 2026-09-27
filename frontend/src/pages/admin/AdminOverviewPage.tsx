import { useQuery } from "@tanstack/react-query";
import { admin } from "../../lib/api";

export default function AdminOverviewPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin", "analytics"], queryFn: () => admin.analytics(30) });

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="font-mono text-xs tracking-[0.25em] text-accent">PAGE VIEWS — LAST 30 DAYS</h2>
        {isLoading && <p className="mt-4 text-white/50" aria-busy="true">Loading…</p>}
        {isError && <p className="mt-4 text-white/60">Could not load analytics. Check the backend connection.</p>}
        {data && (
          <>
            <p className="mt-4 font-display text-4xl font-bold">{data.totalViews} <span className="text-base font-normal text-white/50">total views</span></p>
            <ul className="mt-6 grid gap-2">
              {data.paths.length === 0 && <li className="text-white/50">No views recorded yet.</li>}
              {data.paths.map((p) => (
                <li key={p.path} className="flex items-center justify-between border-b border-white/10 py-2 font-mono text-sm">
                  <span>{p.path}</span>
                  <span className="text-accent">{p.views}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
