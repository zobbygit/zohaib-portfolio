import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin } from "../../lib/api";

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "messages"], queryFn: admin.messages });
  const setRead = useMutation({ mutationFn: ({ id, read }: { id: string; read: boolean }) => admin.setMessageRead(id, read), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }) });
  const remove = useMutation({ mutationFn: (id: string) => admin.deleteMessage(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }) });

  if (isLoading) return <p className="text-white/50" aria-busy="true">Loading…</p>;

  return (
    <ul className="grid gap-4">
      {(data ?? []).length === 0 && <li className="text-white/50">No messages yet.</li>}
      {(data ?? []).map((m) => (
        <li key={m._id} className={`rounded-2xl border p-6 ${m.read ? "border-white/10" : "border-accent/50 bg-accent/5"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs tracking-widest text-white/50">{new Date(m.createdAt).toLocaleString()}</p>
            <span className="flex gap-3 font-mono text-xs tracking-widest">
              <button type="button" onClick={() => setRead.mutate({ id: m._id, read: !m.read })} className="text-accent hover:underline">{m.read ? "MARK UNREAD" : "MARK READ"}</button>
              <button type="button" onClick={() => remove.mutate(m._id)} className="text-red-400 hover:underline">DELETE</button>
            </span>
          </div>
          <p className="mt-3 font-display text-lg font-bold">{m.name} <span className="font-mono text-sm font-normal text-white/50">&lt;{m.email}&gt;</span></p>
          {m.projectType && <p className="mt-1 font-mono text-xs text-white/50">{m.projectType}</p>}
          <p className="mt-3 whitespace-pre-wrap text-white/80">{m.message}</p>
          <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`} data-cursor="view" className="mt-4 inline-block font-mono text-xs tracking-widest text-white/60 hover:text-accent">REPLY BY EMAIL →</a>
        </li>
      ))}
    </ul>
  );
}
