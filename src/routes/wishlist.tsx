import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useWishlistStore } from "@/stores/wishlistStore";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Your Saved Designs — VELONIX" },
      {
        name: "description",
        content: "Your saved custom kit designs, ready to revisit and submit for production.",
      },
      { property: "og:title", content: "Your Saved Designs — VELONIX" },
      {
        property: "og:description",
        content: "Saved custom cycling kit designs from the VELONIX Atelier.",
      },
    ],
  }),
});

function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Atelier / Saved Designs
        </div>
        <h1 className="font-display text-5xl md:text-8xl leading-[0.85] tracking-tighter">
          Your Wishlist.
        </h1>
        <p className="mt-6 max-w-xl font-mono text-sm text-mist">
          Designs you've saved. Stored on this device. Pick one to load it back into the design tool
          and submit your order.
        </p>
      </section>

      {items.length === 0 ? (
        <div className="px-6 md:px-10 py-32 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
            No saved designs yet.
          </div>
          <Link
            to="/custom-kit"
            className="inline-block mt-6 font-mono text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-sage text-ink hover:bg-mist transition-colors"
          >
            Design Your Kit →
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/10">
          {items.map((item) => (
            <article key={item.id} className="bg-ink p-6 flex flex-col">
              <div className="aspect-square w-full overflow-hidden bg-paper/5 mb-4">
                <img src={item.imageUrl} alt={`Saved design ${item.baseStyle}`} className="w-full h-full object-cover" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                {item.baseStyle}
              </div>
              <div className="font-mono text-[10px] text-mist mb-4">
                Saved {new Date(item.savedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Swatch color={item.primary} label="Primary" />
                <Swatch color={item.secondary} label="Secondary" />
                <Swatch color={item.accent} label="Accent" />
              </div>
              <div className="mt-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate({ to: "/custom-kit", search: { fromWishlist: item.id } as never })
                  }
                  className="flex-1 font-mono text-[11px] uppercase tracking-[0.25em] px-4 py-2.5 bg-sage text-ink hover:bg-mist transition-colors text-center"
                >
                  Use Design
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Remove from wishlist"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] px-3 py-2.5 border border-paper/20 text-mist hover:text-paper hover:border-paper/60 transition-colors"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="w-6 h-6 border border-paper/20"
      style={{ background: color }}
      title={`${label}: ${color}`}
      aria-label={`${label} ${color}`}
    />
  );
}
