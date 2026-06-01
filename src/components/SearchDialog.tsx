import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { storefrontApiRequest } from "@/lib/shopify";

type SearchHit = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
};

const QUERY = `
  query Search($q: String!) {
    products(first: 8, query: $q) {
      edges { node {
        id handle title productType
        images(first: 1) { edges { node { url altText } } }
      } }
    }
  }
`;

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQ("");
      setHits([]);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await storefrontApiRequest<{ products: { edges: Array<{ node: SearchHit }> } }>(
        QUERY,
        { q: `title:*${q}* OR product_type:*${q}* OR vendor:*${q}*` },
      );
      if (cancelled) return;
      setHits((res?.data?.products?.edges ?? []).map((e) => e.node));
      setLoading(false);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-[70] bg-ink/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-ink border border-paper/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) {
              navigate({ to: "/shop", search: { q: q.trim() } as never });
              onClose();
            }
          }}
          className="flex items-center border-b border-paper/15"
        >
          <span className="pl-5 text-sage font-mono text-sm">⌕</span>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jerseys, bibs, gilets…"
            aria-label="Search products"
            className="flex-1 bg-transparent text-paper placeholder:text-mist/50 font-mono text-sm tracking-wide outline-none px-4 py-5"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="px-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mist hover:text-paper"
          >
            Esc
          </button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <div className="p-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
              Type at least 2 characters
            </div>
          ) : loading ? (
            <div className="p-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
              Searching…
            </div>
          ) : hits.length === 0 ? (
            <div className="p-6 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/60">
              No matches for "{q}"
            </div>
          ) : (
            <ul>
              {hits.map((h) => {
                const img = h.images.edges[0]?.node;
                return (
                  <li key={h.id} className="border-b border-paper/10 last:border-0">
                    <Link
                      to="/shop/$handle"
                      params={{ handle: h.handle }}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 hover:bg-paper/5 transition-colors"
                    >
                      <div className="w-14 h-14 bg-paper/5 overflow-hidden shrink-0">
                        {img && (
                          <img src={img.url} alt={img.altText ?? h.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage truncate">
                          {h.productType || "VELONIX"}
                        </div>
                        <div className="font-display text-lg text-paper truncate">{h.title}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
