## Plan

1. Update the storefront configuration to use the current connected Shopify store domain instead of the old hardcoded one.
2. Keep the existing product query logic, since Shopify now returns 3 active `VELONIX` products and the vendor filter is valid.
3. Validate the shop page and product detail route against the corrected storefront connection so `/shop` shows products and product clicks still work.

## What I found

- Your Shopify store currently has **3 active products** and all match `vendor:VELONIX`.
- The shop page code is still using this old domain in `src/lib/shopify.ts`:
  - `velonix-engineered-endurance-9srdf.myshopify.com`
- The connected store for this project now reports this permanent domain:
  - `lilu-engineered-endurance-9srdf.myshopify.com`

That mismatch explains why products can exist in Shopify but the site still shows an empty shop in a fresh preview/new tab.

## Technical details

- File to change: `src/lib/shopify.ts`
- Change needed: replace the hardcoded store domain with the current connected permanent domain.
- After that, re-check `/shop` and `/shop/$handle` in preview to confirm products load from the current storefront.

If you approve, I’ll apply that fix next.