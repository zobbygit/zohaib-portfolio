/**
 * Privacy-friendly page-view counting. Sends only the route path.
 * Respects Do Not Track. Stores nothing on the device.
 */
export function trackPageView(path: string): void {
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
  // Fire-and-forget; failures must never affect the visitor.
  fetch(`${base}/analytics/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
    keepalive: true,
  }).catch(() => undefined);
}
