import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from './gsap'
import { HERO_DELAY } from './intro'

/** Page-wide GSAP motion: hero intro, title reveals, 3D screenshot tilt, parallax. */
export function useAnimations() {
  useGSAP(() => {
    if (prefersReducedMotion()) return

    // ── hero intro ───────────────────────────────────────────
    const name = SplitText.create('.hero__name', { type: 'chars', mask: 'chars' })
    gsap.timeline({ delay: HERO_DELAY, defaults: { ease: 'expo.out' } })
      .from('.hero__status', { y: 14, autoAlpha: 0, duration: 0.9 })
      .from(name.chars, { yPercent: 115, duration: 1.2, stagger: 0.03 }, 0.05)
      .from(['.hero__lead', '.edu', '.hero__actions'], { y: 18, autoAlpha: 0, duration: 1, stagger: 0.09 }, 0.55)
      .from('.edu__num', { textContent: 0, duration: 1.4, ease: 'power2.out', snap: { textContent: 0.1 },
        onUpdate() { const el = document.querySelector('.edu__num'); if (el) el.textContent = Number(el.textContent).toFixed(1) } }, 0.7)

    // hero text drifts up and fades as you scroll away from it
    gsap.to('.hero__main', {
      yPercent: -12, autoAlpha: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    // ── section + project titles: characters rise out of a mask ─
    gsap.utils.toArray<HTMLElement>('.section__title, .case__title').forEach((el) => {
      const split = SplitText.create(el, { type: 'words,chars', mask: 'words' })
      gsap.from(split.chars, {
        yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.022,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    })
    gsap.utils.toArray<HTMLElement>('.case__type, .section__note, .case__num').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, x: -10, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
    })

    // ── screenshots: tilt up from the floor (desktop), gentle rise (phones) ─
    const mm = gsap.matchMedia()
    mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)' }, (ctx) => {
      const { wide } = ctx.conditions as { wide: boolean }
      gsap.utils.toArray<HTMLElement>('.shots').forEach((shots) => {
        const desktop = shots.querySelector('.shot--desktop')
        const phone = shots.querySelector('.shot--phone')
        gsap.fromTo(desktop,
          wide
            ? { rotateX: 24, scale: 0.88, y: 70, autoAlpha: 0.4 }
            : { scale: 0.9, y: 40, autoAlpha: 0.6, clipPath: 'inset(18% 8% 0% 8% round 22px)' },
          { rotateX: 0, scale: 1, y: 0, autoAlpha: 1, ...(wide ? {} : { clipPath: 'inset(0% 0% 0% 0% round 10px)' }), ease: 'none',
            scrollTrigger: { trigger: shots, start: 'top bottom', end: wide ? 'top 28%' : 'top 45%', scrub: true } })
        if (phone) {
          // the phone rises past the laptop shot and settles before the text below comes into view
          gsap.fromTo(phone,
            { y: wide ? 140 : 40, rotate: wide ? 7 : 4 },
            { y: wide ? -24 : 0, rotate: wide ? -1.5 : 0, ease: 'none',
              scrollTrigger: { trigger: shots, start: 'top bottom', end: wide ? 'top 15%' : 'top 40%', scrub: true } })
        }
      })
    })

    // ── skills keyboard: tilts flat as it arrives, keys "type" in ──
    mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)' }, (ctx) => {
      const { wide } = ctx.conditions as { wide: boolean }
      gsap.fromTo('.kb__plate', { rotateX: wide ? 42 : 28, y: 40 }, {
        rotateX: wide ? 16 : 8, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.kb', start: 'top bottom', end: 'top 35%', scrub: true },
      })
    })
    gsap.from('.kb .key__top', {
      y: 6, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.5)', stagger: { each: 0.035, from: 'start' },
      scrollTrigger: { trigger: '.kb', start: 'top 75%', once: true },
    })

    // ── hairline rules draw across as each section arrives ───
    gsap.utils.toArray<HTMLElement>('.section, .contact').forEach((el) => {
      gsap.fromTo(el, { '--rule': 0 }, { '--rule': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: true } })
    })


    // ── about: the first paragraph lights up word by word as you read ──
    const lead = document.querySelector('.about__prose p')
    if (lead) {
      const words = SplitText.create(lead, { type: 'words' }).words
      gsap.fromTo(words, { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: lead, start: 'top 85%', end: 'bottom 50%', scrub: true },
      })
    }

    // ── other projects: cards deal in from the right ─────────
    gsap.from('.cards .card', {
      x: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: '.cards', start: 'top 88%', once: true },
    })

    // ── contact: the address rises letter by letter ──────────
    const email = document.querySelector('.contact__email')
    if (email) {
      const chars = SplitText.create(email, { type: 'chars', mask: 'chars' }).chars
      gsap.from(chars, {
        yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.018,
        scrollTrigger: { trigger: email, start: 'top 92%', once: true },
      })
    }

    // images and fonts change the page height after first paint
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  })
}
