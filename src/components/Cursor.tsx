import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Desktop only (fine pointer + hover): a ring that trails the cursor and swells over links,
 * shows "Open" over screenshots, and pulls buttons slightly toward the pointer.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x(e.clientX); y(e.clientY)
      el.classList.add('is-on')
      const t = e.target as Element | null
      el.classList.toggle('is-view', !!t?.closest('.shots'))
      el.classList.toggle('is-link', !t?.closest('.shots') && !!t?.closest('a, button, summary, .key'))
    }
    const onLeave = () => el.classList.remove('is-on')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    // magnetic buttons
    const offs: (() => void)[] = []
    document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
      const bx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' })
      const by = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect()
        bx((e.clientX - r.left - r.width / 2) * 0.22)
        by((e.clientY - r.top - r.height / 2) * 0.3)
      }
      const leave = () => { bx(0); by(0) }
      b.addEventListener('pointermove', move)
      b.addEventListener('pointerleave', leave)
      offs.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave) })
    })

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      offs.forEach((f) => f())
    }
  }, [])

  return <div className="cursor" ref={ring} aria-hidden="true"><span>Open ↗</span></div>
}
