/**
 * Tiny pub-sub for a shared-element-style transition: WorkGrid records the clicked
 * thumbnail's image and screen position right before navigating; RouteWipe picks it
 * up on the next render and animates that same image from that exact spot to
 * fullscreen during the wipe, so entering a project reads as moving toward it
 * rather than a plain route change.
 */
let pending: { src: string; rect: DOMRect } | null = null;

export function setPendingTransitionImage(src: string, rect: DOMRect): void {
  pending = { src, rect };
}

export function takePendingTransitionImage(): { src: string; rect: DOMRect } | null {
  const value = pending;
  pending = null;
  return value;
}
