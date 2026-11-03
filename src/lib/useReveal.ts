import { useEffect } from 'react'

/**
 * Fades [data-reveal] elements in once as they enter the viewport.
 * Content is visible by default; the hidden state only applies once JS adds `html.reveal-ready`,
 * so nothing is lost if JS is slow or motion is reduced.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const vh = window.innerHeight
    // anything already on screen stays visible — no flash on first paint
    els.forEach((el) => { if (el.getBoundingClientRect().top < vh) el.classList.add('is-in') })
    document.documentElement.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el) })
    return () => io.disconnect()
  }, [])
}
