import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSection({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase(), source });
    if (error) {
      if (error.code === "23505") {
        setStatus("ok");
        setMessage("You're already on the list. Welcome back.");
      } else {
        setStatus("error");
        setMessage("Something broke. Try again in a moment.");
      }
      return;
    }
    setStatus("ok");
    setMessage("On the list. First field notes drop in your inbox shortly.");
    setEmail("");
  }

  return (
    <section className="relative bg-ink text-paper border-y border-paper/10 overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--paper, #f5f3ee) 1px, transparent 1px), linear-gradient(to bottom, var(--paper, #f5f3ee) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative px-6 md:px-12 py-24 md:py-32 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-5">
            Dispatch · 01 / The List
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.85] tracking-tighter">
            Field notes from <br />
            <span className="text-sage">the long road.</span>
          </h2>
          <p className="mt-6 max-w-md text-mist font-mono text-sm leading-relaxed">
            One dispatch a month. New drops, ride invitations, repair guides. No noise. Unsubscribe with a single click.
          </p>
        </div>

        <div className="md:col-span-5">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-paper/20 bg-paper/[0.02] backdrop-blur-sm p-6 md:p-8"
          >
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mist mb-3">
              Subscriber / Input
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.cc"
                disabled={status === "loading"}
                className="flex-1 bg-transparent border-b border-paper/30 focus:border-sage outline-none text-paper placeholder:text-mist/40 font-mono text-sm py-3 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "ok"}
                className="font-mono text-[11px] uppercase tracking-[0.25em] bg-sage text-ink px-6 py-3 hover:bg-paper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending…" : status === "ok" ? "On the list ✓" : "Subscribe →"}
              </button>
            </div>
            {message && (
              <p
                className={`mt-4 font-mono text-[10px] uppercase tracking-[0.2em] ${
                  status === "error" ? "text-red-400" : "text-sage"
                }`}
              >
                {message}
              </p>
            )}
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/50">
              No spam. No resale. GDPR compliant.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
