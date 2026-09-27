import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth as authApi } from "../lib/api";

interface AuthState {
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authApi.isAdmin().then((ok) => {
      setIsAdmin(ok);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    setIsAdmin(true);
  };
  const logout = async () => {
    await authApi.logout();
    setIsAdmin(false);
  };

  return <AuthContext.Provider value={{ loading, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
