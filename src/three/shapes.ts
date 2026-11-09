// Point-cloud shapes the particle system morphs between.
// Every generator returns exactly `n` xyz positions, roughly fitting a radius of ~2.

type Gen = (n: number) => Float32Array

const rand = (a = -1, b = 1) => a + Math.random() * (b - a)

/** 0 — Intro: a sphere shell with a faint inner core */
export const sphere: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const inner = Math.random() < 0.14
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    const R = inner ? Math.cbrt(Math.random()) * 1.05 : 1.6
    out.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3)
  }
  return out
}

/** 1 — Attarwala's: a perfume bottle (surface of revolution: body, shoulder, neck, cap) */
export const bottle: Gen = (n) => {
  // profile as (radius, y) pairs, walked from bottom centre to top centre
  const prof: [number, number][] = []
  const push = (r: number, y: number) => prof.push([r, y])
  push(0, -1.95)
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * (Math.PI / 2); push(0.95 + Math.sin(a) * 0.12, -1.95 + (1 - Math.cos(a)) * 0.12) }
  push(1.07, 0.35)
  for (let i = 1; i <= 16; i++) { const t = i / 16; push(1.07 - (1.07 - 0.32) * (t * t * (3 - 2 * t)), 0.35 + t * 0.55) }
  push(0.32, 1.12)
  push(0.6, 1.12)
  push(0.6, 1.95)
  push(0, 1.95)

  // weight each segment by length × radius so density is even on the surface
  const segs = prof.slice(1).map((p, i) => {
    const q = prof[i]
    const len = Math.hypot(p[0] - q[0], p[1] - q[1])
    return { a: q, b: p, w: len * Math.max((p[0] + q[0]) / 2, 0.05) }
  })
  const total = segs.reduce((s, x) => s + x.w, 0)
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    let pick = Math.random() * total
    let seg = segs[0]
    for (const s of segs) { pick -= s.w; if (pick <= 0) { seg = s; break } }
    const t = Math.random()
    const r = seg.a[0] + (seg.b[0] - seg.a[0]) * t
    const y = seg.a[1] + (seg.b[1] - seg.a[1]) * t
    const ang = Math.random() * Math.PI * 2
    out.set([Math.cos(ang) * r, y, Math.sin(ang) * r], i * 3)
  }
  return out
}

/** 2 — StreamVault: a play triangle inside a ring */
export const play: Gen = (n) => {
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.38) {
      const a = Math.random() * Math.PI * 2
      const R = 1.95 + rand() * 0.06
      out.set([Math.cos(a) * R, Math.sin(a) * R, rand() * 0.08], i * 3)
    } else {
      // uniform point in triangle (-0.6,1)(-0.6,-1)(1.1,0)
      let u = Math.random(), v = Math.random()
      if (u + v > 1) { u = 1 - u; v = 1 - v }
      const x = -0.6 + u * 0 + v * 1.7
      const y = 1 - u * 2 - v * 1
      out.set([x, y, rand() * 0.16], i * 3)
    }
  }
  return out
}

/** 3 — Enlighten ("Lighting up your child's path"): a sun — a domed disc ringed by tapered rays */
export const sun: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const rays = 12
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.55) {
      // disc, slightly domed so it reads as 3D when it turns
      const r = Math.sqrt(Math.random()) * 1.05
      const a = Math.random() * Math.PI * 2
      const z = Math.sqrt(Math.max(1.1 - r * r, 0)) * 0.35 * (Math.random() < 0.5 ? 1 : -1)
      out.set([Math.cos(a) * r, Math.sin(a) * r, z], i * 3)
    } else {
      // rays: wedges that taper from the rim outward
      const k = Math.floor(Math.random() * rays)
      const t = Math.random()
      const r = 1.35 + t * 0.65
      const a = (k / rays) * Math.PI * 2 + rand() * 0.11 * (1 - t * 0.8)
      out.set([Math.cos(a) * r, Math.sin(a) * r, rand() * 0.08], i * 3)
    }
  }
  return out
}

/** Deccan Cans: a tin can — a cylinder with rolled rims and lid seams */
export const can: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const R = 1.15, H = 3.4
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const k = Math.random()
    if (k < 0.62) {
      // wall, with two faint beading rings
      const y = rand(-H / 2, H / 2)
      const bead = Math.abs(Math.abs(y) - 0.55) < 0.05 ? 0.05 : 0
      out.set([Math.cos(a) * (R - bead), y, Math.sin(a) * (R - bead)], i * 3)
    } else if (k < 0.82) {
      // rolled rims top and bottom
      const top = Math.random() < 0.5 ? 1 : -1
      const t = Math.random() * Math.PI * 2
      const r = R + 0.06 + Math.cos(t) * 0.06
      out.set([Math.cos(a) * r, top * (H / 2 + Math.sin(t) * 0.06), Math.sin(a) * r], i * 3)
    } else {
      // lid: a disc with a recessed seam ring
      const r = Math.sqrt(Math.random()) * R
      const y = H / 2 - (r < R - 0.18 ? 0.08 : 0)
      out.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3)
    }
  }
  return out
}

