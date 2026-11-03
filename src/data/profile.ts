// ─────────────────────────────────────────────────────────────
//  All portfolio content lives here. Edit this file to update
//  text, links and projects — no component changes needed.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Burhanuddin Rajkotwala',
  role: 'Full-stack developer',
  location: 'Mumbai, India',
  timezone: 'Asia/Kolkata',
  email: 'burhanuddinrajkotwala11@gmail.com',
  github: 'https://github.com/BurhanRajkot',
  linkedin: '', // add your LinkedIn URL and it shows up in Contact
  resume: '', // e.g. '/resume.pdf' (put the file in /public)
  intro:
    'From Shopify stores for real businesses to a streaming platform with its own recommendation engine — I take ideas all the way to a live site.',
  status: 'Open to internships & freelance work',
  about: [
    "I'm a third-year Computer Science (Data Science) student at DJ Sanghvi College of Engineering, Mumbai, with a 9.0 CGPA. I enjoy web development more than competitive programming — I'd rather ship something people use.",
    'Alongside college I build Shopify stores for local businesses, work on my own products, and take part in hackathons, where I learnt to scope fast and ship under pressure.',
  ],
  education: {
    degree: 'B.Tech, Computer Science & Engineering (Data Science)',
    school: 'DJ Sanghvi College of Engineering',
    detail: '3rd year · CGPA 9.0',
  },
}

export interface Shot {
  src: string
  alt: string
  /** intrinsic size — reserves space so the page doesn't jump while images load */
  width: number
  height: number
}

export interface FeaturedProject {
  id: string
  title: string
  type: string
  year: string
  summary: string
  role: string
  points: string[]
  stack: string[]
  live: string
  liveLabel: string
  source?: string
  desktop: Shot
  mobile?: Shot
}

