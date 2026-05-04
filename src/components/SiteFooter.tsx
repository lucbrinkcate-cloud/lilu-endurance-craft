import { Link } from "@tanstack/react-router";

const PAYMENT_METHODS = ["VISA", "MC", "AMEX", "PAYPAL", "KLARNA", "APPLE PAY"];
const SHIP_COUNTRIES = "EU · UK · CH · NO · US · CA · AU · JP";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-mist border-t border-paper/10">
      {/* CERTIFICATIONS STRIP */}
      <div className="border-b border-paper/10 px-6 md:px-10 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl">
          {[
            { v: "92%", k: "Recycled fibres" },
            { v: "0", k: "PFC chemicals" },
            { v: "100%", k: "Renewable energy" },
            { v: "1% FTP", k: "For The Planet" },
          ].map((c) => (
            <div key={c.k} className="flex items-baseline gap-3">
              <span className="font-display text-2xl md:text-3xl text-paper leading-none">{c.v}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist/70">
                {c.k}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-5 gap-10 max-w-7xl">
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

            {/* Trustpilot placeholder — honest empty state */}
            <div className="mt-8 inline-flex items-center gap-3 border border-paper/15 bg-paper/[0.03] px-4 py-2.5">
              <div className="flex gap-0.5 text-sage">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M12 2l2.9 7.1H22l-5.6 4.5L18.2 21 12 16.6 5.8 21l1.8-7.4L2 9.1h7.1z" />
                  </svg>
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
                Trustpilot · Verified Q3 ’26
              </span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
              Sitemap
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-paper">Shop</Link></li>
              <li><Link to="/journal" className="hover:text-paper">Journal</Link></li>
              <li><Link to="/sustainability" className="hover:text-paper">Sustainability</Link></li>
              <li><Link to="/custom-kit" className="hover:text-paper">Custom Kit</Link></li>
              <li><Link to="/about" className="hover:text-paper">About</Link></li>
              <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
              Help
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help/shipping-returns" className="hover:text-paper">Shipping & Returns</Link></li>
              <li><Link to="/help/size-guide" className="hover:text-paper">Size Guide</Link></li>
              <li><Link to="/help/fabric-care" className="hover:text-paper">Fabric Care</Link></li>
              <li><Link to="/help/faq" className="hover:text-paper">FAQ</Link></li>
              <li><a href="mailto:repair@lilucycling.com" className="hover:text-paper">Lifetime Repair</a></li>
              <li>
                <a href="mailto:service@lilucycling.com" className="hover:text-paper">
                  service@lilucycling.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
              Ships to
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist leading-relaxed">
              {SHIP_COUNTRIES}
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mt-8 mb-4">
              Pay with
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((p) => (
                <span
                  key={p}
                  className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist border border-paper/20 px-2 py-1 bg-paper/[0.03]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/10 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
          <span>© {new Date().getFullYear()} LILU Cycling Co. · Ghent, BE · BTW BE0XXX.XXX.XXX</span>
          <span>92% recycled · Carbon-neutral by 2027</span>
        </div>
      </div>
    </footer>
  );
}
