import Link from "next/link";

const LINKS = {
  Shop: [
    { label: "All Products", href: "/" },
    { label: "Electronics", href: "/?category=Electronics" },
    { label: "Fashion", href: "/?category=Fashion" },
    { label: "Books", href: "/?category=Books" },
    { label: "Home & Living", href: "/?category=Home" },
  ],
  Account: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
  ],
  Developer: [
    { label: "GitHub", href: "https://github.com/vashistJatin", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/jatin-sharma-8874162b2", external: true },
    { label: "Email", href: "mailto:jatin8966@gmail.com", external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 text-white mt-auto">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <div className="font-display font-bold text-2xl mb-3">
            Shop<span className="text-brand-light">X</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
            A full-stack e-commerce platform built with Next.js, Node.js, and MongoDB.
            Fast, responsive, and production-ready.
          </p>
          {/* Tech pills */}
          <div className="flex flex-wrap gap-2">
            {["Next.js", "Node.js", "MongoDB", "Express", "Tailwind"].map((t) => (
              <span key={t} className="text-[10px] font-mono font-medium text-white/40 border border-white/10 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group}>
            <div className="text-xs font-mono font-semibold text-white/30 uppercase tracking-widest mb-4">
              {group}
            </div>
            <ul className="flex flex-col gap-2.5">
              {items.map(({ label, href, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar — signature */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-white/30 text-xs font-mono">
            © 2026 ShopX. All rights reserved.
          </p>

          {/* Signature */}
          <div className="flex items-center gap-2">
            <span className="text-white/25 text-xs font-mono">Designed & built by</span>
            <Link
              href="https://github.com/vashistJatin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
            >
              <span className="w-5 h-5 rounded-full bg-brand-light/20 border border-brand-light/30 flex items-center justify-center text-[9px] font-bold text-brand-light">
                JS
              </span>
              <span className="text-xs font-display font-bold text-white/50 group-hover:text-brand-light transition-colors duration-200">
                Jatin Sharma
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/25 text-xs font-mono">Live on Vercel + Render</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
