import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/custom-kit", label: "Design Your Kit" },
  { to: "/journal", label: "Journal" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={
        overlay
          ? "fixed top-0 left-0 right-0 z-50 mix-blend-difference"
          : "sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-paper/10"
      }
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="font-display text-lg tracking-tight text-paper">
          LILU
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hover:text-sage transition-colors"
              activeProps={{ className: "text-sage" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
          Cart [0]
        </div>
      </div>
    </header>
  );
}
