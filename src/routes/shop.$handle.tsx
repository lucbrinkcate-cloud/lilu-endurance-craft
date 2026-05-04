import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useRef, useState } from "react";

type Product = {
  name: string;
  cat: string;
  price: string;
  story: string;
  specs: [string, string][];
  sport: "Road" | "Gravel" | "All-Road";
  level: "Endurance" | "Race" | "All-Day";
  pairs: string[]; // handles of recommended cross-sells
};

const PRODUCTS: Record<string, Product> = {
  "endurance-jersey": {
    name: "Endurance Jersey",
    cat: "Jerseys",
    price: "€185",
    story:
      "Cut for hour five in the drops. Recycled Italian knit, laser-bonded seams, three deep cargo pockets.",
    specs: [
      ["Weight", "142g"],
      ["Fabric", "Recycled poly · Elastane"],
      ["Fit", "Race"],
      ["Made in", "Italy"],
    ],
    sport: "Road",
    level: "Endurance",
    pairs: ["endurance-bib-shorts", "core-merino-base-layer", "long-road-cap"],
  },
  "endurance-bib-shorts": {
    name: "Endurance Bib Shorts",
    cat: "Bibs",
    price: "€245",
    story: "High-compression panels, Italian chamois, recycled nylon. Built for the long road.",
    specs: [
      ["Chamois", "Italian · 12mm"],
      ["Fabric", "Recycled nylon"],
      ["Fit", "Race"],
      ["Made in", "Italy"],
    ],
    sport: "Road",
    level: "Endurance",
    pairs: ["endurance-jersey", "core-merino-base-layer", "shadow-gilet"],
  },
  "field-rain-jacket": {
    name: "Field Rain Jacket",
    cat: "Outerwear",
    price: "€320",
    story:
      "Three-layer waterproof shell, PFC-free DWR, reflective trim. Engineered for the worst of it.",
    specs: [
      ["Membrane", "3L · 20K/20K"],
      ["DWR", "PFC-free"],
      ["Fit", "Athletic"],
      ["Made in", "Portugal"],
    ],
    sport: "All-Road",
    level: "All-Day",
    pairs: ["core-merino-base-layer", "shadow-gilet", "long-road-cap"],
  },
  "core-merino-base-layer": {
    name: "Core Merino Base Layer",
    cat: "Accessories",
    price: "€95",
    story: "Merino blend for thermal honesty. Flatlock seams. Anti-odor by nature.",
    specs: [
      ["Fabric", "Merino · Tencel"],
      ["Weight", "155g"],
      ["Fit", "Next-to-skin"],
      ["Made in", "Portugal"],
    ],
    sport: "All-Road",
    level: "All-Day",
    pairs: ["endurance-jersey", "field-rain-jacket", "shadow-gilet"],
  },
  "shadow-gilet": {
    name: "Shadow Gilet",
    cat: "Outerwear",
    price: "€175",
    story: "Featherweight wind shell. Folds into its own pocket. The insurance policy.",
    specs: [
      ["Weight", "78g"],
      ["Fabric", "Recycled ripstop"],
      ["Fit", "Race"],
      ["Made in", "Italy"],
    ],
    sport: "Road",
    level: "Race",
    pairs: ["endurance-jersey", "endurance-bib-shorts", "core-merino-base-layer"],
  },
  "long-road-cap": {
    name: "Long Road Cap",
    cat: "Accessories",
    price: "€38",
    story: "Cotton twill, three-panel, embroidered LILU script. For the café and the col.",
    specs: [
      ["Fabric", "Cotton twill"],
      ["Sizes", "S/M · L/XL"],
      ["Made in", "Italy"],
      ["Care", "Hand wash"],
    ],
    sport: "All-Road",
    level: "All-Day",
    pairs: ["endurance-jersey", "core-merino-base-layer", "field-rain-jacket"],
  },
};

