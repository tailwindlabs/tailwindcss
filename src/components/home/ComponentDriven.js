import {
  IconContainer,
  Caption,
  BigText,
  Paragraph,
  Link,
  Widont,
  InlineCode,
} from '@/components/home/common'
import { GridLockup } from '@/components/GridLockup'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { Fragment, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import iconUrl from '@/img/icons/home/component-driven.png'
import { Tabs } from '@/components/Tabs'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'

import { lines as reactMoviesSample } from '../../samples/react/movies.jsx?highlight'
import { lines as reactNavSample } from '../../samples/react/nav.jsx?highlight'
import { lines as reactNavItemSample } from '../../samples/react/nav-item.jsx?highlight'
import { lines as reactListSample } from '../../samples/react/list.jsx?highlight'
import { lines as reactListItemSample } from '../../samples/react/list-item.jsx?highlight'

import { lines as vueMoviesSample } from '../../samples/vue/movies.html?highlight'
import { lines as vueNavSample } from '../../samples/vue/nav.html?highlight'
import { lines as vueNavItemSample } from '../../samples/vue/nav-item.html?highlight'
import { lines as vueListSample } from '../../samples/vue/list.html?highlight'
import { lines as vueListItemSample } from '../../samples/vue/list-item.html?highlight'

import { lines as angularMoviesSample } from '../../samples/angular/movies.js?highlight'
import { lines as angularNavSample } from '../../samples/angular/nav.js?highlight'
import { lines as angularNavItemSample } from '../../samples/angular/nav-item.js?highlight'
import { lines as angularListSample } from '../../samples/angular/list.js?highlight'
import { lines as angularListItemSample } from '../../samples/angular/list-item.js?highlight'

import { lines as bladeMoviesSample } from '../../samples/blade/movies.html?highlight'
import { lines as bladeNavSample } from '../../samples/blade/nav.html?highlight'
import { lines as bladeNavItemSample } from '../../samples/blade/nav-item.html?highlight'
import { lines as bladeListSample } from '../../samples/blade/list.html?highlight'
import { lines as bladeListItemSample } from '../../samples/blade/list-item.html?highlight'

import { lines as css } from '../../samples/apply.txt?highlight=css'
import { lines as html } from '../../samples/apply.html?highlight'

function highlightDecorators(lines) {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j].types.includes('function') && lines[i][j - 1].content.trim() === '@') {
        lines[i][j - 1].types = ['function']
      }
    }
  }
  return lines
}

const movies = [
  {
    title: 'Prognosis Negative',
    starRating: '2.66',
    rating: 'PG-13',
    year: '2021',
    genre: 'Comedy',
    runtime: '1h 46m',
    cast: 'Simon Pegg, Zach Galifianakis',
    image: require('@/img/prognosis-negative.jpg').default,
  },
  {
    title: 'Rochelle, Rochelle',
    starRating: '3.25',
    rating: 'R',
    year: '2020',
    genre: 'Romance',
    runtime: '1h 56m',
    cast: 'Emilia Clarke',
    image: require('@/img/rochelle-rochelle.jpg').default,
  },
  {
    title: 'Death Blow',
    starRating: '4.95',
    rating: '18A',
    year: '2020',
    genre: 'Action',
    runtime: '2h 5m',
    cast: 'Idris Elba, John Cena, Thandiwe Newton',
    image: require('@/img/death-blow.jpg').default,
  },
]

