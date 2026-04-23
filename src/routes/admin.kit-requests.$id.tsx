import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useServerFn } from "@tanstack/react-start";
import {
  adminGetKitRequest,
  approveKitRequest,
  rejectKitRequest,
  verifyAdminPassword,
} from "@/server/kit-requests.functions";

export const Route = createFileRoute("/admin/kit-requests/$id")({
  component: AdminDetailPage,
  head: () => ({ meta: [{ title: "Kit Request — LILU Admin" }] }),
});

const PW_KEY = "lilu-admin-pw";

function AdminDetailPage() {
  const navigate = useNavigate();
  const params = Route.useParams();
  const verify = useServerFn(verifyAdminPassword);
  const get = useServerFn(adminGetKitRequest);
  const approve = useServerFn(approveKitRequest);
  const reject = useServerFn(rejectKitRequest);

  const [pw, setPw] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [req, setReq] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState<number>(185);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;
    if (!stored) {
      navigate({ to: "/admin/kit-requests" });
      return;
    }
    setPw(stored);
    verify({ data: { password: stored } }).then((r) => {
      if (!r.ok) navigate({ to: "/admin/kit-requests" });
      else setAuthed(true);
    });
  }, [navigate, verify]);

  useEffect(() => {
    if (!authed) return;
    get({ data: { password: pw, id: params.id } })
      .then((r) => {
        setReq(r.request);
        if (r.request?.approved_price_cents) {
          setPrice(r.request.approved_price_cents / 100);
        }
        if (r.request?.admin_notes) setNotes(r.request.admin_notes);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [authed, get, params.id, pw]);

  const onApprove = async () => {
    setBusy(true);
    setError(null);
    try {
      await approve({ data: { password: pw, id: params.id, priceUsd: price, notes } });
      const r = await get({ data: { password: pw, id: params.id } });
      setReq(r.request);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setBusy(false);
    }
  };

  const onReject = async () => {
    setBusy(true);
    setError(null);
    try {
      await reject({ data: { password: pw, id: params.id, notes } });
      const r = await get({ data: { password: pw, id: params.id } });
      setReq(r.request);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rejection failed");
    } finally {
      setBusy(false);
    }
  };

  if (!req) {
    return (
      <div className="min-h-screen bg-ink text-paper">
        <SiteHeader />
        <div className="px-6 md:px-10 py-20 font-mono text-sm text-mist">Loading…</div>
      </div>
    );
  }

  const designs = (req.generated_designs as Array<{ url: string; prompt: string }>) ?? [];
  const idx = req.selected_design_index ?? 0;

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-12 pb-6 border-b border-paper/10">
        <Link to="/admin/kit-requests" className="font-mono text-xs text-mist hover:text-sage">
          ← All requests
        </Link>
        <h1 className="font-display text-5xl tracking-tighter mt-4">{req.club_name}</h1>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-sage mt-2">
          {req.status}
        </div>
      </section>

      <section className="px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="grid grid-cols-2 gap-3">
            {designs.map((d, i) => (
              <div
                key={i}
                className={`border-2 ${i === idx ? "border-sage" : "border-paper/15"}`}
              >
                <img src={d.url} alt={`Design ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] p-2 text-mist">
                  {i === idx ? "Customer pick" : `Option ${i + 1}`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist mb-2">
              Logo
            </div>
            <div className="w-32 h-32 border border-paper/20 bg-paper/5 flex items-center justify-center p-3">
              <img src={req.logo_url} alt="logo" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>

        <div className="space-y-6 font-mono text-sm">
          <Row k="Customer" v={req.customer_name} />
          <Row k="Email" v={req.customer_email} />
          <Row k="Estimated qty" v={String(req.estimated_qty)} />
          <Row k="Style" v={req.base_style} />
          <Row k="Colors" v={[req.primary_color, req.secondary_color, req.accent_color].filter(Boolean).join(" · ")} />
          <Row k="Submitted" v={new Date(req.created_at).toLocaleString()} />

          <div className="pt-6 border-t border-paper/10 space-y-4">
            <label className="block">
              <div className="text-[10px] uppercase tracking-[0.25em] text-mist mb-2">
                Price per kit (USD)
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                min={1}
                step={1}
                className="w-full bg-transparent border border-paper/20 px-3 py-2 text-sm text-paper focus:border-sage outline-none"
              />
            </label>
            <label className="block">
              <div className="text-[10px] uppercase tracking-[0.25em] text-mist mb-2">
                Admin notes (private)
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-transparent border border-paper/20 px-3 py-2 text-sm text-paper focus:border-sage outline-none"
              />
            </label>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={onApprove}
                disabled={busy || req.status === "approved"}
                className="font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-sage text-ink disabled:opacity-40"
              >
                {req.status === "approved" ? "Approved" : busy ? "Working…" : "Approve & Create Product"}
              </button>
              <button
                onClick={onReject}
                disabled={busy || req.status === "rejected"}
                className="font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 border border-paper/30 text-paper disabled:opacity-40"
              >
                Reject
              </button>
            </div>
            {req.shopify_product_url && (
              <a
                href={req.shopify_product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-xs text-sage underline"
              >
                View Shopify product →
              </a>
            )}
            {error && <div className="font-mono text-xs text-red-400">{error}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-paper/10 pb-2">
      <span className="text-[10px] uppercase tracking-[0.25em] text-mist">{k}</span>
      <span className="text-paper text-right">{v}</span>
    </div>
  );
}
