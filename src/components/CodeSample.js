import clsx from 'clsx'

const codeBackground = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  fuchsia: 'bg-fuchsia-400',
  indigo: 'bg-indigo-400',
  lightBlue: 'bg-light-blue-500',
  purple: 'bg-purple-400',
  rose: 'bg-rose-400',
}

const previewBackground = {
  amber: 'bg-gradient-to-r from-amber-50 to-amber-100',
  emerald: 'bg-gradient-to-r from-emerald-50 to-teal-100',
  fuchsia: 'bg-gradient-to-r from-fuchsia-50 to-fuchsia-100',
  gray: 'bg-gradient-to-r from-gray-50 to-gray-100',
  indigo: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
  lightBlue: 'bg-gradient-to-r from-light-blue-50 to-light-blue-100',
  purple: 'bg-gradient-to-r from-purple-50 to-purple-100',
  rose: 'bg-gradient-to-r from-rose-50 to-rose-100',
}

export function CodeSample({ preview, snippet, previewClassName, color = 'gray' }) {
  return (
    <div className="relative overflow-hidden mb-8">
      <div
        className={clsx(
          'rounded-t-xl overflow-hidden',
          previewBackground[color],
          previewClassName,
          {
            'p-10': !previewClassName,
          }
        )}
        dangerouslySetInnerHTML={{ __html: preview }}
      />
      <div
        className={clsx('overflow-hidden rounded-b-xl', codeBackground[color], {
          'bg-gray-800': !codeBackground[color],
        })}
      >
        <pre
          className={clsx(
            'scrollbar-none overflow-x-auto p-6 text-sm leading-snug language-html text-white',
            {
              'bg-black bg-opacity-75': codeBackground[color],
            }
          )}
        >
          <code className="language-html" dangerouslySetInnerHTML={{ __html: snippet }} />
        </pre>
      </div>
    </div>
  )
}
