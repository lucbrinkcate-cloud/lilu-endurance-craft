import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy & Cookies — VELONIX" },
      { name: "description", content: "How VELONIX collects, uses and protects your personal data. GDPR-compliant privacy and cookie policy." },
      { property: "og:title", content: "Privacy & Cookies — VELONIX" },
      { property: "og:description", content: "GDPR-compliant privacy and cookie policy." },
    ],
    links: [{ rel: "canonical", href: "https://velonix.lovable.app/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <article className="px-6 md:px-12 py-20 max-w-3xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">Legal / GDPR</div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">Privacy & Cookies</h1>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist">Last updated · 1 June 2026</p>

        <div className="mt-12 space-y-10 text-mist leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Who we are</h2>
            <p>VELONIX Cycling Co., based in Ghent, Belgium. Contact: <a className="text-sage underline" href="mailto:privacy@velonix.cc">privacy@velonix.cc</a>.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">What we collect</h2>
            <p>Order data (name, address, email, items, payment confirmation), account credentials if you create one, and anonymous usage data via essential cookies. We do not sell personal data.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Why we collect it</h2>
            <p>To fulfil orders, provide customer service, process returns and repairs, and improve the store. Marketing emails are sent only with explicit opt-in.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Cookies</h2>
            <p>We use strictly necessary cookies for cart and checkout. Analytics or marketing cookies are only loaded after you accept them in the cookie banner. You can change your preference any time by clearing storage for this site.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Your rights (GDPR)</h2>
            <p>You may request access, correction, deletion, or export of your data. Email <a className="text-sage underline" href="mailto:privacy@velonix.cc">privacy@velonix.cc</a> and we respond within 30 days.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-paper mb-3">Data processors</h2>
            <p>Shopify (storefront & checkout), Stripe / PayPal / Klarna (payments), shipping carriers (delivery), and email providers. All bound by GDPR-compliant DPAs.</p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
