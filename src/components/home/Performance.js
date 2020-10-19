import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'
import { gradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/performance.svg'
import { Fragment, useEffect, useRef } from 'react'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import tokenize from '../../macros/tokenize.macro'
import { addClassTokens } from '@/utils/addClassTokens'
import { Token } from '@/components/Code'

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

const { tokens, code } = tokenize.html(`<div class="flex pa-2 bg-white rounded-lg shadow">
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

const classes = code
  .match(/class="[^"]+"/g)
  .map((attr) => attr.substring(7, attr.length - 1).split(/\s+/))
  .flat()
  .filter((v, i, a) => a.indexOf(v) === i)

const unusedClasses = Array.from({ length: 45 }).map(() => makeClass())

const allClassesShuffled = shuffle([...classes, ...unusedClasses])

export function Performance() {
  const progress = useMotionValue(0)
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    if (!inView) return
    animate(progress, BASE_RANGE[1], {
      type: 'spring',
      damping: 50,
    })
  }, [inView])

  return (
    <section>
      <div className="px-8 mb-20">
        <IconContainer className={`${gradients.teal} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-teal-500 mb-3">
          Performance
        </Caption>
        <BigText className="mb-8">It’s tiny in production.</BigText>
        <Paragraph className="mb-6">
          Tailwind automatically removes all unused CSS when building for production, which means
          your final CSS bundle is the smallest it could possibly be. In fact, most Tailwind
          projects ship less than 10KB of CSS to the client.
        </Paragraph>
        <Link href="#" className="text-teal-500">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="teal"
        rotate={1}
        left={
          <div ref={ref} className="relative z-10 rounded-xl shadow-lg lg:-mr-8 tabular-nums">
            <div className="bg-white rounded-t-xl">
              <div className="absolute top-6 left-6 w-15 h-15 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="32" height="32" fill="none">
                  <path
                    d="M6.668 17.333l5.333 5.334L25.335 9.333"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <dl className="p-6 pb-0">
                <div className="flex-none w-full pl-15">
                  <dt className="ml-4 text-sm leading-5 font-medium">Production build</dt>
                  <dd className="ml-4 text-4xl leading-10 font-extrabold text-black">
                    <Counter from={2413.4} to={8.7} round={1} progress={progress} />
                    KB
                  </dd>
                </div>
                <div className="flex items-center border-t border-gray-100 -mx-6 mt-6 px-6 py-3 font-mono text-xs leading-5">
                  <dt className="whitespace-pre">Purged </dt>
                  <dd className="flex-auto">
                    <Counter from={0} to={20144} progress={progress} /> unused classes
                  </dd>
                  <dd className="text-rose-700 flex items-center">
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
            <div className="relative bg-teal-700 rounded-b-xl overflow-hidden p-4">
              <div className="bg-black bg-opacity-75 absolute inset-0" />
              <div
                className="relative font-mono text-sm text-teal-200"
                style={{ lineHeight: 18 / 14 }}
              >
                {allClassesShuffled.map((c, i) =>
                  classes.includes(c) ? (
                    <Fragment key={i}>
                      <motion.span
                        animate={
                          inView
                            ? {
                                backgroundColor: [
                                  null,
                                  'rgba(134, 239, 172, 0.25)',
                                  'rgba(134, 239, 172, 0)',
                                ],
                              }
                            : undefined
                        }
                        initial={{
                          backgroundColor: 'rgba(134, 239, 172, 0)',
                          borderRadius: 3,
                          padding: '1px 3px',
                          margin: '0 -3px',
                        }}
                        transition={{ delay: (5 / classes.length) * classes.indexOf(c) }}
                      >
                        {c}
                      </motion.span>{' '}
                    </Fragment>
                  ) : (
                    <Fragment key={i}>
                      <motion.span
                        animate={
                          inView
                            ? {
                                color: '#134E4A',
                              }
                            : undefined
                        }
                        initial={{ color: '#99f6e4' }}
                        transition={{
                          delay: (5 / unusedClasses.length) * unusedClasses.indexOf(c),
                        }}
                      >
                        {c}
                      </motion.span>{' '}
                    </Fragment>
                  )
                )}
              </div>
            </div>
          </div>
        }
        right={
          <CodeWindow className="bg-turquoise-500">
            <CodeWindow.Code
              tokens={tokens}
              tokenComponent={PerformanceToken}
              tokenProps={{ inView }}
              transformTokens={addClassTokens}
            />
          </CodeWindow>
        }
      />
    </section>
  )
}

function PerformanceToken({ token, parentTypes, inView, children }) {
  if (token[0] === 'class') {
    return (
      <motion.span
        animate={
          inView
            ? { backgroundColor: [null, 'rgba(134, 239, 172, 0.25)', 'rgba(134, 239, 172, 0)'] }
            : undefined
        }
        initial={{ backgroundColor: 'rgba(134, 239, 172, 0)' }}
        transition={{ delay: (5 / classes.length) * classes.indexOf(token[1]) }}
        style={{ borderRadius: 3, padding: '1px 3px', margin: '0 -3px' }}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <Token token={token} parentTypes={parentTypes}>
      {children}
    </Token>
  )
}

// https://stackoverflow.com/a/1349426
function makeClass() {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  const firstLength = randomIntFromInterval(2, 7)
  const secondLength = randomIntFromInterval(3, 8)
  for (let i = 0; i < firstLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  result += '-'
  for (let i = 0; i < secondLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// https://stackoverflow.com/a/7228322
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
