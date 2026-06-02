import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
};

const PRODUCTS_QUERY = `
  query {
    products(first: 50, query: "vendor:VELONIX") {
      edges {
        node {
          id
          handle
          title
          productType
          description
          availableForSale
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { edges { node { url altText } } }
        }
      }
    }
  }
`;

async function fetchProducts(): Promise<ShopifyProduct[]> {
  const res = await storefrontApiRequest<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(PRODUCTS_QUERY);
  return (res?.data?.products?.edges ?? []).map((e) => e.node);
}

type ShopSearch = { q?: string; type?: string };

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — VELONIX" },
      { name: "description", content: "Cycling apparel engineered for continuous endurance. Browse the VELONIX field kit: jerseys, bibs, gilets, jackets." },
      { property: "og:title", content: "Shop — VELONIX" },
      { property: "og:description", content: "Cycling apparel engineered for continuous endurance." },
    ],
    links: [{ rel: "canonical", href: "https://velonix.lovable.app/shop" }],
  }),
});

function ShopPage() {
  const search = Route.useSearch();
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const types = useMemo(() => {
    if (!products) return [];
    const set = new Set<string>();
    products.forEach((p) => p.productType && set.add(p.productType));
    return Array.from(set).sort();
  }, [products]);

  const visible = useMemo(() => {
    if (!products) return null;
    const q = search.q?.toLowerCase().trim();
    const t = search.type?.toLowerCase().trim();
    return products.filter((p) => {
      if (t && p.productType.toLowerCase() !== t) return false;
      if (q && !`${p.title} ${p.productType} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search.q, search.type]);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-10 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-sage">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-paper">Shop</li>
          {search.type && (
            <>
              <li aria-hidden="true">/</li>
              <li className="text-paper">{search.type}</li>
            </>
          )}
        </ol>
      </nav>

      <section className="px-6 md:px-10 pt-6 pb-10 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Volume 04 / Spring Field Kit
        </div>
        <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tighter">
          The Shop.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          Each piece engineered against a single failure mode of the long ride.
        </p>

        {/* Filters */}
        {types.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            <Link
              to="/shop"
              search={{}}
              className={`font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-2 border transition-colors ${
                !search.type ? "border-sage bg-sage text-ink" : "border-paper/20 text-paper hover:border-paper/60"
              }`}
            >
              All
            </Link>
            {types.map((t) => {
              const active = search.type?.toLowerCase() === t.toLowerCase();
              return (
                <Link
                  key={t}
                  to="/shop"
                  search={{ type: t }}
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-2 border transition-colors ${
                    active ? "border-sage bg-sage text-ink" : "border-paper/20 text-paper hover:border-paper/60"
                  }`}
                >
                  {t}
                </Link>
              );
            })}
            {search.q && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist ml-2">
                Search: "{search.q}" ·{" "}
                <Link to="/shop" search={{}} className="text-sage underline">Clear</Link>
              </span>
            )}
          </div>
        )}
      </section>

      {visible === null ? (
        <div className="px-6 md:px-10 py-32 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
          Loading catalogue…
        </div>
      ) : visible.length === 0 ? (
        <div className="px-6 md:px-10 py-32 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
          No products match your filters.{" "}
          <Link to="/shop" search={{}} className="text-sage underline">Reset</Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" aria-label="Products">
          {visible.map((p, i) => (
            <ProductTile key={p.id} product={p} index={i} />
          ))}
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function ProductTile({ product, index }: { product: ShopifyProduct; index: number }) {
  const images = product.images.edges.map((e) => e.node);
  const [hover, setHover] = useState(false);
  const price = parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0);
  const currency = product.priceRange.minVariantPrice.currencyCode === "EUR" ? "€" : product.priceRange.minVariantPrice.currencyCode + " ";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="group border-b border-r border-paper/10 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        to="/shop/$handle"
        params={{ handle: product.handle }}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[-2px]"
      >
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-forest/30 to-ink">
          {images[0] && (
            <img
              src={images[0].url}
              alt={images[0].altText ?? `${product.title} — VELONIX ${product.productType || "cycling apparel"}`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                hover && images[1] ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
          {images[1] && (
            <img
              src={images[1].url}
              alt=""
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                hover ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute top-4 left-4 right-4 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-paper mix-blend-difference">
            <span>{product.productType || "VELONIX"}</span>
            <span>{currency}{price}</span>
          </div>

          {!product.availableForSale && (
            <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] bg-ink/80 text-paper px-2 py-1 border border-paper/20">
              Sold out
            </span>
          )}
        </div>

        <div className="p-6 flex items-baseline justify-between border-t border-paper/10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
              {product.productType}
            </div>
            <div className="font-display text-2xl">{product.title}</div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60 group-hover:text-sage transition-colors">
            View →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
