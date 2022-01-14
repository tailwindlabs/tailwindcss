import clsx from 'clsx'
import { forwardRef, Fragment, useMemo } from 'react'
import { Code } from './Code'

export function CodeWindow({ children, className, border = true }) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10',
        className
      )}
    >
      <div className="relative w-full flex flex-col">
        <div className={clsx('flex-none', border && 'border-b border-slate-500/30')}>
          <div className="flex items-center h-8 space-x-1.5 px-3">
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
          </div>
          {/* <div className="h-px bg-gradient-to-r from-sky-300/0 via-sky-300/20 to-sky-300/0" /> */}
        </div>
        <div className="relative min-h-0 flex-auto flex flex-col">{children}</div>
      </div>
    </div>
  )
}

CodeWindow.Code = forwardRef(({ tokens, initialLineNumber = 1, ...props }, ref) => {
  const lineNumbers = useMemo(() => {
    const t = tokens.flat(Infinity)
    let line = initialLineNumber + 1
    let str = `${initialLineNumber}\n`
    for (let i = 0; i < t.length; i++) {
      if (typeof t[i] === 'string') {
        const newLineChars = t[i].match(/\n/g)
        if (newLineChars !== null) {
          for (let j = 0; j < newLineChars.length; j++) {
            str += `${line++}\n`
          }
        }
      }
    }
    return str
  }, [tokens])

  return (
    <div className="w-full flex-auto flex min-h-0 overflow-auto">
      <div ref={ref} className="w-full relative flex-auto">
        <pre className="flex min-h-full text-sm leading-6">
          <div
            aria-hidden="true"
            className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none"
            style={{ width: 50 }}
          >
            {lineNumbers}
          </div>
          <code className="flex-auto relative block text-slate-50 pt-4 pb-4 px-4 overflow-auto">
            <Code tokens={tokens} {...props} />
          </code>
        </pre>
      </div>
    </div>
  )
})

export function getClassNameForToken({ types, empty }) {
  const typesSize = types.length
  if (typesSize === 1 && types[0] === 'plain') {
    return empty ? 'inline-block' : undefined
  }
  return [...types, empty ? 'inline-block' : 'token'].join(' ')
}

CodeWindow.Code2 = forwardRef(
  (
    {
      lines = 0,
      showLineNumbers = true,
      initialLineNumber = 1,
      overflow = true,
      wrap = false,
      className,
      children,
      language,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(className, 'w-full flex-auto flex min-h-0', {
          'overflow-auto': overflow === true || overflow === 'y',
        })}
      >
        <div className="w-full relative flex-auto">
          <pre
            className={clsx(
              'flex min-h-full text-sm leading-6',
              language && `language-${language}`
            )}
          >
            {showLineNumbers && (
              <div
                aria-hidden="true"
                className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none w-[3.125rem]"
              >
                {Array.from({ length: lines }).map((_, i) =>
                  i === 0 ? (
                    i + initialLineNumber
                  ) : (
                    <Fragment key={i + initialLineNumber}>
                      <br />
                      {i + initialLineNumber}
                    </Fragment>
                  )
                )}
              </div>
            )}
            <code
              className={clsx(
                'flex-auto relative block text-slate-50',
                {
                  'overflow-auto': overflow === true || overflow === 'x',
                  'whitespace-pre-wrap': wrap,
                  'p-4': showLineNumbers,
                },
                language && `language-${language}`
              )}
            >
              {children}
            </code>
          </pre>
        </div>
      </div>
    )
  }
)
