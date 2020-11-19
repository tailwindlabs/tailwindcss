import {
  IconContainer,
  Caption,
  BigText,
  Paragraph,
  Link,
  Widont,
  InlineCode,
} from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/state-variants.svg'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import { addClassTokens2 } from '@/utils/addClassTokens'
import { useEffect, useRef, useState } from 'react'
import { usePrevious } from '@/hooks/usePrevious'
import clsx from 'clsx'

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

const {
  lines,
} = tokenizeWithLines.html(`<section class="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
  <header class="flex items-center justify-between">
    <h2 class="text-lg leading-6 font-medium text-black">Projects</h2>
    <button class="(new-btn-hover)hover:bg-light-blue-200 (new-btn-hover)hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2">
      <svg class="(new-btn-hover)group-hover:text-light-blue-600 text-light-blue-500 mr-2" width="12" height="20" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"/>
      </svg>
      New
    </button>
  </header>
  <form class="relative">
    <svg width="20" height="20" fill="currentColor" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
    </svg>
    <input class="(input-focus)focus:border-light-blue-500 (input-focus)focus:ring-1 (input-focus)focus:ring-light-blue-500 (input-focus)focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Filter projects" placeholder="Filter projects" />
  </form>
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
    <li x-for="item in items">
      <a :href="item.url" class="(item-hover)hover:bg-light-blue-500 (item-hover)hover:border-transparent (item-hover)hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
        <dl class="grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center">
          <div>
            <dt class="sr-only">Title</dt>
            <dd class="(item-hover)group-hover:text-white leading-6 font-medium text-black">
              {item.title}
            </dd>
          </div>
          <div>
            <dt class="sr-only">Category</dt>
            <dd class="(item-hover)group-hover:text-light-blue-200 text-sm font-medium sm:mb-4 lg:mb-0 xl:mb-4">
              {item.category}
            </dd>
          </div>
          <div class="col-start-2 row-start-1 row-end-3">
            <dt class="sr-only">Users</dt>
            <dd class="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
              <img x-for="user in item.users" :src="user.avatar" :alt="user.name" width="48" height="48" class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white" />
            </dd>
          </div>
        </dl>
      </a>
    </li>
    <li class="(new-hover)hover:shadow-lg flex rounded-lg">
      <a href="/new" class="(new-hover)hover:border-transparent (new-hover)hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
        New Project
      </a>
    </li>
  </ul>
</section>
`)

addClassTokens2(lines)

const lineRanges = {
  'new-btn-hover': [3, 8],
  'input-focus': [14, 14],
  'item-hover': [18, 39],
  'new-hover': [41, 45],
}

export function StateVariants() {
  const [states, setStates] = useState([])
  const prevStates = usePrevious(states)
  const codeContainerRef = useRef()
  const linesContainerRef = useRef()

  function scrollTo(rangeOrRanges) {
    const ranges = Array.isArray(rangeOrRanges) ? rangeOrRanges : [rangeOrRanges]
    if (ranges.length === 0) return
    const linesSorted = ranges.flat().sort((a, b) => a - b)
    const minLine = linesSorted[0]
    const maxLine = linesSorted[linesSorted.length - 1]
    const $lines = linesContainerRef.current.children
    const containerHeight = codeContainerRef.current.offsetHeight
    const top = $lines[minLine].offsetTop
    const height = $lines[maxLine].offsetTop + $lines[maxLine].offsetHeight - top

    codeContainerRef.current.scrollTo({
      top: top - containerHeight / 2 + height / 2,
      behavior: 'smooth',
    })
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
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.lightblue[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-light-blue-500 mb-3">
          State variants
        </Caption>
        <BigText className="mb-8">
          <Widont>Hover and focus states? We got ’em.</Widont>
        </BigText>
        <Paragraph className="mb-6">
          Want to style something on hover? Stick <InlineCode>hover:</InlineCode> at the beginning
          of the class you want to add. Works for <InlineCode>focus</InlineCode>,{' '}
          <InlineCode>active</InlineCode>, <InlineCode>disabled</InlineCode>,{' '}
          <InlineCode>focus-within</InlineCode>, <InlineCode>focus-visible</InlineCode>, and even
          fancy states we invented ourselves like <InlineCode>group-hover</InlineCode>.
        </Paragraph>
        <Link
          href="/docs/hover-focus-and-other-states"
          className="text-light-blue-500 hover:text-light-blue-700"
        >
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="lightblue"
        rotate={1}
        left={
          <div className="relative z-10 bg-white rounded-tr-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8">
            <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-lg leading-6 font-medium text-black">Projects</h2>
                <div
                  className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2 cursor-pointer"
                  onMouseEnter={() => {
                    setStates((states) => [...states, 'new-btn-hover'])
                  }}
                  onMouseLeave={() => {
                    setStates((states) => states.filter((x) => x !== 'new-btn-hover'))
                  }}
                >
                  <svg
                    width="12"
                    height="20"
                    fill="currentColor"
                    className="group-hover:text-light-blue-600 text-light-blue-500 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
                    />
                  </svg>
                  New
                </div>
              </header>
              <form className="relative">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                  placeholder="Filter projects"
                  className="w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10 focus:border-light-blue-500 focus:outline-none focus:ring-1 focus:ring-light-blue-500"
                />
              </form>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {projects.map((project, i, a) => (
                  <li
                    key={i}
                    className={i === a.length - 1 ? 'hidden sm:block lg:hidden xl:block' : ''}
                  >
                    <div
                      className="group cursor-pointer rounded-lg p-4 border border-gray-200 hover:bg-light-blue-500 hover:border-transparent hover:shadow-lg"
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
                          <dd className="leading-6 font-medium text-black group-hover:text-white">
                            {project.title}
                          </dd>
                        </div>
                        <div>
                          <dt className="sr-only">Category</dt>
                          <dd className="text-sm font-medium group-hover:text-light-blue-200 sm:mb-4 lg:mb-0 xl:mb-4">
                            {project.category}
                          </dd>
                        </div>
                        <div className="col-start-2 row-start-1 row-end-3">
                          <dt className="sr-only">Users</dt>
                          <dd className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <img
                                key={j}
                                src={`https://images.unsplash.com/${
                                  faces[i * 5 + j]
                                }?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80`}
                                alt=""
                                width="48"
                                height="48"
                                className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                                loading="lazy"
                              />
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                ))}
                <li className="hover:shadow-lg flex rounded-lg">
                  <div
                    className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4 cursor-pointer"
                    onMouseEnter={() => {
                      setStates((states) => [...states, 'new-hover'])
                    }}
                    onMouseLeave={() => {
                      setStates((states) => states.filter((x) => x !== 'new-hover'))
                    }}
                  >
                    New Project
                  </div>
                </li>
              </ul>
            </section>
          </div>
        }
        right={
          <CodeWindow className="bg-light-blue-500">
            <CodeWindow.Code2 ref={codeContainerRef} lines={lines.length}>
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
