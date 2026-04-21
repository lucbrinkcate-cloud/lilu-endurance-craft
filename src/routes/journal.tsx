import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/journal")({
  component: JournalPage,
  head: () => ({
    meta: [
      { title: "Journal — LILU" },
      { name: "description", content: "Field notes, athlete stories, and material studies from the road." },
      { property: "og:title", content: "Journal — LILU" },
      { property: "og:description", content: "Field notes from the road." },
    ],
  }),
});

const STORIES = [
  {
    slug: "the-pre-dawn-protocol",
    chapter: "01 / Ride",
    title: "The pre-dawn protocol.",
    excerpt: "Six hours into the dark before the world starts. Why we ride before we are awake.",
    minutes: 8,
  },
  {
    slug: "marta-riding-the-line",
    chapter: "02 / Athlete",
    title: "Marta, riding the line.",
    excerpt: "A portrait of a domestique who refuses to be invisible.",
    minutes: 12,
  },
  {
    slug: "the-recycled-knit",
    chapter: "03 / Material",
    title: "The recycled knit.",
    excerpt: "How a Brescia mill turned plastic bottles into the fastest jersey we've ever made.",
    minutes: 6,
  },
];

function JournalPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink">
        <SiteHeader />
      </div>
      <section className="px-6 md:px-10 pt-20 pb-16 border-b border-ink/15">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-4">
          Field Journal / Volume 04
        </div>
        <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tighter text-ink">
          Notes from
          <br />
          <span className="text-moss">the long road.</span>
        </h1>
      </section>

      <section className="divide-y divide-ink/10">
        {STORIES.map((s, i) => (
          <Link
            key={s.slug}
            to="/journal/$slug"
            params={{ slug: s.slug }}
            className="group block px-6 md:px-10 py-12 md:py-20 hover:bg-ink/5 transition-colors"
          >
            <div className="grid md:grid-cols-12 gap-6 items-baseline">
              <div className="md:col-span-2 font-mono text-[11px] uppercase tracking-[0.25em] text-moss">
                {s.chapter}
              </div>
              <div className="md:col-span-7">
                <h2 className="font-display text-3xl md:text-6xl leading-[0.95] tracking-tighter text-ink group-hover:text-moss transition-colors">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-xl text-ink/70 leading-relaxed">{s.excerpt}</p>
              </div>
              <div className="md:col-span-3 md:text-right font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                {String(i + 1).padStart(2, "0")} / {s.minutes} min read →
              </div>
            </div>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
