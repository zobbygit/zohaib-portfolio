import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Intro from "../components/Intro";
import Navbar from "../components/Navbar";
import RouteWipe from "../components/RouteWipe";
import { hasSeenIntro } from "../lib/sessionFlags";
import { isTouchDevice, prefersReducedMotion } from "../lib/reducedMotion";
import Lenis from "lenis";
import { Seo, metaForPath } from "../lib/seo";
import { trackPageView } from "../lib/analytics";
import { Shield } from "lucide-react";

export default function SiteLayout() {
  const [introDone, setIntroDone] = useState(() => hasSeenIntro());
  const onDone = useCallback(() => setIntroDone(true), []);
  const { pathname } = useLocation();

  // Page views: path only, respecting Do Not Track. Dynamic routes set their own metadata.
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  const meta = metaForPath(pathname);

  // Reset scroll on route change (Lenis keeps its own position, so sync it too).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    // Native scroll already feels smoother than a JS-driven smoother on touch devices,
    // especially layered on top of a WebGL canvas — so skip Lenis there entirely.
    if (prefersReducedMotion() || isTouchDevice()) return;
    const lenis = new Lenis({ duration: 1.1, syncTouch: false });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {meta && <Seo title={meta.title} description={meta.description} path={pathname} />}
      {!introDone && <Intro onDone={onDone} />}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-ink">Skip to content</a>
      <RouteWipe />
      <Navbar />
      <main id="main" key={pathname}>
        <Outlet />
      </main>
  <footer className="border-t border-white/10 px-6 py-10 text-center font-mono text-xs tracking-widest text-white/40">
      <p>
    © {new Date().getFullYear()} ZOHAIB — BUILT WITH LOVE
  </p>
  <br />


  <div className="mb-4 flex items-center justify-center gap-6">
    <a
      href="https://www.linkedin.com/in/zohaib-aslam-245a40253"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
      aria-label="LinkedIn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      LINKEDIN
    </a>

    <a
      href="https://github.com/zobbygit"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
      aria-label="GitHub"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      GITHUB
    </a>
<a href="/admin/login" className="flex items-center gap-2">
  <Shield className="w-4 h-4" />
  <span>Admin</span>
</a>
  </div>

</footer>
    </>
  );
}