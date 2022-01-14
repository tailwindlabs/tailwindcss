export function TipGood({ children }) {
  return (
    <div className="flex items-start my-6 space-x-4">
      <div className="relative mt-1 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center ring-2 ring-cyan-500 dark:bg-sky-500 dark:ring-sky-500">
        <svg width="6" height="4.5" className="overflow-visible" aria-hidden="true">
          <path
            d="M6 0L2 4.5L0 2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute top-full mt-1 left-[0.46875rem] w-px h-[1.375rem] bg-cyan-500/30 rounded-full dark:bg-sky-400/30" />
      </div>
      <p className="m-0 flex-1 text-base font-semibold text-slate-900 dark:text-slate-200">
        {children}
      </p>
    </div>
  )
}

export function TipBad({ children }) {
  return (
    <div className="flex items-start my-6 space-x-4">
      <div className="relative mt-1 w-4 h-4 rounded-full bg-rose-400 text-white flex items-center justify-center ring-2 ring-rose-400 dark:bg-red-400 dark:ring-red-400">
        <svg width="6" height="6" className="overflow-visible" aria-hidden="true">
          <path
            d="M0 0L6 6M6 0L0 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute top-full mt-1 left-[0.46875rem] w-px h-[1.375rem] bg-rose-200 rounded-full dark:bg-red-200/25" />
      </div>
      <p className="m-0 flex-1 text-base font-semibold text-slate-900 dark:text-slate-200">
        {children}
      </p>
    </div>
  )
}

export function TipCompat({ children }) {
  return (
    <div className="text-sm bg-sky-100 text-sky-800 font-medium px-4 py-3 mb-4 rounded-xl">
      <div className="flex items-start space-x-3">
        <svg width="20" height="20" className="text-sky-500" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.998 2a1 1 0 00-.707 1.707l.707.707v3.758a1 1 0 01-.293.707l-4 4C.815 14.769 2.154 18 4.826 18H15.17c2.672 0 4.01-3.231 2.12-5.121l-4-4a1 1 0 01-.292-.707V4.414l.707-.707A1 1 0 0012.998 2h-6zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.992 1.992 0 00-.114-.035l1.063-1.063a3 3 0 00.879-2.121z"
          />
        </svg>
        <p className="flex-1">{children}</p>
      </div>
    </div>
  )
}

export function TipInfo({ children }) {
  return (
    <div className="not-prose mt-6 -mb-1 flex space-x-2">
      <svg
        className="flex-none w-5 h-5 text-slate-400 dark:text-slate-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>

      <p className="text-slate-700 text-sm font-medium dark:text-slate-200">{children}</p>
    </div>
  )
}
