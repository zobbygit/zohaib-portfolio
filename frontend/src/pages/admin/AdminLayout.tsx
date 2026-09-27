import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";

const LINKS = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/posts", label: "Blog posts" },
  { to: "/admin/messages", label: "Messages" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <button type="button" onClick={() => logout()} className="rounded-full border border-white/20 px-4 py-2 font-mono text-xs tracking-widest hover:border-red-400 hover:text-red-400">SIGN OUT</button>
      </div>
      <nav className="mt-8 flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-full border px-4 py-2 font-mono text-xs tracking-widest ${isActive ? "border-accent text-accent" : "border-white/15 text-white/60"}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-10"><Outlet /></div>
    </div>
  );
}
