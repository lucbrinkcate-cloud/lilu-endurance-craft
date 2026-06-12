import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "velonix:designKitNudge:dismissed";

export function DesignKitNudge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    let shown = false;
    const onScroll = () => {
      if (shown) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const pct = scrolled / total;
      if (pct >= 0.6) {
        shown = true;
        setOpen(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Design your own kit"
          initial={{ opacity: 0, y: 24, x: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-sm z-40 bg-ink border border-sage/60 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute top-2 right-2 min-h-9 min-w-9 inline-flex items-center justify-center text-mist hover:text-paper transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <div className="p-6 pr-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">
              Custom Atelier
            </div>
            <h2 className="font-display text-2xl leading-tight tracking-tight text-paper">
              Ever thought about designing your own kit?
            </h2>
            <p className="mt-2 font-mono text-xs text-mist leading-relaxed">
              Upload your club logo, pick your colors, get four mockups in seconds. No minimums.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/custom-kit"
                onClick={dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.25em] px-4 py-2.5 bg-sage text-ink hover:bg-mist transition-colors"
              >
                Design Your Kit →
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist hover:text-paper transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
