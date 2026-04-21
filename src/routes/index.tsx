import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import heroImage from "@/assets/lilu-hero.png";

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

const CHAPTERS = [
  {
    no: "01",
    kicker: "Origin",
    title: "Born on the long road.",
    body:
      "LILU was forged in the slow grind of pre-dawn climbs and the silence between watts. Every seam is a notebook entry from a ride that hurt.",
  },
  {
    no: "02",
    kicker: "Material",
    title: "Fabrics that hold the line.",
    body:
      "Recycled Italian knits. PFC-free finishes. Merino blends spun for thermal honesty. We test in the rain, not the lab.",
  },
  {
    no: "03",
    kicker: "Fit",
    title: "Cut for the position you actually ride.",
    body:
      "Aero-leaning, race-honest, but human. Patterned around riders in the drops at hour five — not mannequins under studio light.",
  },
  {
    no: "04",
    kicker: "Repair",
    title: "Engineered to be mended.",
    body:
      "Free crash repair on every garment, for life. The most sustainable jersey is the one you keep wearing.",
  },
];

const STATS = [
  { value: "92%", label: "Recycled or renewable fibres" },
  { value: "100%", label: "Renewable-energy production" },
  { value: "0", label: "PFC chemicals across the line" },
  { value: "∞", label: "Lifetime crash repair" },
];

function Index() {
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
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <div className="font-display text-lg tracking-tight">LILU</div>
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em]">
            <a href="#manifesto" className="hover:text-sage transition-colors">Manifesto</a>
            <a href="#chapters" className="hover:text-sage transition-colors">Chapters</a>
            <a href="#sustain" className="hover:text-sage transition-colors">Field Notes</a>
          </nav>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em]">Cart [0]</div>
        </div>
      </header>

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
            <span className="text-sage">the laboratory.</span>
          </h2>
        </div>

        <div className="divide-y divide-paper/10">
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
          <h2 className="font-display text-4xl md:text-7xl leading-[0.9] tracking-tighter max-w-4xl">
            Discomfort is a metric.
            <br />
            <span className="text-moss">Waste is not.</span>
          </h2>

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

      {/* FOOTER */}
      <footer className="bg-ink text-mist border-t border-paper/10 px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-display text-4xl text-paper">LILU</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] mt-3">
              Engineered for continuous endurance
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
            © {new Date().getFullYear()} LILU Cycling Co.
          </div>
        </div>
      </footer>
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

  return (
    <div
      ref={ref}
      className="px-6 md:px-10 py-24 md:py-40 grid md:grid-cols-12 gap-8 items-start"
    >
      <motion.div
        animate={{ opacity: inView ? 1 : 0.25 }}
        transition={{ duration: 0.6 }}
        className="md:col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] text-sage flex items-center gap-3"
      >
        <span className="text-paper/40">{chapter.no}</span>
        <span className="h-px w-8 bg-sage/60" />
        {chapter.kicker}
      </motion.div>

      <motion.div
        animate={{
          opacity: inView ? 1 : 0.2,
          y: inView ? 0 : 20,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="md:col-span-9"
      >
        <h3 className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tighter text-paper">
          {chapter.title}
        </h3>
        <p className="mt-8 max-w-xl text-mist text-base md:text-lg leading-relaxed">
          {chapter.body}
        </p>
        <div
          className={`mt-10 h-px bg-gradient-to-r from-sage to-transparent transition-all duration-700 ${
            inView ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </motion.div>

      {index % 2 === 0 && (
        <motion.div
          aria-hidden
          animate={{ opacity: inView ? 0.06 : 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-none fixed inset-0 -z-0 font-display text-[40vw] leading-none tracking-tighter text-sage flex items-center justify-center select-none"
        >
          {chapter.no}
        </motion.div>
      )}
    </div>
  );
}
