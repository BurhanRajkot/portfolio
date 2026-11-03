// Builds the résumé PDFs into /public:
//   Burhanuddin-Rajkotwala-Resume.pdf           one page
//   Burhanuddin-Rajkotwala-Resume-Projects.pdf  the résumé + a write-up of each project
//
// Run:  npm run resume   (needs Chromium / Chrome installed)
// Contact details, education and hackathons come from src/data/profile.ts;
// the longer project write-ups live below.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { profile, hackathons } from '../src/data/profile.ts'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = join(here, 'out')
mkdirSync(out, { recursive: true })

const SITE = 'https://burhanuddin-rajkotwala.vercel.app'
const host = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const a = (href, text = host(href)) => `<a href="${href}">${text}</a>`
const list = (items) => `<ul class="ticks">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const chips = (items) => `<div class="chips">${items.map((i) => `<span>${i}</span>`).join('')}</div>`
// Chrome stores WebP images uncompressed in a PDF, so hand it JPEG copies when ImageMagick is available
const hasMagick = (() => { try { execFileSync('magick', ['-version'], { stdio: 'ignore' }); return true } catch { return false } })()
const img = (src) => {
  if (!hasMagick) return `../../public${src}`
  const name = src.split('/').pop().replace(/\.\w+$/, '.jpg')
  execFileSync('magick', [join(root, 'public', src), '-background', 'white', '-flatten', '-quality', '84', join(out, name)])
  return name
}

// ───────────────────────────── shared résumé page ─────────────────────────────

const skills = [
  ['Frontend', 'React, TypeScript, JavaScript, Next.js, Tailwind CSS, Three.js, GSAP'],
  ['Backend', 'Node.js, Express, Flask, PostgreSQL, Supabase, Redis, REST APIs'],
  ['Commerce', 'Shopify, Liquid, Shopify Functions'],
  ['Data & AI', 'Python, PyTorch, scikit-learn, XGBoost, SHAP, Gemini API, LLM agents'],
  ['Mobile & tools', 'Kotlin, Jetpack Compose, Docker, Kubernetes, Git, Linux, Vercel'],
]

function resumePage(foot = '') {
  return `
