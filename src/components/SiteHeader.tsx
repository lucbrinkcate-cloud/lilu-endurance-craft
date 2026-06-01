import { Link } from "@tanstack/react-router";
import { useState } from "react";
import velonixLogo from "@/assets/velonix-logo.svg";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchDialog } from "@/components/SearchDialog";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/custom-kit", label: "Design Your Kit" },
  { to: "/journal", label: "Journal" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header
      className={
        overlay
          ? "fixed top-10 left-0 right-0 z-50 mix-blend-difference"
          : "sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-paper/10"
      }
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" aria-label="Velonix home" className="block">
          <img src={velonixLogo} alt="Velonix" className="h-6 md:h-7 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hover:text-sage transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-4"
              activeProps={{ className: "text-sage" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="min-h-11 min-w-11 inline-flex items-center justify-center text-paper hover:text-sage transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <CartDrawer />
        </div>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
