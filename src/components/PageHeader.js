export function PageHeader({ title, description, badge = {}, border = true }) {
  if (!title && !description) return null

  return (
    <div className="markdown mb-6 px-6 max-w-3xl mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:px-12 xl:w-3/4">
      <div className="flex items-center markdown">
        <h1>{title}</h1>
        {badge.key && badge.value && (
          <dl className="mt-0 mb-1 ml-3 flex-none inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900 tracking-tight">
            <dt className="sr-only">{badge.key}</dt>
            <dd>{badge.value}</dd>
          </dl>
        )}
      </div>
      {description && <p className="mt-0 mb-4 text-gray-600">{description}</p>}
      {border && <hr className="my-8 border-b-2 border-gray-200" />}
    </div>
  )
}
