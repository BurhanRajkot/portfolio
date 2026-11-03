import { experience, hackathons, profile } from '../data/profile'

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container about">
        <header className="section__head about__head">
          <h2 id="about-title" className="section__title">About</h2>
        </header>

        <div className="about__body">
          <div className="about__prose" data-reveal>
            {profile.about.map((para) => <p key={para}>{para}</p>)}
          </div>

          <div className="about__lists">
            <div data-reveal>
              <h3 className="label">Now</h3>
              <ul className="rows">
                {experience.map((e) => (
                  <li key={e.what}><span>{e.what}</span><span className="rows__sub">{e.where}</span></li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <h3 className="label">Hackathons</h3>
              <ul className="rows rows--inline">
                {hackathons.map((h) => (
                  <li key={h.name}><span>{h.name}</span><span className="rows__sub">{h.when}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