const tabs = {
  React: {
    'Movies.js': reactMoviesSample,
    'Nav.js': reactNavSample,
    'NavItem.js': reactNavItemSample,
    'List.js': reactListSample,
    'ListItem.js': reactListItemSample,
  },
  Vue: {
    'Movies.vue': vueMoviesSample,
    'Nav.vue': vueNavSample,
    'NavItem.vue': vueNavItemSample,
    'List.vue': vueListSample,
    'ListItem.vue': vueListItemSample,
  },
  Angular: {
    'movies.component.ts': highlightDecorators(angularMoviesSample),
    'nav.component.ts': highlightDecorators(angularNavSample),
    'nav-item.component.ts': highlightDecorators(angularNavItemSample),
    'list.component.ts': highlightDecorators(angularListSample),
    'list-item.component.ts': highlightDecorators(angularListItemSample),
  },
  Blade: {
    'movies.blade.php': bladeMoviesSample,
    'nav.blade.php': bladeNavSample,
    'nav-item.blade.php': bladeNavItemSample,
    'list.blade.php': bladeListSample,
    'list-item.blade.php': bladeListItemSample,
  },
}

function ComponentLink({ onClick, children }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    function onKey(e) {
      const modifier = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey
      if (!active && modifier) {
        setActive(true)
      } else if (active && !modifier) {
        setActive(false)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [active])

  return active ? (
    <button type="button" className="hover:underline" onClick={onClick}>
      {children}
    </button>
  ) : (
    children
  )
}

function ComponentExample({ framework }) {
  const [activeTab, setActiveTab] = useState(0)
  const lines = tabs[framework][Object.keys(tabs[framework])[activeTab]]

  useIsomorphicLayoutEffect(() => {
    setActiveTab(0)
  }, [framework])

  return (
    <CodeWindow border={false}>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={framework}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-none overflow-auto whitespace-nowrap flex"
        >
          <div className="relative flex-none min-w-full px-1">
            <ul className="flex text-sm leading-6 text-gray-400">
              {Object.keys(tabs[framework]).map((tab, tabIndex) => (
                <li key={tab} className="flex-none">
                  <button
                    type="button"
                    className={clsx(
                      'relative py-2 px-3',
                      tabIndex === activeTab ? 'text-sky-300' : 'hover:text-gray-300'
                    )}
                    onClick={() => setActiveTab(tabIndex)}
                  >
                    {tab}
                    {tabIndex === activeTab && (
                      <span className="absolute z-10 bottom-0 inset-x-3 h-px bg-sky-300" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gray-500/30" />
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          key={framework + activeTab}
          className="w-full flex-auto flex min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CodeWindow.Code2 lines={lines.length}>
            {lines.map((tokens, lineIndex) => (
              <Fragment key={framework + activeTab + lineIndex}>
                {tokens.map((token, tokenIndex) => {
                  if (
                    (token.types[token.types.length - 1] === 'class-name' ||
                      (token.types[token.types.length - 1] === 'tag' &&
                        /^([A-Z]|x-)/.test(token.content))) &&
                    tokens[tokenIndex - 1]?.types[tokens[tokenIndex - 1].types.length - 1] ===
                      'punctuation' &&
                    (tokens[tokenIndex - 1]?.content === '<' ||
                      tokens[tokenIndex - 1].content === '</')
                  ) {
                    return (
                      <span key={tokenIndex} className={getClassNameForToken(token)}>
                        <ComponentLink
                          onClick={() =>
                            setActiveTab(
                              Object.keys(tabs[framework]).findIndex((x) =>
                                x.startsWith(`${token.content.replace(/^x-/, '')}.`)
                              )
                            )
                          }
                        >
                          {token.content}
                        </ComponentLink>
                      </span>
                    )
                  }

                  if (
                    token.types[token.types.length - 1] === 'string' &&
                    /^(['"`])\.\/.*?\.(js|vue)\1$/.test(token.content)
                  ) {
                    const tab = token.content.substr(3, token.content.length - 4)
                    return (
                      <span key={tokenIndex} className={getClassNameForToken(token)}>
                        {token.content.substr(0, 1)}
                        <button
                          type="button"
                          className="underline"
                          onClick={() => setActiveTab(Object.keys(tabs[framework]).indexOf(tab))}
                        >
                          ./{tab}
                        </button>
                        {token.content.substr(0, 1)}
                      </span>
                    )
                  }

                  return (
                    <span key={tokenIndex} className={getClassNameForToken(token)}>
                      {token.content}
                    </span>
                  )
                })}
                {'\n'}
              </Fragment>
            ))}
          </CodeWindow.Code2>
        </motion.div>
      </AnimatePresence>
    </CodeWindow>
  )
}

function ApplyExample({ inView }) {
  return (
    <CodeWindow className="!h-auto !max-h-[none]" border={false}>
      <h3 className="pl-4 flex text-sm leading-6 text-sky-300 border-b border-gray-500/30">
        <span className="-mb-px py-2 border-b border-b-current">styles.css</span>
      </h3>
      <div className="flex-none">
        <CodeWindow.Code2 lines={css.length}>
          {css.map((tokens, lineIndex) => (
            <Fragment key={lineIndex}>
              {tokens.map((token, tokenIndex) => {
                let className = getClassNameForToken(token)
                if (className) {
                  className = className
                    .replace(/\bclass\b/, 'selector')
                    .replace(/\b(number|color)\b/, '')
                }
                return (
                  <span key={tokenIndex} className={className}>
                    {token.content}
                  </span>
                )
              })}
              {'\n'}
            </Fragment>
          ))}
        </CodeWindow.Code2>
      </div>
      <h3 className="pl-4 flex text-sm leading-6 text-sky-300 border-b border-gray-500/30">
        <span className="-mb-px py-2 border-b border-b-current">index.html</span>
      </h3>
      <div className="overflow-hidden">
        <CodeWindow.Code2 lines={html.length} initialLineNumber={31} overflow="x" className="-mt-6">
          <div className={clsx('mono', { 'mono-active': inView })}>
            {html.map((tokens, lineIndex) => (
              <div
                key={lineIndex}
                className={lineIndex >= 4 && lineIndex <= 5 ? 'not-mono' : undefined}
              >
                {tokens.map((token, tokenIndex) => {
                  return (
                    <span
                      key={tokenIndex}
                      className={clsx(getClassNameForToken(token), 'delay-500')}
                      style={{ transitionDuration: '1.5s' }}
                    >
                      {token.content}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </CodeWindow.Code2>
      </div>
    </CodeWindow>
  )
}

function AtApplySection() {
  const { inView, ref } = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <div className="mt-20 relative max-w-7xl mx-auto px-4 sm:mt-32 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:grid-rows-1">
      <div className="lg:col-span-7 xl:col-span-6 lg:row-end-1">
        <h3 className="text-3xl text-gray-900 font-extrabold">Not into component frameworks?</h3>
        <Paragraph>
          If you like to keep it old school use Tailwind's <InlineCode>@apply</InlineCode> directive
          to extract repeated utility patterns into custom CSS classes just by copying and pasting
          the list of class names.
        </Paragraph>
        <Link href="/docs/reusing-styles" color="sky">
          Learn more<span className="sr-only">, reusing styles</span>
        </Link>
      </div>

      <div className="pt-10 lg:col-span-5 xl:col-span-6 lg:row-start-1 lg:row-end-2">
        <div
          ref={ref}
          className="relative z-10 bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5"
        >
          <article>
            <h2
              className={clsx(
                'transition-opacity duration-1500 delay-500 text-lg font-semibold text-gray-900 pt-4 pb-2 px-4 sm:px-6 lg:px-4 xl:px-6',
                { 'opacity-25': inView }
              )}
            >
              Weekly one-on-one
            </h2>
            <dl
              className={clsx(
                'transition-opacity duration-1500 delay-500 flex flex-wrap divide-y divide-gray-200 border-b border-gray-200 text-sm sm:text-base lg:text-sm xl:text-base',
                { 'opacity-25': inView }
              )}
            >
              <div className="px-4 sm:px-6 lg:px-4 xl:px-6 pb-4">
                <dt className="sr-only">Date and time</dt>
                <dd>
                  <time dateTime="2020-11-15T10:00:00-05:00">Thu Nov 15, 2020 10:00am</time> -{' '}
                  <time dateTime="2020-11-15T11:00:00-05:00">
                    11:00am<span className="sr-only sm:not-sr-only"> EST</span>
                  </time>
                </dd>
              </div>
              <div className="w-full flex-none flex items-center p-4 sm:p-6 lg:p-4 xl:p-6">
                <dt className="w-2/5 sm:w-1/4 flex-none text-gray-900 font-medium">Location</dt>
                <dd>
                  Kitchener, <abbr title="Ontario">ON</abbr>
                </dd>
              </div>
              <div className="w-full flex-none flex items-center p-4 sm:p-6 lg:p-4 xl:p-6">
                <dt className="w-2/5 sm:w-1/4 flex-none text-gray-900 font-medium">Description</dt>
                <dd className="italic">No meeting description</dd>
              </div>
              <div className="w-full flex-none flex items-center p-4 sm:py-5 sm:px-6 lg:p-4 xl:py-5 xl:px-6">
                <dt className="w-2/5 sm:w-1/4 flex-none text-gray-900 font-medium">Attendees</dt>
                <dd className="text-sm font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3">
                  Andrew McDonald
                </dd>
              </div>
            </dl>
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-4 xl:gap-x-6 p-4 sm:px-6 sm:py-5 lg:p-4 xl:px-6 xl:py-5">
              <div className="text-base font-medium rounded-lg bg-gray-100 text-gray-900 py-3 text-center cursor-pointer">
                Decline
              </div>
              <div className="text-base font-medium rounded-lg bg-sky-500 text-white py-3 text-center cursor-pointer">
                Accept
              </div>
            </div>
          </article>
        </div>
      </div>
      <div className="mt-4 -mx-4 sm:mx-0 lg:mt-0 lg:col-span-7 lg:row-end-2 xl:mt-18 xl:col-span-6 xl:row-span-2">
        <ApplyExample inView={inView} />
      </div>
    </div>
  )
}

const tabItems = {
  React: (selected) => (
    <>
      <path
        d="M30.685 27.536c-5.353 9.182-12.462 15.042-15.878 13.089-3.416-1.953-1.846-10.98 3.508-20.161 5.353-9.182 12.462-15.042 15.878-13.089 3.416 1.953 1.846 10.98-3.508 20.161Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="7"
        ry="19"
        transform="rotate(90 24 24)"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.315 27.536c5.353 9.182 12.462 15.042 15.878 13.089 3.416-1.953 1.846-10.98-3.508-20.161-5.353-9.182-12.462-15.042-15.878-13.089-3.416 1.953-1.846 10.98 3.508 20.161Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M24 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill={selected ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  Vue: (selected) => (
    <>
      <path
        d="M24 12.814 20.474 7H15l9 15 9-15h-5.476l-3.525 5.814Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M37.408 7 24 28.982 10.592 7H3l21 34L45 7h-7.592Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </>
  ),
  Angular: (selected) => (
    <>
      <path
        d="M10 35 7 12l17-7 17 7-3 23-14 8-14-8Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 25h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.617 31 24 13.764 15.381 31h2.236l6.382-12.764L30.381 31h2.236Z"
        fill="currentColor"
      />
    </>
  ),
  Blade: (selected) => (
    <>
      <path
        d="m7.5 10.5 6.5-3 7 3.5v16l7-4v-8l7-4 7 4v8l-7 3.5V34l-14 7.5L7.5 34V10.5Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
      />
      <path
        d="m7 11 7-4 7 4-7 4-7-4ZM21 11v16M21 35v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 11v23l14 8 14-8V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 15v16l7 4 21-12v-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m28 15 7-4 7 4-7 4-7-4ZM28 15v8l7 4M14 31l14-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
}

export function ComponentDriven() {
  const [framework, setFramework] = useState('React')

  return (
    <section id="component-driven">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer>
          <img src={iconUrl} alt="" />
        </IconContainer>
        <Caption className="text-sky-500">Component-driven</Caption>
        <BigText>
          <Widont>Worried about duplication? Don’t be.</Widont>
        </BigText>
        <Paragraph>
          If you're repeating the same utilities over and over and over again, all you have to do is
          extract them into a component or template partial and boom — you've got a single source of
          truth so you can make changes in one place.
        </Paragraph>
        <Link href="/docs/reusing-styles" color="sky">
          Learn more<span className="sr-only">, reusing styles</span>
        </Link>
        <div className="mt-10">
          <Tabs
            tabs={tabItems}
            className="text-sky-500"
            iconClassName="text-sky-500"
            grid={true}
            spacing="loose"
            selected={framework}
            onChange={setFramework}
          />
        </div>
      </div>
      <GridLockup.Container className="mt-10 xl:mt-2" beams={8}>
        <GridLockup.Grid
          left={
            <div className="relative z-10 bg-white rounded-xl shadow-xl ring-1 ring-gray-900/5 divide-y divide-gray-100 my-auto xl:mt-18">
              <nav className="py-4 px-4 sm:px-6 lg:px-4 xl:px-6 text-sm font-medium">
                <ul className="flex space-x-3">
                  <li>
                    <div className="px-3 py-2 rounded-md bg-sky-500 text-white cursor-pointer">
                      New<span className="hidden sm:inline lg:hidden xl:inline"> Releases</span>
                    </div>
                  </li>
                  <li>
                    <div className="px-3 py-2 rounded-md bg-gray-50 cursor-pointer">
                      Top<span className="hidden sm:inline"> Rated</span>
                    </div>
                  </li>
                  <li>
                    <div className="px-3 py-2 rounded-md bg-gray-50 cursor-pointer">
                      Vincent’s Picks
                    </div>
                  </li>
                </ul>
              </nav>
              {movies.map(({ title, starRating, rating, year, genre, runtime, cast, image }, i) => (
                <article
                  key={title}
                  className={clsx(
                    'p-4 sm:p-6 lg:p-4 xl:p-6 space-x-4 items-start sm:space-x-6 lg:space-x-4 xl:space-x-6',
                    i < 2 ? 'flex' : 'hidden sm:flex'
                  )}
                >
                  <img
                    src={image}
                    loading="lazy"
                    alt=""
                    width="60"
                    height="88"
                    className="flex-none rounded-md bg-gray-100"
                  />
                  <div className="min-w-0 relative flex-auto">
                    <h2 className="font-semibold text-gray-900 truncate sm:pr-20">{title}</h2>
                    <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
                      <div className="hidden absolute top-0 right-0 sm:flex items-center space-x-1">
                        <dt className="text-sky-500">
                          <span className="sr-only">Star rating</span>
                          <svg width="16" height="20" fill="currentColor">
                            <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                          </svg>
                        </dt>
                        <dd>{starRating}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Rating</dt>
                        <dd className="px-1.5 ring-1 ring-gray-200 rounded">{rating}</dd>
                      </div>
                      <div className="ml-2">
                        <dt className="sr-only">Year</dt>
                        <dd>{year}</dd>
                      </div>
                      <div>
                        <dt className="sr-only">Genre</dt>
                        <dd className="flex items-center">
                          <svg
                            width="2"
                            height="2"
                            fill="currentColor"
                            className="mx-2 text-gray-300"
                            aria-hidden="true"
                          >
                            <circle cx="1" cy="1" r="1" />
                          </svg>
                          {genre}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">Runtime</dt>
                        <dd className="flex items-center">
                          <svg
                            width="2"
                            height="2"
                            fill="currentColor"
                            className="mx-2 text-gray-300"
                            aria-hidden="true"
                          >
                            <circle cx="1" cy="1" r="1" />
                          </svg>
                          {runtime}
                        </dd>
                      </div>
                      <div className="flex-none w-full mt-2 font-normal">
                        <dt className="sr-only">Cast</dt>
                        <dd className="text-gray-400">{cast}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          }
          right={<ComponentExample framework={framework} />}
        />
        <AtApplySection />
      </GridLockup.Container>
    </section>
  )
}
