import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";

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

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const Route = createFileRoute("/shop/$handle")({
  loader: ({ params }) => {
    const product = PRODUCTS[params.handle];
    if (!product) throw notFound();
    const pairs = product.pairs
      .map((h) => ({ handle: h, ...PRODUCTS[h] }))
      .filter((p) => Boolean(p.name));
    return { product, pairs };
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

function ProductPage() {
  const { product, pairs } = Route.useLoaderData();
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");

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
        <div className="aspect-square lg:aspect-auto lg:min-h-[80vh] bg-gradient-to-br from-forest/40 to-ink relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center font-display text-[40vw] lg:text-[20vw] text-paper/10 leading-none">
            {product.name.charAt(0)}
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

          <button className="mt-8 w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] py-5 hover:bg-sage transition-colors">
            Add to Cart — {product.price}
          </button>

          <dl className="mt-12 border-t border-paper/15 pt-8 space-y-3">
            {product.specs.map(([k, v]: [string, string]) => (
              <div key={k} className="flex justify-between font-mono text-xs uppercase tracking-[0.18em]">
                <dt className="text-mist/60">{k}</dt>
                <dd className="text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
