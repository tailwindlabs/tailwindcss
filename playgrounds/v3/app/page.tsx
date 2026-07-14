export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          Tailwind CSS v3 playground
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Hello{' '}
          <span className="bg-gradient-to-r from-cyan-300 to-sky-500 bg-clip-text text-transparent">
            world
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-400">
          A refined v3 surface. Upgrade with the monorepo&apos;s upgrade tool, or explore the v4
          playgrounds for the full multi-framework experience.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="https://github.com/kariitsme/tailwindcss"
            className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
          >
            View monorepo
          </a>
          <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300">
            text-3xl · font-bold · underline ready
          </span>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {['Utilities', 'Responsive', 'Dark mode'].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30"
            >
              <h2 className="font-semibold text-white">{t}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Classic Tailwind v3 patterns, polished for this playground.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
