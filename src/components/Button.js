import clsx from 'clsx'
import Link from 'next/link'

let colors = {
  indigo: [
    'bg-indigo-50 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 focus:ring-indigo-500',
    'text-indigo-300 group-hover:text-indigo-400',
  ],
  pink: [
    'bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 focus:ring-pink-600',
    'text-pink-300 group-hover:text-pink-400',
  ],
  sky: [
    'bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 focus:ring-sky-600',
    'text-sky-300 group-hover:text-sky-400',
  ],
  blue: [
    'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:ring-blue-600',
    'text-blue-300 group-hover:text-blue-400',
  ],
  gray: [
    'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500',
    'text-slate-300 group-hover:text-slate-400',
  ],
}

let colorsDark = {
  gray: [
    'dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500',
    'dark:text-slate-500 dark:group-hover:text-slate-400',
  ],
  sky: [
    'dark:bg-sky-500 dark:text-sky-50 dark:hover:bg-sky-400 dark:hover:text-white dark:focus:ring-sky-200',
    'dark:text-sky-300 dark:group-hover:text-sky-100',
  ],
}

export function Button({
  color = 'gray',
  darkColor = color,
  href,
  children,
  className = '',
  reverse = false,
  ...props
}) {
  let colorClasses = typeof color === 'string' ? colors[color] : color
  let darkColorClasses = typeof darkColor === 'string' ? colorsDark[darkColor] || [] : darkColor

  return (
    <Link href={href}>
      <a
        className={clsx(
          'group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2',
          colorClasses[0],
          darkColorClasses[0],
          className,
          reverse && 'flex-row-reverse'
        )}
        {...props}
      >
        {children}
        <svg
          className={clsx(
            'overflow-visible',
            reverse ? 'mr-3' : 'ml-3',
            colorClasses[1],
            darkColorClasses[1]
          )}
          width="3"
          height="6"
          viewBox="0 0 3 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={reverse ? 'M3 0L0 3L3 6' : 'M0 0L3 3L0 6'} />
        </svg>
      </a>
    </Link>
  )
}
