# Shopify Academy Logbook — Plan

I'll produce a single PDF (`/mnt/documents/velonix-shopify-logbook.pdf`, max 8 pages) covering the 7 weekly courses. The content is reconstructed from our actual chat history (Apr 20 – Jun 8), so each "Application" entry maps to real changes we shipped in this project (originally "LILU", later rebranded to "VELONIX").

I do **not** need you to paste course text. The official Shopify Academy course outlines are publicly documented and I'll align each "Key Learnings" section to the standard syllabus of that course. If a course concept is Shopify-admin-specific and couldn't be applied because we built a custom TanStack/Storefront-API frontend, I'll explicitly call that out under "Application" with the workaround we used.

## Week-by-week mapping (drafted from chat history)

1. **Week 1 — Introduction to Shopify**
   Application: created the Shopify dev store, defined the LILU/VELONIX brand brief (cycling apparel, sustainability, storytelling), decided scope (Home, Shop, Product, About, Contact, Sustainability, Journal).

2. **Week 2 — Navigate Administrator**
   Application: seeded products via Shopify Admin (jerseys/bibs as `vendor:VELONIX`), connected the store via OAuth, wired the Storefront API token. Shopify-specific gap: theme editor not used because we built a headless TanStack frontend — instead built our own admin route (`/admin/kit-requests`) for custom-kit moderation.

3. **Week 3 — Branding, Positioning & Online Presence**
   Application: Forest & Moss palette, Archivo Black + Hind typography, manifesto-style announcement ticker, slogan hero, Journal storytelling pages, sustainability page.

4. **Week 4 — Customizing Themes**
   Application: Because we don't use a Liquid theme, we replicated theme-customization principles in code — semantic design tokens in `src/styles.css`, reusable section components (Hero, AnimatedPillar, NewsletterSection, SiteHeader/Footer), and configurable announcement bar.

5. **Week 5 — Horizon Theme Development**
   Application: Horizon's section/block model can't be used on a headless build. Instead we mirrored its architecture: modular route-level "sections," scroll-driven Framer Motion blocks, accessible color tokens, and a content-first PDP layout matching Horizon defaults (gallery, sticky add-to-cart, sizing, materials, brand story).

6. **Week 6 — Digital Marketing Essentials**
   Application: SEO `<head>` per route (titles, descriptions, OG/Twitter, canonical), newsletter capture with Supabase-backed list, announcement bar promo, cookie banner for compliance, share-ready OG images.

7. **Week 7 — Converting Site Visitors into First-Time Buyers**
   Application: trust infrastructure (shipping/returns, size guide, fabric care, FAQ), social proof blocks, 4-frame PDP gallery, sticky add-to-cart, real Shopify checkout via Storefront API `checkoutUrl`, cart drawer, custom-kit upsell funnel.

## Format

- A4, max 8 pages, ~1 page per course
- Clean editorial layout matching the VELONIX aesthetic (Archivo Black headers, Hind body, Forest/Moss accents)
- Each course page: course title + week, "Key Learnings" (4–6 bullets), "Application to VELONIX store" (concrete changes, file/feature names from our build), and a small "Shopify-specific gap → what we did instead" note where relevant
- Cover page with project name, student-style metadata placeholder, and course list

## Technical approach

- Generate with Python + ReportLab (Platypus) into `/mnt/documents/velonix-shopify-logbook.pdf`
- QA: render to JPGs with `pdftoppm` and visually inspect every page before delivering
- Output a `<presentation-artifact>` link for download

## One confirmation before I build

The cover currently has no student name / class / date — do you want me to put a placeholder ("Student name: ____"), or do you want to give me your name + class/section now so it's filled in?
