import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/help/fabric-care")({
  component: FabricCarePage,
  head: () => ({
    meta: [
      { title: "Fabric Care — LILU" },
      { name: "description", content: "How to wash, dry, and store technical cycling apparel so it lasts a decade, not a season." },
      { property: "og:title", content: "Fabric Care — LILU" },
      { property: "og:description", content: "Wash, dry, and store technical apparel so it lasts." },
    ],
  }),
});

const STEPS = [
  { n: "01", title: "Rinse on the day", body: "Cold rinse in the sink straight after the ride. Salt is the enemy of elastane." },
  { n: "02", title: "Wash cold, inside out", body: "30°C max, technical detergent, no fabric softener — softener kills DWR and chamois bonding." },
  { n: "03", title: "Air dry, flat", body: "Never tumble. Tumble dry destroys elastic memory and PFC-free DWR coatings." },
  { n: "04", title: "Re-proof shells yearly", body: "Apply a PFC-free DWR re-proofer every 12 months for outer layers. We sell one." },
  { n: "05", title: "Store flat", body: "Hang jerseys, fold bibs flat. Never store damp. UV bleaches recycled fibres — keep them in the drawer." },
];

function FabricCarePage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-16 border-b border-paper/10 max-w-4xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Help / Material · DOC-S03
        </div>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter">
          Fabric Care.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          Built to be repaired, not replaced. Care for it like the technical instrument it is.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-3xl">
        <ol className="space-y-10">
          {STEPS.map((s) => (
            <li key={s.n} className="grid grid-cols-[60px_1fr] gap-6 border-b border-paper/10 pb-10 last:border-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage pt-1">{s.n}</div>
              <div>
                <h2 className="font-display text-2xl mb-2">{s.title}</h2>
                <p className="text-sm leading-relaxed text-mist">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 border-t border-paper/10 pt-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
            Crashed it?
          </div>
          <p className="text-sm leading-relaxed text-mist">
            Don't bin it. Lifetime crash repair is included on every LILU piece — patch, re-stitch, or panel replace at cost. Email{" "}
            <a className="text-paper underline" href="mailto:repair@lilucycling.com">repair@lilucycling.com</a>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
