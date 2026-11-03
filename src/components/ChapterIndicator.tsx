import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, onChapterChange, sceneState } from '../lib/chapters'
import { scrollToTarget } from '../lib/scroll'

/** Fixed "you are here" rail: which chapter you're in and how far through the story you are. */
export default function ChapterIndicator() {
  const [active, setActive] = useState(sceneState.active)
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const off = onChapterChange(setActive)
    let raf = 0
    const tick = () => {
      if (fill.current) fill.current.style.transform = `scaleY(${sceneState.progress / (CHAPTERS.length - 1)})`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { off(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <nav className="rail" aria-label="Chapters">
      <div className="rail__track"><div className="rail__fill" ref={fill} /></div>
      <ol>
        {CHAPTERS.map((c, i) => (
          <li key={c.id} className={i === active ? 'is-active' : ''}>
            <button onClick={() => scrollToTarget(`#${c.id}`)}>
              <span className="rail__num">0{i}</span>
              <span className="rail__name">{c.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
