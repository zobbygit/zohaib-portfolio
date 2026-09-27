type Level = "info" | "warn" | "error";

/** Minimal structured logger. Never log request bodies or secrets. */
export function log(level: Level, message: string, meta: Record<string, string | number | undefined> = {}): void {
  const line = JSON.stringify({ level, message, time: new Date().toISOString(), ...meta });
  if (level === "error") console.error(line);
  else console.log(line);
}
