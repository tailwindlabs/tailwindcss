import {
  IconContainer,
  Caption,
  BigText,
  Paragraph,
  Link,
  Widont,
  InlineCode,
} from '@/components/home/common'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { addClassTokens2 } from '@/utils/addClassTokens'
import { useEffect, useRef, useState } from 'react'
import { usePrevious } from '@/hooks/usePrevious'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { lines } from '../../samples/state-variants.html?highlight'
import { animate } from 'framer-motion'

const projects = [
  { title: 'API Integration', category: 'Engineering' },
  { title: 'New Benefits Plan', category: 'Human Resources' },
  { title: 'Onboarding Emails', category: 'Customer Success' },
]

const faces = [
  'photo-1531123897727-8f129e1688ce',
  'photo-1494790108377-be9c29b29330',
  'photo-1552374196-c4e7ffc6e126',
  'photo-1546525848-3ce03ca516f6',
  'photo-1544005313-94ddf0286df2',
  'photo-1517841905240-472988babdf9',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1500648767791-00dcc994a43e',
  'photo-1534528741775-53994a69daeb',
  'photo-1502685104226-ee32379fefbe',
  'photo-1546525848-3ce03ca516f6',
  'photo-1502685104226-ee32379fefbe',
  'photo-1494790108377-be9c29b29330',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1534528741775-53994a69daeb',
]

addClassTokens2(lines)

const lineRanges = {
  'new-btn-hover': [4, 9],
  'input-focus': [15, 15],
  'item-hover': [20, 39],
  'new-hover': [42, 47],
}

