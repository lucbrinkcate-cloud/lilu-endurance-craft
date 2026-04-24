import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import jerseys1 from "@/assets/shop/jerseys-1.png";
import jerseys2 from "@/assets/shop/jerseys-2.png";
import jerseys3 from "@/assets/shop/jerseys-3.png";
import jerseys4 from "@/assets/shop/jerseys-4.png";
import bibs1 from "@/assets/shop/bib-shorts-1.png";
import bibs2 from "@/assets/shop/bib-shorts-2.png";
import bibs3 from "@/assets/shop/bib-shorts-3.png";
import bibs4 from "@/assets/shop/bib-shorts-4.png";
import sets1 from "@/assets/shop/sets-1.png";
import sets2 from "@/assets/shop/sets-2.png";
import sets3 from "@/assets/shop/sets-3.png";
import sets4 from "@/assets/shop/sets-4.png";
import outer1 from "@/assets/shop/outerwear-1.png";
import outer2 from "@/assets/shop/outerwear-2.png";
import outer3 from "@/assets/shop/outerwear-3.png";
import outer4 from "@/assets/shop/outerwear-4.png";
import base1 from "@/assets/shop/base-layers-1.png";
import base2 from "@/assets/shop/base-layers-2.png";
import base3 from "@/assets/shop/base-layers-3.png";
import base4 from "@/assets/shop/base-layers-4.png";
import acc1 from "@/assets/shop/accessories-1.png";
import acc2 from "@/assets/shop/accessories-2.png";
import acc3 from "@/assets/shop/accessories-3.png";
import acc4 from "@/assets/shop/accessories-4.png";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — LILU" },
      { name: "description", content: "Six product groups engineered for continuous endurance. Jerseys, bibs, sets, outerwear, base layers and accessories." },
      { property: "og:title", content: "Shop — LILU" },
      { property: "og:description", content: "Six product groups engineered for continuous endurance." },
    ],
  }),
});

type Group = {
  slug: string;
  name: string;
  code: string;
  spec: string;
  count: string;
  images: [string, string, string, string];
  visual: "jersey" | "bib" | "set" | "shell" | "base" | "cap";
};

const GROUPS: Group[] = [
  {
    slug: "jerseys",
    name: "Jerseys",
    code: "GRP-01",
    spec: "Recycled · 142g · Drops position",
    count: "4 styles",
    images: [jerseys1, jerseys2, jerseys3, jerseys4],
    visual: "jersey",
  },
  {
    slug: "bib-shorts",
    name: "Bib Shorts",
    code: "GRP-02",
    spec: "Italian chamois · 6h+ saddle time",
    count: "4 styles",
    images: [bibs1, bibs2, bibs3, bibs4],
    visual: "bib",
  },
  {
    slug: "sets",
    name: "Sets",
    code: "GRP-03",
    spec: "Matched jersey + bib · System fit",
    count: "4 sets",
    images: [sets1, sets2, sets3, sets4],
    visual: "set",
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    code: "GRP-04",
    spec: "3L shell · PFC-free DWR",
    count: "4 layers",
    images: [outer1, outer2, outer3, outer4],
    visual: "shell",
  },
  {
    slug: "base-layers",
    name: "Base Layers",
    code: "GRP-05",
    spec: "Merino blend · Thermal regulation",
    count: "4 layers",
    images: [base1, base2, base3, base4],
    visual: "base",
  },
  {
    slug: "accessories",
    name: "Accessories",
    code: "GRP-06",
    spec: "Caps · Socks · Gloves",
    count: "4 pieces",
    images: [acc1, acc2, acc3, acc4],
    visual: "cap",
  },
];

function ShopPage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Volume 04 / Spring Field Kit · 06 Groups
        </div>
        <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tighter">
          The Shop.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          Six product groups. Each one engineered against a single failure mode of the long ride.
          Hover any tile to see the catalogue.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g, i) => (
          <GroupTile key={g.slug} group={g} index={i} />
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}

