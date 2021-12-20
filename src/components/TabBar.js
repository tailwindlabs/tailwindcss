import clsx from 'clsx'

export function TabBar({
  primary,
  secondary = [],
  showTabMarkers = true,
  side,
  translucent = false,
  children,
}) {
  return (
    <div className="flex text-gray-400 text-xs leading-6">
      <div className="flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
        {primary.name}
        {showTabMarkers &&
          (primary.saved ? (
            <svg
              viewBox="0 0 4 4"
              className="ml-2.5 flex-none w-1 h-1 text-gray-500 overflow-visible"
            >
              <path
                d="M-1 -1L5 5M5 -1L-1 5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div className="ml-2.5 flex-none w-1 h-1 rounded-full bg-current" />
          ))}
      </div>
      <div
        className={clsx(
          'flex-auto flex items-center bg-gray-700/50 border border-gray-500/30',
          side === 'left' ? 'rounded-tl lg:rounded-tr' : 'rounded-tl',
          translucent && 'dark:bg-gray-800/50'
        )}
      >
        {secondary.map(({ name, open = true, className }) => (
          <div
            key={name}
            className={clsx('px-4 py-1 border-r border-gray-200/5', className, { italic: !open })}
          >
            {name}
          </div>
        ))}
        {children && (
          <div className="flex-auto flex items-center justify-end px-4 space-x-4">{children}</div>
        )}
      </div>
    </div>
  )
}
