import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getKitRequest } from "@/server/kit-requests.functions";

export const Route = createFileRoute("/custom-kit/status/$requestId")({
  component: StatusPage,
  loader: async ({ params }) => {
    const res = await getKitRequest({ data: { id: params.requestId } });
    return res;
  },
  head: () => ({
    meta: [
      { title: "Kit Request Status — LILU" },
      { name: "description", content: "Track your custom kit request." },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl mb-4">Couldn't load request</h1>
          <p className="font-mono text-xs text-mist mb-6">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="font-mono text-[11px] uppercase tracking-[0.25em] px-4 py-2 border border-paper/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-ink text-paper flex items-center justify-center">
      <p className="font-mono">Request not found.</p>
    </div>
  ),
});

function StatusPage() {
  const { request } = Route.useLoaderData();
  const params = Route.useParams();

  if (!request) {
    return (
      <div className="min-h-screen bg-ink text-paper">
        <SiteHeader />
        <div className="px-6 md:px-10 py-20">
          <h1 className="font-display text-4xl">Request not found.</h1>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const designs = (request.generated_designs as Array<{ url: string; prompt: string }>) ?? [];
  const idx = request.selected_design_index ?? 0;
  const selected = designs[idx];

  const statusLabel: Record<string, string> = {
    pending: "Pending Review",
    approved: "Approved · Ready to Order",
    rejected: "Not Approved",
    ordered: "Ordered",
    draft: "Draft",
  };
  const statusColor: Record<string, string> = {
    pending: "text-mist",
    approved: "text-sage",
    rejected: "text-red-400",
    ordered: "text-sage",
    draft: "text-mist",
  };

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Request {params.requestId.slice(0, 8)}
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">
          {request.club_name}
        </h1>
        <div className={`mt-6 font-mono text-sm uppercase tracking-[0.25em] ${statusColor[request.status]}`}>
          {statusLabel[request.status] ?? request.status}
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {selected && (
          <div className="border border-paper/15">
            <img src={selected.url} alt="Selected design" className="w-full aspect-square object-cover" />
          </div>
        )}
        <div className="space-y-6 font-mono text-sm">
          <Row k="Customer" v={request.customer_name} />
          <Row k="Email" v={(request as any).customer_email_masked ?? ""} />
          <Row k="Style" v={request.base_style} />
          <Row k="Estimated qty" v={String(request.estimated_qty)} />
          <Row k="Colors" v={[request.primary_color, request.secondary_color, request.accent_color].filter(Boolean).join(" · ")} />
          {request.approved_price_cents != null && (
            <Row k="Approved price" v={`$${(request.approved_price_cents / 100).toFixed(2)} / kit`} />
          )}

          {request.status === "approved" && request.shopify_product_url && (
            <a
              href={request.shopify_product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-sage text-ink hover:bg-mist transition-colors"
            >
              Order on LILU Shop
            </a>
          )}
          {request.status === "pending" && (
            <p className="text-mist">
              We've received your request. You'll get an email from LILU once we've reviewed your
              design.
            </p>
          )}
          {request.status === "rejected" && (
            <p className="text-mist">
              This request wasn't approved. Reach out to atelier@lilu.cc for next steps.
            </p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-paper/10 pb-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-mist">{k}</span>
      <span className="text-paper">{v}</span>
    </div>
  );
}
