import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SHOPIFY_DOMAIN = "lilu-engineered-endurance-9srdf.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "9c93ed0384d8d6c1d3a765633647f20b";

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
};

const PRODUCTS_QUERY = `
  query {
    products(first: 50, query: "vendor:LILU") {
      edges {
        node {
          id
          handle
          title
          productType
          description
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { edges { node { url altText } } }
        }
      }
    }
  }
`;

async function fetchProducts(): Promise<ShopifyProduct[]> {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data?.products?.edges ?? []).map((e: { node: ShopifyProduct }) => e.node);
}

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop — LILU" },
      { name: "description", content: "Cycling apparel engineered for continuous endurance." },
      { property: "og:title", content: "Shop — LILU" },
      { property: "og:description", content: "Cycling apparel engineered for continuous endurance." },
    ],
  }),
});

function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <section className="px-6 md:px-10 pt-20 pb-12 border-b border-paper/10">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
          Volume 04 / Spring Field Kit
        </div>
        <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tighter">
          The Shop.
        </h1>
        <p className="mt-6 max-w-xl text-mist font-mono text-sm leading-relaxed">
          Each piece engineered against a single failure mode of the long ride.
          Click any product to view it in the store.
        </p>
      </section>

      {products === null ? (
        <div className="px-6 md:px-10 py-32 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
          Loading catalogue…
        </div>
      ) : products.length === 0 ? (
        <div className="px-6 md:px-10 py-32 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
          No products found.
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
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
  const url = `https://${SHOPIFY_DOMAIN}/products/${product.handle}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="group border-b border-r border-paper/10 relative block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-forest/30 to-ink">
        {images[0] && (
          <img
            src={images[0].url}
            alt={images[0].altText ?? product.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hover && images[1] ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
        {images[1] && (
          <img
            src={images[1].url}
            alt={images[1].altText ?? product.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-paper mix-blend-difference">
          <span>{product.productType || "LILU"}</span>
          <span>{currency}{price}</span>
        </div>
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
    </motion.a>
  );
}
