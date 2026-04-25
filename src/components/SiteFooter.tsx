import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-mist border-t border-paper/10 px-6 md:px-10 py-16">
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl">
        <div className="md:col-span-2">
          <div className="font-display text-5xl text-paper">LILU</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] mt-3">
            Engineered for continuous endurance
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist/80">
            Field notes, drops, and ride invitations. No noise.
          </p>
          <form className="mt-4 flex max-w-sm border-b border-paper/30 pb-2">
            <input
              type="email"
              placeholder="email@address"
              className="flex-1 bg-transparent text-paper placeholder:text-mist/50 font-mono text-xs uppercase tracking-[0.18em] outline-none"
            />
            <button className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage hover:text-paper transition-colors">
              Subscribe →
            </button>
          </form>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
            Sitemap
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-paper">Shop</Link></li>
            <li><Link to="/journal" className="hover:text-paper">Journal</Link></li>
            <li><Link to="/sustainability" className="hover:text-paper">Sustainability</Link></li>
            <li><Link to="/about" className="hover:text-paper">About</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
            Help
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-paper">Shipping & Returns</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Size Guide</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Fabric Care</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Lifetime Repair</Link></li>
            <li>
              <a href="mailto:service@lilucycling.com" className="hover:text-paper">
                service@lilucycling.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-paper/10 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
        <span>© {new Date().getFullYear()} LILU Cycling Co.</span>
        <span>92% recycled · Carbon-neutral by 2027</span>
      </div>
    </footer>
  );
}