// Story-driven content: each product points to relevant journal entries
const PRODUCT_JOURNAL: Record<string, Array<{ slug: string; chapter: string; title: string; excerpt: string; minutes: number }>> = {
  "endurance-jersey": [
    { slug: "the-recycled-knit", chapter: "03 / Material", title: "The recycled knit.", excerpt: "How a Brescia mill turned plastic bottles into the fastest jersey we've ever made.", minutes: 6 },
    { slug: "the-pre-dawn-protocol", chapter: "01 / Ride", title: "The pre-dawn protocol.", excerpt: "Six hours into the dark before the world starts. Why we ride before we are awake.", minutes: 8 },
  ],
  "endurance-bib-shorts": [
    { slug: "marta-riding-the-line", chapter: "02 / Athlete", title: "Marta, riding the line.", excerpt: "A portrait of a domestique who refuses to be invisible.", minutes: 12 },
  ],
  "field-rain-jacket": [
    { slug: "the-pre-dawn-protocol", chapter: "01 / Ride", title: "The pre-dawn protocol.", excerpt: "Six hours into the dark before the world starts.", minutes: 8 },
  ],
  "core-merino-base-layer": [
    { slug: "the-recycled-knit", chapter: "03 / Material", title: "The recycled knit.", excerpt: "How a Brescia mill turned plastic bottles into the fastest jersey we've ever made.", minutes: 6 },
  ],
  "shadow-gilet": [
    { slug: "the-pre-dawn-protocol", chapter: "01 / Ride", title: "The pre-dawn protocol.", excerpt: "Six hours into the dark before the world starts.", minutes: 8 },
  ],
  "long-road-cap": [
    { slug: "marta-riding-the-line", chapter: "02 / Athlete", title: "Marta, riding the line.", excerpt: "A portrait of a domestique who refuses to be invisible.", minutes: 12 },
  ],
};

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const Route = createFileRoute("/shop/$handle")({
  loader: ({ params }) => {
    const product = PRODUCTS[params.handle];
    if (!product) throw notFound();
    const pairs = product.pairs
      .map((h) => ({ handle: h, ...PRODUCTS[h] }))
      .filter((p) => Boolean(p.name));
    const journal = PRODUCT_JOURNAL[params.handle] ?? [];
    return { product, pairs, journal };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-5xl md:text-7xl">Out of stock.</h1>
        <p className="mt-4 text-mist">This piece isn't in the field kit.</p>
        <Link to="/shop" className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-sage">
          Back to Shop →
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
      <p className="text-mist">Error: {error.message}</p>
    </div>
  ),
  head: ({ params }) => {
    const p = PRODUCTS[params.handle];
    const title = p ? `${p.name} — LILU` : "LILU Shop";
    return {
      meta: [
        { title },
        { name: "description", content: p?.story ?? "LILU cycling apparel." },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.story ?? "" },
      ],
    };
  },
});

const GALLERY_FRAMES = [
  { label: "Front", tone: "from-forest/40 to-ink" },
  { label: "Back", tone: "from-ink to-forest/30" },
  { label: "Detail", tone: "from-sage/20 to-ink" },
  { label: "On-bike", tone: "from-forest/60 to-ink/80" },
] as const;

