import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import heroImage from "@/assets/lilu-hero.png";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsletterSection } from "@/components/NewsletterSection";
import { AnimatedPillar } from "@/components/AnimatedPillar";
import { PowerGraph } from "@/components/pillar-visuals/PowerGraph";
import cutImage from "@/assets/chapters/cut-for-the-drops.png";
import rainImage from "@/assets/chapters/tested-in-rain.png";

const bornVideo = { mp4: "/chapters/born-for-the-long-road.mp4", webm: "/chapters/born-for-the-long-road.webm" };
const mendedVideo = { mp4: "/chapters/engineered-to-be-mended.mp4", webm: "/chapters/engineered-to-be-mended.webm" };

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LILU — Engineered for Continuous Endurance" },
      {
        name: "description",
        content:
          "LILU. Cycling apparel engineered for continuous endurance. Editorial cuts, technical fabrics, built for the long road.",
      },
      { property: "og:title", content: "LILU — Engineered for Continuous Endurance" },
      {
        property: "og:description",
        content: "Cycling apparel engineered for the long road. Editorial cuts, technical fabrics.",
      },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
  }),
});

const MANIFESTO = [
  "ENGINEERED FOR CONTINUOUS ENDURANCE",
  "DISCOMFORT IS A REQUIRED METRIC FOR PROGRESSION",
  "THE ROAD IS THE LABORATORY",
  "BUILT TO BE REPAIRED, NOT REPLACED",
];

type ChapterMedia =
  | { type: "video"; src: { mp4: string; webm: string } }
  | { type: "image"; src: string; alt: string };

const CHAPTERS: Array<{
  no: string;
  kicker: string;
  title: string;
  body: string;
  media: ChapterMedia;
}> = [
  {
    no: "01",
    kicker: "Origin",
    title: "Born on the long road.",
    body:
      "LILU was forged in the slow grind of pre-dawn climbs and the silence between watts. Every seam is a notebook entry from a ride that hurt.",
    media: { type: "video", src: bornVideo },
  },
  {
    no: "02",
    kicker: "Material",
    title: "Tested in rain, not labs.",
    body:
      "Recycled Italian knits. PFC-free finishes. Merino blends spun for thermal honesty. Real-world performance for cyclists who demand technical honesty from their gear.",
    media: { type: "image", src: rainImage, alt: "LILU merino jersey tested in rain" },
  },
  {
    no: "03",
    kicker: "Fit",
    title: "Cut for the drops.",
    body:
      "Technical silhouettes engineered for the geometry of the ride, not the coffee stop. Patterned around riders in the drops at hour five — not mannequins under studio light.",
    media: { type: "image", src: cutImage, alt: "Rider in LILU jersey in the drops on a mountain road" },
  },
  {
    no: "04",
    kicker: "Repair",
    title: "Engineered to be mended.",
    body:
      "Free crash repair on every garment, for life. The most sustainable jersey is the one you keep wearing.",
    media: { type: "video", src: mendedVideo },
  },
];

const STATS = [
  { value: "92%", label: "Recycled or renewable fibres" },
  { value: "100%", label: "Renewable-energy production" },
  { value: "0", label: "PFC chemicals across the line" },
  { value: "∞", label: "Lifetime crash repair" },
];

