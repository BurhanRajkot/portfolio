// ─────────────────────────────────────────────────────────────
//  Spline integration
//
//  1. Design a scene at https://spline.design
//  2. Export → "Code Export" → React → copy the `scene.splinecode` URL
//  3. Paste it below (or set VITE_SPLINE_SCENE in a .env file)
//
//  When a URL is set, the hero uses your Spline scene.
//  When empty, the hero uses the built-in Three.js "ember core" scene.
// ─────────────────────────────────────────────────────────────

export const SPLINE_HERO_SCENE: string = import.meta.env.VITE_SPLINE_SCENE ?? ''
