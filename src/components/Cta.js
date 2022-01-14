import { Button } from '@/components/Button'

export function Cta({ description, href, label }) {
  return (
    <p className="flex flex-wrap sm:flex-nowrap lg:flex-wrap xl:flex-nowrap items-center py-6 px-4 sm:p-6 lg:p-10 ring-1 ring-slate-900/5 shadow rounded-lg dark:bg-slate-800 dark:shadow-none dark:ring-0 dark:highlight-white/5">
      <span className="flex-auto flex items-start mb-8 sm:mb-0 lg:mb-8 xl:mb-0">
        <svg
          viewBox="0 -4 16 24"
          fill="currentColor"
          className="flex-none w-4 h-6 mr-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm5 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 7a2 2 0 0 1 2 2v2a1 1 0 1 1-2 0V7Z"
          />
        </svg>
        <span className="flex-auto text-sm leading-6 text-slate-600 xl:max-w-2xl dark:text-slate-400">
          {description}
        </span>
      </span>
      <span className="flex-none flex justify-center w-full sm:w-auto sm:ml-6 md:ml-8 lg:w-full lg:ml-0 xl:w-auto xl:ml-8">
        <Button href={href} darkColor="sky">
          {label}
        </Button>
      </span>
    </p>
  )
}
