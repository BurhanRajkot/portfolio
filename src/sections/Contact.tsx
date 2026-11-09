import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 20000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const time = useLocalTime()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const socials = [
    { label: 'GitHub', href: profile.github },
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'Résumé', href: profile.resume },
    { label: 'Résumé + projects', href: profile.resumeProjects },
  ].filter((s) => s.href)

  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" className="section__title">Contact</h2>
        <p className="contact__lead" data-reveal>
          Need a website, a Shopify store or an extra pair of hands on a web app? I’m also looking for internships.
          Email is the best way to reach me.
        </p>
        <a className="contact__email" href={`mailto:${profile.email}`} data-reveal>
          <span className="contact__part">{profile.email.split('@')[0]}</span><wbr /><span className="contact__part">@{profile.email.split('@')[1]}</span>
        </a>
        <div className="contact__actions" data-reveal>
          <button className="btn" type="button" onClick={copy} aria-live="polite">
            {copied ? 'Copied ✓' : 'Copy email'}
          </button>
          {socials.map((s) => (
            <a key={s.label} className="btn" href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>
          ))}
        </div>

        <div className="footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location} · {time} local time</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
