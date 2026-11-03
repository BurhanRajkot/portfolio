import { useMemo, useRef, useState } from 'react'
import {
  siDocker, siExpress, siFlask, siGit, siGooglegemini, siGreensock, siJavascript, siJetpackcompose, siKotlin, siLinux,
  siNodedotjs, siPostgresql, siPython, siReact, siRedis, siScikitlearn, siShopify, siSupabase, siTailwindcss,
  siThreedotjs, siTypescript, type SimpleIcon,
} from 'simple-icons'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { featured, projects, skillGroups, type Skill } from '../data/profile'

const ICONS: Record<string, SimpleIcon> = {
  docker: siDocker, express: siExpress, flask: siFlask, git: siGit, googlegemini: siGooglegemini, greensock: siGreensock,
  javascript: siJavascript, jetpackcompose: siJetpackcompose, kotlin: siKotlin, linux: siLinux, nodedotjs: siNodedotjs,
  postgresql: siPostgresql, python: siPython, react: siReact, redis: siRedis, scikitlearn: siScikitlearn,
  shopify: siShopify, supabase: siSupabase, tailwindcss: siTailwindcss, threedotjs: siThreedotjs, typescript: siTypescript,
}

/** near-black / near-white brand colours would vanish on one of the themes — use the text colour instead */
function brandColor(hex: string) {
  const n = parseInt(hex, 16)
  const l = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  return l < 0.12 || l > 0.92 ? 'var(--text)' : `#${hex}`
}

interface Key extends Skill { group: string; usedIn: { title: string; href: string }[] }

function buildKeys(): Key[] {
  const all = [
    ...featured.map((p) => ({ title: p.title, stack: p.stack, href: `#${p.id}` })),
    ...projects.map((p) => ({ title: p.title, stack: p.stack, href: '#projects' })),
  ]
  return skillGroups.flatMap(({ group, items }) => items.map((s) => {
    const names = [s.name, ...(s.aliases ?? [])].map((n) => n.toLowerCase())
    const used = all.filter((p) => p.stack.some((t) => names.includes(t.toLowerCase())) || s.also?.includes(p.title))
    const extra = (s.also ?? []).filter((t) => !all.some((p) => p.title === t)).map((title) => ({ title, href: '#top' }))
    return { ...s, group, usedIn: [...used.map(({ title, href }) => ({ title, href })), ...extra] }
  }))
}

function Glyph({ k, size = 26 }: { k: Skill; size?: number }) {
  const icon = k.icon ? ICONS[k.icon] : undefined
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color: brandColor(icon.hex) }}>
        <path d={icon.path} fill="currentColor" />
      </svg>
    )
  }
  return <span className="key__glyph" aria-hidden="true">{k.glyph}</span>
}

export default function Skills() {
  const keys = useMemo(buildKeys, [])
  const groups = skillGroups.map((g) => g.group)
  const [active, setActive] = useState(keys[0].name)
  const [filter, setFilter] = useState<string | null>(null)
  const board = useRef<HTMLDivElement>(null)
  const current = keys.find((k) => k.name === active) ?? keys[0]

  // space bar: a wave of key presses rolls across the board
  const wave = () => {
    if (prefersReducedMotion() || !board.current) return
    const tops = board.current.querySelectorAll('.key__top')
    gsap.timeline()
      .to(tops, { y: 5, duration: 0.09, ease: 'power2.in', stagger: { each: 0.025, from: 'start' } })
      .to(tops, { y: 0, duration: 0.25, ease: 'back.out(3)', stagger: { each: 0.025, from: 'start' } }, 0.09)
  }

  return (
    <section className="section skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <header className="section__head">
          <h2 id="skills-title" className="section__title">What I work with</h2>
          <p className="section__note">Tap a key to see where I’ve used it</p>
        </header>

        <div className="chips" role="group" aria-label="Filter by area">
          <button type="button" className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>All</button>
          {groups.map((g) => (
            <button key={g} type="button" className="chip" aria-pressed={filter === g} onClick={() => setFilter(filter === g ? null : g)}>{g}</button>
          ))}
        </div>

        <div className="skills__layout">
          <div className="kb">
            <div className="kb__plate" ref={board}>
              <div className="kb__keys">
                {keys.map((k) => (
                  <button
                    key={k.name}
                    type="button"
                    className={`key${filter && filter !== k.group ? ' is-dim' : ''}`}
                    aria-pressed={k.name === active}
                    aria-label={k.name}
                    onClick={() => setActive(k.name)}
                  >
                    <span className="key__top">
                      <Glyph k={k} />
                      <span className="key__label">{k.name}</span>
                    </span>
                  </button>
                ))}
                <button type="button" className="key key--space" onClick={wave} aria-label="Play a typing wave">
                  <span className="key__top"><span className="key__label">space</span></span>
                </button>
              </div>
            </div>
          </div>

          <div className="skill-card" aria-live="polite">
            <div className="skill-card__icon"><Glyph k={current} size={34} /></div>
            <div className="skill-card__text">
              <p className="skill-card__group">{current.group}</p>
              <h3 className="skill-card__name">{current.name}</h3>
              {current.usedIn.length > 0 ? (
                <p className="skill-card__used">
                  <span className="label">Used in</span>
                  <span className="skill-card__links">
                    {current.usedIn.map((u) => <a key={u.title} href={u.href}>{u.title}</a>)}
                  </span>
                </p>
              ) : (
                <p className="skill-card__note">{current.note ?? 'Part of my toolkit.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
