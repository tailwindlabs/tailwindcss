import clsx from 'clsx'

const codeBackground = {
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-500',
  indigo: 'bg-indigo-400',
  fuchsia: 'bg-fuchsia-400',
}

const previewBackground = {
  gray: 'bg-gradient-to-r from-gray-50 to-gray-100',
  rose: 'bg-gradient-to-r from-rose-50 to-rose-100',
  emerald: 'bg-gradient-to-r from-emerald-50 to-teal-100',
  indigo: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
  fuchsia: 'bg-gradient-to-r from-fuchsia-50 to-fuchsia-100',
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
          className={clsx('scrollbar-none p-6 text-sm leading-snug language-html', {
            'bg-black bg-opacity-75': codeBackground[color],
          })}
        >
          <code className="language-html" dangerouslySetInnerHTML={{ __html: snippet }} />
        </pre>
      </div>
    </div>
  )
}
