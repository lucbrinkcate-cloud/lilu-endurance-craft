import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sustainability")({
  component: SustainabilityPage,
  head: () => ({
    meta: [
      { title: "Sustainability — LILU" },
      { name: "description", content: "Repair protocol, recycled materials, renewable energy, carbon-neutral roadmap." },
      { property: "og:title", content: "Sustainability — LILU" },
      { property: "og:description", content: "The operational mandate." },
    ],
  }),
});

const PILLARS = [
  { n: "01", title: "Repair", body: "Lifetime crash repair on every garment we make. Free. Forever." },
  { n: "02", title: "Materials", body: "92% recycled or renewable fibres across the line. PFC-free. Bluesign-approved." },
  { n: "03", title: "Energy", body: "100% renewable energy across our offices, warehouses and partner mills." },
  { n: "04", title: "Carbon", body: "Net-zero by 2027. Audited annually. Published openly." },
];

const TIMELINE = [
  { y: "2021", t: "LILU founded. First recycled-knit jersey." },
  { y: "2023", t: "Crash repair programme launched." },
  { y: "2024", t: "100% renewable energy across operations." },
  { y: "2025", t: "92% recycled fibre threshold reached." },
  { y: "2027", t: "Carbon-neutral target. Independently audited." },
];

function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink"><SiteHeader /></div>
      <section className="px-6 md:px-10 pt-20 pb-24 border-b border-ink/15">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-4">
          Operational Mandate
        </div>
        <h1 className="font-display text-6xl md:text-[10vw] leading-[0.85] tracking-tighter">
          Built to be
          <br />
          <span className="text-moss">repaired.</span>
        </h1>
        <p className="mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          The most sustainable jersey is the one you keep wearing. Everything we make is engineered to be mended, not replaced.
        </p>
      </section>

      <section className="px-6 md:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-px bg-ink/15">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-paper p-10 md:p-14"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss flex items-center gap-3">
                <span>{p.n}</span>
                <span className="h-px w-10 bg-moss/60" />
                {p.title}
              </div>
              <h3 className="mt-6 font-display text-3xl md:text-5xl leading-[0.95] tracking-tighter">
                {p.body}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper px-6 md:px-10 py-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Roadmap
        </div>
        <h2 className="font-display text-4xl md:text-7xl leading-[0.9] tracking-tighter">
          Receipts, not promises.
        </h2>
        <ol className="mt-16 space-y-0 divide-y divide-paper/10 max-w-4xl">
          {TIMELINE.map((t) => (
            <li key={t.y} className="grid grid-cols-12 gap-6 py-8 items-baseline">
              <span className="col-span-3 md:col-span-2 font-display text-3xl md:text-5xl text-sage">
                {t.y}
              </span>
              <span className="col-span-9 md:col-span-10 text-mist text-lg">{t.t}</span>
            </li>
          ))}
        </ol>
      </section>
      <SiteFooter />
    </div>
  );
}