<section class="page">
  <header class="head">
    <h1>${profile.name}</h1>
    <p class="role">Full-stack developer · B.Tech CSE (Data Science) student · ${profile.location}</p>
    <p class="contact">
      ${a(`mailto:${profile.email}`, profile.email)}
      ${a(profile.github)}
      ${a(SITE, `Portfolio: ${host(SITE)}`)}
      ${profile.linkedin ? a(profile.linkedin) : ''}
      <span><span class="dot"></span>${profile.status}</span>
    </p>
  </header>

  <div class="sec">
    <h2 class="label">Profile</h2>
    <p>Third-year Computer Science (Data Science) student with a 9.0 CGPA. I build websites for real businesses and my own full-stack and AI products, and take each one from first design to a live domain.</p>
  </div>

  <div class="sec">
    <h2 class="label">Education</h2>
    <div class="entry">
      <div class="entry__head">
        <p class="entry__title">${profile.education.school} <span class="sub">· Mumbai</span></p>
        <p class="entry__meta">Current · 3rd year</p>
      </div>
      <p>${profile.education.degree} · <b>CGPA 9.0</b></p>
    </div>
  </div>

  <div class="sec">
    <h2 class="label">Experience</h2>
    <div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">Freelance web developer <span class="sub">· Self-employed, Mumbai</span></p>
          <p class="entry__meta">Current</p>
        </div>
        ${list([
          `<b>Attarwala’s</b> (${a('https://www.attarwalas.com/')}): built and maintain the custom, mobile-first Shopify theme for a Mumbai perfume house running since 1998. Wrote a Shopify Function that enforces “pick any N for a fixed price” bundles at checkout, with one discount covering every current and future offer.`,
          `<b>Enlighten SEN Services</b> (${a('https://www.enlightensenservices.in/')}): designed and built a new Next.js + Tailwind site for a special-education company, replacing an old PHP template. Enquiry forms email the team through Resend with a WhatsApp fallback; moved the domain to Vercel with HTTPS.`,
          `<b>Deccan Cans</b> (in progress): rebuilding a B2B packaging manufacturer’s site as a custom Shopify OS 2.0 theme with a request-a-quote catalogue instead of a cart.`,
        ])}
      </div>
    </div>
  </div>

  <div class="sec">
    <h2 class="label">Projects</h2>
    <div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">StreamVault <span class="sub">· Movie &amp; TV discovery platform, solo</span></p>
          <p class="entry__meta">${a('https://stream-vault-7u6q.vercel.app/', 'Live')} · ${a('https://github.com/BurhanRajkot/StreamVault', 'Source')}</p>
        </div>
        ${list([
          'CineMatch recommender: nine candidate sources merged with reciprocal rank fusion, then filtering, ranking (diversity, exploration, position-bias correction) and mixing into home-page rows; a two-tower PyTorch model supplies user and title embeddings.',
          'Auth0 sign-in with 2FA, Redis caching, rate limiting, admin dashboard; Docker / Kubernetes configs and Playwright end-to-end tests.',
        ])}
        <p class="stack">React · TypeScript · Express · Supabase · Redis · Python · PyTorch</p>
      </div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">App Blocker <span class="sub">· Android app</span></p>
          <p class="entry__meta">${a('https://github.com/BurhanRajkot/Block-APP', 'Source')}</p>
        </div>
        <p>Locks chosen apps for a set time. An Accessibility Service bounces locked apps (and the settings that could disable it) back home, Device Admin guards uninstalling, and the only early exit is an unlock key signed offline by a separate Python tool. <span class="stack">Kotlin · Jetpack Compose · Room</span></p>
      </div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">Misinfo Detector <span class="sub">· Mumbai Hacks 2025</span></p>
          <p class="entry__meta">${a('https://github.com/BurhanRajkot/Mumbai-Hacks-2025', 'Source')}</p>
        </div>
        <p>Chrome extension that fact-checks a page with a team of AI agents (summary, fact-check, news cross-reference, bias) and a judge agent that returns a verdict with a confidence score. <span class="stack">Python · Flask · Chrome Extension</span></p>
      </div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">MediBase <span class="sub">· REDACT 2025, SPIT</span></p>
          <p class="entry__meta">${a('https://github.com/BurhanRajkot/REDACT-2025', 'Source')}</p>
        </div>
        <p>Predicts a likely condition from blood-test values with XGBoost, explains each prediction with SHAP and flags out-of-range values; Gemini writes a plain-language summary. <span class="stack">Python · XGBoost · SHAP · Streamlit</span></p>
      </div>
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">Claw &amp; Agentic AI <span class="sub">· AI agents</span></p>
          <p class="entry__meta">${a('https://burhanrajkot.github.io/claw-app/', 'Claw')} · ${a('https://github.com/BurhanRajkot/agentic-ai', 'Agentic AI')}</p>
        </div>
        <p>Claw: a Telegram assistant across my Gmail, Calendar, Tasks and Drive. Agentic AI: a command-line coding agent using Gemini function calling, sandboxed to one folder.</p>
      </div>
    </div>
  </div>

  <div class="sec">
    <h2 class="label">Skills</h2>
    <dl class="skills">${skills.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
  </div>

  <div class="sec">
    <h2 class="label">Hackathons</h2>
    <p class="inline-list">${hackathons.map((h) => `<span><b>${h.name}</b> ${h.when}</span>`).join('')}</p>
  </div>
  ${foot}
</section>`
}

// ───────────────────────────── project write-ups ─────────────────────────────

const foot = (n) => `<footer class="page__foot"><span>${profile.name} · Résumé &amp; projects</span><span>${host(SITE)} · ${n}</span></footer>`

function featuredPage({ n, kicker, title, type, links, desktop, mobile, lede, body, side }) {
  return `
<section class="page">
  <header class="proj-head">
    <div>
      <p class="kicker">${kicker}</p>
      <h2>${title}</h2>
      <p class="type">${type}</p>
    </div>
    <div class="links">${links.map(([href, text]) => a(href, text)).join('')}</div>
  </header>
  <div class="shots">
    <img class="desk" src="${img(desktop)}" alt="">
    <img class="phone" src="${img(mobile)}" alt="">
  </div>
  <div class="cols">
    <div>
      <p class="lede">${lede}</p>
      ${body}
    </div>
    <aside class="side">${side}</aside>
  </div>
  ${foot(n)}
</section>`
}

const block = (h, html) => `<div class="block"><h3>${h}</h3>${html}</div>`

const attarwalas = featuredPage({
  n: 2,
  kicker: 'Client work · 01',
  title: 'Attarwala’s',
  type: 'Shopify store for a Mumbai perfume &amp; attar house, in business since 1998',
  links: [['https://www.attarwalas.com/', 'attarwalas.com ↗'], ['https://github.com/BurhanRajkot/Attarwalas-theme', 'Theme source ↗']],
  desktop: '/work/attarwalas.webp',
  mobile: '/work/attarwalas-mobile.webp',
  lede: 'I built the store’s custom Shopify theme and still maintain it: new pages, offers, audits and fixes as the business needs them.',
  body: [
    block('The problem', '<p>The shop runs offers like <i>“Double Dhamaka: any 2 perfumes for ₹1,999”</i>. Shopify has no built-in way to charge a fixed total for a bundle the customer picks themselves, and fake “bundle products” would break inventory and the packing slips.</p>'),
    block('How I solved it', `<p>The offer page adds each chosen perfume as an ordinary cart line, tagged with hidden properties: a bundle id, the bundle price and the bundle size. A <b>Shopify Function</b> (a discount that runs inside checkout) groups the lines by bundle id and discounts them down to the bundle price.</p>
      <div class="receipt"><span>Oud 80 ML</span><span>₹1,500.00</span><span>Aura 80 ML</span><span>₹1,500.00</span><span class="off">Double Dhamaka</span><span class="off">−₹1,001.00</span><span class="total">Total</span><span class="total">₹1,999.00</span></div>
      <p>Stock, fulfilment and packing slips work normally because every perfume is a real item, and the customer sees what they saved. The price travels on the cart lines, so <b>one automatic discount covers every offer</b> the store will ever run. New offers need no code.</p>`),
    block('Also built', list(['Mobile-first theme design', 'Gift sets, customisation and order-tracking pages', 'Ongoing audits and improvements'])),
  ].join(''),
  side: [
    block('Role', '<p>Theme development &amp; maintenance</p>'),
    block('Year', '<p>2026, ongoing</p>'),
    block('Stack', chips(['Shopify', 'Liquid', 'Shopify Functions', 'JavaScript'])),
  ].join(''),
})

const streamvault = featuredPage({
  n: 3,
  kicker: 'Personal product · 02',
  title: 'StreamVault',
  type: 'Movie &amp; TV discovery platform with its own recommendation engine',
  links: [['https://stream-vault-7u6q.vercel.app/', 'Live site ↗'], ['https://github.com/BurhanRajkot/StreamVault', 'Source ↗']],
  desktop: '/work/streamvault.webp',
  mobile: '/work/streamvault-mobile.webp',
  lede: 'Built solo, end to end: the React frontend, the Express API, a Python ML pipeline and the infrastructure configs.',
  body: [
    block('CineMatch: how recommendations are made', `<ol class="steps">
      <li><b>Candidates</b>Nine sources: collaborative filtering; genre, cast, keyword and graph discovery; TMDB recommendations and similar titles; trending; a popular fallback. Merged with reciprocal rank fusion.</li>
      <li><b>Filtering</b>Removes titles already watched, disliked, duplicated, low quality or in suppressed categories.</li>
      <li><b>Ranking</b>Scores what’s left with weights that refresh over time, corrects for position bias, adds exploration and re-ranks for diversity.</li>
      <li><b>Mixing</b>Builds the home page as rows of sections, like a streaming service would.</li>
    </ol>`),
    block('The ML part', '<p>A <b>two-tower neural network</b> in PyTorch learns user and title embeddings from watch activity. A pipeline extracts the training data, trains the model and uploads the embeddings to Supabase, where the API reads them as one of its signals.</p>'),
    block('The product around it', list([
      'Browse by streaming service (TMDB watch-provider data); favourites and continue-watching',
      'Auth0 sign-in with 2FA, onboarding that seeds your taste profile, admin dashboard',
      'Redis caching, rate limiting, Helmet / CORS / HTTPS hardening',
      'Docker and Kubernetes configs, unit tests across the pipeline, Playwright end-to-end tests',
    ])),
  ].join(''),
  side: [
    block('Role', '<p>Solo: design, frontend, API, ML</p>'),
    block('Year', '<p>2026</p>'),
    block('Stack', chips(['React', 'TypeScript', 'Express', 'Supabase', 'Redis', 'Python', 'PyTorch', 'Docker', 'Kubernetes'])),
  ].join(''),
})

const enlighten = featuredPage({
  n: 4,
  kicker: 'Client work · 03',
  title: 'Enlighten SEN Services',
  type: 'Website for a Mumbai special-education (SEN) services company',
  links: [['https://www.enlightensenservices.in/', 'enlightensenservices.in ↗']],
  desktop: '/work/enlighten.webp',
  mobile: '/work/enlighten-mobile.webp',
  lede: 'Enlighten places one-to-one teachers with children who have autism, ADHD, Down syndrome, cerebral palsy and learning or intellectual disabilities. I replaced their old PHP template site with a new one written for the parents looking for help.',
  body: [
    block('What I built', list([
      'A fast <b>Next.js + Tailwind</b> site: home, a page for each of the five services, about, team, blog with post pages, careers and contact, plus sitemap and robots',
      'A warm visual identity built on their line <i>“Lighting up your child’s path”</i>: a dotted trail, a smiling sun, sparkles and wavy colour bands, around the client’s own illustrations',
      'Enquiry and career forms that post to a serverless route and <b>email the team through Resend</b>. If email is down, the form falls back to a pre-filled WhatsApp message, email or call',
      'Mobile polish: page transitions, an animated menu with call and enquiry buttons, and a floating WhatsApp button',
    ])),
    block('Launch', '<p>I moved the domain’s DNS to Vercel and set up HTTPS (renews automatically), with www as the main address. Every push to <code>main</code> deploys automatically.</p>'),
    block('Accessibility', '<p>Skip link, visible focus rings, semantic landmarks, an FAQ built on native <code>&lt;details&gt;</code>, and all motion turned off for people who prefer reduced motion.</p>'),
  ].join(''),
  side: [
    block('Role', '<p>Design, development, hosting &amp; domain</p>'),
    block('Year', '<p>2026</p>'),
    block('Stack', chips(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Resend', 'Vercel'])),
  ].join(''),
})

function mini({ title, type, summary, points, note, stack, links }) {
  return `
<article class="mini">
  <div>
    <h3>${title}</h3>
    <p class="type">${type}</p>
    <p class="summary">${summary}</p>
    ${list(points)}
    ${note ? `<p class="note">${note}</p>` : ''}
  </div>
  <aside>
    ${block('Stack', chips(stack))}
    ${block('Links', links.map(([href, text]) => `<p>${a(href, text.replaceAll('/', '/<wbr>'))}</p>`).join(''))}
  </aside>
</article>`
}

const morePage1 = `
<section class="page">
  <h2 class="more-title">More projects <span class="note">Apps, AI tools and hackathon builds</span></h2>
  ${mini({
    title: 'App Blocker',
    type: 'Android app · 2026',
    summary: 'Locks an app for a set time with no in-app way to cheat. The only early exit is an unlock key signed offline.',
    points: [
      'An <b>Accessibility Service</b> spots locked apps and sends you back to the home screen the moment they open',
      'While a lock runs, it also blocks the settings screens that could switch it off: Accessibility settings, Device Admin and the app’s own uninstall page',
      'Registering as a <b>Device Admin</b> makes uninstalling a deliberate extra step',
      'Unlock keys are signed with a private key by a separate Python tool on my PC; the app only holds the public key and verifies them',
    ],
    note: 'I documented its limits honestly: it is a strong deterrent, not a guarantee. Safe Mode can still get around it without factory-reset device-owner provisioning.',
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'Python'],
    links: [['https://github.com/BurhanRajkot/Block-APP', 'github.com/BurhanRajkot/Block-APP']],
  })}
  ${mini({
    title: 'Misinfo Detector',
    type: 'Hackathon · Mumbai Hacks 2025',
    summary: 'A Chrome extension that fact-checks the page you are reading using a team of AI agents.',
    points: [
      'Separate agents for summary, fact-checking, news cross-reference and bias',
      'A final “judge” agent weighs their findings and returns a verdict with a confidence score',
      'Works on a highlighted passage or on every headline on a page',
    ],
    stack: ['Python', 'Flask', 'Chrome Extension', 'LLM agents'],
    links: [['https://github.com/BurhanRajkot/Mumbai-Hacks-2025', 'github.com/BurhanRajkot/Mumbai-Hacks-2025']],
  })}
  ${mini({
    title: 'MediBase',
    type: 'Hackathon · REDACT 2025, SPIT',
    summary: 'Predicts a likely condition from blood-test values and explains which values drove the prediction.',
    points: [
      'XGBoost classifier over biomarkers such as troponin, CRP and cholesterol',
      'SHAP explanations for every prediction, with out-of-range values flagged',
      'Gemini turns the result into a plain-language summary',
    ],
    stack: ['Python', 'XGBoost', 'SHAP', 'Streamlit', 'Gemini'],
    links: [['https://github.com/BurhanRajkot/REDACT-2025', 'github.com/BurhanRajkot/REDACT-2025']],
  })}
  ${mini({
    title: 'Claw',
    type: 'AI assistant · 2026',
    summary: 'A private assistant I talk to on Telegram that works across my Gmail, Calendar, Tasks and Drive.',
    points: [
      'Summarises my inbox and drafts replies for me to review before sending',
      'Creates calendar events and manages my to-do list from a chat message',
      'Sends a short daily briefing of meetings, tasks and important email',
    ],
    stack: ['LLM agent', 'Telegram', 'Google APIs'],
    links: [['https://burhanrajkot.github.io/claw-app/', 'burhanrajkot.github.io/claw-app']],
  })}
  ${foot(5)}
