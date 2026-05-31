"use client";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/store/authSlice";
import { selectCartCount } from "@/store/cartSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const count = useSelector(selectCartCount);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
        <Link href="/" className="font-display font-bold text-xl text-ink tracking-tight">
          Shop<span className="text-brand">X</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {["Electronics","Fashion","Books","Home"].map((cat) => (
            <Link key={cat} href={`/?category=${cat}`}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface2 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {user.isAdmin && (
                <Link href="/admin" className="section-label border border-border px-3 py-1.5 rounded-lg hover:bg-surface2 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/orders" className="btn-ghost text-sm py-2">Orders</Link>
              <button onClick={handleLogout} className="btn-ghost text-sm py-2">Logout</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm py-2">Login</Link>
              <Link href="/register" className="btn-blue text-sm py-2">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden p-2 rounded-lg text-ink-muted hover:bg-surface2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 py-4 flex flex-col gap-3">
          {["Electronics","Fashion","Books","Home"].map((cat) => (
            <Link key={cat} href={`/?category=${cat}`}
              className="text-sm font-medium text-ink-muted hover:text-ink"
              onClick={() => setMobileOpen(false)}>{cat}</Link>
          ))}
          <div className="border-t border-border pt-3 flex flex-col gap-2">
            {user ? (
              <>
                {user.isAdmin && <Link href="/admin" className="text-sm font-medium text-brand" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
                <Link href="/orders" className="text-sm text-ink-muted" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-ink-muted text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-ink-muted" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="btn-blue text-sm text-center py-2" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
