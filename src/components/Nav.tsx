import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { profile } from '../data/profile'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects', menuOnly: true },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  // border once scrolled + a hairline that fills with page progress
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 8)
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // full-screen menu (phones): a panel wipes down, the links rise out of their masks
  useEffect(() => {
    const el = menu.current
    if (!el) return
    const items = el.querySelectorAll('.menu__link span, .menu__foot')
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .set(el, { visibility: 'visible' })
      .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' })
      .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05 }, 0.3)
    return () => { tl.current?.kill() }
  }, [])

  useEffect(() => {
    const t = tl.current
    setScrollLocked(open)
    document.documentElement.classList.toggle('menu-open', open)
    if (!t) return
    if (prefersReducedMotion()) { t.progress(open ? 1 : 0).pause(); if (!open) gsap.set(menu.current, { visibility: 'hidden' }); return }
    if (open) t.timeScale(1).play()
    else t.timeScale(1.8).reverse().eventCallback('onReverseComplete', () => gsap.set(menu.current, { visibility: 'hidden' }))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // let the menu start closing before the page moves
    setTimeout(() => scrollToTarget(href), open ? 260 : 0)
  }

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="nav__inner container">
          <a className="nav__name" href="#top" onClick={go('#top')}>
            Burhanuddin<span className="nav__surname"> Rajkotwala</span>
          </a>
          <nav aria-label="Primary">
            <ul className="nav__links">
              {links.filter((l) => !l.menuOnly).map((l) => (
                <li key={l.href}><a href={l.href} onClick={go(l.href)}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
        <span className="nav__progress" ref={bar} aria-hidden="true" />
      </header>

      <div className="menu" id="menu" ref={menu} aria-hidden={!open} inert={!open}>
        <nav className="menu__inner container" aria-label="Menu">
          <ol className="menu__list">
            {links.map((l, i) => (
              <li key={l.href}>
                <a className="menu__link" href={l.href} onClick={go(l.href)}>
                  <span><small>0{i + 1}</small>{l.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="menu__mask">
            <div className="menu__foot">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.location}</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
