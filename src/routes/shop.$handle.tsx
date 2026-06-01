import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useRef, useState } from "react";
import { storefrontApiRequest, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

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

async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  const res = await storefrontApiRequest<{ productByHandle: ShopifyProduct | null }>(
    PRODUCT_QUERY,
    { handle },
  );
  return res?.data?.productByHandle ?? null;
}


export const Route = createFileRoute("/shop/$handle")({
  loader: async ({ params }): Promise<{ product: ShopifyProduct }> => {
    const product = await fetchProduct(params.handle);
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
    const title = p ? `${p.title} — VELONIX` : "VELONIX Shop";
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "VELONIX cycling apparel." },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.description ?? "" },
      ],
    };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: ShopifyProduct };
  const variants: Variant[] = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);

  const sizeOption = product.options.find((o) => /size/i.test(o.name)) ?? product.options[0];
  const initialVariant = variants.find((v) => v.availableForSale) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(initialVariant?.id ?? "");
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? initialVariant;
  const [activeImage, setActiveImage] = useState(0);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const price = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : "—";

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      imageUrl: images[0]?.url ?? null,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
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
            {product.productType || "VELONIX"}
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tighter">
            {product.title}
          </h1>
          <div className="mt-4 flex items-baseline gap-4">
            <div className="font-mono text-2xl text-mist">{price}</div>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5 ${
                selectedVariant?.availableForSale ? "text-sage" : "text-mist/60"
              }`}
            >
              <span aria-hidden="true">{selectedVariant?.availableForSale ? "●" : "○"}</span>
              {selectedVariant?.availableForSale ? "In stock · ships in 24h" : "Sold out"}
            </span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/70">
            EU delivery 3–5 days · Worldwide 5–10 days
          </div>
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
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="mt-8 w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] py-5 hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Adding…"
              : selectedVariant?.availableForSale
              ? `Add to Cart — ${price}`
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

      <ProductDetailSections product={product} />

      <SiteFooter />
    </div>
  );
}

const SIZE_CHART: Array<{ size: string; chest: string; waist: string; height: string }> = [
  { size: "XS", chest: "84–88", waist: "70–74", height: "165–170" },
  { size: "S", chest: "89–93", waist: "75–79", height: "170–175" },
  { size: "M", chest: "94–98", waist: "80–84", height: "175–180" },
  { size: "L", chest: "99–103", waist: "85–89", height: "180–185" },
  { size: "XL", chest: "104–108", waist: "90–94", height: "185–190" },
  { size: "XXL", chest: "109–114", waist: "95–100", height: "190–195" },
];

function inferMaterials(product: ShopifyProduct): Array<{ label: string; value: string }> {
  const type = (product.productType || "").toLowerCase();
  if (type.includes("bib") || type.includes("short")) {
    return [
      { label: "Main Fabric", value: "78% Recycled Polyamide · 22% Elastane" },
      { label: "Chamois", value: "Italian high-density foam · 8h endurance pad" },
      { label: "Bib Straps", value: "Laser-cut mesh, raw-edge finish" },
      { label: "Weight", value: "182 g (size M)" },
    ];
  }
  if (type.includes("jacket") || type.includes("shell") || type.includes("gilet")) {
    return [
      { label: "Outer Shell", value: "3-layer recycled ripstop · 10K/10K membrane" },
      { label: "Lining", value: "Brushed merino blend · 140 gsm" },
      { label: "Sealing", value: "Taped seams · YKK Aquaguard zips" },
      { label: "Weight", value: "248 g (size M)" },
    ];
  }
  // Jersey / default
  return [
    { label: "Main Fabric", value: "82% Recycled Polyester · 18% Elastane" },
    { label: "Side Panels", value: "Engineered mesh · ventilated weave" },
    { label: "Trims", value: "Silicone gripper hem · YKK® camlock zipper" },
    { label: "Weight", value: "138 g (size M)" },
  ];
}

function ProductDetailSections({ product }: { product: ShopifyProduct }) {
  const materials = inferMaterials(product);

  return (
    <div className="border-t border-paper/10">
      {/* Sizing */}
      <section className="px-6 md:px-12 py-20 border-b border-paper/10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage mb-4">
              01 / Sizing
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-tighter">
              Cut for the long ride.
            </h2>
            <p className="mt-6 text-mist text-sm leading-relaxed max-w-sm">
              Race-fit through the torso, easy at the shoulder. Measurements are body
              dimensions in centimetres — not garment. Between sizes, size down for race,
              up for endurance.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px] uppercase tracking-[0.15em]">
              <thead>
                <tr className="border-b border-paper/20 text-sage">
                  <th className="text-left py-3 pr-4 font-normal">Size</th>
                  <th className="text-left py-3 pr-4 font-normal">Chest (cm)</th>
                  <th className="text-left py-3 pr-4 font-normal">Waist (cm)</th>
                  <th className="text-left py-3 font-normal">Height (cm)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-paper/10 text-mist">
                    <td className="py-3 pr-4 text-paper">{row.size}</td>
                    <td className="py-3 pr-4">{row.chest}</td>
                    <td className="py-3 pr-4">{row.waist}</td>
                    <td className="py-3">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="px-6 md:px-12 py-20 border-b border-paper/10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage mb-4">
              02 / Materials & Construction
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-tighter">
              Engineered, not assembled.
            </h2>
            <p className="mt-6 text-mist text-sm leading-relaxed max-w-sm">
              Every panel is mapped to the body's heat zones. Recycled fibres from
              certified European mills, bonded seams where chafe lives, and trims
              spec'd to outlast the garment.
            </p>
          </div>
          <dl className="grid sm:grid-cols-2 gap-px bg-paper/10">
            {materials.map((m) => (
              <div key={m.label} className="bg-ink p-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-sage mb-2">
                  {m.label}
                </dt>
                <dd className="font-display text-xl leading-tight text-paper">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Brand story */}
      <section className="px-6 md:px-12 py-24 bg-gradient-to-b from-forest/10 to-transparent">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage mb-4">
            03 / The VELONIX Story
          </div>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tighter">
            Built in the Ardennes. Ridden everywhere.
          </h2>
          <div className="mt-8 space-y-5 text-mist leading-relaxed max-w-2xl">
            <p>
              VELONIX began on a wet October climb above Stavelot — three riders, two
              broken zippers, and one shared refusal to keep buying disposable kit. We
              set out to build cycling apparel that survives a decade of weather and a
              decade of washing, then comes back for more.
            </p>
            <p>
              Every garment is engineered with European mills we visit in person,
              cut in small batches, and backed by lifetime free crash repair. No
              seasonal drops. No marketing math. Just kit that earns the next ride.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mist/80">
            <span className="border border-paper/20 px-3 py-2">Made in EU</span>
            <span className="border border-paper/20 px-3 py-2">Lifetime Repair</span>
            <span className="border border-paper/20 px-3 py-2">Small-batch</span>
            <span className="border border-paper/20 px-3 py-2">Recycled Fibres</span>
          </div>
        </div>
      </section>
    </div>
  );
}
