import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { inProgress, projects, type Project } from '../data/profile'

/** inline CSS custom properties (animation delays, bar widths) */
const vars = (v: Record<string, string>) => v as CSSProperties

/* ── Animated previews ─────────────────────────────────────────
   Each card gets a tiny illustration of what the project does.
   At rest it shows the finished state; on hover (desktop) or when
   the card scrolls into view (phones) the animation plays. */

const PREVIEWS: Record<string, () => ReactNode> = {
  'App Blocker': () => (
    <div className="pv pv--lock">
      <div className="pv-phone">
        <div className="pv-phone__apps">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="pv-phone__lock">
          <svg viewBox="0 0 48 48" className="pv-ring" aria-hidden="true">
            <circle cx="24" cy="24" r="21" className="pv-ring__track" />
            <circle cx="24" cy="24" r="21" className="pv-ring__fill" pathLength={100} />
          </svg>
          <svg viewBox="0 0 24 24" className="pv-padlock" aria-hidden="true">
            <path className="pv-padlock__shackle" d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" strokeWidth="2" strokeLinecap="round" />
            <rect x="5.5" y="11" width="13" height="9" rx="2" />
          </svg>
        </div>
      </div>
      <p className="pv-caption"><b>Locked</b> · 25:00 left</p>
    </div>
  ),
  Claw: () => (
    <div className="pv pv--chat">
      <p className="pv-bubble pv-bubble--me" style={vars({ '--d': '0s' })}>What’s on today?</p>
      <p className="pv-bubble" style={vars({ '--d': '.55s' })}>3 meetings · 2 tasks due</p>
      <p className="pv-bubble" style={vars({ '--d': '.95s' })}>Inbox summary + 1 draft ready ✓</p>
    </div>
  ),
  'Agentic AI': () => (
    <div className="pv pv--term">
      <div className="pv-term__bar"><i /><i /><i /></div>
      <p className="pv-line pv-line--cmd" style={vars({ '--d': '0s' })}><span>$</span> agent "fix the failing test"</p>
      <p className="pv-line" style={vars({ '--d': '.9s' })}><span>→</span> read_file  src/</p>
      <p className="pv-line" style={vars({ '--d': '1.25s' })}><span>→</span> write_file fix.py</p>
      <p className="pv-line pv-line--ok" style={vars({ '--d': '1.6s' })}><span>✓</span> tests passed</p>
    </div>
  ),
  'Misinfo Detector': () => (
    <div className="pv pv--verdict">
      <div className="pv-agents">
        {['Summary', 'Fact-check', 'News', 'Bias'].map((a, i) => (
          <span key={a} style={vars({ '--d': `${i * 0.18}s` })}>{a}</span>
        ))}
      </div>
      <div className="pv-judge">
        <p><b>Judge</b> · Misleading</p>
        <div className="pv-meter"><i /></div>
        <p className="pv-judge__score">82% confidence</p>
      </div>
    </div>
  ),
  Noitas: () => (
    <div className="pv pv--chart">
      <svg viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
        <path className="pv-chart__area" d="M0 70 L25 62 L50 66 L75 44 L100 50 L125 30 L150 36 L175 16 L200 22 L200 90 L0 90 Z" />
        <path className="pv-chart__line" pathLength={100} d="M0 70 L25 62 L50 66 L75 44 L100 50 L125 30 L150 36 L175 16 L200 22" />
      </svg>
      <p className="pv-caption">noitas · posts with data</p>
    </div>
  ),
  MediBase: () => (
    <div className="pv pv--shap">
      {[
        { f: 'Troponin', v: 82, pos: true },
        { f: 'CRP', v: 48, pos: true },
        { f: 'Cholesterol', v: 26, pos: false },
      ].map((b, i) => (
        <div className="pv-bar" key={b.f} style={vars({ '--w': `${b.v}%`, '--d': `${i * 0.15}s` })}>
          <span>{b.f}</span>
          <div className={b.pos ? 'is-pos' : 'is-neg'}><i /></div>
        </div>
      ))}
      <p className="pv-caption">SHAP · why the model decided</p>
    </div>
  ),
}

function Card({ p }: { p: Project }) {
  const ref = useRef<HTMLLIElement>(null)
  const [live, setLive] = useState(false)
  const primary = p.links[0]

  // touch screens have no hover: play the preview once the card is mostly in view
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: hover)').matches) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect() } }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // desktop: tilt the card toward the cursor
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`)
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`)
  }
  const onLeave = (e: PointerEvent<HTMLLIElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <li ref={ref} className={`card${live ? ' is-live' : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="card__preview">{PREVIEWS[p.title]?.()}</div>
      <div className="card__content">
        <p className="card__type">{p.type.includes(p.year) ? p.type : `${p.type} · ${p.year}`}</p>
        <h3 className="card__title">
          <a className="card__stretch" href={primary.href} target="_blank" rel="noreferrer">{p.title}</a>
        </h3>
        <p className="card__summary">{p.summary}</p>
        <details className="card__more">
          <summary>How it works</summary>
          <ul className="ticks">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        </details>
        <div className="card__foot">
          <span className="card__stack">{p.stack.join(' · ')}</span>
          <span className="card__link" aria-hidden="true">{primary.label} ↗</span>
        </div>
      </div>
    </li>
  )
}

export default function Projects() {
  // phones: the cards become a swipeable row; track which card is in view for the counter
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const onScroll = () => {
    const el = track.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    setIndex(Math.min(Math.round(el.scrollLeft / (card.offsetWidth + 12)), projects.length - 1))
  }

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section__head">
          <h2 id="projects-title" className="section__title">Other projects</h2>
          <p className="section__note">Apps, AI tools &amp; hackathon builds</p>
        </header>

        <div className="building" data-reveal>
          <h3 className="label">Currently building</h3>
          <ul>
            {inProgress.map((p) => (
              <li key={p.title} className="building__item">
                <p className="building__title">{p.title} <span className="tag">In progress</span></p>
                <p className="building__type">{p.type}</p>
                <p className="building__summary">{p.summary}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="cards__bar">
          <h3 className="label">More projects</h3>
          <p className="cards__count" aria-hidden="true">{index + 1} / {projects.length} <span>· swipe</span></p>
        </div>
        <ul className="cards" ref={track} onScroll={onScroll} data-reveal>
          {projects.map((p) => <Card key={p.title} p={p} />)}
        </ul>
      </div>
    </section>
  )
}
