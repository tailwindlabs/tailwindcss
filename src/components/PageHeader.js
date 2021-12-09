export function PageHeader({ title, description, badge = {}, section }) {
  if (!title && !description) return null

  return (
    <header id="header" className="relative z-20">
      <div>
        {section && <p className="mb-2 text-sm leading-6 font-semibold text-sky-500">{section}</p>}
        <h1 className="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {badge.key && badge.value && (
          <dl className="ml-3 mt-1.5 align-top inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-cyan-100 text-cyan-900 tracking-tight">
            <dt className="sr-only">{badge.key}</dt>
            <dd>{badge.value}</dd>
          </dl>
        )}
      </div>
      {description && <p className="mt-2 text-lg text-gray-700">{description}</p>}
    </header>
  )
}
