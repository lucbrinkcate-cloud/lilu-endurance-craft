import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "velonix-cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const choose = (v: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60] border border-paper/15 bg-ink/95 backdrop-blur p-5 shadow-2xl"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">Cookies</div>
      <p className="text-paper text-sm leading-relaxed">
        We use essential cookies to run the store and optional analytics to improve it. Read the{" "}
        <Link to="/privacy" className="text-sage underline">privacy policy</Link>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => choose("all")}
          className="font-mono text-[10px] uppercase tracking-[0.25em] bg-paper text-ink px-4 py-2.5 hover:bg-sage transition-colors"
        >
          Accept all
        </button>
        <button
          onClick={() => choose("essential")}
          className="font-mono text-[10px] uppercase tracking-[0.25em] border border-paper/30 text-paper px-4 py-2.5 hover:border-paper transition-colors"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
