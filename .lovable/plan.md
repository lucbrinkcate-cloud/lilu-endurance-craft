

# Homepage Visual Animations — Lab/Engineering Theme

Bring the homepage manifesto to life with text-synced visual animations. Each pillar (Born on the long road, Fabrics that hold the line, Cut for the position you actually ride, Engineered to be mending, Discomfort is a metric) gets its own custom inline SVG animation that fires when scrolled into view.

## Approach (Best Option)

**Inline animated SVGs + scroll-triggered reveals** — not Lottie, not video, not stock images.

Why this approach:
- **Zero dependencies, zero asset weight** — SVGs are inline, animated with CSS/SMIL, render instantly with no network requests
- **On-brand** — matches the existing "technical editorial / lab notebook" aesthetic (mono font, ink/paper palette) better than photography or stock illustrations
- **Crisp at any size** — vector, retina-perfect, scales with the viewport
- **Synced to text** — each visual is custom-drawn for its specific line, not generic decoration
- **Fast** — no JS animation library, just IntersectionObserver + CSS keyframes already in `styles.css`

Alternative considered: Lottie (heavier, requires asset creation pipeline), looping video (heavy, distracting), Framer Motion variants (overkill for this).

## What Each Pillar Gets

```text
"Born on the long road"
  → Animated topographic contour lines drawing themselves across a horizon,
    with a small bike silhouette tracing the longest contour
    (stroke-dasharray draw-on animation)

"Fabrics that hold the line"
  → Woven fabric grid that builds thread-by-thread (warp lines draw left→right,
    weft lines draw top→bottom in sequence), then a subtle tension pulse

"Cut for the position you actually ride"
  → Technical pattern-piece schematic of a jersey with measurement lines,
    annotation callouts (e.g. "back drop +3cm", "sleeve +12mm") that type in
    one by one, like a tailor's draft

"Engineered to be mending"
  → A torn fabric edge that stitches itself back together
    (dashed stitch line draws across the tear, then the two halves nudge
    closer)

"Discomfort is a metric"
  → A live-style data graph (heart rate / power curve) that draws across
    the panel with a moving readout dot and ticking numeric counter
    (e.g. watts: 0 → 287)
```

## Technical Implementation

**New component**: `src/components/AnimatedPillar.tsx`
- Wraps each pillar's text + SVG visual
- Uses `IntersectionObserver` to add an `.in-view` class when ≥30% visible
- Animations only play once (no re-triggering on scroll up)
- Respects `prefers-reduced-motion` — falls back to static final-state SVG

**New component**: `src/components/pillar-visuals/` (5 small SVG components)
- `ContourMap.tsx`, `WovenGrid.tsx`, `JerseySchematic.tsx`, `StitchRepair.tsx`, `PowerGraph.tsx`
- Each is a self-contained inline SVG with CSS animations targeting `.in-view` parent
- Drawn in `--paper` / `--mist` strokes on `--ink` background to match existing palette

**CSS additions** in `src/styles.css`:
- `@keyframes draw-stroke` (stroke-dashoffset 1000 → 0) for line-drawing
- `@keyframes count-up`, `@keyframes stitch`, `@keyframes weave` for specific effects
- `.in-view .draw-line { animation: draw-stroke 1.6s ease-out forwards; }` pattern
- All animations respect `@media (prefers-reduced-motion: reduce)`

**Homepage edit** in `src/routes/index.tsx`:
- Locate the existing manifesto/pillars section
- Restructure to a 2-column grid per pillar (text left, SVG visual right; alternating on every other pillar for visual rhythm)
- Wrap each in `<AnimatedPillar visual={<ContourMap />} />`

**Performance**:
- All SVGs inline, total added weight ~6-8 KB
- IntersectionObserver is native, no library
- Animations are pure CSS (GPU-accelerated transforms/opacity where possible)

## Rollout Plan

**This turn — Homepage only** (the 5 pillars above).

**Next turns — once you approve the homepage feel**, we extend the same pattern to:
- `/about` — animated timeline of the brand story, lab-notebook style margin sketches
- `/sustainability` — material-flow diagram, lifecycle loop animation
- `/shop` — subtle hover micro-interactions on product cards (fabric weave reveal)
- `/journal` — typewriter-style headline reveal, ink-bleed entry transitions
- `/custom-kit` — animated logo-to-jersey transformation in the hero
- `/contact` — paper-airplane send animation on form submit

Each page reuses the same `AnimatedPillar` + IntersectionObserver pattern, so no new infrastructure needed after this turn.

## Files to Create/Edit

- Create `src/components/AnimatedPillar.tsx`
- Create `src/components/pillar-visuals/ContourMap.tsx`
- Create `src/components/pillar-visuals/WovenGrid.tsx`
- Create `src/components/pillar-visuals/JerseySchematic.tsx`
- Create `src/components/pillar-visuals/StitchRepair.tsx`
- Create `src/components/pillar-visuals/PowerGraph.tsx`
- Edit `src/styles.css` (add keyframes + reduced-motion guard)
- Edit `src/routes/index.tsx` (wire up the 5 pillars with their visuals)

