import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/performance.svg'
import { Fragment, useEffect, useRef } from 'react'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import { addClassTokens2 } from '@/utils/addClassTokens'
import shuffleSeed from '@/utils/shuffleSeed'
import clsx from 'clsx'

const DURATION = 6.5
const BASE_RANGE = [0, 5000]

function Counter({ from, to, round = 0, progress }) {
  const ref = useRef()
  const value = useTransform(progress, BASE_RANGE, [from, to], { clamp: false })
  const { format: formatNumber } = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: round,
    maximumFractionDigits: round,
  })

  useEffect(() => {
    return value.onChange((v) => {
      ref.current.firstChild.data = formatNumber(round === 0 ? Math.round(v) : v.toFixed(round))
    })
  }, [])

  return <span ref={ref}>{formatNumber(value.get())}</span>
}

const { lines } = tokenizeWithLines.html(
  `<div class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
  <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto">
    <div class="rounded-lg shadow-xs overflow-hidden">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              Successfully saved!
            </p>
            <p class="mt-1 text-sm text-gray-500">
              Anyone with a link can now view this file.
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
)

addClassTokens2(lines)

const allClasses = 'fixed flex-col rounded-sm shadow px-4 justify-content text-center flex-shrink-0 md:text-left h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto text-lg text-purple-500 md:text-left text-gray-600 text-green-400 text-blue-500 rounded-pill p-4 max-w-screen-xl mt-5 leading-7 whitespace-nowrap sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none flex-1 xl:mx-0 xl:grid-cols-4 border border-gray-200 text-4xl leading-6 leading-10 font-extrabold  leading-5 h-5 w-5 text-green-500 text-5xl leading-none font-extrabold text-white tracking-tight border-t text-sm border-indigo-600 py-4 font-medium px-5 flex items-center space-x-3 text-base leading-6 text-white absolute right-full ml-4 bottom-0 transform -translate-x-1/2 py-3 mx-4 w-full duration-150 h-full transition py-0 pl-4 pr-8 border-transparent bg-transparent text-gray-500 px-5 py-3 appearance-none underline bg-indigo-700 min-w-full divide-y divide-gray-200 items-baseline text-indigo-600 hover:text-indigo-500'.split(
  ' '
)

const usedClasses = shuffleSeed.shuffle(
  'fixed px-4 flex-shrink-0 text-green-400 p-4 flex-1 leading-5 text-sm font-medium ml-4 transition'.split(
    ' '
  ),
  1
)

const unusedClasses = shuffleSeed.shuffle(
  allClasses.filter((c) => !usedClasses.includes(c)),
  1
)

export function Performance() {
  const progress = useMotionValue(0)
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (!inView) return
    animate(progress, BASE_RANGE[1], {
      type: 'spring',
      damping: 50,
    })
  }, [inView])

  return (
    <section id="performance">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.teal[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-teal-500 mb-3">
          Performance
        </Caption>
        <BigText className="mb-8">It’s tiny in production.</BigText>
        <Paragraph className="mb-6">
          Tailwind automatically removes all unused CSS when building for production, which means
          your final CSS bundle is the smallest it could possibly be. In fact, most Tailwind
          projects ship less than 10kB of CSS to the client.
        </Paragraph>
        <Link href="/docs/optimizing-for-production" className="text-teal-500 hover:text-teal-700">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="teal"
        rotate={1}
        pin="right"
        left={
          <div
            ref={ref}
            className="relative z-10 rounded-tl-xl sm:rounded-t-xl lg:rounded-xl shadow-lg lg:-mr-8 tabular-nums"
          >
            <div className="bg-white rounded-tl-xl sm:rounded-t-xl">
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 64 64"
                  className="absolute inset-0 w-full h-full text-green-400"
                  transform="rotate(90) scale(1 -1)"
                >
                  <motion.path
                    d="M6,32a26,26 0 1,0 52,0a26,26 0 1,0 -52,0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeDasharray="0 1"
                    initial={{ pathLength: 0, strokeWidth: 6 }}
                    animate={inView ? { pathLength: 1, strokeWidth: 12 } : undefined}
                    transition={{
                      duration: DURATION,
                    }}
                  />
                </svg>
                <div className="relative bg-white rounded-full w-10 h-10 shadow-sm" />
                <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M22.668 33.333l5.333 5.334 13.334-13.334"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="0 1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                    transition={{
                      pathLength: { delay: DURATION - 0.5, duration: 0.3 },
                      opacity: { delay: DURATION - 0.5, duration: 0 },
                    }}
                  />
                </svg>
              </div>
              <dl className="p-4 pb-0 sm:p-6 sm:pb-0">
                <div className="flex-none w-full pl-18 sm:pl-20 sm:py-0.5">
                  <dt className="text-sm font-medium">Production build</dt>
                  <dd className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    <Counter from={2413.4} to={8.7} round={1} progress={progress} />
                    kB
                  </dd>
                </div>
                <div className="flex items-center border-t border-gray-100 -mx-4 sm:-mx-6 mt-4 sm:mt-6 px-4 sm:px-6 py-3 font-mono text-xs leading-5">
                  <dt className="whitespace-pre">Purged </dt>
                  <dd className="flex-auto">
                    <Counter from={0} to={20144} progress={progress} /> unused classes
                  </dd>
                  <dd className="text-rose-700 hidden sm:flex lg:hidden xl:flex items-center">
                    <span>
                      -<Counter from={0} to={160215} progress={progress} /> lines
                    </span>
                    <svg viewBox="0 0 82 12" width="82" height="12" className="flex-none ml-2">
                      <motion.rect
                        width="12"
                        height="12"
                        fill="#f43f5e"
                        style={{
                          fill: useTransform(progress, (p) =>
                            p >= BASE_RANGE[1] * 0.35 ? '#f43f5e' : '#e4e4e7'
                          ),
                        }}
                      />
                      <motion.rect
                        width="12"
                        height="12"
                        x="14"
                        style={{
                          fill: useTransform(progress, (p) =>
                            p >= BASE_RANGE[1] * 0.75 ? '#f43f5e' : '#e4e4e7'
                          ),
                        }}
                      />
                      <motion.rect
                        width="12"
                        height="12"
                        x="28"
                        style={{
                          fill: useTransform(progress, (p) =>
                            p >= BASE_RANGE[1] * 0.9 ? '#f43f5e' : '#e4e4e7'
                          ),
                        }}
                      />
                      <motion.rect
                        width="12"
                        height="12"
                        x="42"
                        style={{
                          fill: useTransform(progress, (p) =>
                            p >= BASE_RANGE[1] * 0.99 ? '#f43f5e' : '#e4e4e7'
                          ),
                        }}
                      />
                      <rect width="12" height="12" x="56" fill="#e4e4e7" />
                      <rect width="12" height="12" x="70" fill="#e4e4e7" />
                    </svg>
                  </dd>
                </div>
              </dl>
            </div>
            <div
              className="relative bg-teal-700 lg:rounded-b-xl overflow-hidden p-4"
              style={{ maxHeight: 251 }}
            >
              <div className="bg-black bg-opacity-75 absolute inset-0" />
              <div className="relative font-mono text-xs sm:text-sm text-teal-200">
                {allClasses.map((c, i) =>
                  usedClasses.includes(c) ? (
                    <Fragment key={i}>
                      <span
                        className={clsx('code-highlight whitespace-nowrap', {
                          'animate-flash-code-slow': inView,
                        })}
                        style={{
                          animationDelay: `${
                            (DURATION / usedClasses.length) * usedClasses.indexOf(c)
                          }s`,
                        }}
                      >
                        {c}
                      </span>{' '}
                    </Fragment>
                  ) : (
                    <Fragment key={i}>
                      <span
                        className={clsx('transition-colors duration-500 whitespace-nowrap', {
                          'text-teal-200': !inView,
                          'text-teal-900': inView,
                        })}
                        style={{
                          transitionDelay: `${
                            (DURATION / unusedClasses.length) * unusedClasses.indexOf(c)
                          }s`,
                        }}
                      >
                        {c}
                      </span>{' '}
                    </Fragment>
                  )
                )}
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, rgba(4, 30, 28, 1), rgba(4, 30, 28, 0))',
                }}
              />
            </div>
          </div>
        }
        right={
          <CodeWindow className="bg-cyan-500">
            <CodeWindow.Code2 lines={lines.length}>
              {lines.map((tokens, lineIndex) => (
                <Fragment key={lineIndex}>
                  {tokens.map((token, tokenIndex) => {
                    if (
                      token.types[token.types.length - 1] === 'class' &&
                      usedClasses.includes(token.content)
                    ) {
                      return (
                        <span
                          key={tokenIndex}
                          className={clsx('code-highlight', getClassNameForToken(token), {
                            'animate-flash-code-slow': inView,
                          })}
                          style={{
                            animationDelay: `${
                              (DURATION / usedClasses.length) * usedClasses.indexOf(token.content)
                            }s`,
                          }}
                        >
                          {token.content}
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
          </CodeWindow>
        }
      />
    </section>
  )
}
