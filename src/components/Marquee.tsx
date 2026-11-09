import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap'

const WORDS = ['Shopify stores', 'Web apps', 'AI tools', 'Android apps', 'Hackathon builds', 'Recommendation engines']

/** An endless strip of what I make. Scrolling speeds it up and flips its direction. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const loop = gsap.to('.marquee__track', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
    // start deep into the repeats so it can also run backwards
    loop.totalTime(loop.duration() * 500)
    let dir = 1
    const settle = () => gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out', overwrite: true })
    const st = ScrollTrigger.create({
      onUpdate(self) {
        dir = self.direction
        const boost = Math.min(Math.abs(self.getVelocity()) / 250, 6)
        gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.15, overwrite: true, onComplete: settle })
      },
    })
    return () => { st.kill(); loop.kill() }
  }, { scope: root })

  const row = (copy: number) => WORDS.map((w) => (
    <span key={`${copy}-${w}`} className="marquee__item" aria-hidden={copy > 0 || undefined}>{w}<i /></span>
  ))

  return (
    <div className="marquee" ref={root}>
      <p className="sr-only">I build {WORDS.join(', ').toLowerCase()}.</p>
      <div className="marquee__track" aria-hidden="true">{row(0)}{row(1)}</div>
    </div>
  )
}
