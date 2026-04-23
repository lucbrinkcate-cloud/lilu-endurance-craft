import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { uploadClubLogo } from "@/lib/upload-logo";
import { useServerFn } from "@tanstack/react-start";
import { generateKitDesigns, submitKitRequest } from "@/server/kit-requests.functions";
import { motion } from "framer-motion";

export const Route = createFileRoute("/custom-kit")({
  component: CustomKitPage,
  head: () => ({
    meta: [
      { title: "Design Your Club Kit — LILU" },
      {
        name: "description",
        content:
          "Upload your club logo and let LILU's design tool generate custom cycling kit mockups. No minimums.",
      },
      { property: "og:title", content: "Design Your Club Kit — LILU" },
      {
        property: "og:description",
        content: "Upload your logo, generate custom kit designs, order through LILU.",
      },
    ],
  }),
});

const STYLES = ["Road", "Gravel", "Classic"] as const;
type Style = (typeof STYLES)[number];

function CustomKitPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generateKitDesigns);
  const submit = useServerFn(submitKitRequest);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [style, setStyle] = useState<Style>("Road");
  const [primary, setPrimary] = useState("#1a3c2a");
  const [secondary, setSecondary] = useState("#5a8a5c");
  const [accent, setAccent] = useState("#a0c49d");

  const [designs, setDesigns] = useState<{ url: string; prompt: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  const [clubName, setClubName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogoFile = async (file: File) => {
    setError(null);
    setLogoUploading(true);
    try {
      const url = await uploadClubLogo(file);
      setLogoUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  const onGenerate = async () => {
    if (!logoUrl) {
      setError("Upload a logo first.");
      return;
    }
    setError(null);
    setGenerating(true);
    setDesigns([]);
    setSelected(null);
    try {
      const res = await generate({
        data: {
          logoUrl,
          baseStyle: style,
          primaryColor: primary,
          secondaryColor: secondary,
          accentColor: accent,
        },
      });
      setDesigns(res.designs);
      if (res.designs.length > 0) setSelected(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrl || selected === null || designs.length === 0) {
      setError("Generate and select a design first.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          customerEmail: email,
          customerName: name,
          clubName,
          estimatedQty: qty,
          logoUrl,
          baseStyle: style,
          primaryColor: primary,
          secondaryColor: secondary,
          accentColor: accent,
          generatedDesigns: designs,
          selectedDesignIndex: selected,
        },
      });
      navigate({ to: "/custom-kit/status/$requestId", params: { requestId: res.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Custom Atelier / Club Program
        </div>
        <h1 className="font-display text-5xl md:text-8xl leading-[0.85] tracking-tighter">
          Design Your Kit.
        </h1>
        <p className="mt-6 max-w-xl font-mono text-sm text-mist">
          Upload your club logo. Our design tool generates four kit mockups in your colors. Pick one,
          submit for review, and order once we approve. No minimums.
        </p>
      </section>

      {/* Step 1: Logo */}
      <section className="px-6 md:px-10 py-12 border-b border-paper/10">
        <StepHeader n="01" title="Upload your logo" />
        <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
          <label className="flex-1 border border-dashed border-paper/30 hover:border-sage transition-colors cursor-pointer p-10 text-center block">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onLogoFile(f);
              }}
            />
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-mist">
              {logoUploading ? "Uploading…" : "Drop / pick PNG · JPG · WEBP · SVG · max 5MB"}
            </div>
          </label>
          {logoUrl && (
            <div className="w-32 h-32 border border-paper/20 bg-paper/5 flex items-center justify-center p-3">
              <img src={logoUrl} alt="Club logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </section>

      {/* Step 2: Style + colors */}
      <section className="px-6 md:px-10 py-12 border-b border-paper/10">
        <StepHeader n="02" title="Pick a base style and your colors" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist mb-3">
              Base style
            </div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
                    style === s
                      ? "border-sage bg-sage text-ink"
                      : "border-paper/20 text-mist hover:border-paper/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ColorField label="Primary" value={primary} onChange={setPrimary} />
            <ColorField label="Secondary" value={secondary} onChange={setSecondary} />
            <ColorField label="Accent" value={accent} onChange={setAccent} />
          </div>
        </div>
      </section>

      {/* Step 3: Generate */}
      <section className="px-6 md:px-10 py-12 border-b border-paper/10">
        <StepHeader n="03" title="Generate four mockups" />
        <button
          onClick={onGenerate}
          disabled={generating || !logoUrl}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-sage text-ink hover:bg-mist transition-colors disabled:opacity-40"
        >
          {generating ? "Generating… (~30s)" : "Generate Designs"}
        </button>

        {designs.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {designs.map((d, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(i)}
                className={`relative border-2 transition-colors text-left ${
                  selected === i ? "border-sage" : "border-paper/15 hover:border-paper/40"
                }`}
              >
                <img src={d.url} alt={`Design ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-[0.25em] bg-ink/80 px-2 py-1">
                  {selected === i ? "Selected" : `Option ${String(i + 1).padStart(2, "0")}`}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* Step 4: Submit */}
      <section className="px-6 md:px-10 py-12 border-b border-paper/10">
        <StepHeader n="04" title="Submit for review" />
        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <Field label="Club name" value={clubName} onChange={setClubName} required />
          <Field label="Your name" value={name} onChange={setName} required />
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field
            label="Estimated quantity"
            type="number"
            value={String(qty)}
            onChange={(v) => setQty(Math.max(1, parseInt(v) || 1))}
            required
          />
          <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
            <div className="font-mono text-xs text-mist">
              Indicative price · <span className="text-sage">$185 / kit</span> — final price set on
              approval.
            </div>
            <button
              type="submit"
              disabled={submitting || selected === null}
              className="font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-paper text-ink hover:bg-sage transition-colors disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
          {error && (
            <div className="md:col-span-2 font-mono text-xs text-red-400">{error}</div>
          )}
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}

function StepHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[11px] tracking-[0.25em] text-sage">{n}</span>
      <h2 className="font-display text-3xl md:text-5xl tracking-tighter">{title}</h2>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist mb-2">
        {label}
      </div>
      <div className="flex items-center gap-2 border border-paper/20 p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent font-mono text-xs text-paper outline-none"
        />
      </div>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist mb-2">
        {label}
      </div>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-paper/20 px-3 py-2 font-mono text-sm text-paper focus:border-sage outline-none"
      />
    </label>
  );
}