function Index() {
  // power graph activation
  const [powerActive, setPowerActive] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.2]);
  const wordmarkY = useTransform(heroProgress, [0, 1], ["0%", "-40%"]);

  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const progressBar = useSpring(storyProgress, { stiffness: 80, damping: 20 });

  return (
    <main className="bg-ink text-paper overflow-x-hidden">
      <SiteHeader overlay />

      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="LILU cycling lineup at the edge of a forest road"
            className="h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink" />
        </motion.div>

        <motion.div
          style={{ y: wordmarkY }}
          className="relative z-10 flex h-full flex-col justify-end px-6 md:px-10 pb-16 md:pb-24"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist mb-4">
            Volume 04 — Spring Field Kit
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[22vw] md:text-[16vw] leading-[0.85] tracking-tighter text-paper"
          >
            LILU
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 max-w-md text-mist text-base md:text-lg leading-relaxed"
          >
            Cycling apparel engineered for the long road. Patterned in the drops at hour five.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] px-7 py-4 hover:bg-sage transition-colors"
            >
              Shop Spring Field Kit
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/journal"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist hover:text-paper transition-colors border-b border-mist/40 pb-1"
            >
              Read the field notes
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 right-6 md:right-10 font-mono text-[10px] uppercase tracking-[0.25em] text-mist flex items-center gap-3"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section id="manifesto" className="border-y border-paper/10 bg-ink py-6 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...MANIFESTO, ...MANIFESTO, ...MANIFESTO].map((line, i) => (
            <span
              key={i}
              className="font-display text-3xl md:text-5xl text-paper/90 mx-8 inline-flex items-center gap-8"
            >
              {line}
              <span className="text-sage">●</span>
            </span>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-paper/10 bg-ink py-10 md:py-12 px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/10 border border-paper/10">
          {[
            { icon: "◇", title: "Free EU shipping", sub: "Over €150 · 3–5 days" },
            { icon: "↺", title: "60-day returns", sub: "Unworn, no questions" },
            { icon: "∞", title: "Lifetime crash repair", sub: "Free, on every garment" },
            { icon: "✓", title: "Made in Italy & PT", sub: "Recycled · PFC-free" },
          ].map((t) => (
            <div key={t.title} className="bg-ink p-5 md:p-6">
              <div className="text-sage text-xl mb-2">{t.icon}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper">
                {t.title}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/60">
                {t.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCROLL-DRIVEN STORY */}
      <section id="chapters" ref={storyRef} className="relative bg-ink">
        {/* progress bar */}
        <motion.div
          style={{ scaleX: progressBar }}
          className="sticky top-0 z-40 h-[2px] bg-sage origin-left"
        />

        <div className="px-6 md:px-10 pt-24 pb-12 max-w-6xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-6">
            Chapters / The LILU Index
          </div>
          <h2 className="font-display text-5xl md:text-8xl leading-[0.9] tracking-tighter">
            Four notes from
            <br />
            <span className="text-sage">our clothes designers.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 px-3 md:px-10 pb-16">
          {CHAPTERS.map((c, i) => (
            <Chapter key={c.no} chapter={c} index={i} />
          ))}
        </div>
      </section>

      {/* SUSTAINABILITY STATS */}
      <section id="sustain" className="bg-paper text-ink py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-6xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-6">
            Field Notes / Operational Mandate
          </div>
          <div className="grid md:grid-cols-12 gap-12 items-end">
            <h2 className="md:col-span-7 font-display text-4xl md:text-7xl leading-[0.9] tracking-tighter">
              Discomfort is a metric.
              <br />
              <span className="text-moss">Waste is not.</span>
            </h2>
            <AnimatedPillar
              className="md:col-span-5"
              onActivate={() => setPowerActive(true)}
            >
              <div className="border border-ink/20 bg-ink p-4 md:p-6 rounded-sm">
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-mist/60 mb-3 flex justify-between">
                  <span>Fig. 05</span>
                  <span>Telemetry / Lab</span>
                </div>
                <div className="text-paper">
                  <PowerGraph active={powerActive} />
                </div>
              </div>
            </AnimatedPillar>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mt-20 border-t border-ink/15 pt-12">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="font-display text-5xl md:text-7xl text-forest leading-none">
                  {s.value}
                </div>
                <div className="mt-3 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-ink/60 max-w-[14ch]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS / COMMUNITY — honest, no fabricated quotes */}
      <section className="bg-ink border-t border-paper/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-6xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-6">
            Field Reports / Volume 04
          </div>
          <div className="grid md:grid-cols-12 gap-12 items-end mb-16">
            <h2 className="md:col-span-8 font-display text-4xl md:text-7xl leading-[0.9] tracking-tighter">
              Worn by riders.
              <br />
              <span className="text-sage">Not by influencers.</span>
            </h2>
            <p className="md:col-span-4 text-mist text-sm leading-relaxed">
              We don't pay for placement and we don't fabricate testimonials. When riders write to
              us, we publish what they say — verbatim, attributed, on their terms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/10 border border-paper/10">
            {["Cycling Tips", "Rouleur", "Escape Collective", "Bikepacking.com"].map((name) => (
              <div
                key={name}
                className="bg-ink p-8 md:p-10 flex items-center justify-center min-h-[120px]"
              >
                <div className="font-display text-xl md:text-2xl text-mist/40 tracking-tight text-center">
                  {name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-mist/40 text-center">
            Press coverage in progress · Volume 04 launches Spring '26
          </div>
        </div>
      </section>

      <NewsletterSection source="homepage" />

      <SiteFooter />
    </main>
  );
}

function Chapter({
  chapter,
  index,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverse = index % 2 === 1;
  void reverse;

  return (
    <div ref={ref}>
      <AnimatedPillar>
        <motion.div
          animate={{ opacity: inView ? 1 : 0.4, y: inView ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-paper/10 bg-ink/40 rounded-sm aspect-[9/16] max-h-[75svh] w-auto mx-auto"
        >
          {chapter.media.type === "video" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload={index === 0 ? "metadata" : "none"}
              className="h-full w-full object-cover"
            >
              <source src={chapter.media.src.webm} type="video/webm" />
              <source src={chapter.media.src.mp4} type="video/mp4" />
            </video>
          ) : (
            <img
              src={chapter.media.src}
              alt={chapter.media.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatedPillar>
    </div>
  );
}


