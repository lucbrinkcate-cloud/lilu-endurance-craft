import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — LILU" },
      { name: "description", content: "Mission, mandate, and the people who built LILU." },
      { property: "og:title", content: "About — LILU" },
      { property: "og:description", content: "The mandate behind LILU." },
    ],
  }),
});

const VALUES = [
  { n: "01", t: "Honesty", b: "We test what we sell. The road, not the lab." },
  { n: "02", t: "Endurance", b: "We build for hour five, not the warm-up." },
  { n: "03", t: "Repair", b: "Mend, don't replace. Lifetime guarantee." },
  { n: "04", t: "Restraint", b: "Fewer pieces. Better pieces. Longer lives." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-24 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          About / The Mandate
        </div>
        <h1 className="font-display text-6xl md:text-[10vw] leading-[0.85] tracking-tighter">
          A small studio,
          <br />
          <span className="text-sage">a long road.</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg text-mist leading-relaxed">
          LILU is a cycling apparel studio founded in 2021. We design, prototype, and ride out of a converted warehouse in Ghent. Everything we make is engineered for continuous endurance — and for the lives of the riders who wear it.
        </p>
      </section>

      <section className="px-6 md:px-10 py-24 grid md:grid-cols-2 gap-12 md:gap-20 max-w-7xl">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
            Mission
          </div>
          <h2 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-tighter">
            To build cycling apparel that earns its place in your kit bag for a decade, not a season.
          </h2>
        </div>
        <div className="space-y-6 text-mist leading-relaxed text-lg">
          <p>We are riders first. Designers second. Everything we ship has been worn, washed, crashed, and re-stitched before it ever sees a customer.</p>
          <p>Our team rides together every Wednesday and Saturday. Field days are sacred. Feedback is collected in the saddle, not in spreadsheets.</p>
        </div>
      </section>

      <section className="bg-paper text-ink px-6 md:px-10 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-4">
          Core Values
        </div>
        <h2 className="font-display text-4xl md:text-7xl leading-[0.9] tracking-tighter mb-16">
          Four pillars.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15">
          {VALUES.map((v) => (
            <div key={v.n} className="bg-paper p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss flex items-center gap-3 mb-6">
                <span>{v.n}</span>
                <span className="h-px w-8 bg-moss/60" />
              </div>
              <h3 className="font-display text-3xl tracking-tighter">{v.t}</h3>
              <p className="mt-4 text-ink/70 text-sm leading-relaxed">{v.b}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
