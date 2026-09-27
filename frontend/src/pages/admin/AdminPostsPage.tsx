import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin, type AdminPostInput, type Stored } from "../../lib/api";

const EMPTY: AdminPostInput = { slug: "", title: "", excerpt: "", body: "", tags: [], published: false };

export default function AdminPostsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "posts"], queryFn: admin.posts });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPostInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () => admin.savePost(editingId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      setForm(EMPTY);
      setEditingId(null);
      setError(null);
    },
    onError: () => setError("Save failed. Check required fields (slug, title, body)."),
  });
  const remove = useMutation({ mutationFn: (id: string) => admin.deletePost(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "posts"] }) });

  const edit = (p: Stored<AdminPostInput>) => {
    setEditingId(p._id);
    setForm(p);
  };

  const field = "w-full rounded-lg border border-white/15 bg-navy/60 px-3 py-2 text-sm text-white outline-none focus:border-accent";
  const label = "grid gap-1 font-mono text-[11px] tracking-widest text-white/60";

  return (
    <div className="grid gap-10">
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-4 rounded-2xl border border-white/10 p-6">
        <p className="font-mono text-xs tracking-widest text-accent">{editingId ? "EDIT POST" : "NEW POST"}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={label}>SLUG<input required className={field} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
          <label className={label}>TITLE<input required className={field} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        </div>
        <label className={label}>EXCERPT<input className={field} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
        <label className={label}>BODY (blank line separates paragraphs)<textarea required rows={10} className={field} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
        <label className={label}>TAGS (comma separated)<input className={field} value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></label>
        <label className="flex items-center gap-2 font-mono text-xs tracking-widest text-white/60">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> PUBLISHED
        </label>
        {error && <p role="alert" className="text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={save.isPending} className="rounded-full bg-white px-6 py-2 font-mono text-xs tracking-widest text-ink hover:bg-accent disabled:opacity-50">{save.isPending ? "SAVING…" : editingId ? "UPDATE" : "CREATE"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }} className="rounded-full border border-white/20 px-6 py-2 font-mono text-xs tracking-widest">CANCEL</button>}
        </div>
      </form>

      <div>
        {isLoading && <p className="text-white/50" aria-busy="true">Loading…</p>}
        <ul className="grid gap-2">
          {(data ?? []).map((p) => (
            <li key={p._id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
              <span className="font-mono text-sm">{p.title} <span className="text-white/40">/{p.slug}</span> {!p.published && <span className="text-amber-300">DRAFT</span>}</span>
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
