import { profile } from '../data/profile'

export default function Hero() {
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero__main">
          <p className="hero__status"><span className="dot" aria-hidden="true" />{profile.status}</p>
          <h1 className="hero__name">
            <span>{first}</span> <span>{rest.join(' ')}</span>
          </h1>
          <p className="hero__lead">
            Full-stack developer in {profile.location.split(',')[0]}. I build <a href="#attarwalas">Shopify stores</a> for
            local businesses and products like <a href="#streamvault">StreamVault</a>.
          </p>

          <div className="edu">
            <p className="edu__score"><span className="edu__num">9.0</span><span className="edu__unit">CGPA</span></p>
            <div className="edu__text">
              <p className="edu__school">{profile.education.school}</p>
              <p className="edu__degree">B.Tech CSE (Data Science) · 3rd year</p>
            </div>
          </div>

          <div className="hero__actions">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>Email me</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
