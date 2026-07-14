import { useEffect, useState } from 'react'

/* ─── Framework ecosystem (merged from kariitsme repos) ─── */
const frameworks = [
  {
    name: 'React',
    tag: 'UI Library',
    color: 'from-sky-400 to-cyan-300',
    ring: 'ring-sky-400/30',
    href: 'https://github.com/kariitsme/react',
    blurb: 'The library for web and native user interfaces.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    tag: 'React Framework',
    color: 'from-zinc-100 to-zinc-400',
    ring: 'ring-zinc-400/30',
    href: 'https://github.com/kariitsme/next.js',
    blurb: 'The React Framework for the Web — production-ready.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.35 4.3-.97l-7.1-12.3A7.97 7.97 0 0 1 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9L12 2z" />
      </svg>
    ),
  },
  {
    name: 'Vue',
    tag: 'Progressive Framework',
    color: 'from-emerald-400 to-teal-300',
    ring: 'ring-emerald-400/30',
    href: 'https://github.com/kariitsme/vue',
    blurb: 'The progressive JavaScript framework for building UIs.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M1.5 3h4.3L12 13.2 18.2 3H22.5L12 21 1.5 3zm7.1 0L12 8.4 15.4 3h-6.8z" />
      </svg>
    ),
  },
  {
    name: 'Nuxt',
    tag: 'Vue Framework',
    color: 'from-green-400 to-lime-300',
    ring: 'ring-green-400/30',
    href: 'https://github.com/kariitsme/nuxt',
    blurb: 'The full-stack Vue framework — intuitive & performant.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M13.4 3.5 22 18.5H4.8L8.1 13l3.2-5.5 2.1-3.5zm-1.9 3.3L4.3 18.5H1L9.6 3.5l1.9 3.3zm5.7 7.7-1.9-3.3-1.9 3.3h3.8z" />
      </svg>
    ),
  },
  {
    name: 'Svelte',
    tag: 'Compiled UI',
    color: 'from-orange-400 to-red-400',
    ring: 'ring-orange-400/30',
    href: 'https://github.com/kariitsme/svelte',
    blurb: 'Cybernetically enhanced web apps — no virtual DOM.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M12.8 2.3c-1.8-.8-3.9-.5-5.4.8L4.3 5.7a4.4 4.4 0 0 0-1.6 3.4 4.6 4.6 0 0 0 .5 2.1 4.3 4.3 0 0 0-.7 1.6 4.5 4.5 0 0 0 .9 3.5l3.1 2.6c1.8.8 3.9.5 5.4-.8l3.1-2.6a4.4 4.4 0 0 0 1.6-3.4 4.6 4.6 0 0 0-.5-2.1 4.3 4.3 0 0 0 .7-1.6 4.5 4.5 0 0 0-.9-3.5L15.8 3c-.9-.8-2-.1-3-.7zm-1.2 14.6a2.5 2.5 0 0 1-2.7.4l-3.1-2.6a2.3 2.3 0 0 1-.5-1.8c0-.2.1-.5.2-.7l.2-.3.3.2a5.4 5.4 0 0 0 3.4.7l.5-.1v.4c0 .6.2 1.2.6 1.7a2.4 2.4 0 0 0 1.7.9l.5.1-.2.3a2.4 2.4 0 0 1-.9.8zm6.5-4.6-.3-.2a5.4 5.4 0 0 0-3.4-.7l-.5.1v-.4a2.4 2.4 0 0 0-.6-1.7 2.4 2.4 0 0 0-1.7-.9l-.5-.1.2-.3a2.5 2.5 0 0 1 2.7-.4l3.1 2.6a2.3 2.3 0 0 1 .5 1.8c0 .2-.1.5-.2.7l-.2.3z" />
      </svg>
    ),
  },
  {
    name: 'Vite',
    tag: 'Build Tool',
    color: 'from-violet-400 to-fuchsia-400',
    ring: 'ring-violet-400/30',
    href: 'https://github.com/kariitsme/vite',
    blurb: 'Next generation frontend tooling. Instant, blazing fast.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M12.9 2.3 22 19.5H2.9L8.4 9.7l4.5-7.4zm-.5 4.4L7.3 17.2h10.3L12.4 6.7z" />
        <path d="M12 9.5 8.8 15h6.4L12 9.5z" className="opacity-60" />
      </svg>
    ),
  },
  {
    name: 'Astro',
    tag: 'Content Sites',
    color: 'from-pink-400 to-rose-400',
    ring: 'ring-pink-400/30',
    href: 'https://github.com/kariitsme/astro',
    blurb: 'The web framework for content-driven websites.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M8.4 15.8c.7 1.4 2 2.2 3.6 2.2 1.7 0 2.8-.8 3.6-2.2l.3-.5h-7.8l.3.5zm7.5-1.8 2.3-6.8c.3-1 .4-1.8.4-2.5C18.6 2.7 16.5 1 12 1S5.4 2.7 5.4 4.7c0 .7.1 1.5.4 2.5l2.3 6.8h7.8zM12 3.2c2.6 0 4.1.8 4.1 1.8S14.6 6.8 12 6.8 7.9 6 7.9 5s1.5-1.8 4.1-1.8z" />
        <path d="M16.2 18.5c-.8 1.4-2.2 2.5-4.2 2.5s-3.4-1.1-4.2-2.5l-1.1 1.3C7.8 21.6 9.7 23 12 23s4.2-1.4 5.3-3.2l-1.1-1.3z" className="opacity-70" />
      </svg>
    ),
  },
  {
    name: 'Bootstrap',
    tag: 'CSS Framework',
    color: 'from-purple-400 to-indigo-400',
    ring: 'ring-purple-400/30',
    href: 'https://github.com/kariitsme/bootstrap',
    blurb: 'The most popular HTML, CSS, and JS framework — mobile first.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M6 3h8.2c2.9 0 5.1 1 5.1 4 0 1.8-.9 3.1-2.4 3.6v.1c2 .5 3.2 2 3.2 4.1 0 3.2-2.5 4.7-5.7 4.7H6V3zm4.1 6.7h3.4c1.5 0 2.4-.7 2.4-1.9s-.9-1.8-2.4-1.8h-3.4v3.7zm0 7.3h3.8c1.7 0 2.7-.8 2.7-2.2s-1-2.1-2.7-2.1h-3.8v4.3z" />
      </svg>
    ),
  },
  {
    name: 'Express',
    tag: 'Node Backend',
    color: 'from-stone-300 to-stone-500',
    ring: 'ring-stone-400/30',
    href: 'https://github.com/kariitsme/express',
    blurb: 'Fast, unopinionated, minimalist web framework for Node.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12h14M14 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 7h6M3 17h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Django',
    tag: 'Python Web',
    color: 'from-green-500 to-emerald-300',
    ring: 'ring-green-500/30',
    href: 'https://github.com/kariitsme/django',
    blurb: 'The web framework for perfectionists with deadlines.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M11 2v16.5c0 2.4-1.2 3.5-3.5 3.5-.9 0-1.9-.2-2.6-.5v-2.5c.5.2 1.1.3 1.7.3 1 0 1.4-.4 1.4-1.4V9.5H5.5V7H8V2h3zm5.5 5.2c2.9 0 5 1.9 5 5.3s-2.1 5.4-5 5.4c-1 0-1.9-.2-2.5-.6v5.2h-3V7.3c.9-.3 2-.5 3.5-.5 1 0 1.5.1 2 .2zm-2 7.6c.4.2.9.3 1.5.3 1.5 0 2.5-1 2.5-2.7s-1-2.6-2.5-2.6c-.6 0-1.1.1-1.5.3v4.7z" />
      </svg>
    ),
  },
  {
    name: 'Flask',
    tag: 'Python Micro',
    color: 'from-zinc-200 to-zinc-500',
    ring: 'ring-zinc-400/30',
    href: 'https://github.com/kariitsme/flask',
    blurb: 'The Python micro framework for building web applications.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M9.5 3.2c.6-1.4 2.4-1.4 3 0l1.1 2.5 2.7.4c1.5.2 2.1 2 .9 3l-2 1.9.5 2.7c.3 1.5-1.3 2.6-2.6 1.9L12 14.3l-2.4 1.3c-1.3.7-2.9-.4-2.6-1.9l.5-2.7-2-1.9c-1.2-1-.6-2.8.9-3l2.7-.4 1.1-2.5z" className="opacity-40" />
        <path d="M15 14c2.5 1 4 2.5 4 4.5S17 22 12 22s-7-1.5-7-3.5S7 15 9.5 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Tailwind',
    tag: 'Utility CSS',
    color: 'from-cyan-400 to-sky-500',
    ring: 'ring-cyan-400/40',
    href: 'https://github.com/kariitsme/tailwindcss',
    blurb: 'A utility-first CSS framework for rapid UI development.',
    logo: (
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3C13.3 11 14.5 12.2 17 12.2c2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3C15.7 7.2 14.5 6 12 6zM7 12.2c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3.9 1.2 2.1 2.4 4.6 2.4 2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3-.9-1.2-2.1-2.4-4.6-2.4z" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'Utility-first',
    desc: 'Build complex designs from a constrained set of primitive utilities — no more fighting CSS specificity.',
    icon: '⚡',
  },
  {
    title: 'Responsive by default',
    desc: 'Mobile-first breakpoints with sm:, md:, lg:, and xl: variants. Design once, ship everywhere.',
    icon: '📱',
  },
  {
    title: 'Dark mode ready',
    desc: 'First-class dark: variants and CSS variables so theming feels effortless across every surface.',
    icon: '🌙',
  },
  {
    title: 'Lightning fast',
    desc: 'Oxide engine + Lightning CSS. Incremental builds and tiny production bundles out of the box.',
    icon: '🚀',
  },
  {
    title: 'Framework agnostic',
    desc: 'Works with React, Vue, Svelte, Next, Nuxt, Astro, Django templates, Flask, Express — anywhere HTML lives.',
    icon: '🧩',
  },
  {
    title: 'Design tokens',
    desc: 'Colors, spacing, typography, and shadows as a coherent system. Customize with @theme in one place.',
    icon: '🎨',
  },
]

