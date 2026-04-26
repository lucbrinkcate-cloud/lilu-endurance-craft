import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/help/size-guide")({
  component: SizeGuidePage,
  head: () => ({
    meta: [
      { title: "Size Guide — LILU" },
      { name: "description", content: "Race-cut sizing for jerseys, bibs, and outerwear. Measurements in cm, with rider-tested fit notes." },
      { property: "og:title", content: "Size Guide — LILU" },
      { property: "og:description", content: "Race-cut sizing for jerseys, bibs, and outerwear." },
    ],
  }),
});

const JERSEY_ROWS = [
  ["XS", "168–172", "82–86", "70–74"],
  ["S", "172–177", "86–92", "74–80"],
  ["M", "177–182", "92–98", "80–86"],
  ["L", "182–187", "98–104", "86–92"],
  ["XL", "187–192", "104–110", "92–98"],
  ["XXL", "192–197", "110–118", "98–106"],
];

const BIB_ROWS = [
  ["XS", "168–172", "70–74", "82–86"],
  ["S", "172–177", "74–80", "86–92"],
  ["M", "177–182", "80–86", "92–98"],
  ["L", "182–187", "86–92", "98–104"],
  ["XL", "187–192", "92–98", "104–110"],
  ["XXL", "192–197", "98–106", "110–118"],
];

function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-16 border-b border-paper/10 max-w-4xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Help / Fit · DOC-S02
        </div>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tighter">
          Size Guide.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          LILU is cut race. Measure on bare skin, exhale, do not pull tight. Between sizes? Size down for race feel, up for endurance.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-5xl">
        <SizeTable
          title="Jerseys & Outerwear"
          headers={["Size", "Height (cm)", "Chest (cm)", "Waist (cm)"]}
          rows={JERSEY_ROWS}
        />
        <div className="mt-16">
          <SizeTable
            title="Bib Shorts"
            headers={["Size", "Height (cm)", "Waist (cm)", "Hip (cm)"]}
            rows={BIB_ROWS}
          />
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 border-t border-paper/10 pt-10">
          <FitNote label="Jerseys" body="Snug across the chest, no flap at the waist when in the drops. Sleeves end mid-bicep." />
          <FitNote label="Bibs" body="Compression should feel firm but never numb. Straps sit flat over the shoulder, no dig." />
          <FitNote label="Shells" body="Cut to layer over a long-sleeve jersey + base. If you ride bare-armed, size down one." />
        </div>

        <p className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-mist">
          Still unsure? Email <a className="text-sage underline" href="mailto:fit@lilucycling.com">fit@lilucycling.com</a> with your measurements — we reply within 24h.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function SizeTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-3">Table</div>
      <h2 className="font-display text-3xl mb-6">{title}</h2>
      <div className="overflow-x-auto border border-paper/10">
        <table className="w-full font-mono text-xs">
          <thead className="border-b border-paper/10 bg-paper/[0.02]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left py-3 px-4 uppercase tracking-[0.2em] text-sage font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-paper/5 last:border-0 hover:bg-paper/[0.02]">
                {r.map((cell, j) => (
                  <td key={j} className={`py-3 px-4 ${j === 0 ? "text-paper" : "text-mist"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FitNote({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">{label}</div>
      <p className="text-sm leading-relaxed text-mist">{body}</p>
    </div>
  );
}
