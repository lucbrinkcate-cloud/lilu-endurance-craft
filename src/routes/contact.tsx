import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — LILU" },
      { name: "description", content: "Outposts, press, wholesale, community. Get in touch." },
      { property: "og:title", content: "Contact — LILU" },
      { property: "og:description", content: "Get in touch with LILU." },
    ],
  }),
});

const OUTPOSTS = [
  { city: "Ghent", country: "Belgium", addr: "Drongensesteenweg 14", hours: "Wed–Sat · 11–18" },
  { city: "Girona", country: "Spain", addr: "Carrer de la Força 23", hours: "Tue–Sat · 10–19" },
  { city: "Boulder", country: "USA", addr: "1740 Pearl Street", hours: "Wed–Sun · 11–18" },
];

const CHANNELS = [
  { k: "General", v: "hello@lilu.cc" },
  { k: "Press", v: "press@lilu.cc" },
  { k: "Wholesale", v: "wholesale@lilu.cc" },
  { k: "Community", v: "rides@lilu.cc" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-20 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Contact
        </div>
        <h1 className="font-display text-6xl md:text-[10vw] leading-[0.85] tracking-tighter">
          Find us
          <br />
          <span className="text-sage">on the road.</span>
        </h1>
      </section>

      <section className="px-6 md:px-10 py-20 grid md:grid-cols-3 gap-px bg-paper/10 border-b border-paper/10">
        {OUTPOSTS.map((o) => (
          <div key={o.city} className="bg-ink p-8">
            <div className="font-display text-4xl tracking-tighter">{o.city}</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mt-2">
              {o.country}
            </div>
            <div className="mt-6 text-mist text-sm leading-relaxed">
              {o.addr}
              <br />
              <span className="text-mist/60 font-mono text-xs uppercase tracking-[0.2em]">
                {o.hours}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 md:px-10 py-20 grid md:grid-cols-2 gap-16 max-w-7xl">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
            Channels
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.9] tracking-tighter">
            Pick the right line.
          </h2>
          <dl className="mt-10 divide-y divide-paper/10 border-t border-paper/10">
            {CHANNELS.map((c) => (
              <div key={c.k} className="flex justify-between py-4 font-mono text-sm uppercase tracking-[0.18em]">
                <dt className="text-mist/60">{c.k}</dt>
                <dd className="text-paper">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage block mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-transparent border-b border-paper/30 py-3 text-paper outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage block mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-transparent border-b border-paper/30 py-3 text-paper outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage block mb-2">
              Message
            </label>
            <textarea
              rows={5}
              className="w-full bg-transparent border-b border-paper/30 py-3 text-paper outline-none focus:border-sage resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] px-8 py-4 hover:bg-sage transition-colors"
          >
            Send →
          </button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