function ProductPage() {
  const { product, pairs, journal } = Route.useLoaderData();
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [activeFrame, setActiveFrame] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: "0px 0px -100px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reasonFor = (p: Product) => {
    if (product.cat === "Outerwear" && p.cat === "Accessories")
      return "Layer underneath for thermal range";
    if (product.cat === "Jerseys" && p.cat === "Bibs") return "Matched fit · same fabric family";
    if (product.cat === "Bibs" && p.cat === "Jerseys") return "Completes the kit";
    if (p.name.includes("Merino")) return "Base mileage for cold starts";
    if (p.name.includes("Gilet")) return "Pocket insurance for descents";
    if (p.level === product.level) return `Built for the same ${product.level.toLowerCase()} effort`;
    return `Pairs with ${product.sport.toLowerCase()} riding`;
  };

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="lg:sticky lg:top-20 lg:h-[80vh] flex flex-col">
          <div
            className={`relative flex-1 aspect-square lg:aspect-auto bg-gradient-to-br ${GALLERY_FRAMES[activeFrame].tone} overflow-hidden cursor-zoom-in`}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <div
              className="absolute inset-0 flex items-center justify-center font-display text-[40vw] lg:text-[20vw] text-paper/10 leading-none transition-transform duration-300 ease-out"
              style={
                zoom
                  ? { transform: `scale(1.6)`, transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : undefined
              }
            >
              {product.name.charAt(0)}
            </div>
            <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/70 bg-ink/60 backdrop-blur px-2 py-1">
              {GALLERY_FRAMES[activeFrame].label} · {String(activeFrame + 1).padStart(2, "0")} / {String(GALLERY_FRAMES.length).padStart(2, "0")}
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.25em] text-mist/50">
              Hover to zoom
            </div>
          </div>
          <div className="grid grid-cols-4 gap-px bg-paper/10 mt-px">
            {GALLERY_FRAMES.map((f, i) => (
              <button
                key={f.label}
                onClick={() => setActiveFrame(i)}
                className={`aspect-square bg-gradient-to-br ${f.tone} relative transition-opacity ${
                  activeFrame === i ? "opacity-100 ring-1 ring-inset ring-sage" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center font-display text-3xl text-paper/20">
                  {product.name.charAt(0)}
                </div>
                <div className="absolute bottom-1 left-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-paper/70">
                  {f.label}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 md:px-12 py-16 lg:sticky lg:top-20 lg:h-fit">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
            {product.cat}
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            {product.name}
          </h1>
          <div className="mt-4 font-mono text-2xl text-mist">{product.price}</div>
          <p className="mt-8 max-w-md text-mist leading-relaxed">{product.story}</p>

          <div className="mt-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
              Size
            </div>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`font-mono text-xs uppercase tracking-[0.2em] w-12 h-12 border transition-colors ${
                    size === s
                      ? "border-sage bg-sage text-ink"
                      : "border-paper/20 hover:border-paper/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            ref={ctaRef}
            className="mt-8 w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] py-5 hover:bg-sage transition-colors"
          >
            Add to Cart — {product.price}
          </button>

          {/* TRUST SIGNALS */}
          <ul className="mt-6 grid grid-cols-1 gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">◇</span>
              Free EU shipping over €150 · 3–5 day delivery
            </li>
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">↺</span>
              30-day free returns · unworn, tags on
            </li>
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">∞</span>
              Lifetime free crash repair on every garment
            </li>
          </ul>

          <dl className="mt-12 border-t border-paper/15 pt-8 space-y-3">
            {product.specs.map(([k, v]: [string, string]) => (
              <div key={k} className="flex justify-between font-mono text-xs uppercase tracking-[0.18em]">
                <dt className="text-mist/60">{k}</dt>
                <dd className="text-paper">{v}</dd>
              </div>
            ))}
          </dl>

          {/* INFO ACCORDION: size guide / care / shipping / contact */}
          <div className="mt-10 border-t border-paper/15">
            {[
              {
                title: "Size Guide",
                body:
                  "Race fit. Sized for hour-five geometry, not the café. XS (chest 86–90cm) · S (91–95) · M (96–100) · L (101–106) · XL (107–112). Between sizes? Size up for endurance, down for race.",
                href: "/help/size-guide",
              },
              {
                title: "Fabric Care",
                body:
                  "Machine wash cold (30°C) on a gentle cycle, inside-out, with technical-fabric detergent. No softener. No tumble dry. Hang dry in shade. Crash damage? Send it back — we repair, free, for life.",
                href: "/help/fabric-care",
              },
              {
                title: "Shipping & Returns",
                body:
                  "Free EU shipping over €150 (2–4 business days). Worldwide tracked from €18. 60-day free returns on unworn pieces. Refunds within 5 business days of arrival at our Ghent atelier.",
                href: "/help/shipping-returns",
              },
              {
                title: "Customer Service",
                body:
                  "Real humans in Ghent, BE. Email service@lilucycling.com Mon–Fri, 09:00–18:00 CET. Average response: under 4 hours. Crash repairs and fit questions go to the same inbox.",
                href: "/contact" as const,
              },
            ].map((item) => (
              <details key={item.title} className="group border-b border-paper/15 py-4">
                <summary className="flex cursor-pointer items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-paper list-none">
                  {item.title}
                  <span className="text-sage transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist">{item.body}</p>
                <Link
                  to={item.href}
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-sage hover:text-paper"
                >
                  Read full guide →
                </Link>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS — empty state, no fake content */}
      <section className="border-t border-paper/10 px-6 md:px-12 py-20">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-3">
            Field Reports
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.9] tracking-tighter">
            Ridden by riders.
          </h2>
          <div className="mt-10 border border-paper/15 bg-paper/[0.02] p-8 md:p-10">
            <div className="flex items-center gap-1 text-mist/40">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2l2.9 7.1H22l-5.6 4.5L18.2 21 12 16.6 5.8 21l1.8-7.4L2 9.1h7.1z" />
                </svg>
              ))}
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
                No reviews yet
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-mist">
              We don't fabricate reviews. Verified field reports from owners appear here once we
              receive them. Bought this piece? Email service@lilucycling.com to share yours.
            </p>
          </div>
        </div>
      </section>

      {/* FROM THE JOURNAL — story-driven context for this piece */}
      {journal.length > 0 && (
        <section className="border-t border-paper/10 px-6 md:px-12 py-20 bg-paper/[0.015]">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-3">
                From the Journal
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.9] tracking-tighter">
                Read how we
                <br />
                built this.
              </h2>
            </div>
            <Link
              to="/journal"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist hover:text-paper border-b border-mist/40 pb-1"
            >
              All field notes →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-paper/10 border border-paper/10">
            {journal.map((s) => (
              <Link
                key={s.slug}
                to="/journal/$slug"
                params={{ slug: s.slug }}
                className="group block bg-ink p-8 md:p-10 hover:bg-forest/15 transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
                  {s.chapter} · {s.minutes} min read
                </div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight tracking-tight mb-3 group-hover:text-sage transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-mist leading-relaxed mb-5">{s.excerpt}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper border-b border-paper/30 pb-1 group-hover:border-sage group-hover:text-sage transition-colors">
                  Read the story →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {pairs.length > 0 && (
        <section className="border-t border-paper/10 px-6 md:px-12 py-20">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-3">
                Field Pairing · {product.sport} · {product.level}
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.9] tracking-tighter">
                Goes with.
              </h2>
            </div>
            <p className="max-w-sm text-mist text-sm leading-relaxed">
              Curated by our fit team for the same effort window — matched fabrics, complementary
              thermal range, no redundancy in the pocket.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/10">
            {pairs.map((p: Product & { handle: string }) => (
              <Link
                key={p.handle}
                to="/shop/$handle"
                params={{ handle: p.handle }}
                className="group block bg-ink p-6 hover:bg-forest/20 transition-colors"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-forest/40 to-ink relative overflow-hidden mb-5">
                  <div className="absolute inset-0 flex items-center justify-center font-display text-9xl text-paper/10 group-hover:scale-110 transition-transform duration-700">
                    {p.name.charAt(0)}
                  </div>
                  <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.25em] bg-ink/80 backdrop-blur px-2 py-1 text-sage">
                    {p.level}
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">
                  {p.cat} · {p.sport}
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <div className="font-display text-xl">{p.name}</div>
                  <div className="font-mono text-sm text-mist">{p.price}</div>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/70 leading-relaxed border-t border-paper/10 pt-3">
                  → {reasonFor(p)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />

      {/* STICKY ADD TO CART BAR — appears once primary CTA scrolls out */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 border-t border-paper/15 bg-ink/95 backdrop-blur-md transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="px-4 md:px-8 py-3 flex items-center gap-3 md:gap-6 max-w-6xl mx-auto">
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage truncate">
              {product.cat} · Size {size}
            </div>
            <div className="font-display text-base md:text-lg truncate">
              {product.name} <span className="text-mist/60">— {product.price}</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-1">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`font-mono text-[10px] uppercase w-8 h-8 border transition-colors ${
                  size === s ? "border-sage bg-sage text-ink" : "border-paper/20 text-mist hover:border-paper/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="bg-paper text-ink font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] px-5 md:px-8 py-3 md:py-4 hover:bg-sage transition-colors shrink-0">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
