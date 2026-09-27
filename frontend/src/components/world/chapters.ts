/** Named scroll ranges for each homepage chapter, as fractions of total page scroll. */
export const CHAPTERS = [
  { id: "arrival", label: "ARRIVAL", start: 0.0, end: 0.12 },
  { id: "identity", label: "IDENTITY", start: 0.1, end: 0.3 },
  { id: "engineering", label: "ENGINEERING", start: 0.28, end: 0.52 },
  { id: "skills", label: "SKILLS", start: 0.5, end: 0.68 },
  { id: "work", label: "WORK", start: 0.66, end: 0.85 },
  { id: "contact", label: "CONTACT", start: 0.85, end: 1.0 },
] as const;

/** 0 outside [start,end], ramps 0→1→0 across the range (peaks at the midpoint). */
export function rangeWeight(p: number, start: number, end: number): number {
  if (p <= start || p >= end) return p < start || p > end ? 0 : 1;
  const mid = (start + end) / 2;
  const half = (end - start) / 2;
  return 1 - Math.min(1, Math.abs(p - mid) / half);
}

/** 0→1 ramp entering the range, holds at 1 after. Useful for "appears and stays". */
export function enterWeight(p: number, start: number, end: number): number {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}
