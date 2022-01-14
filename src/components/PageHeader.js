export function PageHeader({ title, description, badge = {}, section }) {
  if (!title && !description) return null

  return (
    <header id="header" className="relative z-20">
      <div>
        {section && (
          <p className="mb-2 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
            {section}
          </p>
        )}
        <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
          {title}
        </h1>
        {badge.key && badge.value && (
          <dl className="ml-3 mt-1.5 align-top inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-cyan-100 text-cyan-900 tracking-tight">
            <dt className="sr-only">{badge.key}</dt>
            <dd>{badge.value}</dd>
          </dl>
        )}
      </div>
      {description && (
        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">{description}</p>
      )}
    </header>
  )
}
