import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu,  X } from "lucide-react";
import { navItems,profile } from "../data/profile";
import { navDescriptions } from "../data/navMap";
// import { useTheme } from "../lib/ThemeContext";

/** Compact floating bar plus a full-screen spatial map overlay (not a plain link list). */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  // const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <nav aria-label="Primary" style={{ background: "var(--nav-bg)" }} className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 px-5 py-3 backdrop-blur-md">
          <Link to="/" data-cursor="view" className="flex items-center gap-2 font-display text-sm font-bold tracking-widest">
            {profile.name}
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-normal text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />ONLINE</span>
          </Link>  
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={toggle}
              data-cursor="view"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {theme === "dark" ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
            </button> */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              data-cursor="view"
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono text-xs tracking-widest hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Menu size={14} aria-hidden="true" /> MAP
            </button>
          </div>
        </nav>
      </header>

      <div
        id="menu-overlay"
        aria-hidden={!open}
        style={{ background: "var(--wipe-bg)" }} className={`fixed inset-0 z-[60] backdrop-blur-xl transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex justify-between">
            <p className="font-mono text-xs tracking-[0.3em] text-white/40">SITE MAP</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" data-cursor="view" className="sticky top-0 grid h-11 w-11 place-items-center rounded-full border border-white/20" style={{ background: "var(--wipe-bg)" }}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <ul className="my-auto grid gap-x-10 gap-y-1 py-8 sm:grid-cols-2">
            {navItems.map((item, i) => (
              <li key={item.to} style={{ transitionDelay: `${open ? i * 50 : 0}ms` }} className={`border-b border-white/10 py-3 transition-all duration-500 md:py-4 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  data-cursor="explore"
                  className={({ isActive }) => `group flex flex-col ${isActive ? "text-accent" : ""}`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-xs tracking-widest text-white/30">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-xl font-bold tracking-tight transition group-hover:translate-x-1 sm:text-2xl md:text-3xl">{item.label}</span>
                  </span>
                  <span className="mt-1 pl-8 text-sm text-white/45">{navDescriptions[item.to]}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}