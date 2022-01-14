import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { TabBar } from '@/components/TabBar'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { lines as html } from '../../samples/performance.html?highlight'
import { lines as css } from '../../samples/performance.txt?highlight=css'
import { useInView } from 'react-intersection-observer'
import { animate } from 'framer-motion'

const START_DELAY = 500
const CLASS_DELAY = 1000
const CHAR_DELAY = 75
const SAVE_DELAY = 50
const BUILD_DELAY = 100

function Typing({ classes, rules, onStartedClass, onFinishedClass }) {
  let [text, setText] = useState('')

  useEffect(() => {
    let newText = classes.substr(0, text.length + 1)
    let isSpace = newText.endsWith(' ')
    let isEnd = text.length + 1 > classes.length
    let isEndOfClass = isSpace || isEnd
    if (isEndOfClass) {
      onFinishedClass(newText.split(' ').filter(Boolean).length - 1)
    }
    let handle = window.setTimeout(
      () => {
        if (newText.endsWith(' ') || newText.length === 1) {
          onStartedClass()
        }
        setText(newText)
      },
      isSpace ? CLASS_DELAY : CHAR_DELAY
    )
    return () => {
      window.clearTimeout(handle)
    }
  }, [classes, text, onStartedClass, onFinishedClass])

  return text.split(' ').map((cls, index) => (
    <Fragment key={cls}>
      {index !== 0 && ' '}
      <span
        className={clsx(
          'whitespace-nowrap',
          index === rules.length - 1 && 'code-highlight animate-flash-code-slow'
        )}
      >
        {cls}
      </span>
    </Fragment>
  ))
}

