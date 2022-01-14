import { BasicLayout } from '@/layouts/BasicLayout'

export function FrameworkGuideLayout({ title, description, children }) {
  return (
    <BasicLayout>
      <header id="header" className="mb-10 md:flex md:items-start">
        <div className="flex-auto max-w-4xl">
          <p className="mb-4 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
            Installation
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
            {title}
          </h1>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-400">{description}</p>
        </div>
      </header>
      <section className="mb-16 relative">{children}</section>
    </BasicLayout>
  )
}
