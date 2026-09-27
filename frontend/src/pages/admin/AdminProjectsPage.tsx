import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin, type AdminProjectInput, type Stored } from "../../lib/api";

const EMPTY: AdminProjectInput = {
  slug: "", title: "", description: "", longDescription: "", technologies: [], category: "",
  image: "", gallery: [], githubUrl: "", liveUrl: "", features: [], challenges: [], solutions: [],
  problem: "", solution: "", architecture: [], results: [],
};

const listField = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

export default function AdminProjectsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "projects"], queryFn: admin.projects });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminProjectInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () => admin.saveProject(editingId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      setForm(EMPTY);
      setEditingId(null);
      setError(null);
    },
    onError: () => setError("Save failed. Check required fields (slug and title)."),
  });
  const remove = useMutation({
    mutationFn: (id: string) => admin.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const edit = (p: Stored<AdminProjectInput>) => {
    setEditingId(p._id);
    setForm(p);
  };

  const field = "w-full rounded-lg border border-white/15 bg-navy/60 px-3 py-2 text-sm text-white outline-none focus:border-accent";
  const label = "grid gap-1 font-mono text-[11px] tracking-widest text-white/60";

  return (
    <div className="grid gap-10">
      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="grid gap-4 rounded-2xl border border-white/10 p-6 md:grid-cols-2"
      >
        <p className="font-mono text-xs tracking-widest text-accent md:col-span-2">{editingId ? "EDIT PROJECT" : "NEW PROJECT"}</p>
        <label className={label}>SLUG<input required className={field} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
        <label className={label}>TITLE<input required className={field} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className={label}>CATEGORY<input className={field} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <label className={label}>IMAGE PATH<input className={field} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/projects/example.jpg" /></label>
        <label className={label}>GITHUB URL<input className={field} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></label>
        <label className={label}>LIVE URL<input className={field} value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} /></label>
        <label className={`${label} md:col-span-2`}>SHORT DESCRIPTION<input className={field} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label className={`${label} md:col-span-2`}>LONG DESCRIPTION<textarea rows={3} className={field} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} /></label>
        <label className={label}>TECHNOLOGIES (comma separated)<input className={field} value={form.technologies.join(", ")} onChange={(e) => setForm({ ...form, technologies: listField(e.target.value) })} /></label>
        <label className={label}>FEATURES (comma separated)<input className={field} value={form.features.join(", ")} onChange={(e) => setForm({ ...form, features: listField(e.target.value) })} /></label>
        <label className={label}>ARCHITECTURE (comma separated)<input className={field} value={form.architecture.join(", ")} onChange={(e) => setForm({ ...form, architecture: listField(e.target.value) })} /></label>
        <label className={label}>RESULTS (comma separated)<input className={field} value={form.results.join(", ")} onChange={(e) => setForm({ ...form, results: listField(e.target.value) })} /></label>
        {error && <p role="alert" className="text-red-400 md:col-span-2">{error}</p>}
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={save.isPending} className="rounded-full bg-white px-6 py-2 font-mono text-xs tracking-widest text-ink hover:bg-accent disabled:opacity-50">{save.isPending ? "SAVING…" : editingId ? "UPDATE" : "CREATE"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }} className="rounded-full border border-white/20 px-6 py-2 font-mono text-xs tracking-widest">CANCEL</button>}
        </div>
      </form>

      <div>
        {isLoading && <p className="text-white/50" aria-busy="true">Loading…</p>}
        <ul className="grid gap-2">
          {(data ?? []).map((p) => (
            <li key={p._id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
              <span className="font-mono text-sm">{p.title} <span className="text-white/40">/{p.slug}</span></span>
              <span className="flex gap-2 font-mono text-xs tracking-widest">
                <button type="button" onClick={() => edit(p)} className="text-accent hover:underline">EDIT</button>
                <button type="button" onClick={() => remove.mutate(p._id)} className="text-red-400 hover:underline">DELETE</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
