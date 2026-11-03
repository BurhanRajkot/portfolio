import { lazy, Suspense, useEffect } from 'react'
import { useReveal } from './lib/useReveal'
import { useAnimations } from './lib/animations'
import { initSmoothScroll } from './lib/scroll'
import { measureStage, updateProgress } from './lib/chapters'
import { featured } from './data/profile'
import { SPLINE_HERO_SCENE } from './config'
import Nav from './components/Nav'
import SplineScene from './components/SplineScene'
import Hero from './sections/Hero'
import ProjectChapter from './sections/ProjectChapter'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import About from './sections/About'
import Contact from './sections/Contact'

const ParticleScene = lazy(() => import('./three/ParticleScene'))

export default function App() {
  useReveal()
  useAnimations()

  useEffect(() => {
    initSmoothScroll()
    const measure = () => { measureStage(); updateProgress() }
    measure()
    // only re-measure the hero stage on real size changes (mobile URL-bar show/hide fires resize too)
    let lastW = window.innerWidth
    const onResize = () => { if (window.innerWidth !== lastW) { lastW = window.innerWidth; measureStage() } updateProgress() }
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', measure)
    document.fonts?.ready.then(measure)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', measure)
    }
  }, [])

  return (
    <>
      {SPLINE_HERO_SCENE ? (
        <div className="scene"><SplineScene scene={SPLINE_HERO_SCENE} /></div>
      ) : (
        <Suspense fallback={null}>
          <ParticleScene />
        </Suspense>
      )}
      <a className="skip" href="#work">Skip to work</a>
      <Nav />
      <main>
        <Hero />
        <section id="work" className="section" aria-labelledby="work-title">
          <div className="container">
            <header className="section__head">
              <h2 id="work-title" className="section__title">Selected work</h2>
              <p className="section__note">Live sites, in production</p>
            </header>
            <div className="cases">
              {featured.map((p, i) => <ProjectChapter key={p.id} p={p} eager={i === 0} />)}
            </div>
          </div>
        </section>
        <Skills />
        <Projects />
        <About />
      </main>
      <Contact />
    </>
  )
}
