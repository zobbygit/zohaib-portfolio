import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-[60svh] place-items-center text-white/50" aria-busy="true">Checking session…</div>;
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
