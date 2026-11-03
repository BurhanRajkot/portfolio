# Burhanuddin Rajkotwala — Portfolio

A single-page, scroll-driven portfolio. One WebGL particle system (React Three Fiber + custom GLSL) sits behind the page and morphs into a new shape for every chapter as you scroll. GSAP handles text reveals and the 3D tilt of project screenshots; Lenis does smooth scrolling.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Page flow (chapter → particle shape)

| Chapter | Shape |
| --- | --- |
| Intro | sphere |
| Attarwala's (live Shopify store) | perfume bottle |
| StreamVault (live web app) | play button |
| More work (in-progress clients + expandable project list) | torus knot |
| About | DNA helix |
| Contact | spiral galaxy |

Shapes are generated in `src/three/shapes.ts`; the morph shader is in `src/three/shaders.ts`; chapter order lives in `src/lib/chapters.ts` (the section `id`s must match). Particles scatter away from the cursor and a few pick up the accent colour.

## Editing content

All text and links are in [`src/data/profile.ts`](src/data/profile.ts):

- `featured` — live projects with screenshots. Add `live`, `desktop` (and optionally `mobile`) image paths.
- `inProgress` — client work not yet launched. When one goes live, move it into `featured`.
- `projects` — the expandable list.
- `profile.linkedin` / `profile.resume` — fill these in and the links appear in Contact.

## Updating screenshots

Screenshots live in `public/work/`. To re-capture a live site (1440×900):

```bash
chromium --headless=new --hide-scrollbars --window-size=1440,900 \
  --virtual-time-budget=12000 --screenshot=shot.png https://www.attarwalas.com/
magick shot.png -resize 1600x -quality 82 public/work/attarwalas.webp
```

## Spline (optional)

To use a Spline scene instead of the particle system, export your scene from spline.design (Export → Code → React) and add to `.env`:

```
VITE_SPLINE_SCENE=https://prod.spline.design/XXXX/scene.splinecode
```

## Deploy

Vercel / Netlify: build command `npm run build`, output directory `dist`.
