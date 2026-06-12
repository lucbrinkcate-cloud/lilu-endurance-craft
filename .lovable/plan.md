## What we'll build

### 1. "Design your own kit" scroll popup on `/shop`
- New component `src/components/DesignKitNudge.tsx`: dismissible card that slides in from the bottom-right of the viewport.
- Trigger: appears once the user has scrolled past ~60% of the product grid (roughly 3–4 product rows). Uses a scroll listener with a threshold.
- Once-per-session: dismissal stored in `sessionStorage` under `velonix:designKitNudge:dismissed` so it doesn't re-open after closing.
- Visual: matches site language — ink background, sage accent border, mono uppercase eyebrow, display headline ("Have you ever thought about designing your own kit?"), short subtext, and a primary CTA link (TanStack `<Link to="/custom-kit">`) plus a small close (×) button.
- Mounted from `src/routes/shop.index.tsx` only (not the product detail page).

### 2. Wishlist for generated kit designs (browser-local)
- New store `src/stores/wishlistStore.ts` (Zustand, mirrors the pattern of `cartStore`) persisted to `localStorage` under `velonix:kit-wishlist`.
  - Shape per item: `{ id, savedAt, imageUrl, prompt, baseStyle, primary, secondary, accent, logoUrl, clubName? }`.
  - Actions: `add`, `remove`, `has(id)`, `clear`.
  - `id` derived deterministically from image URL + design params so the same generated design can be toggled off.
- Update `src/routes/custom-kit.tsx`:
  - On each generated design card in Step 03, add a small heart/save button in the corner. Clicking toggles wishlist membership without selecting the design (stop propagation).
  - Add a new "Saved designs" section above Step 03 (only shown when wishlist has items): horizontal scrollable strip of saved thumbnails with: image, mini color swatches, style label, "Use this design" button (loads it into the current flow as the selected design, pre-fills colors + style), and a remove (×) button.
  - "Use this design" path: sets `designs` state to `[savedItem]` (or appends) and `selected = 0`, then scrolls to Step 04 so the user can submit.
- New route `src/routes/wishlist.tsx` (`/wishlist`): standalone page listing all saved designs in a grid, each with "Use in custom kit" (navigates to `/custom-kit` with a query param that the page picks up and loads into state) and "Remove". Includes proper `head()` meta. Linked from the header.
- Add "Wishlist" link to `src/components/SiteHeader.tsx` nav with a small count badge when items > 0.

### 3. Cross-page wiring
- `/custom-kit` reads `?fromWishlist=<id>` on mount; if present and the id matches a wishlist item, it hydrates `logoUrl`, colors, style, `designs`, and `selected` so the user lands ready to submit.

## Technical notes
- No backend / DB changes — wishlist is fully client-side via Zustand `persist` middleware (already in deps via cartStore pattern).
- No Shopify API calls needed.
- The popup never appears on `/shop/$handle` (PDP), only `/shop` index. It also won't appear on mobile if the viewport is below the threshold where 3 rows haven't rendered yet (the scroll-percent threshold handles this naturally).
- Accessibility: popup has `role="dialog"`, focusable close button, ESC closes it. Wishlist toggle buttons have `aria-pressed` and `aria-label`.

## Out of scope
- No account-based sync (per your choice — local only).
- No changes to the generation logic itself; existing designs are simply saveable.

```text
Files touched
  NEW  src/components/DesignKitNudge.tsx
  NEW  src/stores/wishlistStore.ts
  NEW  src/routes/wishlist.tsx
  EDIT src/routes/shop.index.tsx        (mount nudge)
  EDIT src/routes/custom-kit.tsx        (save buttons, saved strip, query hydration)
  EDIT src/components/SiteHeader.tsx    (Wishlist nav link + count)
```
