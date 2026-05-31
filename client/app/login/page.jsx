"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import api from "@/lib/axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      dispatch(setUser(data));
      router.push(data.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-ink mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm">Sign in to your ShopX account</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="section-label mb-2 block">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="section-label mb-2 block">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-blue w-full mt-2 py-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-ink-muted text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand hover:text-brand-dark font-medium transition-colors">Sign up</Link>
        </p>
        <div className="mt-4 p-3 bg-surface2 rounded-xl border border-border">
          <p className="text-xs font-mono text-ink-faint mb-1">Demo Admin:</p>
          <p className="text-xs font-mono text-ink-muted">admin@shopx.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
