import clsx from 'clsx'

export function PageHeader({ title, description, badge = {}, border = true }) {
  if (!title && !description) return null

  return (
    <div className={clsx('pb-10', { 'border-b border-gray-200 mb-10': border })}>
      <div className="flex items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        {badge.key && badge.value && (
          <dl className="mt-0 mb-1 ml-3 flex-none inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900 tracking-tight">
            <dt className="sr-only">{badge.key}</dt>
            <dd>{badge.value}</dd>
          </dl>
        )}
      </div>
      {description && <p className="mt-1 text-lg text-gray-500">{description}</p>}
    </div>
  )
}
