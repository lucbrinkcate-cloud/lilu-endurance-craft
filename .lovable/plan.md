

# Custom Club Kit Designer

A tool where customers upload their cycling club logo, AI generates 3-4 custom kit design mockups (jersey + bibs), they pick a favorite, submit for your approval, and once you approve, they can order through Shopify.

## User Flow

```text
1. Customer visits /custom-kit
2. Uploads club logo (PNG/JPG/SVG)
3. Picks base style (Road / Gravel / Classic) + 2-3 brand colors
4. Clicks "Generate Designs" → AI returns 3-4 mockup images (~30s)
5. Customer picks favorite + fills club name, contact, qty estimate
6. Submits → status "Pending Review"
7. YOU (admin) get notified, review in /admin/kit-requests
8. Approve → system creates a custom Shopify product (draft or hidden) priced for the order, emails customer a checkout link
9. Customer pays via standard Shopify cart → order flows into your Shopify orders
```

## What Gets Built

**Public side**
- `/custom-kit` — landing + designer tool (logo upload, style picker, color picker, generate button, results gallery, submit form)
- `/custom-kit/status/$requestId` — customer can revisit to see approval status & checkout link
- Nav entry "Design Your Kit" added to `SiteHeader`

**Admin side**
- `/admin/kit-requests` — list of all submissions with status filters
- `/admin/kit-requests/$id` — detail view: logo, chosen design, customer info, approve/reject buttons, price input
- Simple password-gate (single admin password stored as a secret) — no full auth system needed

**Backend**
- Lovable Cloud (Supabase) for storing requests + uploaded logos + generated mockups
- Lovable AI (Nano Banana / `google/gemini-2.5-flash-image`) for generating kit mockups using the logo as input image
- TanStack server functions for: upload, generate, submit, approve, create-shopify-product
- Shopify integration: on approval, create a one-off product via `shopify--create_product` with the agreed price, return the product URL → customer adds to cart → standard checkout

## Data Model (Lovable Cloud)

```text
kit_requests
  id, created_at, status (draft|pending|approved|rejected|ordered)
  customer_email, customer_name, club_name, estimated_qty
  logo_url, base_style, primary_color, secondary_color, accent_color
  generated_designs (jsonb: array of {url, prompt})
  selected_design_index
  admin_notes, approved_price_cents
  shopify_product_id, shopify_product_url

storage buckets: 'club-logos' (public read), 'kit-mockups' (public read)
```

## How AI Mockups Work

For each request, call Lovable AI 3-4 times with the uploaded logo + a prompt like:
*"Editorial product photo of a [road/gravel] cycling jersey and bib shorts in [colors]. Place this logo cleanly on the chest and one thigh panel. Studio lighting, neutral background, technical fabric texture, photoreal."*

Each variation tweaks color placement / style (full-color block, minimal accent, retro stripe, modern panel). Returned base64 images get uploaded to the `kit-mockups` storage bucket and URLs saved to the request row.

## Approval → Order Flow

1. Admin opens request, sets a price (e.g. $185/kit), clicks **Approve**
2. Server function calls `shopify--create_product`:
   - Title: `Custom Kit — {club_name}`
   - Image: the selected mockup
   - Variants: sizes XS-XXL
   - Tag: `custom-kit`, `hidden` (so it doesn't show in main shop grid)
3. Customer receives email (via Resend connector or Shopify) with a link to `/custom-kit/status/{id}` showing their approved mockup + an "Add to Cart" button wired to the new Shopify product
4. They check out normally through your existing Shopify cart flow

## What I Need From You Before Building

A few decisions:

1. **Admin access** — single shared password stored as a secret (simplest), or full email/password login for you?
2. **Customer notification** — should I wire up the Resend connector for transactional emails (approval/rejection), or just show status on the page and you email manually?
3. **Pricing** — fixed price per kit, or do you set it per request after seeing quantity?
4. **MOQ** — minimum order quantity (e.g. 10 kits) shown upfront, or no minimum?

Once you answer, I'll build it end to end.

## Technical Notes

- Logo upload: client-side validation (max 5MB, PNG/JPG/SVG/WEBP), stored in Supabase `club-logos` bucket via signed upload
- AI generation runs in a server function (`generateKitDesigns`) that loops 3-4 times sequentially with a small delay to avoid rate limits; returns array of public URLs
- Color picker uses a simple hex input + 3 swatches (no heavy color library)
- Admin route protected by middleware checking a cookie set after password submit; password compared against `ADMIN_PASSWORD` env secret
- Shopify product creation is server-side only (uses your existing Shopify connection); product stays hidden from main collection via tag filter in the existing `shop.tsx` query (`-tag:custom-kit`)
- All AI mockup costs are absorbed per-request — typically 4 image generations (~$0.15-0.30 per request on Nano Banana)