</section>`

const morePage2 = `
<section class="page">
  ${mini({
    title: 'Agentic AI',
    type: 'Developer tool · 2025',
    summary: 'A command-line coding agent that can read, write and run code inside a sandboxed project folder.',
    points: [
      'Gemini function calling picks the right tool for a plain-English request',
      'Tools to list, read, write and delete files and to run Python scripts, returning their output',
      'Every file path is checked so the agent can never leave the working directory',
    ],
    stack: ['Python', 'Gemini API'],
    links: [['https://github.com/BurhanRajkot/agentic-ai', 'github.com/BurhanRajkot/agentic-ai']],
  })}
  ${mini({
    title: 'This portfolio',
    type: 'Website · 2026',
    summary: 'My portfolio site, where a cloud of particles reshapes itself for each section as you scroll.',
    points: [
      'Three.js particle system morphing between seven shapes (a perfume bottle, a play button, a sun and more), written as custom GLSL shaders',
      'Cursor repulsion and colours that follow your light or dark theme; a 3D keyboard shows where I used each skill',
      'All content lives in one data file, so updating projects needs no component changes',
    ],
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Vite'],
    links: [[SITE, host(SITE)]],
  })}
  ${mini({
    title: 'Noitas',
    type: 'Personal blog · 2026',
    summary: 'My blog on programming, game development, books and life, with charts generated from data.',
    points: ['Hugo with custom layouts and shortcodes', 'Python scripts generate interactive Plotly charts for posts'],
    stack: ['Hugo', 'Python', 'Plotly'],
    links: [['https://github.com/BurhanRajkot/Blog', 'github.com/BurhanRajkot/Blog']],
  })}
  <div class="closing">
    <div>
      <p class="kicker">Currently building</p>
      <h3>Deccan Cans <span class="tag">In progress</span></h3>
      <p>Rebuilding a B2B packaging manufacturer’s website as a custom Shopify OS 2.0 theme: a product catalogue with request-a-quote instead of a cart.</p>
    </div>
    <div>
      <p class="kicker">Get in touch</p>
      <h3>${profile.status}</h3>
      <p>${a(`mailto:${profile.email}`, profile.email)}</p>
      <p>${a(profile.github)} · ${a(SITE, host(SITE))}</p>
    </div>
  </div>
  ${foot(6)}
</section>`

// ───────────────────────────── write + print ─────────────────────────────

const doc = (title, pages) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="../style.css"></head>
<body>${pages}</body></html>`

const docs = [
  ['Burhanuddin-Rajkotwala-Resume', `${profile.name}: Résumé`, resumePage()],
  ['Burhanuddin-Rajkotwala-Resume-Projects', `${profile.name}: Résumé & projects`,
    resumePage(foot(1)) + attarwalas + streamvault + enlighten + morePage1 + morePage2],
]

const chrome = ['chromium', 'google-chrome-stable', 'google-chrome', 'chrome']
  .map((c) => { try { return execFileSync('which', [c], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return '' } })
  .find(Boolean)
if (!chrome) throw new Error('Chromium or Chrome is needed to print the PDFs')

for (const [file, title, pages] of docs) {
  const html = join(out, `${file}.html`)
  writeFileSync(html, doc(title, pages))
  const pdf = join(root, 'public', `${file}.pdf`)
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
    '--virtual-time-budget=4000', `--print-to-pdf=${pdf}`, `file://${html}`,
  ], { stdio: 'ignore' })
  if (!existsSync(pdf)) throw new Error(`Failed to write ${pdf}`)
  console.log('wrote', pdf.replace(root + '/', ''))
}