/** Noitas: an 8-bit heart — a grid of tiny voxels, like a sprite */
export const pixelHeart: Gen = (n) => {
  const rows = [
    '.XX...XX.',
    'XXXX.XXXX',
    'XXXXXXXXX',
    'XXXXXXXXX',
    '.XXXXXXX.',
    '..XXXXX..',
    '...XXX...',
    '....X....',
  ]
  const cells: [number, number][] = []
  rows.forEach((row, r) => [...row].forEach((c, col) => { if (c === 'X') cells.push([col, r]) }))
  const s = 0.44, w = rows[0].length, h = rows.length
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [cx, cy] = cells[Math.floor(Math.random() * cells.length)]
    // points on the surface of each voxel cube, so the pixels read as solid blocks
    const p = [rand(-0.5, 0.5), rand(-0.5, 0.5), rand(-0.5, 0.5)]
    const ax = Math.floor(Math.random() * 3)
    p[ax] = Math.random() < 0.5 ? -0.5 : 0.5
    const g = 0.86
    out.set([
      (cx - (w - 1) / 2 + p[0] * g) * s,
      (-(cy - (h - 1) / 2) + p[1] * g) * s + 0.1,
      p[2] * g * s,
    ], i * 3)
  }
  return out
}

/** Skills: a tilted grid of keycaps */
export const keys: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const cols = 5, rows = 4, pitch = 0.78, cap = 0.3
  const tilt = 0.75, ct = Math.cos(tilt), st = Math.sin(tilt)
  for (let i = 0; i < n; i++) {
    const c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows)
    const cx = (c - (cols - 1) / 2) * pitch, cz = (r - (rows - 1) / 2) * pitch
    // top face of the cap, plus its four sloped sides
    let x: number, y: number, z: number
    if (Math.random() < 0.55) { x = rand(-cap, cap); z = rand(-cap, cap); y = 0.22 }
    else {
      const side = Math.floor(Math.random() * 4), t = rand(-1, 1), h = Math.random()
      const e = cap + (1 - h) * 0.06
      ;[x, z] = side === 0 ? [e, t * e] : side === 1 ? [-e, t * e] : side === 2 ? [t * e, e] : [t * e, -e]
      y = h * 0.22
    }
    x += cx; z += cz
    out.set([x, y * ct - z * st, y * st + z * ct], i * 3)
  }
  return out
}

/** Projects: a (2,3) torus knot */
export const knot: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const R = 1.25, tube = 0.32, p = 2, q = 3
  const curve = (u: number) => {
    const qu = (q / p) * u
    const cs = Math.cos(qu)
    return [R * (2 + cs) * 0.5 * Math.cos(u), R * (2 + cs) * 0.5 * Math.sin(u), R * Math.sin(qu) * 0.5]
  }
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2 * p
    const v = Math.random() * Math.PI * 2
    const c1 = curve(u), c2 = curve(u + 0.01)
    const T = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]]
    const N0 = [c2[0] + c1[0], c2[1] + c1[1], c2[2] + c1[2]]
    const B = [T[1] * N0[2] - T[2] * N0[1], T[2] * N0[0] - T[0] * N0[2], T[0] * N0[1] - T[1] * N0[0]]
    const N = [B[1] * T[2] - B[2] * T[1], B[2] * T[0] - B[0] * T[2], B[0] * T[1] - B[1] * T[0]]
    const bl = Math.hypot(...B), nl = Math.hypot(...N)
    const cx = Math.cos(v) * tube, sx = Math.sin(v) * tube
    out.set([
      c1[0] + (cx * N[0]) / nl + (sx * B[0]) / bl,
      c1[1] + (cx * N[1]) / nl + (sx * B[1]) / bl,
      c1[2] + (cx * N[2]) / nl + (sx * B[2]) / bl,
    ], i * 3)
  }
  return out
}

/** 5 — About: a DNA double helix */
export const helix: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const turns = 2.2, R = 0.95, H = 4.2
  for (let i = 0; i < n; i++) {
    const t = Math.random()
    const y = -H / 2 + t * H
    const a = t * turns * Math.PI * 2
    if (Math.random() < 0.7) {
      const s = Math.random() < 0.5 ? 0 : Math.PI
      out.set([Math.cos(a + s) * R + rand() * 0.07, y + rand() * 0.07, Math.sin(a + s) * R + rand() * 0.07], i * 3)
    } else {
      // rungs between the strands at regular steps
      const step = Math.round(t * 26) / 26
      const ra = step * turns * Math.PI * 2
      const k = rand()
      out.set([Math.cos(ra) * R * k, -H / 2 + step * H + rand() * 0.02, Math.sin(ra) * R * k], i * 3)
    }
  }
  return out
}

/** 6 — Contact: a three-armed spiral galaxy, tilted toward the viewer */
export const galaxy: Gen = (n) => {
  const out = new Float32Array(n * 3)
  const tilt = 1.05, ct = Math.cos(tilt), st = Math.sin(tilt)
  for (let i = 0; i < n; i++) {
    const r = Math.pow(Math.random(), 1.4) * 2.9
    const arm = (i % 3) * ((Math.PI * 2) / 3)
    const spread = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    const a = arm + r * 1.7 + spread
    const x = Math.cos(a) * r + rand() * 0.08
    const z = Math.sin(a) * r + rand() * 0.08
    const y = rand() * 0.12 * (1 - r / 3)
    out.set([x, y * ct - z * st, y * st + z * ct], i * 3)
  }
  return out
}

/** one shape per chapter, in page order (see src/lib/chapters.ts) */
export const SHAPES = [sphere, bottle, can, play, sun, pixelHeart, keys, knot, helix, galaxy]