/** Live, shipped work — shown large with real screenshots. */
export const featured: FeaturedProject[] = [
  {
    id: 'attarwalas',
    title: "Attarwala's",
    type: 'Client · Shopify store',
    year: '2026',
    summary:
      'Online store for a Mumbai perfume and attar house, in business since 1998. I built and maintain their custom Shopify theme.',
    role: 'Theme development & maintenance',
    points: [
      'Custom theme on Shopify, designed for mobile-first shopping',
      '"Pick any N" bundle offers with a fixed bundle price, enforced at checkout by a Shopify Function',
      'Gift sets, customisation and order-tracking pages; ongoing audits and improvements',
    ],
    stack: ['Shopify', 'Liquid', 'Shopify Functions', 'JavaScript'],
    live: 'https://www.attarwalas.com/',
    liveLabel: 'attarwalas.com',
    source: 'https://github.com/BurhanRajkot/Attarwalas-theme',
    desktop: { src: '/work/attarwalas.webp', alt: "Attarwala's homepage on desktop", width: 1600, height: 1000 },
    mobile: { src: '/work/attarwalas-mobile.webp', alt: "Attarwala's homepage on mobile", width: 600, height: 1298 },
  },
  {
    id: 'streamvault',
    title: 'StreamVault',
    type: 'Personal product · Full-stack',
    year: '2026',
    summary:
      'A movie and TV discovery platform with its own recommendation engine, built end-to-end — frontend, API, ML pipeline and infrastructure.',
    role: 'Solo — design, frontend, API, ML',
    points: [
      'CineMatch: a multi-stage recommender (candidates → ranking → mixing) fed by watch activity and title embeddings',
      'Browse by streaming service via TMDB watch-provider data; favourites and continue-watching',
      'Auth0 sign-in with 2FA, Redis caching, rate limiting; Docker/Kubernetes configs and Playwright tests',
    ],
    stack: ['React', 'TypeScript', 'Express', 'Supabase', 'Redis', 'Python'],
    live: 'https://stream-vault-7u6q.vercel.app/',
    liveLabel: 'stream-vault.vercel.app',
    source: 'https://github.com/BurhanRajkot/StreamVault',
    desktop: { src: '/work/streamvault.webp', alt: 'StreamVault homepage', width: 1600, height: 868 },
    mobile: { src: '/work/streamvault-mobile.webp', alt: 'StreamVault homepage on mobile', width: 600, height: 1298 },
  },
  {
    id: 'enlighten',
    title: 'Enlighten SEN Services',
    type: 'Client · Website',
    year: '2026',
    summary:
      'A new website for a Mumbai special-education company that supports children with autism, ADHD and other additional needs, written for the parents looking for help.',
    role: 'Design, development, hosting & domain',
    points: [
      'Replaced an old PHP template site with a fast Next.js build: services, team, blog, careers and contact pages, each with its own illustrations',
      'Enquiry and career forms email the team through Resend, falling back to a pre-filled WhatsApp message if email is down',
      'Moved the domain onto Vercel with HTTPS; sitemap, accessible markup and reduced-motion support, plus extra mobile animations',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Resend', 'Vercel'],
    live: 'https://www.enlightensenservices.in/',
    liveLabel: 'enlightensenservices.in',
    desktop: { src: '/work/enlighten.webp', alt: 'Enlighten SEN Services homepage on desktop', width: 1600, height: 1000 },
    mobile: { src: '/work/enlighten-mobile.webp', alt: 'Enlighten SEN Services homepage on mobile', width: 600, height: 1298 },
  },
]

/** Client sites currently being built. */
export const inProgress = [
  {
    title: 'Deccan Cans',
    type: 'Client · Shopify OS 2.0',
    summary:
      'Rebuilding a B2B packaging manufacturer’s website as a custom Shopify theme — product catalogue with request-a-quote instead of a cart.',
  },
]

export interface Project {
  title: string
  type: string
  year: string
  summary: string
  points: string[]
  stack: string[]
  links: { label: string; href: string }[]
}

/** Everything else — shown as cards with an animated preview (see Projects.tsx). */
export const projects: Project[] = [
  {
    title: 'App Blocker',
    type: 'Android app',
    year: '2026',
    summary: 'Locks an app for a set time with no in-app way to cheat — the only early exit is an offline-signed unlock key.',
    points: [
      'Accessibility Service bounces locked apps back to the home screen',
      'Device Admin makes uninstalling a deliberate extra step',
      'Unlock keys are signed by a separate Python tool; the app only verifies them',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'Room'],
    links: [{ label: 'Source', href: 'https://github.com/BurhanRajkot/Block-APP' }],
  },
  {
    title: 'Claw',
    type: 'AI assistant',
    year: '2026',
    summary: 'A private assistant I talk to on Telegram that works across my Gmail, Calendar, Tasks and Drive.',
    points: [
      'Summarises my inbox and drafts replies for me to review',
      'Creates calendar events and manages my to-do list',
      'Sends a short daily briefing of meetings, tasks and important email',
    ],
    stack: ['LLM agent', 'Telegram', 'Google APIs'],
    links: [{ label: 'Website', href: 'https://burhanrajkot.github.io/claw-app/' }],
  },
  {
    title: 'Agentic AI',
    type: 'Developer tool',
    year: '2025',
    summary: 'A command-line coding agent that can read, write and run code inside a sandboxed project folder.',
    points: ['Gemini function calling picks the right tool', 'All file access is scoped to the working directory'],
    stack: ['Python', 'Gemini API'],
    links: [{ label: 'Source', href: 'https://github.com/BurhanRajkot/agentic-ai' }],
  },
  {
    title: 'Misinfo Detector',
    type: 'Mumbai Hacks 2025',
    year: '2025',
    summary: 'A Chrome extension that fact-checks the page you are reading using a team of AI agents.',
    points: [
      'Separate agents for summary, fact-checking, news cross-reference and bias',
      'A final "judge" agent returns a verdict with a confidence score',
      'Works on a highlighted passage or every headline on a page',
    ],
    stack: ['Python', 'Flask', 'Chrome Extension'],
    links: [{ label: 'Source', href: 'https://github.com/BurhanRajkot/Mumbai-Hacks-2025' }],
  },
  {
    title: 'Noitas',
    type: 'Personal blog',
    year: '2026',
    summary: 'My blog on programming, game development, books and life, with charts generated from data.',
    points: ['Hugo with custom layouts and shortcodes', 'Python scripts generate interactive Plotly charts'],
    stack: ['Hugo', 'Python'],
    links: [{ label: 'Source', href: 'https://github.com/BurhanRajkot/Blog' }],
  },
  {
    title: 'MediBase',
    type: 'REDACT 2025, SPIT',
    year: '2025',
    summary: 'Predicts a likely condition from blood-test values and explains which values drove the prediction.',
    points: [
      'XGBoost classifier over biomarkers such as troponin, CRP and cholesterol',
      'SHAP explanations per prediction, with out-of-range values flagged',
      'Gemini turns the result into a plain-language summary',
    ],
    stack: ['Python', 'XGBoost', 'SHAP', 'Streamlit'],
    links: [{ label: 'Source', href: 'https://github.com/BurhanRajkot/REDACT-2025' }],
  },
]

export const experience = [
  { when: 'Current', what: 'Freelance web developer', where: "Attarwala's, Deccan Cans, Enlighten SEN Services" },
  { when: 'Current', what: 'B.Tech, CSE (Data Science)', where: 'DJ Sanghvi College of Engineering · CGPA 9.0' },
]

export const hackathons = [
  { when: '2026', name: 'Smart India Hackathon' },
  { when: '2026', name: 'NIMIS Hackathon' },
  { when: '2025', name: 'Mumbai Hacks' },
  { when: '2025', name: 'REDACT, SPIT' },
  { when: '2024', name: 'DataHack' },
]

export interface Skill {
  name: string
  /** simple-icons slug (see src/sections/Skills.tsx); omit for a text glyph */
  icon?: string
  glyph?: string
  /** names this skill appears under in project stacks, if different */
  aliases?: string[]
  /** projects that used it but don't list it in their stack */
  also?: string[]
  note?: string
}

/** Shown as keys on the 3D keyboard. "Used in" is worked out from project stacks automatically. */
export const skillGroups: { group: string; items: Skill[] }[] = [
  {
    group: 'Frontend',
    items: [
      { name: 'React', icon: 'react', also: ['This portfolio'] },
      { name: 'TypeScript', icon: 'typescript', also: ['This portfolio'] },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Three.js', icon: 'threedotjs', also: ['This portfolio'] },
      { name: 'GSAP', icon: 'greensock', also: ['This portfolio'] },
      { name: 'Tailwind', icon: 'tailwindcss' },
    ],
  },
  {
    group: 'Backend',
    items: [
      { name: 'Node.js', icon: 'nodedotjs', also: ['StreamVault'] },
      { name: 'Express', icon: 'express' },
      { name: 'Flask', icon: 'flask' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Redis', icon: 'redis' },
      { name: 'Supabase', icon: 'supabase' },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { name: 'Shopify', icon: 'shopify' },
      { name: 'Liquid', glyph: '{%}' },
      { name: 'Shopify Functions', glyph: 'ƒ' },
    ],
  },
  {
    group: 'Data & AI',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'scikit-learn', icon: 'scikitlearn' },
      { name: 'XGBoost', glyph: 'XGB' },
      { name: 'Gemini', icon: 'googlegemini', aliases: ['Gemini API'], also: ['MediBase'] },
      { name: 'LLM agents', glyph: 'AI', aliases: ['LLM agent'], also: ['Misinfo Detector', 'Agentic AI'] },
    ],
  },
  {
    group: 'Mobile & tools',
    items: [
      { name: 'Kotlin', icon: 'kotlin' },
      { name: 'Jetpack Compose', icon: 'jetpackcompose' },
      { name: 'Docker', icon: 'docker', also: ['StreamVault'] },
      { name: 'Git', icon: 'git', note: 'Every project, versioned on GitHub' },
      { name: 'Linux', icon: 'linux', note: 'My daily driver' },
    ],
  },
]