export function StateVariants() {
  const [states, setStates] = useState([])
  const prevStates = usePrevious(states)
  const codeContainerRef = useRef()
  const linesContainerRef = useRef()

  function scrollTo(rangeOrRanges) {
    let ranges = Array.isArray(rangeOrRanges) ? rangeOrRanges : [rangeOrRanges]
    if (ranges.length === 0) return
    let linesSorted = ranges.flat().sort((a, b) => a - b)
    let minLine = linesSorted[0]
    let maxLine = linesSorted[linesSorted.length - 1]
    let $lines = linesContainerRef.current.children
    let containerHeight = codeContainerRef.current.offsetHeight
    let top = $lines[minLine].offsetTop
    let height = $lines[maxLine].offsetTop + $lines[maxLine].offsetHeight - top

    top = top - containerHeight / 2 + height / 2

    if (CSS.supports('scroll-behavior', 'smooth')) {
      codeContainerRef.current.scrollTo({ top })
    } else {
      animate(codeContainerRef.current.scrollTop, top, {
        onUpdate: (top) => codeContainerRef.current.scrollTo({ top }),
      })
    }
  }

  useEffect(() => {
    if (prevStates && prevStates.length > states.length) {
      scrollTo(states.map((state) => lineRanges[state]))
    } else if (states.length) {
      scrollTo(lineRanges[states[states.length - 1]])
    }
  }, [states, prevStates])

  return (
    <section id="state-variants">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer
          className="dark:bg-blue-500 dark:highlight-white/20"
          light={require('@/img/icons/home/state-variants.png').default}
          dark={require('@/img/icons/home/dark/state-variants.png').default}
        />
        <Caption className="text-blue-500">State variants</Caption>
        <BigText>
          <Widont>Hover and focus states? We got ’em.</Widont>
        </BigText>
        <Paragraph>
          Want to style something on hover? Stick <InlineCode>hover:</InlineCode> at the beginning
          of the class you want to add. Works for <InlineCode>focus</InlineCode>,{' '}
          <InlineCode>active</InlineCode>, <InlineCode>disabled</InlineCode>,{' '}
          <InlineCode>focus-within</InlineCode>, <InlineCode>focus-visible</InlineCode>, and even
          fancy states we invented ourselves like <InlineCode>group-hover</InlineCode>.
        </Paragraph>
        <Link href="/docs/hover-focus-and-other-states" color="blue" darkColor="gray">
          Learn more<span className="sr-only">, handling hover, focus, and other states</span>
        </Link>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        beams={4}
        left={
          <div className="relative z-10 rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden my-auto xl:mt-18 dark:bg-slate-800">
            <section>
              <header className="rounded-t-xl space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 dark:highlight-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Projects</h2>
                  <div
                    className="group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 cursor-pointer shadow-sm hover:bg-blue-400"
                    onMouseEnter={() => {
                      setStates((states) => [...states, 'new-btn-hover'])
                    }}
                    onMouseLeave={() => {
                      setStates((states) => states.filter((x) => x !== 'new-btn-hover'))
                    }}
                  >
                    <svg width="20" height="20" fill="currentColor" className="mr-2">
                      <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    New
                  </div>
                </div>
                <div className="group relative rounded-md dark:bg-slate-700 dark:highlight-white/10 dark:focus-within:bg-transparent">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 dark:text-slate-500"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    />
                  </svg>
                  <input
                    onFocus={() => {
                      setStates((states) => [...states, 'input-focus'])
                    }}
                    onBlur={() => {
                      setStates((states) => states.filter((x) => x !== 'input-focus'))
                      // resetScroll()
                    }}
                    type="text"
                    aria-label="Filter projects"
                    placeholder="Filter projects..."
                    className="appearance-none w-full text-sm leading-6 bg-transparent text-slate-900 placeholder:text-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-0 dark:focus:ring-2"
                  />
                </div>
              </header>
              <ul className="bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6 dark:bg-slate-900/40 dark:ring-1 dark:ring-white/5">
                {projects.map((project, i, a) => (
                  <li
                    key={i}
                    className={clsx(
                      'group cursor-pointer rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md dark:bg-slate-700 dark:ring-0 dark:highlight-white/10 dark:hover:bg-blue-500',
                      i === a.length - 1 ? 'hidden sm:block lg:hidden xl:block' : ''
                    )}
                    onMouseEnter={() => {
                      setStates((states) => [...states, 'item-hover'])
                    }}
                    onMouseLeave={() => {
                      setStates((states) => states.filter((x) => x !== 'item-hover'))
                    }}
                  >
                    <dl className="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
                      <div>
                        <dt className="sr-only">Title</dt>
                        <dd className="font-semibold text-slate-900 group-hover:text-white dark:text-slate-100">
                          {project.title}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Category</dt>
                        <dd className="group-hover:text-blue-200">{project.category}</dd>
                      </div>
                      <div className="col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4">
                        <dt className="sr-only">Users</dt>
                        <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-1.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <img
                              key={j}
                              src={`https://images.unsplash.com/${
                                faces[i * 5 + j]
                              }?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80`}
                              alt=""
                              className="w-6 h-6 rounded-full bg-slate-100 ring-2 ring-white dark:ring-slate-700 dark:group-hover:ring-white"
                              loading="lazy"
                            />
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
                <li className="flex">
                  <div
                    className="group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3 cursor-pointer hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 dark:border-slate-700 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-transparent dark:hover:text-blue-500"
                    onMouseEnter={() => {
                      setStates((states) => [...states, 'new-hover'])
                    }}
                    onMouseLeave={() => {
                      setStates((states) => states.filter((x) => x !== 'new-hover'))
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="mb-1 text-slate-400 group-hover:text-blue-500"
                    >
                      <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    New project
                  </div>
                </li>
              </ul>
            </section>
          </div>
        }
        right={
          <CodeWindow>
            <CodeWindow.Code2 ref={codeContainerRef} lines={lines.length} className="scroll-smooth">
              <div
                ref={linesContainerRef}
                className={clsx('mono', { 'mono-active': states.length > 0 })}
              >
                {lines.map((tokens, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={
                      (states.includes('new-btn-hover') &&
                        lineIndex >= lineRanges['new-btn-hover'][0] &&
                        lineIndex <= lineRanges['new-btn-hover'][1]) ||
                      (states.includes('input-focus') &&
                        lineIndex >= lineRanges['input-focus'][0] &&
                        lineIndex <= lineRanges['input-focus'][1]) ||
                      (states.includes('item-hover') &&
                        lineIndex >= lineRanges['item-hover'][0] &&
                        lineIndex <= lineRanges['item-hover'][1]) ||
                      (states.includes('new-hover') &&
                        lineIndex >= lineRanges['new-hover'][0] &&
                        lineIndex <= lineRanges['new-hover'][1])
                        ? 'not-mono'
                        : ''
                    }
                  >
                    {tokens.map((token, tokenIndex) => {
                      if (
                        token.types[token.types.length - 1] === 'class' &&
                        token.content.startsWith('(')
                      ) {
                        const [, state] = token.content.match(/^\(([^)]+)\)/)
                        return (
                          <span
                            key={tokenIndex}
                            className={clsx(
                              'code-highlight transition-colors duration-500',
                              getClassNameForToken(token),
                              { 'bg-code-highlight': states.includes(state) }
                            )}
                          >
                            {token.content.substr(token.content.indexOf(')') + 1)}
                          </span>
                        )
                      }
                      return (
                        <span key={tokenIndex} className={getClassNameForToken(token)}>
                          {token.content}
                        </span>
                      )
                    })}
                  </div>
                ))}
              </div>
            </CodeWindow.Code2>
          </CodeWindow>
        }
      />
    </section>
  )
}
