import { BasicLayout } from '@/layouts/BasicLayout'

export function FrameworkGuideLayout({ title, description, children }) {
  return (
    <BasicLayout>
      <header id="header" className="mb-10 md:flex md:items-start">
        <div className="flex-auto max-w-4xl">
          <p className="mb-4 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
            Installation
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
            {title}
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">{description}</p>
        </div>
      </header>
      <section className="mb-16 relative">{children}</section>
    </BasicLayout>
  )
}