export function Performance() {
  let [visibleRules, setVisibleRules] = useState([])
  let [saved, setSaved] = useState(true)
  let [lastFinishedClass, setLastFinishedClass] = useState(-1)
  let [active, setActive] = useState(false)
  let scrollRef = useRef()
  let { ref: typingRef, inView: typingInView } = useInView({ threshold: 1 })
  let { ref: containerRef, inView: containerInView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (typingInView && !active) {
      let handle = window.setTimeout(() => setActive(true), START_DELAY)
      return () => {
        window.clearTimeout(handle)
      }
    }
  }, [active, typingInView])

  useEffect(() => {
    if (!containerInView && active) {
      setActive(false)
      setVisibleRules([])
      setSaved(true)
      setLastFinishedClass(-1)
    }
  }, [active, containerInView])

  let rules = []
  let chunk = []
  for (let line of css) {
    chunk.push(line)
    let empty = line.every(({ content }) => content.trim() === '')
    if (empty) {
      rules.push(chunk)
      chunk = []
    }
  }

  rules = rules.filter((_, i) => visibleRules.includes(i))

  let onStartedClass = useCallback(() => {
    setSaved(false)
  }, [])

  useEffect(() => {
    if (lastFinishedClass < 0) return
    let handle1 = window.setTimeout(() => setSaved(true), SAVE_DELAY)
    let handle2 = window.setTimeout(
      () =>
        setVisibleRules(
          [
            [0],
            [0, 1],
            [0, 1, 3],
            [0, 1, 3, 4],
            [0, 1, 3, 4, 5],
            [0, 1, 2, 3, 4, 5],
            [0, 1, 2, 3, 4, 5, 6],
          ][lastFinishedClass]
        ),
      SAVE_DELAY + BUILD_DELAY
    )
    return () => {
      window.clearTimeout(handle1)
      window.clearTimeout(handle2)
    }
  }, [lastFinishedClass])

  return (
    <section id="performance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer
          className="dark:bg-sky-500 dark:highlight-white/20"
          light={require('@/img/icons/home/performance.png').default}
          dark={require('@/img/icons/home/dark/performance.png').default}
        />
        <Caption className="text-sky-500">Performance</Caption>
        <BigText>It's tiny — never ship unused CSS again.</BigText>
        <Paragraph>
          Tailwind automatically removes all unused CSS when building for production, which means
          your final CSS bundle is the smallest it could possibly be. In fact, most Tailwind
          projects ship less than 10kB of CSS to the client.
        </Paragraph>
        <Link href="/docs/optimizing-for-production" color="sky" darkColor="gray">
          Learn more<span className="sr-only">, optimizing for production</span>
        </Link>
      </div>
      <GridLockup
        className="mt-14"
        overhang="md"
        left={
          <div className="relative">
            <div
              ref={containerRef}
              className="relative bg-slate-800 shadow-xl pt-2 overflow-hidden sm:rounded-xl lg:grid lg:grid-cols-2 lg:grid-rows-1 dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10"
            >
              <div className="row-end-1">
                <TabBar
                  side="left"
                  translucent={true}
                  primary={{ name: 'index.html', saved }}
                  secondary={[
                    { name: 'tailwind.config.js' },
                    { name: 'package.json', open: false, className: 'hidden sm:block' },
                  ]}
                >
                  <svg width="15" height="14" fill="none" stroke="currentColor">
                    <rect width="14" height="13" x="0.5" y="0.5" rx="3" />
                    <path d="M7.5 0V14" />
                  </svg>
                  <svg width="12" height="2" fill="currentColor">
                    <circle cx="1" cy="1" r="1" />
                    <circle cx="6" cy="1" r="1" />
                    <circle cx="11" cy="1" r="1" />
                  </svg>
                </TabBar>
                <CodeWindow.Code2
                  lines={html.length}
                  language="html"
                  wrap={true}
                  showLineNumbers={false}
                  overflow={false}
                  className="border-r border-slate-500/30 h-[20.8125rem] overflow-hidden p-4 md:pl-0"
                >
                  {html.map((tokens, lineIndex) => (
                    <div key={lineIndex} className="flex">
                      <div className="hidden md:block text-slate-600 flex-none pr-4 text-right select-none w-[3.125rem] mr-4">
                        {lineIndex + 1}
                      </div>
                      <div>
                        {tokens.map((token, tokenIndex) => {
                          if (token.content === '__CLASSES__') {
                            return (
                              <span
                                key={tokenIndex}
                                ref={typingRef}
                                className={getClassNameForToken(token)}
                              >
                                {active && (
                                  <Typing
                                    classes="flex items-center px-4 py-3 text-white bg-blue-500 hover:bg-blue-400"
                                    rules={rules}
                                    onStartedClass={onStartedClass}
                                    onFinishedClass={setLastFinishedClass}
                                  />
                                )}
                                <span className="border -mx-px" style={{ height: '1.125rem' }} />
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
                    </div>
                  ))}
                </CodeWindow.Code2>
              </div>
              <div className="row-span-2 border-t border-slate-500/30 pt-1.5 lg:border-0 lg:pt-0">
                <TabBar
                  side="right"
                  translucent={true}
                  primary={{ name: 'build.css', saved: true }}
                >
                  <svg width="12" height="2" fill="currentColor">
                    <circle cx="1" cy="1" r="1" />
                    <circle cx="6" cy="1" r="1" />
                    <circle cx="11" cy="1" r="1" />
                  </svg>
                </TabBar>
                <CodeWindow.Code2
                  ref={scrollRef}
                  language="css"
                  overflow={false}
                  lines={Math.max(1, rules.flat().length)}
                  className="h-[20.8125rem] lg:h-[31.6875rem] scroll-smooth overflow-hidden"
                >
                  {rules.map((rule) => (
                    <Rule
                      key={rule[0].find(({ content }) => content.trim()).content}
                      rule={rule}
                      scrollRef={scrollRef}
                    />
                  ))}
                </CodeWindow.Code2>
              </div>
              <div className="row-start-1 row-end-2 border-t border-slate-500/30">
                <div className="h-1.5 border-r border-slate-500/30" />
                <TabBar
                  side="right"
                  translucent={true}
                  primary={{ name: 'Terminal' }}
                  showTabMarkers={false}
                >
                  <svg width="12" height="2" fill="currentColor">
                    <circle cx="1" cy="1" r="1" />
                    <circle cx="6" cy="1" r="1" />
                    <circle cx="11" cy="1" r="1" />
                  </svg>
                </TabBar>
                <Terminal rules={rules} />
              </div>
            </div>
          </div>
        }
      />
    </section>
  )
}

function Terminal({ rules }) {
  let scrollRef = useRef()

  useEffect(() => {
    let top = scrollRef.current.scrollHeight - scrollRef.current.offsetHeight

    if (CSS.supports('scroll-behavior', 'smooth')) {
      scrollRef.current.scrollTo({ top })
    } else {
      animate(scrollRef.current.scrollTop, top, {
        onUpdate: (top) => scrollRef.current.scrollTo({ top }),
      })
    }
  }, [rules.length])

  return (
    <div
      ref={scrollRef}
      className="flex-auto border-r border-slate-500/30 text-slate-400 font-mono p-4 pb-0 h-[8.75rem] overflow-hidden scroll-smooth flex"
    >
      <svg viewBox="0 -9 3 24" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
        <path
          d="M0 0L3 3L0 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <pre className="flex-auto leading-6 text-sm">
        <code className="block space-y-1 pb-4">
          <div>
            npx tailwindcss <span className="xl:hidden">-o</span>
            <span className="hidden xl:inline">--output</span> build.css --content index.html{' '}
            <span className="xl:hidden">-w</span> <span className="hidden xl:inline">--watch</span>
          </div>
          {rules.map((_rule, index) => (
            <div key={index} className={index === rules.length - 1 ? 'text-slate-200' : undefined}>
              <span className="code-highlight animate-flash-code-slow">
                Rebuilding... Done in {[5, 6, 5, 7, 4, 5][index % 6]}ms.
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

function Rule({ rule, scrollRef }) {
  let ref = useRef()

  useEffect(() => {
    let top =
      ref.current.offsetTop - scrollRef.current.offsetHeight / 2 + ref.current.offsetHeight / 2

    if (CSS.supports('scroll-behavior', 'smooth')) {
      scrollRef.current.scrollTo({ top })
    } else {
      animate(scrollRef.current.scrollTop, top, {
        onUpdate: (top) => scrollRef.current.scrollTo({ top }),
      })
    }
  }, [scrollRef])

  return (
    <div ref={ref}>
      {rule.map((tokens, lineIndex) => {
        let contentIndex = tokens.findIndex(({ content }) => content.trim())
        if (contentIndex === -1) {
          return '\n'
        }
        return (
          <Fragment key={lineIndex}>
            {tokens.slice(0, contentIndex).map((token) => token.content)}
            <span className="code-highlight animate-flash-code-slow">
              {tokens.slice(contentIndex).map((token, tokenIndex) => {
                return (
                  <span key={tokenIndex} className={getClassNameForToken(token)}>
                    {token.content}
                  </span>
                )
              })}
            </span>
            {'\n'}
          </Fragment>
        )
      })}
    </div>
  )
}
