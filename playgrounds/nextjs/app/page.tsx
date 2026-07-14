const frameworks = [
  { name: 'React', tag: 'UI', href: 'https://github.com/kariitsme/react', tone: 'from-sky-400 to-cyan-300' },
  { name: 'Next.js', tag: 'React', href: 'https://github.com/kariitsme/next.js', tone: 'from-zinc-100 to-zinc-400' },
  { name: 'Vue', tag: 'UI', href: 'https://github.com/kariitsme/vue', tone: 'from-emerald-400 to-teal-300' },
  { name: 'Nuxt', tag: 'Vue', href: 'https://github.com/kariitsme/nuxt', tone: 'from-green-400 to-lime-300' },
  { name: 'Svelte', tag: 'UI', href: 'https://github.com/kariitsme/svelte', tone: 'from-orange-400 to-red-400' },
  { name: 'Vite', tag: 'Tooling', href: 'https://github.com/kariitsme/vite', tone: 'from-violet-400 to-fuchsia-400' },
  { name: 'Astro', tag: 'Content', href: 'https://github.com/kariitsme/astro', tone: 'from-pink-400 to-rose-400' },
  { name: 'Bootstrap', tag: 'CSS', href: 'https://github.com/kariitsme/bootstrap', tone: 'from-purple-400 to-indigo-400' },
  { name: 'Express', tag: 'Node', href: 'https://github.com/kariitsme/express', tone: 'from-stone-300 to-stone-500' },
  { name: 'Django', tag: 'Python', href: 'https://github.com/kariitsme/django', tone: 'from-green-500 to-emerald-300' },
  { name: 'Flask', tag: 'Python', href: 'https://github.com/kariitsme/flask', tone: 'from-zinc-200 to-zinc-500' },
  { name: 'Tailwind', tag: 'CSS', href: 'https://github.com/kariitsme/tailwindcss', tone: 'from-cyan-400 to-sky-500' },
]

const features = [
  {
    title: 'Utility-first',
    desc: 'Compose complex UIs from a constrained set of primitives — no more fighting specificity.',
    icon: '⚡',
  },
  {
    title: 'Framework agnostic',
    desc: 'React, Vue, Svelte, Django templates, Flask, Express — anywhere HTML lives.',
    icon: '🧩',
  },
  {
    title: 'Lightning fast',
    desc: 'Oxide engine + Lightning CSS. Incremental builds and tiny production bundles.',
    icon: '🚀',
  },
  {
    title: 'Design tokens',
    desc: 'Colors, spacing, and type as a coherent system. Customize with @theme in one place.',
    icon: '🎨',
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100 antialiased">
      {/* Ambient */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.18),transparent)]" />
        <div className="absolute top-1/3 left-1/4 size-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/2 right-0 size-[28rem] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-500/25">
              T
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Tailwind<span className="text-cyan-400">Universe</span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {['Ecosystem', 'Features', 'Start'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/10 transition hover:bg-cyan-300"
          >
            Docs
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <span className="size-1.5 animate-pulse rounded-full bg-cyan-400" />
              Next.js playground · merged ecosystem
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              One utility system.{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                Every framework.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              A beautiful Next.js surface that unifies React, Vue, Nuxt, Svelte, Vite, Astro,
              Bootstrap, Express, Django, Flask — and Tailwind CSS — into one design language.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#ecosystem"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-cyan-500/25 transition hover:brightness-110"
              >
                Explore frameworks
              </a>
              <a
                href="#start"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get started
              </a>
            </div>

            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { v: '12', l: 'Frameworks' },
                { v: 'v4', l: 'Tailwind' },
                { v: '0', l: 'Runtime CSS' },
                { v: '∞', l: 'Possibilities' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 backdrop-blur"
                >
                  <div className="text-3xl font-bold text-white">{s.v}</div>
                  <div className="mt-1 text-xs text-zinc-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section id="ecosystem" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold tracking-wide text-cyan-400 uppercase">Ecosystem</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              All your frameworks. One design language.
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Linked to the kariitsme forks of the modern web stack. Style every surface with the
              same Tailwind primitives.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((fw) => (
                <a
                  key={fw.name}
                  href={fw.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div
                    className={`absolute -top-10 -right-10 size-28 rounded-full bg-gradient-to-br ${fw.tone} opacity-0 blur-2xl transition group-hover:opacity-25`}
                  />
                  <div className="relative flex items-center gap-3">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${fw.tone} text-sm font-bold text-zinc-950 shadow-lg`}
                    >
                      {fw.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{fw.name}</h3>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                          {fw.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500 group-hover:text-cyan-300">
                        View repository →
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-wide text-violet-400 uppercase">Features</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Designed for beauty. Built for speed.
              </h2>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-violet-400/30"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live palette */}
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-10">
            <h3 className="text-xl font-bold sm:text-2xl">Live component palette</h3>
            <p className="mt-1 text-sm text-zinc-500">Pure utility classes — no custom CSS modules.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
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
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
              >
                Gradient
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="start" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center sm:px-12">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-600/15 to-fuchsia-500/20" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  Ready to build something beautiful?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                  Install Tailwind CSS v4, pick any framework, and ship interfaces that feel finished.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://tailwindcss.com/docs/installation/framework-guides/nextjs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
                  >
                    Next.js install guide
                  </a>
                  <a
                    href="https://github.com/kariitsme/tailwindcss"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/15 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    GitHub
                  </a>
                </div>
                <p className="mt-8 font-mono text-xs text-zinc-500">
                  npm install tailwindcss @tailwindcss/postcss
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 text-center text-xs text-zinc-600 sm:px-6">
        Built with Tailwind CSS v4 · Next.js playground · Merged ecosystem · MIT
      </footer>
    </div>
  )
}
