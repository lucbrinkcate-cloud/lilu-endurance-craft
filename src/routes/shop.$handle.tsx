import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useRef, useState } from "react";

const SHOPIFY_DOMAIN = "lilu-engineered-endurance-9srdf.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "9c93ed0384d8d6c1d3a765633647f20b";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
};

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description: string;
  descriptionHtml: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: Variant }> };
  options: Array<{ name: string; values: string[] }>;
};

const PRODUCT_QUERY = `
  query Product($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      productType
      description
      descriptionHtml
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 8) { edges { node { url altText } } }
      options { name values }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

async function storefront<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data as T;
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const u = new URL(checkoutUrl);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return checkoutUrl;
  }
}

export const Route = createFileRoute("/shop/$handle")({
  loader: async ({ params }) => {
    const data = await storefront<{ productByHandle: ShopifyProduct | null }>(
      PRODUCT_QUERY,
      { handle: params.handle },
    );
    const product = data?.productByHandle;
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-5xl md:text-7xl">Out of stock.</h1>
        <p className="mt-4 text-mist">This piece isn't in the field kit.</p>
        <Link to="/shop" className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-sage">
          Back to Shop →
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
      <p className="text-mist">Error: {error.message}</p>
    </div>
  ),
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name ?? p.title} — LILU` : "LILU Shop";
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "LILU cycling apparel." },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.description ?? "" },
      ],
    };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const variants = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);

  // Find first option (usually Size) for selection
  const sizeOption = product.options.find((o) => /size/i.test(o.name)) ?? product.options[0];
  const initialVariant = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(initialVariant?.id ?? "");
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? initialVariant;
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const price = selectedVariant
    ? `${selectedVariant.price.currencyCode === "EUR" ? "€" : selectedVariant.price.currencyCode + " "}${parseFloat(selectedVariant.price.amount).toFixed(0)}`
    : "—";

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setLoading(true);
    try {
      const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: Array<{ message: string }> } }>(
        CART_CREATE,
        { input: { lines: [{ quantity: 1, merchandiseId: selectedVariant.id }] } },
      );
      const url = data?.cartCreate?.cart?.checkoutUrl;
      if (url) {
        window.open(formatCheckoutUrl(url), "_blank");
      } else {
        const msg = data?.cartCreate?.userErrors?.[0]?.message ?? "Could not start checkout.";
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      <div className="px-6 md:px-12 pt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
        <Link to="/shop" className="hover:text-sage">← Shop</Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Gallery */}
        <div className="lg:sticky lg:top-20 lg:h-[80vh] flex flex-col">
          <div className="relative flex-1 aspect-square lg:aspect-auto bg-gradient-to-br from-forest/30 to-ink overflow-hidden">
            {images[activeImage] ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-display text-[20vw] text-paper/10">
                {product.title.charAt(0)}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-px bg-paper/10 mt-px">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square relative overflow-hidden transition-opacity ${
                    activeImage === i ? "opacity-100 ring-1 ring-inset ring-sage" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-6 md:px-12 py-16 lg:sticky lg:top-20 lg:h-fit">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sage mb-4">
            {product.productType || "LILU"}
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            {product.title}
          </h1>
          <div className="mt-4 font-mono text-2xl text-mist">{price}</div>
          {product.description && (
            <p className="mt-8 max-w-md text-mist leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {sizeOption && sizeOption.values.length > 1 && (
            <div className="mt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
                {sizeOption.name}
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizeOption.values.map((val) => {
                  const variant = variants.find((v) =>
                    v.selectedOptions.some((o) => o.name === sizeOption.name && o.value === val),
                  );
                  if (!variant) return null;
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={!variant.availableForSale}
                      className={`font-mono text-xs uppercase tracking-[0.2em] min-w-12 h-12 px-3 border transition-colors ${
                        isSelected
                          ? "border-sage bg-sage text-ink"
                          : variant.availableForSale
                          ? "border-paper/20 hover:border-paper/60"
                          : "border-paper/10 text-mist/30 line-through cursor-not-allowed"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            ref={ctaRef}
            onClick={handleBuyNow}
            disabled={loading || !selectedVariant?.availableForSale}
            className="mt-8 w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] py-5 hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Opening checkout…"
              : selectedVariant?.availableForSale
              ? `Buy Now — ${price}`
              : "Sold out"}
          </button>

          <ul className="mt-6 grid grid-cols-1 gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/80">
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">◇</span>
              Free EU shipping over €150 · 3–5 day delivery
            </li>
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">↺</span>
              30-day free returns · unworn, tags on
            </li>
            <li className="flex items-center gap-3 border border-paper/10 bg-paper/[0.02] px-3 py-2.5">
              <span className="text-sage">∞</span>
              Lifetime free crash repair on every garment
            </li>
          </ul>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
