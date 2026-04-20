
# LILU — Cycling Brand Storefront

A cinematic, story-driven Shopify storefront for LILU cycling apparel. Editorial Rapha-inspired energy, but darker, greener, and more alive — heavy on motion, scroll-driven storytelling, and a manifesto voice.

## Setup
- Spin up a new Shopify development store (free while building, claim later to go live).
- After Shopify is enabled, seed the catalog with starter LILU products (jerseys, bibs, base layers, accessories) so the store is shoppable immediately.

## Visual System
- **Palette:** deep forest `#1a3c2a` as primary, moss `#2d5a3d`, sage `#5a8a5c`, mist `#a0c49d`, off-white paper, near-black ink. Mostly dark, editorial, with off-white "manifesto" sections for contrast.
- **Type:** Archivo Black for declarative, manifesto-style headlines (oversized, tight tracking). Hind for body. Mono numerals for stats/specs.
- **Motion language:**
  - Scroll-triggered fades, slow image parallax, and horizontal scroll for collection reveals.
  - Marquee tickers for manifesto lines ("ENGINEERED FOR CONTINUOUS ENDURANCE").
  - Hover: image zoom + label slide-in on product cards, story underline links, cursor-aware tilt on hero cards.
  - Page transitions with fade + subtle scale.
  - Animated counters on sustainability stats; route-leader map ticks.

## Routes
1. **Home `/`** — Full-bleed hero using the uploaded LILU lineup image with slow Ken Burns motion, oversized "LILU" wordmark overlay, and a scrolling manifesto ticker. Sections below: featured collection horizontal scroll, athlete story teaser, sustainability strip with animated metrics, journal preview, retail outpost locator teaser.
2. **Shop `/shop`** — Editorial product grid with category filters (Jerseys, Bibs, Outerwear, Accessories). Hover swaps to alt image; "ADD" reveal on hover.
3. **Product `/shop/$handle`** — Large image gallery left, sticky spec panel right (Archivo Black product name, mono spec list: weight, fabric, fit, country of make), variant + size picker, "Engineered for" expandable sections, related pieces carousel.
4. **Journal `/journal`** + `/journal/$slug`** — Editorial article index (magazine layout) and long-form story pages with pull quotes, full-bleed photography, and chapter markers. Seed with 3 starter stories (a ride, an athlete, a fabric).
5. **Sustainability `/sustainability`** — Manifesto-style page: repair protocol, materials, renewable energy, carbon-neutral roadmap. Animated counters, pillar cards, timeline.
6. **About `/about`** — Mission, operational mandate, core values (4-pillar grid), internal culture (synchronized rides, field days), retail outposts.
7. **Contact `/contact`** — Outpost addresses, general contact form, press/wholesale/community contacts, newsletter opt-in.

Shared global header (transparent over hero, solidifies on scroll) with LILU wordmark, nav, cart icon, and a footer with newsletter, sitemap, sustainability badges, and social links. Each route gets its own SEO meta and og:image (home uses the uploaded image).

## Storytelling Touches
- Manifesto fragments from the brand brief surface throughout — section intros use lines like "Discomfort is a required metric for progression."
- Image-led, copy-restrained — let photography breathe.
- Numeric spec callouts on product and sustainability pages reinforce the "engineering" voice.

## Build Order
1. Enable Shopify (new dev store).
2. Tokens, fonts, layout shell, header/footer.
3. Home page with hero image + motion.
4. Shop + Product pages wired to Shopify.
5. Journal, Sustainability, About, Contact.
6. Polish motion, responsive QA, SEO meta.
