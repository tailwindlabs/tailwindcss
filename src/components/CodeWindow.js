import clsx from 'clsx'
import { forwardRef, Fragment, useMemo } from 'react'
import tokenize from '../macros/tokenize.macro'
import { Code } from './Code'
import styles from './CodeWindow.module.css'

const { tokens: defaultTokens } = tokenize.html(`<div class="flex pa-2 bg-white rounded-lg shadow">
  <div class="w-32 rounded-md overflow-hidden">
    <img src="avatar.jpg" class="h-full object-fit">
  </div>
  <div class="flex flex-col">
    <p class="font-bold text-lg">"If I had to recommend a way of
      getting into programming today, it would be HTML + CSS
      with @tailwindcss."
    </p>
    <div class="flex space-between">
      <div>
        <h2 class="font-semibold">Guillermo Rauch</h2>
        <small class="text-sm text-gray-500">CEO Vercel</small>
      </div>
      <a href="https://twitter.com/rauchg" class="text-blue-500
        rounded-md p-1">View Tweet</a>
    </div>
  </div>
</div>`)

export function CodeWindow({ children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden md:rounded-xl shadow-2xl flex ${styles.root} ${className}`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      <div className="relative w-full flex flex-col">
        <div className="flex-none h-11 flex items-center px-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 border-2 rounded-full border-red-500" />
            <div className="w-3 h-3 border-2 rounded-full border-amber-400" />
            <div className="w-3 h-3 border-2 rounded-full border-green-400" />
          </div>
        </div>
        <div className="border-t border-white border-opacity-10 min-h-0 flex-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

CodeWindow.Code = forwardRef(
  (
    { tokens = defaultTokens, initialLineNumber = 1, lineNumbersBackground = true, ...props },
    ref
  ) => {
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
          <pre className="flex min-h-full text-xs leading-4 md:text-sm md:leading-5">
            <div
              aria-hidden="true"
              className={`hidden md:block text-white text-opacity-50 flex-none py-4 pr-4 text-right select-none ${
                lineNumbersBackground ? 'bg-black bg-opacity-25' : ''
              }`}
              style={{ width: 50 }}
            >
              {lineNumbers}
            </div>
            <code className="flex-auto relative block text-white pt-4 pb-4 px-4 overflow-auto">
              <Code tokens={tokens} {...props} />
            </code>
          </pre>
        </div>
      </div>
    )
  }
)

const themeDict = {
  punctuation: 'text-code-punctuation',
  tag: 'text-code-tag',
  'attr-name': 'text-code-attr-name',
  'attr-value': 'text-code-attr-value',
  class: 'text-code-attr-value',
}

export function getClassNameForToken({ types, empty }) {
  const typesSize = types.length
  if (typesSize === 1 && types[0] === 'plain') {
    return empty ? 'inline-block' : undefined
  }
  const className = (
    (themeDict[types[typesSize - 1]] || '') + (empty ? ' inline-block' : '')
  ).trim()
  return className === '' ? undefined : className
}

CodeWindow.Code2 = forwardRef(
  ({ lines = 0, lineNumbersBackground = true, overflow = true, children }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('w-full flex-auto flex min-h-0', { 'overflow-auto': overflow })}
      >
        <div className="w-full relative flex-auto">
          <pre className="flex min-h-full text-xs leading-4 md:text-sm md:leading-5">
            <div
              aria-hidden="true"
              className={`hidden md:block text-white text-opacity-50 flex-none py-4 pr-4 text-right select-none ${
                lineNumbersBackground ? 'bg-black bg-opacity-25' : ''
              }`}
              style={{ width: 50 }}
            >
              {Array.from({ length: lines }).map((_, i) =>
                i === 0 ? (
                  i + 1
                ) : (
                  <Fragment key={i + 1}>
                    <br />
                    {i + 1}
                  </Fragment>
                )
              )}
            </div>
            <code
              className={clsx('flex-auto relative block text-white pt-4 pb-4 px-4', {
                'overflow-auto': overflow,
              })}
            >
              {children}
            </code>
          </pre>
        </div>
      </div>
    )
  }
)
