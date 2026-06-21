## 1. Header readability over the hero image (home only)

Problem: on `/`, `SiteHeader` is mounted with `overlay`, which uses `mix-blend-difference`. Against the warm/gray hero photo the logo and nav blend into the background. Once you scroll past the hero, the normal sticky header takes over and looks fine — so the fix is scoped to the overlay state.

Change in `src/components/SiteHeader.tsx`:
- Drop `mix-blend-difference` from the overlay variant.
- Add a soft top-down gradient backdrop behind the overlay header (`bg-gradient-to-b from-ink/70 via-ink/30 to-transparent`) so the paper-white logo + nav always have enough contrast, without making it look like a solid bar.
- Force text to `text-paper` and add a subtle `drop-shadow` on the logo `<img>` and nav links for extra legibility on bright hero areas.
- Keep the search/cart icons readable with the same paper color + sage hover.
- No change to the sticky (non-overlay) variant used on every other page.

No other pages or components touched.

## 2. Product page shows "Title / Default Title / Default Title"

This is not a frontend bug — the PDP (`src/routes/shop.$handle.tsx`) already renders `product.title`, `product.productType`, and the first option's name + values from Shopify. The placeholder text appears because the Shopify product has:
- no real title (defaults to "Default Title"),
- no real options (Shopify auto-creates a single option called "Title" with one value "Default Title").

Fix on the Shopify side (no code change needed on the PDP — it will pick up the new data automatically):

a. Connect Shopify (the session needs a fresh auth before any `shopify--*` tool can run).

b. List the current products, then for each one:
   - `shopify--update_product` → set a real `title` (and `product_type` like "Jersey", "Bib Shorts", "Jacket" so the small sage kicker above the H1 reads correctly), plus a `Size` option with values `["XS","S","M","L","XL","XXL"]` (matches the existing `SIZE_CHART` in the PDP).
   - Replace the auto-generated "Default Title" variant: `shopify--delete_product_variant` on the placeholder, then `shopify--create_product_variant` once per size with `option1` = the size, the same price, and `inventory_management: "shopify"` so stock is tracked.

c. After the update, the PDP will render: real product type in the kicker, real product name as the H1, and a row of size buttons XS–XXL that respect stock.

## Open question before I run the Shopify updates

- Should every product get the full `XS / S / M / L / XL / XXL` set, or do some items (e.g. accessories like caps, socks, bottles) need a different size scale or no size at all? If you want different scales per product type, tell me which products get which set and I'll apply them per product.

## Files

- Edit: `src/components/SiteHeader.tsx` (overlay variant only).
- Shopify data: updates via `shopify--update_product`, `shopify--delete_product_variant`, `shopify--create_product_variant` for each existing product. No new code files.
