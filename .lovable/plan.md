## Goal

Keep customers on the Velonix site while browsing, then send them to Shopify's secure checkout when they're ready to pay. Replace the current one-shot "Buy Now" flow with a real cart that holds multiple items across pages and sessions.

## What changes for the user

- **Shop page** (`/shop`): each product tile gets a quick **Add to Cart** button (size still picked on the detail page when there are variants). Clicking the tile still opens the Velonix product page.
- **Product page** (`/shop/[handle]`): "Buy Now" becomes **Add to Cart**. After adding, a small cart drawer slides in from the right confirming the item.
- **Header**: the current "Cart [0]" placeholder becomes a real cart icon with a live item count. Clicking it opens the cart drawer from any page.
- **Cart drawer**: shows each item (image, title, size, price), lets the customer change quantity or remove items, shows the subtotal, and has one big **Checkout with Shopify** button that opens Shopify's secure checkout in a new tab.
- **After checkout**: when the customer comes back to the tab, the cart auto-clears if the order completed on Shopify.

## What changes under the hood

1. **Cart state store** (`src/stores/cartStore.ts`, new file using Zustand)
   - Holds `items`, `cartId`, `checkoutUrl`, plus `isLoading` / `isSyncing` flags.
   - Persists to `localStorage` so the cart survives refresh.
   - Talks to Shopify's Storefront API via four mutations: `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`. First add creates the cart; later adds/updates/removes hit the existing cart.
   - Clears itself automatically if Shopify reports "cart not found" (e.g. after checkout completes).

2. **Shopify API helper** (`src/lib/shopify.ts`, new file)
   - Centralises the existing `SHOPIFY_DOMAIN`, `SHOPIFY_STOREFRONT_URL`, `SHOPIFY_STOREFRONT_TOKEN` constants currently duplicated in `shop.tsx` and `shop.$handle.tsx`.
   - Exports a single `storefrontApiRequest(query, variables)` helper used by the store and the existing fetches.
   - Always appends `channel=online_store` to the checkout URL so checkout works even on a password-protected dev store.

3. **Cart drawer component** (`src/components/CartDrawer.tsx`, new file)
   - Built with the existing shadcn `Sheet` primitive so the styling matches the site.
   - Trigger lives in `SiteHeader.tsx` (replaces the static "Cart [0]" text) and shows a live count badge.
   - Checkout button uses `window.open(checkoutUrl, "_blank")`.

4. **Cart sync hook** (`src/hooks/useCartSync.ts`, new file)
   - On page load and on tab `visibilitychange`, calls `syncCart()` to clear the local cart if Shopify says it no longer exists. This handles the "customer just finished checkout in the other tab" case.
   - Mounted once inside `RootComponent` in `src/routes/__root.tsx`.

5. **Wire up product pages**
   - `src/routes/shop.$handle.tsx`: replace `handleBuyNow` and `CART_CREATE` mutation with `useCartStore().addItem(...)`. Keep the size selector and trust badges as-is.
   - `src/routes/shop.tsx`: keep the tile linking to `/shop/[handle]`; optionally add a small "Add" button on tiles for products that have a single variant.

6. **Header update**
   - `src/components/SiteHeader.tsx`: replace the `Cart [0]` `<div>` with `<CartDrawer />` (icon + badge). Same colours/typography as the rest of the header.

## Files touched

| File | Change |
|---|---|
| `src/lib/shopify.ts` | new — shared Storefront API helper + constants |
| `src/stores/cartStore.ts` | new — Zustand cart with Shopify sync |
| `src/components/CartDrawer.tsx` | new — slide-out cart UI |
| `src/hooks/useCartSync.ts` | new — clear cart after checkout |
| `src/components/SiteHeader.tsx` | swap placeholder for cart drawer trigger |
| `src/routes/__root.tsx` | mount `useCartSync` |
| `src/routes/shop.$handle.tsx` | "Buy Now" → "Add to Cart" via store |
| `src/routes/shop.tsx` | optional add-to-cart on single-variant tiles, use shared helper |

## Dependency

- `zustand` (small state library, ~1 KB) — needs to be installed.

## Out of scope

- No design changes to the existing shop/PDP layout.
- No new Shopify admin work (uses the products already in your store).
- No payment handling on our side — Shopify owns the checkout, payment, taxes, shipping, and order confirmation emails, same as today.
