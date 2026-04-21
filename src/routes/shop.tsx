import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — LILU" },
      { name: "description", content: "Jerseys, bibs, outerwear and accessories. Engineered for continuous endurance." },
      { property: "og:title", content: "Shop — LILU" },
      { property: "og:description", content: "Jerseys, bibs, outerwear and accessories." },
    ],
  }),
});

const CATS = ["All", "Jerseys", "Bibs", "Outerwear", "Accessories"] as const;

const PRODUCTS = [
  { handle: "endurance-jersey", name: "Endurance Jersey", cat: "Jerseys", price: "€185", spec: "Recycled · 142g" },
  { handle: "endurance-bib-shorts", name: "Endurance Bib Shorts", cat: "Bibs", price: "€245", spec: "Italian chamois" },
  { handle: "field-rain-jacket", name: "Field Rain Jacket", cat: "Outerwear", price: "€320", spec: "3L · PFC-free" },
  { handle: "core-merino-base-layer", name: "Core Merino Base Layer", cat: "Accessories", price: "€95", spec: "Merino blend" },
  { handle: "shadow-gilet", name: "Shadow Gilet", cat: "Outerwear", price: "€175", spec: "Wind-shell" },
  { handle: "long-road-cap", name: "Long Road Cap", cat: "Accessories", price: "€38", spec: "Cotton twill" },
];

function ShopPage() {
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Volume 04 / Spring Field Kit
        </div>
        <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tighter">
          The Shop.
        </h1>
        <div className="mt-10 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
                active === c
                  ? "border-sage bg-sage text-ink"
                  : "border-paper/20 text-mist hover:border-paper/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.handle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="group border-b border-r border-paper/10 relative"
          >
            <Link to="/shop/$handle" params={{ handle: p.handle }} className="block">
              <div className="aspect-[4/5] bg-gradient-to-br from-forest/40 to-ink overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center font-display text-9xl text-paper/5 group-hover:scale-110 transition-transform duration-700">
                  {p.name.charAt(0)}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
                    {p.spec}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] bg-sage text-ink px-3 py-1">
                    Add
                  </span>
                </div>
              </div>
              <div className="p-6 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                    {p.cat}
                  </div>
                  <div className="font-display text-xl">{p.name}</div>
                </div>
                <div className="font-mono text-sm text-mist">{p.price}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
