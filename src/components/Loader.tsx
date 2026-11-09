import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { setScrollLocked } from '../lib/scroll'
import { sceneState } from '../lib/chapters'
import { SHOW_LOADER } from '../lib/intro'

/** First visit per session: a counter runs to 100, then the curtain lifts onto the hero. */
export default function Loader() {
  const [done, setDone] = useState(!SHOW_LOADER)
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (done || !root.current) return
    // deferred a frame so smooth scrolling exists before we pause it
    const raf = requestAnimationFrame(() => setScrollLocked(true))
    const count = { v: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.setItem('br:seen', '1') } catch { /* private mode */ }
        setScrollLocked(false)
        setDone(true)
      },
    })
      .to(count, {
        v: 100, duration: 1.25, ease: 'power2.inOut',
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(count.v)).padStart(3, '0') },
      })
      .to('.loader__bar i', { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
      .to('.loader__row', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, '+=0.1')
      .add(() => { sceneState.ready = true })
      .to(root.current, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.2')
    return () => { cancelAnimationFrame(raf); tl.kill() }
  }, [done])

  if (done) return null
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__inner container">
        <div className="loader__mask"><p className="loader__row loader__name">Burhanuddin Rajkotwala</p></div>
        <div className="loader__mask"><p className="loader__row loader__role">Websites · stores · web apps</p></div>
        <div className="loader__mask loader__count"><span className="loader__row"><span ref={num}>000</span></span></div>
        <div className="loader__bar"><i /></div>
      </div>
    </div>
  )
}
