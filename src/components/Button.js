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
    'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-500',
    'text-gray-300 group-hover:text-gray-400',
  ],
}

export function Button({
  color = 'gray',
  href,
  children,
  className = '',
  reverse = false,
  ...props
}) {
  let colorClasses = typeof color === 'string' ? colors[color] : color

  return (
    <Link href={href}>
      <a
        className={clsx(
          'group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2',
          colorClasses[0],
          className,
          reverse && 'flex-row-reverse'
        )}
        {...props}
      >
        {children}
        <svg
          className={clsx('overflow-visible', reverse ? 'mr-3' : 'ml-3', colorClasses[1])}
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
