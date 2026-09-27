import { createContext, useContext, useRef, type ReactNode } from "react";

const ProgressContext = createContext<{ current: number } | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const ref = useRef(0);
  return <ProgressContext.Provider value={ref}>{children}</ProgressContext.Provider>;
}

/** A mutable ref (not state) so reading it in useFrame never triggers a re-render. */
export function useProgressRef(): { current: number } {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressRef must be used within ProgressProvider");
  return ctx;
}
