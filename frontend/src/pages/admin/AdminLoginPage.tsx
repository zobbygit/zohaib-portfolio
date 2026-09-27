import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";

export default function AdminLoginPage() {
  const { isAdmin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname ?? "/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[100svh] max-w-sm place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full grid gap-5">
        <p className="font-mono text-xs tracking-[0.25em] text-accent">// ADMIN</p>
        <h1 className="font-display text-3xl font-bold">Sign in</h1>
        <label className="grid gap-2 font-mono text-xs tracking-widest text-white/60">
          EMAIL
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-white/15 bg-navy/60 px-4 py-3 text-white outline-none focus:border-accent" />
        </label>
        <label className="grid gap-2 font-mono text-xs tracking-widest text-white/60">
          PASSWORD
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-white/15 bg-navy/60 px-4 py-3 text-white outline-none focus:border-accent" />
        </label>
        {error && <p role="alert" className="text-red-400">{error}</p>}
        <button type="submit" disabled={busy} className="rounded-full bg-white px-6 py-3 font-mono text-xs tracking-widest text-ink hover:bg-accent disabled:opacity-50">
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
