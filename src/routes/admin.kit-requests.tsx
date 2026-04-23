import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useServerFn } from "@tanstack/react-start";
import { listKitRequests, verifyAdminPassword } from "@/server/kit-requests.functions";

export const Route = createFileRoute("/admin/kit-requests")({
  component: AdminListPage,
  head: () => ({ meta: [{ title: "Admin · Kit Requests — LILU" }] }),
});

const PW_KEY = "lilu-admin-pw";
const STATUSES = ["all", "pending", "approved", "rejected", "ordered"] as const;

function AdminListPage() {
  const verify = useServerFn(verifyAdminPassword);
  const list = useServerFn(listKitRequests);

  const [pw, setPw] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("pending");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;
    if (stored) {
      setPw(stored);
      verify({ data: { password: stored } })
        .then((r) => {
          if (r.ok) setAuthed(true);
          else sessionStorage.removeItem(PW_KEY);
        })
        .catch(() => sessionStorage.removeItem(PW_KEY));
    }
  }, [verify]);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    list({ data: { password: pw, status: filter } })
      .then((r) => setRequests(r.requests))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [authed, filter, list, pw]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = await verify({ data: { password: pw } });
      if (r.ok) {
        sessionStorage.setItem(PW_KEY, pw);
        setAuthed(true);
      } else {
        setError("Wrong password.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink text-paper">
        <SiteHeader />
        <div className="px-6 md:px-10 py-20 max-w-md">
          <h1 className="font-display text-4xl mb-6">Admin Access</h1>
          <form onSubmit={onLogin} className="space-y-4">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-transparent border border-paper/20 px-3 py-2 font-mono text-sm text-paper focus:border-sage outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-sage text-ink"
            >
              Sign In
            </button>
            {error && <div className="font-mono text-xs text-red-400">{error}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-16 pb-8 border-b border-paper/10">
        <h1 className="font-display text-5xl tracking-tighter">Kit Requests</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
                filter === s
                  ? "border-sage bg-sage text-ink"
                  : "border-paper/20 text-mist hover:border-paper/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>
      <section className="px-6 md:px-10 py-8">
        {loading && <div className="font-mono text-sm text-mist">Loading…</div>}
        {error && <div className="font-mono text-xs text-red-400">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((r) => {
            const designs = (r.generated_designs as Array<{ url: string }>) ?? [];
            const idx = r.selected_design_index ?? 0;
            const cover = designs[idx]?.url;
            return (
              <Link
                key={r.id}
                to="/admin/kit-requests/$id"
                params={{ id: r.id }}
                className="border border-paper/15 hover:border-sage transition-colors block"
              >
                {cover && <img src={cover} alt="" className="w-full aspect-square object-cover" />}
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage">
                    {r.status}
                  </div>
                  <div className="font-display text-xl mt-1">{r.club_name}</div>
                  <div className="font-mono text-xs text-mist mt-1">
                    {r.customer_name} · qty {r.estimated_qty} · {r.base_style}
                  </div>
                  <div className="font-mono text-[10px] text-mist mt-2">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
              </Link>
            );
          })}
          {!loading && requests.length === 0 && (
            <div className="font-mono text-sm text-mist">No requests in this view.</div>
          )}
        </div>
      </section>
    </div>
  );
}