const codeSnippets = [
  {
    label: 'React + Vite',
    lang: 'tsx',
    code: `export function Button() {
  return (
    <button className="rounded-xl bg-cyan-500
      px-5 py-2.5 font-semibold text-white
      shadow-lg shadow-cyan-500/30
      transition hover:bg-cyan-400
      active:scale-95">
      Get started
    </button>
  )
}`,
  },
  {
    label: 'Next.js',
    lang: 'tsx',
    code: `export default function Hero() {
  return (
    <section className="relative overflow-hidden
      bg-zinc-950 px-6 py-24">
      <h1 className="text-5xl font-bold
        tracking-tight text-white">
        Ship faster with{' '}
        <span className="bg-gradient-to-r
          from-cyan-400 to-sky-500
          bg-clip-text text-transparent">
          Tailwind
        </span>
      </h1>
    </section>
  )
}`,
  },
  {
    label: 'Vue / Nuxt',
    lang: 'vue',
    code: `<template>
  <div class="grid gap-4 sm:grid-cols-2
              lg:grid-cols-3">
    <article
      v-for="card in cards"
      :key="card.id"
      class="rounded-2xl border border-white/10
             bg-white/5 p-6 backdrop-blur
             transition hover:-translate-y-1
             hover:border-cyan-400/40">
      <h3 class="text-lg font-semibold
                 text-white">{{ card.title }}</h3>
    </article>
  </div>
</template>`,
  },
  {
    label: 'Svelte',
    lang: 'svelte',
    code: `<script>
  let open = $state(false)
</script>

<button
  class="inline-flex items-center gap-2
         rounded-full bg-gradient-to-r
         from-orange-400 to-rose-500
         px-4 py-2 text-sm font-medium
         text-white shadow-lg"
  onclick={() => open = !open}>
  {open ? 'Close' : 'Open'} menu
</button>`,
  },
]

