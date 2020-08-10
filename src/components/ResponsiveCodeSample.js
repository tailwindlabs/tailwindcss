import { useState } from 'react'
import redent from 'redent'
import clsx from 'clsx'

const screens = ['', 'sm:', 'md:', 'lg:', 'xl:']

function Button({ children, active, onClick }) {
  return (
    <button
      type="button"
      className={clsx('inline-block text-center cursor-pointer select-none px-3', {
        'text-gray-800': active,
        'text-gray-500': !active,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const defaultSnippet = (classNames) => `<div class="${classNames}"></div>`

export function ResponsiveCodeSample({
  classNames,
  snippet = defaultSnippet,
  preview,
  previewClassName,
}) {
  let groups = Array.isArray(classNames[0]) ? classNames.length : 1
  let [active, setActive] = useState(0)

  function getActiveClassName(index) {
    if (groups > 1) {
      return classNames.map((group) => {
        for (let i = index; i >= 0; i--) {
          if (group[i]) return group[i].replace(/\(([^)]+)\)/g, '$1')
        }
        return undefined
      })
    }
    for (let i = index; i >= 0; i--) {
      if (classNames[i]) return classNames[i].replace(/\(([^)]+)\)/g, '$1')
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <div className="grid grid-cols-5 mb-2 bg-white">
          <Button active={active === 0} onClick={() => setActive(0)}>
            <svg
              width="8.57142857142857"
              height="24"
              viewBox="0 0 10 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current block mx-auto mb-1"
            >
              <path
                d="M1.5 12h7a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 8.5 28h-7A1.5 1.5 0 0 1 0 26.5v-13A1.5 1.5 0 0 1 1.5 12zM1 15v10h8V15H1zm4 12.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 13v1h2v-1H4z"
                fillRule="evenodd"
              ></path>
            </svg>
            <p className="text-xs">all</p>
          </Button>
          <Button active={active === 1} onClick={() => setActive(1)}>
            <svg
              width="11.999999999999998"
              height="24"
              viewBox="0 0 14 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current block mx-auto mb-1"
            >
              <path
                d="M1.5 6h11A1.5 1.5 0 0 1 14 7.5v19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 0 26.5v-19A1.5 1.5 0 0 1 1.5 6zM1 9v16h12V9H1zm6 18.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                fillRule="evenodd"
              ></path>
            </svg>
            <p className="text-xs">sm</p>
          </Button>
          <Button active={active === 2} onClick={() => setActive(2)}>
            <svg
              width="22.28571428571428"
              height="24"
              viewBox="0 0 26 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current block mx-auto mb-1"
            >
              <path
                d="M26 26.5a1.5 1.5 0 0 1-1.5 1.5h-23A1.5 1.5 0 0 1 0 26.5v-14A1.5 1.5 0 0 1 1.5 11h23a1.5 1.5 0 0 1 1.5 1.5v14zm-3 .5V12H3v15h20zm1.5-6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-23-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
                fillRule="evenodd"
              ></path>
            </svg>
            <p className="text-xs">md</p>
          </Button>
          <Button active={active === 3} onClick={() => setActive(3)}>
            <svg
              width="32.57142857142856"
              height="24"
              viewBox="0 0 38 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current block mx-auto mb-1"
            >
              <path
                d="M34 26h4v1c-1.333.667-2.667 1-4 1H4c-1.333 0-2.667-.333-4-1v-1h4V7.5A1.5 1.5 0 0 1 5.5 6h27A1.5 1.5 0 0 1 34 7.5V26zM6 8v18h26V8H6z"
                fillRule="evenodd"
              ></path>
            </svg>
            <p className="text-xs">lg</p>
          </Button>
          <Button active={active === 4} onClick={() => setActive(4)}>
            <svg
              width="30.85714285714285"
              height="24"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current block mx-auto mb-1"
            >
              <path d="M20.857 24l.857 3H24v1H12v-1h2.286l.857-3H1.5A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0h33A1.5 1.5 0 0 1 36 1.5v21a1.5 1.5 0 0 1-1.5 1.5H20.857zM2 2v18h32V2H2z"></path>
            </svg>
            <p className="text-xs">xl</p>
          </Button>
        </div>
      </div>
      <div className="overflow-hidden mb-8">
        <div className="rounded-t-lg bg-gray-800 border-b border-gray-300 whitespace-pre font-mono text-gray-500 text-sm">
          <pre className="scrollbar-none m-0 p-0 overflow-auto scrolling-touch">
            <code className="inline-block p-4">
              {redent(
                snippet(
                  groups === 1
                    ? '{{CLASSNAMES}}'
                    : Array.from({ length: groups }).map((_, i) => `{{CLASSNAMES[${i}]}}`)
                )
              )
                .trim()
                .split(/(\{\{CLASSNAMES(?:\[[0-9]+\])?\}\})/)
                .flatMap((segment, i) => {
                  if (i % 2 === 1) {
                    let match = segment.match(/\[([0-9]+)\]/)
                    return (match ? classNames[parseInt(match[1], 10)] : classNames)
                      .map((className, j) =>
                        className ? (
                          <span
                            key={`${i}-${j}`}
                            className={active === j ? 'text-code-yellow' : ''}
                          >
                            {j === 0 ? '' : ' '}
                            {className
                              .replace(/\(([^)]+)\)/g, '')
                              .trim()
                              .split(/\s+/)
                              .map((cn) => `${screens[j]}${cn}`)
                              .join(' ')}
                          </span>
                        ) : null
                      )
                      .filter(Boolean)
                  }
                  return segment
                })}
            </code>
          </pre>
        </div>
        <div
          className={clsx(
            'rounded-b-lg border-l border-r border-b border-gray-400 bg-white',
            previewClassName,
            { 'p-4': !previewClassName }
          )}
        >
          {preview(getActiveClassName(active))}
        </div>
      </div>
    </div>
  )
}
