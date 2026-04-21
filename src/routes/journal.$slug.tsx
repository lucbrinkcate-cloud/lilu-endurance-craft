import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const STORIES: Record<
  string,
  { chapter: string; title: string; pullQuote: string; body: string[] }
> = {
  "the-pre-dawn-protocol": {
    chapter: "01 / Ride",
    title: "The pre-dawn protocol.",
    pullQuote: "Discomfort is a required metric for progression.",
    body: [
      "It is 04:42. The kettle is on. The bibs are already on. The coffee is a formality — the decision was made the night before, when the alarm was set without negotiation.",
      "We ride before the world is awake because the road belongs to no one. There are no cars, no commuters, no opinions. Only the sound of tubular tyres on cold tarmac and the slow argument between your lungs and the dark.",
      "By the time the sky begins to bruise, you have done the work. The rest of the day is a lap of honour.",
    ],
  },
  "marta-riding-the-line": {
    chapter: "02 / Athlete",
    title: "Marta, riding the line.",
    pullQuote: "The domestique writes the race in invisible ink.",
    body: [
      "Marta does not win races. Marta makes them winnable. She holds the line in the gutter when the crosswind comes, she carries the bottles, she pulls the breakaway back inside the final ten kilometres.",
      "We met her in a kitchen in Girona, eating pasta at 22:00 after a six-hour ride. She does not romanticise the work. She simply does it, again, the next morning.",
    ],
  },
  "the-recycled-knit": {
    chapter: "03 / Material",
    title: "The recycled knit.",
    pullQuote: "The road is the laboratory.",
    body: [
      "In a small mill outside Brescia, plastic bottles are spun into a yarn so fine it feels like silk. We tested it for a season in the rain, in the heat, on the climbs nobody wants to do twice.",
      "The result is the lightest jersey we have ever produced. 142 grams. 92% recycled content. Zero PFC chemistry. Engineered to be repaired, not replaced.",
    ],
  },
};

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const story = STORIES[params.slug];
    if (!story) throw notFound();
    return { story };
  },
  component: StoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <div className="bg-ink"><SiteHeader /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-5xl md:text-7xl">Story not found.</h1>
        <Link to="/journal" className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-moss">
          ← Back to Journal
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-ink bg-paper px-6">
      <p>Error: {error.message}</p>
    </div>
  ),
  head: ({ params }) => {
    const s = STORIES[params.slug];
    const title = s ? `${s.title} — LILU Journal` : "LILU Journal";
    return {
      meta: [
        { title },
        { name: "description", content: s?.pullQuote ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: s?.pullQuote ?? "" },
      ],
    };
  },
});

function StoryPage() {
  const { story } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink"><SiteHeader /></div>
      <article className="px-6 md:px-10 max-w-3xl mx-auto py-20 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-6">
          {story.chapter}
        </div>
        <h1 className="font-display text-5xl md:text-8xl leading-[0.9] tracking-tighter">
          {story.title}
        </h1>
        <div className="mt-16 space-y-8 text-lg leading-relaxed text-ink/80">
          {story.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <blockquote className="my-20 border-l-4 border-moss pl-6 md:pl-8 font-display text-3xl md:text-5xl leading-[1] tracking-tighter text-moss">
          "{story.pullQuote}"
        </blockquote>
        <Link to="/journal" className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss hover:text-ink">
          ← All field notes
        </Link>
      </article>
      <SiteFooter />
    </div>
  );
}
