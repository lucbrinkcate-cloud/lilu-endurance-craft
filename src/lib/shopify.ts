export const SHOPIFY_DOMAIN = "lilu-engineered-endurance-9srdf.myshopify.com";
export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "9c93ed0384d8d6c1d3a765633647f20b";

export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: T; errors?: Array<{ message: string }> } | null> {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 402) {
    console.error("Shopify: payment required (402). Store needs a paid plan.");
    return null;
  }
  if (!res.ok) return null;
  return (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
}

export function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const u = new URL(checkoutUrl);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return checkoutUrl;
  }
}

export function formatPrice(amount: string, currencyCode: string): string {
  const symbol = currencyCode === "EUR" ? "€" : currencyCode === "USD" ? "$" : currencyCode + " ";
  return `${symbol}${parseFloat(amount).toFixed(2)}`;
}