const stats = [
  { value: '12', label: 'Frameworks unified' },
  { value: 'v4', label: 'Tailwind generation' },
  { value: '0', label: 'Runtime CSS cost' },
  { value: '∞', label: 'Design possibilities' },
]

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [snippet, setSnippet] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(['home', 'ecosystem', 'features', 'code', 'cta'])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = [
    { id: 'home', label: 'Home' },
    { id: 'ecosystem', label: 'Ecosystem' },
    { id: 'features', label: 'Features' },
    { id: 'code', label: 'Code' },
    { id: 'cta', label: 'Start' },
  ]

  return (
    <div className="relative min-h-full overflow-x-hidden bg-zinc-950 text-zinc-100 antialiased">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.18),transparent)]" />
        <div className="absolute top-1/3 left-1/4 size-[40rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/2 right-0 size-[30rem] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-zinc-950/80 shadow-lg shadow-black/20 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#home" className="group flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-zinc-950 shadow-lg shadow-cyan-500/25 transition group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3C13.3 11 14.5 12.2 17 12.2c2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3C15.7 7.2 14.5 6 12 6zM7 12.2c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3.9 1.2 2.1 2.4 4.6 2.4 2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3-.9-1.2-2.1-2.4-4.6-2.4z" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Tailwind<span className="text-cyan-400">Universe</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/10 transition hover:bg-cyan-300 sm:inline-flex"
            >
              Docs
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-4 flex-col gap-1">
                <span
                  className={`h-0.5 rounded-full bg-white transition ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`}
                />
                <span className={`h-0.5 rounded-full bg-white transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span
                  className={`h-0.5 rounded-full bg-white transition ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-zinc-950/95 px-4 py-3 backdrop-blur-xl md:hidden">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-cyan-400" />
                </span>
                Merged ecosystem · Tailwind CSS v4
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                One utility system.{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                  Every framework.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                A beautiful playground that unifies React, Next.js, Vue, Nuxt, Svelte, Vite, Astro,
                Bootstrap, Express, Django, Flask — and Tailwind CSS — into one cohesive design
                language.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#ecosystem"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-cyan-500/25 transition hover:brightness-110 active:scale-[0.98]"
                >
                  Explore frameworks
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a
                  href="#code"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  View code samples
                </a>
              </div>
            </div>

            {/* Stats strip */}
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center backdrop-blur"
                >
                  <div className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Floating preview card */}
            <div className="relative mx-auto mt-16 max-w-4xl">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/40 via-violet-500/30 to-fuchsia-500/40 opacity-60 blur-xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/50 backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 font-mono text-xs text-zinc-500">playground · merged-repos</span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  {[
                    { t: 'Components', d: 'Buttons, cards, navs', c: 'from-cyan-500/20 to-transparent' },
                    { t: 'Layouts', d: 'Heroes, grids, footers', c: 'from-violet-500/20 to-transparent' },
                    { t: 'Themes', d: 'Light, dark, brand', c: 'from-fuchsia-500/20 to-transparent' },
                  ].map((card) => (
                    <div
                      key={card.t}
                      className={`rounded-2xl border border-white/10 bg-gradient-to-b ${card.c} p-5 transition hover:border-white/20`}
                    >
                      <div className="mb-3 h-24 rounded-xl border border-white/5 bg-zinc-950/50">
                        <div className="flex h-full flex-col justify-end gap-1.5 p-3">
                          <div className="h-2 w-2/3 rounded-full bg-white/15" />
                          <div className="h-2 w-1/2 rounded-full bg-white/10" />
                          <div className="mt-1 h-6 w-20 rounded-lg bg-cyan-400/30" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-white">{card.t}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{card.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section id="ecosystem" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-wide text-cyan-400 uppercase">Ecosystem</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                All your frameworks. One design language.
              </h2>
              <p className="mt-4 text-zinc-400">
                Pulled together from the kariitsme forks of the modern web stack — each card links
                back to its repo. Style every surface with the same Tailwind primitives.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((fw) => (
                <a
                  key={fw.name}
                  href={fw.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-xl hover:ring-1 ${fw.ring}`}
                >
                  <div
                    className={`absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${fw.color} opacity-0 blur-2xl transition group-hover:opacity-20`}
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${fw.color} text-zinc-950 shadow-lg`}
                    >
                      {fw.logo}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{fw.name}</h3>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                          {fw.tag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{fw.blurb}</p>
                    </div>
                  </div>
                  <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-zinc-500 transition group-hover:text-cyan-300">
                    View repository
                    <svg
                      className="size-3.5 transition group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-wide text-violet-400 uppercase">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Designed for beauty. Built for speed.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                Everything you need to craft interfaces that feel intentional — across every
                framework in the stack.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-violet-400/30"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl transition group-hover:scale-110 group-hover:border-violet-400/30">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code */}
        <section id="code" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold tracking-wide text-fuchsia-400 uppercase">
                  Multi-framework
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Same utilities. Every stack.
                </h2>
                <p className="mt-4 text-zinc-400">
                  Drop the same class names into React, Next, Vue, Nuxt, or Svelte. Tailwind doesn&apos;t
                  care what renders your HTML — only that it looks incredible.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {codeSnippets.map((s, i) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSnippet(i)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        snippet === i
                          ? 'bg-white text-zinc-950 shadow-lg shadow-white/10'
                          : 'border border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <ul className="mt-8 space-y-3 text-sm text-zinc-400">
                  {[
                    'Zero runtime CSS-in-JS overhead',
                    'Works with SSR, SSG, and SPA alike',
                    'Oxide scanner finds classes in any template',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-cyan-500/30 opacity-50 blur-xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-red-400/80" />
                      <span className="size-2.5 rounded-full bg-amber-400/80" />
                      <span className="size-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      {codeSnippets[snippet].label.toLowerCase().replace(/[^a-z0-9]+/g, '.')}
                      .{codeSnippets[snippet].lang}
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
                    <code className="font-mono text-zinc-300">
                      {codeSnippets[snippet].code.split('\n').map((line, i) => (
                        <div key={i} className="table-row">
                          <span className="table-cell select-none pr-4 text-right text-zinc-600">
                            {i + 1}
                          </span>
                          <span className="table-cell whitespace-pre">
                            {highlightLine(line)}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component gallery strip */}
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">Live component palette</h3>
                  <p className="mt-1 text-sm text-zinc-500">Built entirely with utility classes — no custom CSS files.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 active:scale-95"
                >
                  Primary
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Secondary
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
                >
                  Gradient
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
                <span className="rounded-lg bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-300">
                  Beta
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { name: 'Ava Chen', role: 'Design systems', tone: 'from-cyan-400 to-blue-500' },
                  { name: 'Marcus Lee', role: 'Full-stack', tone: 'from-violet-400 to-purple-500' },
                  { name: 'Sofia Ruiz', role: 'Frontend craft', tone: 'from-rose-400 to-orange-400' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20"
                  >
                    <div
                      className={`flex size-11 items-center justify-center rounded-full bg-gradient-to-br ${p.tone} text-sm font-bold text-zinc-950`}
                    >
                      {p.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-zinc-500">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <div className="h-2 w-full bg-zinc-800">
                  <div className="h-full w-2/3 rounded-r-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center sm:px-12">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-600/15 to-fuchsia-500/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  Ready to build something beautiful?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                  Install Tailwind CSS v4, pick any framework from the ecosystem, and start shipping
                  interfaces that feel finished.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://tailwindcss.com/docs/installation"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl transition hover:bg-cyan-300"
                  >
                    Install Tailwind
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/kariitsme/tailwindcss"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    Star on GitHub
                  </a>
                </div>
                <p className="mt-8 font-mono text-xs text-zinc-500">
                  npm install tailwindcss @tailwindcss/vite
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 text-zinc-950">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3C13.3 11 14.5 12.2 17 12.2c2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3C15.7 7.2 14.5 6 12 6zM7 12.2c-2.7 0-4.4 1.3-5 4 1-1.3 2.1-1.8 3.4-1.5.7.2 1.3.7 1.9 1.3.9 1.2 2.1 2.4 4.6 2.4 2.7 0 4.4-1.3 5-4-1 1.3-2.1 1.8-3.4 1.5-.7-.2-1.3-.7-1.9-1.3-.9-1.2-2.1-2.4-4.6-2.4z" />
                </svg>
              </span>
              <span className="text-sm font-semibold">
                Tailwind<span className="text-cyan-400">Universe</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              A playground merging the modern web stack under one utility-first design system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Frontend</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                {['React', 'Vue', 'Svelte', 'Next.js', 'Nuxt', 'Astro'].map((n) => (
                  <li key={n}>
                    <a
                      href={`https://github.com/kariitsme/${n === 'Next.js' ? 'next.js' : n.toLowerCase()}`}
                      className="transition hover:text-cyan-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Backend</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                {['Express', 'Django', 'Flask'].map((n) => (
                  <li key={n}>
                    <a
                      href={`https://github.com/kariitsme/${n.toLowerCase()}`}
                      className="transition hover:text-cyan-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">Tooling</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                {['Vite', 'Bootstrap', 'Tailwind CSS'].map((n) => (
                  <li key={n}>
                    <a
                      href={`https://github.com/kariitsme/${n === 'Tailwind CSS' ? 'tailwindcss' : n.toLowerCase()}`}
                      className="transition hover:text-cyan-300"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/5 pt-6 text-center text-xs text-zinc-600">
          Built with Tailwind CSS v4 · Playground inside the tailwindcss monorepo · MIT
        </div>
      </footer>
    </div>
  )
}

/** Tiny keyword highlighter for the code panel */
function highlightLine(line: string) {
  // Keep it simple & safe — split into tokens without a full parser
  const parts = line.split(
    /(\b(?:export|function|return|const|let|import|from|className|v-for|onclick|template|script|button|div|section|span|article|h1|h3)\b|["'`][^"'`]*["'`]|[{}()[\]<>/=]|\/\/.*$)/g,
  )
  return parts.map((part, i) => {
    if (!part) return null
    if (/^(export|function|return|const|let|import|from)$/.test(part)) {
      return (
        <span key={i} className="text-fuchsia-400">
          {part}
        </span>
      )
    }
    if (/^(className|v-for|onclick|template|script)$/.test(part)) {
      return (
        <span key={i} className="text-sky-300">
          {part}
        </span>
      )
    }
    if (/^(button|div|section|span|article|h1|h3)$/.test(part)) {
      return (
        <span key={i} className="text-rose-300">
          {part}
        </span>
      )
    }
    if (/^["'`]/.test(part)) {
      return (
        <span key={i} className="text-emerald-300">
          {part}
        </span>
      )
    }
    if (part.startsWith('//')) {
      return (
        <span key={i} className="text-zinc-600 italic">
          {part}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}
