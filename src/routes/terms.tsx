import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — VELONIX" },
      { name: "description", content: "Terms of sale and use for the VELONIX online store." },
      { property: "og:title", content: "Terms & Conditions — VELONIX" },
      { property: "og:description", content: "Terms of sale and use for the VELONIX online store." },
    ],
    links: [{ rel: "canonical", href: "https://velonix.lovable.app/terms" }],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <article className="px-6 md:px-12 py-20 max-w-3xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">Legal</div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">Terms & Conditions</h1>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist">Last updated · 1 June 2026</p>

        <div className="mt-12 space-y-10 text-mist leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Orders</h2>
            <p>An order is confirmed once you receive a confirmation email. We reserve the right to refuse orders in case of clear pricing errors or stock issues.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Pricing & payment</h2>
            <p>All prices include EU VAT where applicable. Shipping is calculated at checkout — no surprise fees. Payment is processed by Shopify Payments, Stripe, PayPal or Klarna.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Shipping</h2>
            <p>EU orders ship in 3–5 working days, worldwide in 5–10. Free shipping over €150 inside the EU. Tracking is sent by email.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Returns</h2>
            <p>60-day free returns on unworn items with tags. Refunds are issued within 10 working days of receipt. See the <a className="text-sage underline" href="/help/shipping-returns">Shipping & Returns</a> page for the full process.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Crash Repair Commitment</h2>
            <p>Every Velonix kit comes with our Crash Repair Commitment: we repair crash damage for free on your first claim, and at cost for every repair after that. Manufacturing defects? Fixed free, forever — no time limit. Email <a className="text-sage underline" href="mailto:repair@velonix.cc">repair@velonix.cc</a> with photos and order number.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Liability & law</h2>
            <p>Liability is limited to the value of the order. These terms are governed by Belgian law; consumer rights under EU regulation are unaffected.</p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
