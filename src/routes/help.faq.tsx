import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";

export const Route = createFileRoute("/help/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — LILU" },
      { name: "description", content: "Answers on sizing, fabrics, shipping, returns, custom kits and lifetime crash repair." },
      { property: "og:title", content: "FAQ — LILU" },
      { property: "og:description", content: "Answers on sizing, fabrics, shipping, returns, custom kits and lifetime crash repair." },
    ],
  }),
});

const FAQS: { cat: string; q: string; a: string }[] = [
  { cat: "Fit", q: "How does LILU sizing run?", a: "Race cut. Sized for hour-five geometry, not the café. Between sizes? Size up for endurance, down for race. See the full size guide for cm tables." },
  { cat: "Fit", q: "Can I exchange for a different size?", a: "Yes. Free size exchanges within EU, both ways. Email service@lilucycling.com — we ship the new size before the old one leaves you." },
  { cat: "Material", q: "What fabrics do you use?", a: "Recycled Italian knits, PFC-free DWR finishes, merino blends spun for thermal honesty. Every spec is on the product page." },
  { cat: "Material", q: "Are LILU pieces vegan?", a: "Outerwear, jerseys and bibs — yes. Merino base layers contain ethically sourced wool (mulesing-free, ZQ-certified)." },
  { cat: "Care", q: "Can I tumble dry?", a: "Never. Tumble drying destroys elastic memory and PFC-free DWR. Always air-dry flat." },
  { cat: "Shipping", q: "Do you ship worldwide?", a: "Yes — DHL Express, 3–7 working days. Duties prepaid for US, UK, CH, NO, AU, CA. Free EU shipping over €150." },
  { cat: "Returns", q: "How long is the return window?", a: "60 days. Riding it once on the road is fine — we trust you. Free EU returns; outside EU, return shipping at your cost." },
  { cat: "Repair", q: "What is lifetime crash repair?", a: "Crashed in your kit? Send it back. We patch, re-stitch, or panel-replace at cost — for as long as you ride it. Email repair@lilucycling.com." },
  { cat: "Custom", q: "Can I order custom team kit?", a: "Yes. Use the Design Your Kit tool to brief a custom kit — minimum order 6 pieces, 4-week production, full crash repair included." },
];

function FaqPage() {
  const cats = Array.from(new Set(FAQS.map((f) => f.cat)));
  const [active, setActive] = useState<string | "All">("All");
  const visible = active === "All" ? FAQS : FAQS.filter((f) => f.cat === active);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Help / FAQ · DOC-S04
        </div>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter">
          Questions, answered.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          The questions we get most. Can't find yours? Email{" "}
          <a className="text-sage underline" href="mailto:service@lilucycling.com">service@lilucycling.com</a>.
        </p>
      </section>

      <section className="px-6 md:px-10 py-10 border-b border-paper/10">
        <div className="flex flex-wrap gap-2">
          {(["All", ...cats] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono text-[10px] uppercase tracking-[0.25em] px-4 py-2 border transition-colors ${
                active === c
                  ? "bg-sage text-ink border-sage"
                  : "border-paper/20 text-mist hover:border-sage hover:text-sage"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-10 max-w-4xl">
        {visible.map((f, i) => (
          <details key={i} className="group border-b border-paper/15 py-6">
            <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">
                  {String(i + 1).padStart(2, "0")} / {f.cat}
                </div>
                <h2 className="font-display text-2xl md:text-3xl leading-tight">{f.q}</h2>
              </div>
              <span className="font-mono text-2xl text-sage transition-transform group-open:rotate-45 shrink-0 mt-2">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-mist">
              {f.a}
            </p>
          </details>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
