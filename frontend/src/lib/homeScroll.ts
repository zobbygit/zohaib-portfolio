/** Scroll progress (0–1) across a specific element's height, not the whole document.
 *  Used by the homepage world so the camera timeline is independent of page length
 *  changes elsewhere (e.g. once real projects lengthen the Work section). */
export function getElementScrollProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  if (total <= 0) return 0;
  const scrolled = -rect.top;
  return Math.min(1, Math.max(0, scrolled / total));
}
