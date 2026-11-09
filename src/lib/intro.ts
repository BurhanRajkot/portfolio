import { prefersReducedMotion } from './gsap'

/** Whether the intro loader plays on this visit — once per browser session, never with reduced motion. */
export const SHOW_LOADER = (() => {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false
  try { return !sessionStorage.getItem('br:seen') } catch { return false }
})()

/** Seconds before the hero text starts its entrance. */
export const HERO_DELAY = SHOW_LOADER ? 2.05 : 0.3
