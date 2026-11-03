import { useEffect, useState } from 'react'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__name" href="#top">
          Burhanuddin<span className="nav__surname"> Rajkotwala</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links">
            {links.map((l) => <li key={l.href} className={`nav__item--${l.label.toLowerCase()}`}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </nav>
      </div>
    </header>
  )
}
