import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, onChapterChange, sceneState } from '../lib/chapters'
import { scrollToTarget } from '../lib/scroll'

const R = 9
const C = 2 * Math.PI * R

/**
 * Floating "you are here" pill: the current chapter, a ring for overall progress,
 * and a tap to move on to the next chapter. Hidden over the hero and the contact footer.
 */
export default function ChapterPill() {
  const [active, setActive] = useState(sceneState.active)
  const ring = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const off = onChapterChange(setActive)
    let raf = 0
    const tick = () => {
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - sceneState.progress / (CHAPTERS.length - 1)))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { off(); cancelAnimationFrame(raf) }
  }, [])

  const last = CHAPTERS.length - 1
  const hidden = active === 0 || active === last
  const current = CHAPTERS[active]
  const next = CHAPTERS[Math.min(active + 1, last)]

  return (
    <button
      type="button"
      className={`pill${hidden ? ' is-hidden' : ''}`}
      onClick={() => scrollToTarget(`#${next.id}`)}
      aria-label={`Now: ${current.name}. Go to ${next.name}`}
      tabIndex={hidden ? -1 : 0}
    >
      <svg className="pill__ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r={R} />
        <circle cx="12" cy="12" r={R} ref={ring} strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <span className="pill__text" aria-hidden="true">
        <span className="pill__num">{String(active).padStart(2, '0')}</span>
        <span className="pill__name" key={active}>{current.name}</span>
      </span>
      <span className="pill__next" aria-hidden="true">↓</span>
    </button>
  )
}
