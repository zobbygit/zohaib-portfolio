/** Returns page scroll progress in [0, 1]. Safe to call from render loops. */
export function getScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}
