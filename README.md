# Dhiren Sharma — Portfolio (Phase 1)

"Exploring Earth through AI" — an award-quality portfolio for an AI /
Earth Observation / Geospatial AI engineer. Built with Next.js App Router,
TypeScript, Tailwind, React Three Fiber, and Framer Motion.

## What's in this phase

This is **Phase 1 of an incremental build**. It ships a fully working,
type-checked, lint-clean landing page:

- Full Next.js 14 + TypeScript + Tailwind project scaffold
- Root layout with `Sora` / `Manrope` / `JetBrains Mono` fonts, skip-link,
  reduced-motion handling, custom scrollbar
- Lenis smooth-scroll provider (auto-disables under reduced-motion)
- Scroll-progress bar + custom cursor trail (desktop only)
- **Hero section** with:
  - An interactive 3D "sensor globe" (React Three Fiber + a hand-written
    GLSL shader) — auto-rotates, parallaxes toward the cursor, has a
    Fibonacci-distributed data-point overlay, atmosphere rim glow, three
    tilted orbit rings, and one small satellite in true orbital motion
  - Word-by-word text reveal headline
  - Magnetic buttons (Explore My Work / Download Resume / Contact Me)
  - Scroll cue

Design tokens (colors, type scale, glass/glow utilities) are defined in
`tailwind.config.ts` and `app/globals.css` — every later phase should pull
from these rather than inventing new one-off colors.

## Why the globe isn't a photoreal Earth texture

A licensed NASA/Blue Marble texture isn't something I can source as a
placeholder asset. Instead the globe is rendered as a **live sensor
sphere** — procedural shader surface + a scattered data-point overlay +
orbit rings — which reads as "AI reading the planet" rather than "photo of
the planet," and fits the Earth Observation / Geospatial AI subject matter
more specifically than a stock globe would. If you'd rather use a real
texture later, swap the `shaderMaterial` in `components/hero/Earth.tsx`
for a `meshStandardMaterial` with an Earth-texture map — the rest of the
scene (lights, stars, rings, satellite, parallax) doesn't need to change.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> Note: this sandbox can't reach fonts.googleapis.com, so I verified the
> build two ways: (1) `tsc --noEmit` and `next lint` both pass clean against
> the real font imports, and (2) a full `next build` succeeds end-to-end
> with the fonts temporarily stubbed out, proving the rest of the pipeline
> (3D scene, Tailwind, static generation) is solid. On your machine, with
> normal internet access, the Google Fonts fetch will just work.

## Roadmap (next phases)

1. ✅ Project scaffold + Hero (this delivery)
2. About section — scroll-triggered story timeline (education, ISRO
   internship, skills-on-hover)
3. Project 1 — Vegetation Height Estimation: interactive satellite map,
   scan/zoom/heatmap interaction, animated stat counters, inference
   pipeline diagram, before/after slider
4. Project 2 — Sign Language Recognition demo: webcam-or-simulated feed,
   animated hand landmarks, CNN visualization, live confidence bars
5. Experience — horizontal animated ISRO timeline
6. Skills — glowing constellation graph
7. Research — publication-style cards
8. Contact — glass card with animated Earth backdrop
9. Routing for all pages (`/about`, `/projects`, `/research`,
   `/experience`, `/skills`, `/contact`) with animated transitions
10. Performance pass (code-splitting, Suspense boundaries, Lighthouse),
    accessibility pass (keyboard nav, ARIA, contrast), polish pass (satellite
    flybys, meteor streaks, boot-sequence loader, AI log terminal, sound
    toggle)

Say the word and I'll build the next phase into this same project.

## Folder structure

```
app/
  layout.tsx        Root layout, fonts, providers
  page.tsx           Home page (assembles sections)
  globals.css         Design tokens as CSS, utility classes
components/
  hero/
    Earth.tsx          3D scene contents (globe, stars, satellite)
    EarthCanvas.tsx     R3F <Canvas> wrapper (client-only)
    HeroSection.tsx     Hero layout, copy, CTAs
  layout/
    SmoothScrollProvider.tsx
    ScrollProgress.tsx
    CursorTrail.tsx
  ui/
    MagneticButton.tsx
lib/
  utils.ts            cn() class-merge helper
```
