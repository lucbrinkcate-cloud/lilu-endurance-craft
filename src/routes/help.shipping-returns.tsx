import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/help/shipping-returns")({
  component: ShippingReturnsPage,
  head: () => ({
    meta: [
      { title: "Shipping & Returns — LILU" },
      { name: "description", content: "Free EU shipping over €150, worldwide delivery, 60-day returns and lifetime crash repair on every LILU kit." },
      { property: "og:title", content: "Shipping & Returns — LILU" },
      { property: "og:description", content: "Free EU shipping over €150, 60-day returns, lifetime crash repair." },
    ],
  }),
});

function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-16 border-b border-paper/10 max-w-4xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Help / Logistics · DOC-S01
        </div>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter">
          Shipping & Returns.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          Built to be ridden hard, sent fast, and returned without friction. Here is exactly what to expect.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 grid md:grid-cols-2 gap-x-12 gap-y-14 max-w-5xl">
        <Block label="01 / Shipping" title="Free EU over €150">
          <p>Standard EU delivery: 2–4 working days. Free over €150, otherwise €9 flat.</p>
          <p>Worldwide delivery via DHL Express: 3–7 working days. Calculated at checkout. Duties prepaid for US, UK, CH, NO, AU, CA.</p>
          <p>Orders placed before 14:00 CET ship same day from our Antwerp facility.</p>
        </Block>
        <Block label="02 / Returns" title="60 days, no questions">
          <p>Return any unworn item within 60 days for a full refund. Riding it once on the road is fine — we trust you.</p>
          <p>Free return labels for EU. Outside EU: return shipping at your cost, refund processed within 5 working days of arrival.</p>
        </Block>
        <Block label="03 / Exchanges" title="Sized wrong? On us">
          <p>Free size exchanges within EU, both ways. Email service@lilucycling.com with your order number and we ship the new size before the old one leaves you.</p>
        </Block>
        <Block label="04 / Lifetime Crash Repair" title="Built to be mended">
          <p>Crashed in your kit? Send it back. We patch, re-stitch, or replace panels at cost — for as long as you ride it.</p>
          <p>Submit a repair at <a className="text-sage underline" href="mailto:repair@lilucycling.com">repair@lilucycling.com</a>.</p>
        </Block>
      </section>

      <SiteFooter />
    </div>
  );
}

function Block({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-3">{label}</div>
      <h2 className="font-display text-3xl mb-4">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-mist">{children}</div>
    </div>
  );
}
