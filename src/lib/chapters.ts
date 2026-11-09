// Shared, framework-free state for the scroll-driven 3D scene.
// The DOM sections tell us how far through the page we are; the WebGL scene reads it every frame.
import { SHOW_LOADER } from './intro'

export interface Chapter {
  id: string
  name: string
  /** desktop: horizontal offset of the shape, as a fraction of the viewport width (+ = right) */
  x: number
  /** desktop opacity — shapes sitting behind reading content are dimmed */
  o: number
  /** phones: opacity (the shape is centred behind the content, except in the hero) */
  mo: number
}

export const CHAPTERS: Chapter[] = [
  { id: 'top', name: 'Intro', x: 0.27, o: 1, mo: 1 },
  { id: 'attarwalas', name: "Attarwala's", x: 0.3, o: 0.35, mo: 0.2 },
  { id: 'deccan', name: 'Deccan Cans', x: -0.3, o: 0.35, mo: 0.2 },
  { id: 'streamvault', name: 'StreamVault', x: 0.3, o: 0.35, mo: 0.2 },
  { id: 'enlighten', name: 'Enlighten', x: -0.3, o: 0.35, mo: 0.2 },
  { id: 'noitas', name: 'Noitas', x: 0.3, o: 0.35, mo: 0.2 },
  { id: 'skills', name: 'Skills', x: 0.3, o: 0.22, mo: 0.12 },
  { id: 'projects', name: 'Projects', x: 0.3, o: 0.35, mo: 0.16 },
  { id: 'about', name: 'About', x: 0.3, o: 0.4, mo: 0.18 },
  { id: 'contact', name: 'Contact', x: 0.28, o: 1, mo: 0.35 },
]

export const sceneState = {
  /** continuous chapter position, e.g. 1.4 = 40% of the way from chapter 1 to 2 */
  progress: 0,
  active: 0,
  /** false while the intro loader covers the page — the particles wait to fly in */
  ready: !SHOW_LOADER,
  /** phones: the empty "stage" above the hero text where the intro shape forms (px, viewport space) */
  stage: { center: 0, radius: 0 },
}

type Listener = (i: number) => void
const listeners = new Set<Listener>()
export const onChapterChange = (fn: Listener) => {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Measure the free space above the hero text (phones) so the intro shape never overlaps it. */
export function measureStage() {
  const nav = document.querySelector('.nav')?.getBoundingClientRect().height ?? 56
  const text = document.querySelector('.hero__main')?.getBoundingClientRect()
  if (!text) return
  // measured at scroll 0 so it's stable; we add scrollY back for when it's called mid-page
  const top = nav
  const bottom = text.top + window.scrollY - 12
  sceneState.stage = { center: (top + bottom) / 2, radius: Math.max((bottom - top) / 2, 60) }
}

/** Measure each chapter's position — called on scroll. */
export function updateProgress() {
  const vh = window.innerHeight
  let p = 0
  for (let i = 1; i < CHAPTERS.length; i++) {
    const el = document.getElementById(CHAPTERS[i].id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    // morph happens while the next chapter's top travels from 85% → 25% of the viewport
    p += Math.min(Math.max((vh * 0.85 - top) / (vh * 0.6), 0), 1)
  }
  sceneState.progress = p
  const active = Math.round(p)
  if (active !== sceneState.active) {
    sceneState.active = active
    listeners.forEach((fn) => fn(active))
  }
}