function GroupTile({ group, index }: { group: Group; index: number }) {
  const [hover, setHover] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (!hover) {
      setPhotoIdx(0);
      return;
    }
    const id = window.setInterval(() => {
      setPhotoIdx((p) => (p + 1) % group.images.length);
    }, 1100);
    return () => window.clearInterval(id);
  }, [hover, group.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="group border-b border-r border-paper/10 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to="/shop/$handle" params={{ handle: group.slug }} className="block">
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-forest/30 to-ink">
          {/* Animated schematic — visible when not hovered */}
          <div
            className={`absolute inset-0 flex items-center justify-center p-10 text-paper/70 transition-opacity duration-500 ${
              hover ? "opacity-0" : "opacity-100"
            }`}
          >
            <GroupSchematic kind={group.visual} animate={!hover} />
          </div>

          {/* Photo carousel — visible on hover */}
          {group.images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`${group.name} ${idx + 1}`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                hover && idx === photoIdx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Top-left meta */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-mist mix-blend-difference">
            <span>{group.code}</span>
            <span>{group.count}</span>
          </div>

          {/* Hover progress dots */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 transition-opacity duration-300 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          >
            {group.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-[3px] w-6 transition-colors ${
                  idx === photoIdx ? "bg-sage" : "bg-paper/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 flex items-baseline justify-between border-t border-paper/10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
              Group / {group.code}
            </div>
            <div className="font-display text-2xl">{group.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist mt-1">
              {group.spec}
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60 group-hover:text-sage transition-colors">
            View →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ───────────── Animated SVG schematics, one per group ───────────── */

function GroupSchematic({ kind, animate }: { kind: Group["visual"]; animate: boolean }) {
  const common = {
    className: "w-full h-auto",
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1,
    "aria-hidden": true,
  };
  const dash = animate
    ? { strokeDasharray: 600, strokeDashoffset: 0, transition: "stroke-dashoffset 1.6s ease" }
    : { strokeDasharray: 600, strokeDashoffset: 600 };

  switch (kind) {
    case "jersey":
      return (
        <svg viewBox="0 0 240 280" {...common}>
          <path style={dash} d="M85,55 L60,75 L45,130 L65,140 L65,240 L175,240 L175,140 L195,130 L180,75 L155,55 Q120,75 85,55 Z" />
          <path style={{ ...dash, transitionDelay: "0.2s" }} d="M95,55 Q120,72 145,55" />
          <line style={{ ...dash, transitionDelay: "0.4s" }} x1="120" y1="70" x2="120" y2="240" strokeDasharray="2 4" />
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">PATTERN · JERSEY</text>
        </svg>
      );
    case "bib":
      return (
        <svg viewBox="0 0 240 280" {...common}>
          <path style={dash} d="M70,40 L70,90 L55,160 L60,240 L110,240 L115,170 L125,170 L130,240 L180,240 L185,160 L170,90 L170,40" />
          <path style={{ ...dash, transitionDelay: "0.2s" }} d="M70,40 L100,30 M170,40 L140,30 M100,30 L140,30" />
          <circle style={{ ...dash, transitionDelay: "0.5s" }} cx="120" cy="180" r="14" strokeDasharray="2 3" />
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">CHAMOIS · ITALIAN</text>
        </svg>
      );
    case "set":
      return (
        <svg viewBox="0 0 280 280" {...common}>
          <g>
            <path style={dash} d="M40,55 L20,72 L10,120 L26,128 L26,200 L100,200 L100,128 L116,120 L106,72 L86,55 Q63,72 40,55 Z" />
          </g>
          <g transform="translate(140 0)">
            <path style={{ ...dash, transitionDelay: "0.3s" }} d="M40,40 L40,82 L28,150 L32,235 L70,235 L72,170 L78,170 L80,235 L118,235 L122,150 L110,82 L110,40" />
          </g>
          <line style={{ ...dash, transitionDelay: "0.6s" }} x1="125" y1="140" x2="155" y2="140" strokeDasharray="2 3" />
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">SYSTEM · MATCHED FIT</text>
        </svg>
      );
    case "shell":
      return (
        <svg viewBox="0 0 240 280" {...common}>
          <path style={dash} d="M75,50 L50,72 L35,135 L58,148 L58,245 L182,245 L182,148 L205,135 L190,72 L165,50 Q120,72 75,50 Z" />
          <path style={{ ...dash, transitionDelay: "0.2s" }} d="M120,55 L120,245" />
          <path style={{ ...dash, transitionDelay: "0.4s" }} d="M58,160 L182,160" strokeDasharray="3 3" />
          <path style={{ ...dash, transitionDelay: "0.6s" }} d="M115,80 L125,80 L125,140 L115,140 Z" />
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">SHELL · 3L · PFC-FREE</text>
        </svg>
      );
    case "base":
      return (
        <svg viewBox="0 0 240 280" {...common}>
          <path style={dash} d="M85,55 L65,72 L55,130 L72,138 L72,235 L168,235 L168,138 L185,130 L175,72 L155,55 Q120,70 85,55 Z" />
          {[80, 110, 140, 170, 200].map((y, i) => (
            <line
              key={y}
              style={{ ...dash, transitionDelay: `${0.2 + i * 0.1}s` }}
              x1="72"
              y1={y}
              x2="168"
              y2={y}
              strokeDasharray="1 3"
            />
          ))}
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">MERINO · 180gsm</text>
        </svg>
      );
    case "cap":
      return (
        <svg viewBox="0 0 240 280" {...common}>
          <path style={dash} d="M50,150 Q120,60 190,150 L190,170 L50,170 Z" />
          <path style={{ ...dash, transitionDelay: "0.3s" }} d="M30,170 L210,170 L200,195 L40,195 Z" />
          <line style={{ ...dash, transitionDelay: "0.5s" }} x1="120" y1="80" x2="120" y2="170" strokeDasharray="2 3" />
          <circle style={{ ...dash, transitionDelay: "0.7s" }} cx="120" cy="100" r="4" />
          <text x="6" y="270" fontSize="8" fill="currentColor" stroke="none" className="font-mono opacity-60">CAP · COTTON TWILL</text>
        </svg>
      );
  }
}
