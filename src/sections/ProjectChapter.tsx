import type { FeaturedProject } from '../data/profile'

/** One featured, live project laid out as a short case study: header → screenshots → details. */
export default function ProjectChapter({ p, eager = false }: { p: FeaturedProject; eager?: boolean }) {
  const loading = eager ? 'eager' : 'lazy'

  return (
    <article className="case" id={p.id} aria-labelledby={`${p.id}-title`}>
      <header className="case__head">
        <h3 id={`${p.id}-title`} className="case__title">{p.title}</h3>
        <p className="case__type">{p.type} · {p.year}</p>
      </header>

      <a
        className={`shots${p.mobile ? ' shots--pair' : ''}`}
        href={p.live}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${p.liveLabel} in a new tab`}
      >
        <figure className="shot shot--desktop">
          <img
            src={p.desktop.src} alt={p.desktop.alt}
            width={p.desktop.width} height={p.desktop.height}
            loading={loading} decoding="async"
            fetchPriority={eager ? 'high' : 'auto'}
          />
        </figure>
        {p.mobile && (
          <figure className="shot shot--phone">
            <img
              src={p.mobile.src} alt={p.mobile.alt}
              width={p.mobile.width} height={p.mobile.height}
              loading={loading} decoding="async"
            />
          </figure>
        )}
        <span className="shots__badge"><span className="dot" aria-hidden="true" />{p.liveLabel} ↗</span>
      </a>

      <div className="case__body">
        <p className="case__summary" data-reveal>{p.summary}</p>

        <div className="case__detail" data-reveal>
          <h4 className="label">What I built</h4>
          <ul className="ticks">
            {p.points.map((pt) => <li key={pt}>{pt}</li>)}
          </ul>
        </div>

        <dl className="case__meta" data-reveal>
          <div><dt className="label">Role</dt><dd>{p.role}</dd></div>
          <div><dt className="label">Stack</dt><dd>{p.stack.join(', ')}</dd></div>
          <div className="case__links">
            <a className="btn btn--primary" href={p.live} target="_blank" rel="noreferrer">Visit site ↗</a>
            {p.source && <a className="btn" href={p.source} target="_blank" rel="noreferrer">Source code ↗</a>}
          </div>
        </dl>
      </div>
    </article>
  )
}
