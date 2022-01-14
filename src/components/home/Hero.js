import { CodeWindow } from '@/components/CodeWindow'
import { Token } from '@/components/Code'
import { AnimateSharedLayout, motion, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { fit } from '@/utils/fit'
import { debounce } from 'debounce'
import { useMedia } from '@/hooks/useMedia'
import { wait } from '@/utils/wait'
import { createInViewPromise } from '@/utils/createInViewPromise'
import { tokens, code } from '../../samples/hero.html?highlight'
import colors from 'tailwindcss/colors'

const CHAR_DELAY = 75
const GROUP_DELAY = 1000
const TRANSITION = { duration: 0.5 }

function getRange(text, options = {}) {
  return { start: code.indexOf(text), end: code.indexOf(text) + text.length, ...options }
}

const ranges = [
  getRange(' p-8'),
  getRange(' rounded-full'),
  getRange(' mx-auto'),
  getRange(' font-medium'),
  getRange(' class="font-medium"'),
  getRange(' class="text-sky-500 dark:text-sky-400"'),
  getRange(' class="text-slate-700 dark:text-slate-500"'),
  getRange(' text-center'),
  getRange('md:flex '),
  getRange(' md:p-0'),
  getRange(' md:p-8', { immediate: true }),
  getRange(' md:rounded-none'),
  getRange(' md:w-48'),
  getRange(' md:h-auto'),
  getRange(' md:text-left'),
]

function getRangeIndex(index, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const rangeArr = Array.isArray(ranges[i]) ? ranges[i] : [ranges[i]]
    for (let j = 0; j < rangeArr.length; j++) {
      if (index >= rangeArr[j].start && index < rangeArr[j].end) {
        return [i, index - rangeArr[j].start, index === rangeArr[j].end - 1]
      }
    }
  }
  return [-1]
}

function Words({ children, bolder = false, layout, transition }) {
  return children.split(' ').map((word, i) => (
    <motion.span
      key={i}
      layout={layout}
      className="relative inline-flex whitespace-pre text-lg"
      transition={transition}
    >
      {bolder ? (
        <>
          <motion.span
            className="absolute top-0 left-0"
            initial={{ fontWeight: 400 }}
            animate={{ fontWeight: 500 }}
            transition={transition}
          >
            {word}{' '}
          </motion.span>
          <span style={{ opacity: 0, fontWeight: 500 }}>{word} </span>
        </>
      ) : (
        word + ' '
      )}
    </motion.span>
  ))
}

function augment(tokens, index = 0) {
  for (let i = 0; i < tokens.length; i++) {
    if (Array.isArray(tokens[i])) {
      const _type = tokens[i][0]
      const children = tokens[i][1]
      if (Array.isArray(children)) {
        index = augment(children, index)
      } else {
        const str = children
        const result = []
        for (let j = 0; j < str.length; j++) {
          const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
          if (rangeIndex > -1) {
            result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
          } else {
            if (typeof result[result.length - 1] === 'string') {
              result[result.length - 1] += str[j]
            } else {
              result.push(str[j])
            }
          }
          index++
        }
        if (!(result.length === 1 && typeof result[0] === 'string')) {
          tokens[i].splice(1, 1, result)
        }
      }
    } else {
      const str = tokens[i]
      const result = []
      for (let j = 0; j < str.length; j++) {
        const [rangeIndex, indexInRange, isLast] = getRangeIndex(index, ranges)
        if (rangeIndex > -1) {
          result.push([`char:${rangeIndex}:${indexInRange}${isLast ? ':last' : ''}`, str[j]])
        } else {
          if (typeof result[result.length - 1] === 'string') {
            result[result.length - 1] += str[j]
          } else {
            result.push(str[j])
          }
        }
        index++
      }
      tokens.splice(i, 1, ...result)
      i += result.length - 1
    }
  }
  return index
}

augment(tokens)

export function Hero() {
  const containerRef = useRef()
  const [step, setStep] = useState(-1)
  const [state, setState] = useState({ group: -1, char: -1 })
  const cursorControls = useAnimation()
  const [wide, setWide] = useState(false)
  const [finished, setFinished] = useState(false)
  const supportsMd = useMedia('(min-width: 640px)')
  const [isMd, setIsMd] = useState(false)
  const [containerRect, setContainerRect] = useState()
  const md = supportsMd && isMd
  const mounted = useRef(true)
  const inViewRef = useRef()
  const imageRef = useRef()

  const layout = !finished

  useEffect(() => {
    return () => (mounted.current = false)
  }, [])

  useEffect(() => {
    let current = true

    const { promise: inViewPromise, disconnect } = createInViewPromise(inViewRef.current, {
      threshold: 0.5,
    })

    const promises = [
      wait(1000),
      inViewPromise,
      new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(resolve)
        } else {
          window.setTimeout(resolve, 0)
        }
      }),
      new Promise((resolve) => {
        if (imageRef.current.complete) {
          resolve()
        } else {
          imageRef.current.addEventListener('load', resolve)
        }
      }),
    ]

    Promise.all(promises).then(() => {
      if (current) {
        setState({ group: 0, char: 0 })
      }
    })

    return () => {
      current = false
      disconnect()
    }
  }, [])

  useEffect(() => {
    if (step === 14) {
      let id = window.setTimeout(() => {
        setFinished(true)
      }, 1000)
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [step])

  useEffect(() => {
    if (!finished) return
    let count = 0
    cursorControls.start({ opacity: 0.5 })
    const id = window.setInterval(() => {
      if (count === 2) {
        return window.clearInterval(id)
      }
      count++
      cursorControls.start({ opacity: 1, scale: 0.9, transition: { duration: 0.25 } }).then(() => {
        setWide((wide) => !wide)
        cursorControls.start({
          opacity: count === 2 ? 0 : 0.5,
          scale: 1,
          transition: { duration: 0.25, delay: 0.6 },
        })
      })
    }, 2000)
    return () => {
      window.clearInterval(id)
    }
  }, [finished])

  useEffect(() => {
    if (finished) {
      const id = window.setTimeout(() => {
        setIsMd(wide)
      }, 250)
      return () => window.clearTimeout(id)
    }
  }, [wide, finished])

  useEffect(() => {
    const observer = new window.ResizeObserver(
      debounce(() => {
        if (containerRef.current) {
          setContainerRect(containerRef.current.getBoundingClientRect())
        }
      }, 500)
    )
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Layout
      left={
        <div ref={containerRef} className="lg:-mr-18">
          <AnimateSharedLayout>
            <motion.div
              layout={layout}
              className="relative z-10 rounded-lg shadow-xl text-slate-900 mx-auto sm:w-[23.4375rem] dark:text-slate-300"
              initial={false}
              animate={
                containerRect?.width
                  ? {
                      width: !supportsMd || wide ? containerRect.width : 375,
                    }
                  : {}
              }
              transition={TRANSITION}
            >
              <motion.div
                layout={layout}
                transition={TRANSITION}
                className={clsx(
                  'bg-white rounded-lg overflow-hidden ring-1 ring-slate-900/5 dark:bg-slate-800 dark:highlight-white/5 dark:ring-0',
                  {
                    flex: step >= 8 && md,
                    'p-8': step >= 0,
                    'text-center': (step >= 7 && !md) || (step < 14 && md),
                  }
                )}
              >
                <motion.div
                  layout={layout}
                  className={clsx(
                    'absolute z-20 top-1/2 right-0 xl:right-auto xl:left-0 text-black rounded-full -mt-4 -mr-4 xl:mr-0 xl:-ml-4 pointer-events-none',
                    { invisible: !supportsMd }
                  )}
                  initial={{ opacity: 0 }}
                  animate={cursorControls}
                  transition={{ default: TRANSITION, opacity: { duration: 0.25 } }}
                >
                  <svg className="h-8 w-8" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth="8"
                      fill="rgba(0, 0, 0, 0.5)"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  layout={layout}
                  initial={false}
                  animate={{
                    ...((step >= 1 && step < 11) || (step >= 11 && !md && !finished)
                      ? { borderRadius: 96 / 2 }
                      : { borderRadius: 0 }),
                  }}
                  transition={TRANSITION}
                  className={clsx(
                    'relative z-10 overflow-hidden flex-none',
                    step >= 10 && md ? '-m-8 mr-8' : step >= 2 ? 'mx-auto' : undefined,
                    step >= 12 && md ? 'w-48' : 'w-24',
                    step >= 13 && md ? 'h-auto' : 'h-24'
                  )}
                >
                  <motion.img
                    ref={imageRef}
                    layout={layout}
                    transition={TRANSITION}
                    src={require('@/img/sarah-dayan.jpg').default}
                    alt=""
                    className={clsx('absolute max-w-none object-cover bg-slate-100', {
                      'rounded-full': finished && !md,
                    })}
                    style={
                      finished
                        ? { top: 0, left: 0, width: '100%', height: '100%' }
                        : step >= 13 && md
                        ? fit(192, containerRect.height, 384, 512)
                        : step >= 12 && md
                        ? fit(192, 96, 384, 512)
                        : fit(96, 96, 384, 512)
                    }
                  />
                </motion.div>
                <motion.div
                  layout={layout}
                  className={step >= 10 && md ? '' : 'pt-6'}
                  transition={TRANSITION}
                >
                  <motion.div layout={layout} className="mb-4" transition={TRANSITION}>
                    <Words bolder={step >= 3} layout={layout} transition={TRANSITION}>
                      “Tailwind CSS is the only framework that I've seen scale on large teams. It’s
                      easy to customize, adapts to any design, and the build size is tiny.”
                    </Words>
                  </motion.div>
                  <motion.div
                    className={`flex flex-col ${
                      (step >= 7 && !md) || (step < 14 && md) ? 'items-center' : 'items-start'
                    }`}
                    style={{
                      ...(step >= 4 ? { fontWeight: 500 } : { fontWeight: 400 }),
                    }}
                    transition={TRANSITION}
                  >
                    <motion.p
                      layout={layout}
                      initial={false}
                      transition={TRANSITION}
                      className={clsx(
                        'transition-colors duration-500',
                        step >= 5
                          ? 'text-sky-500 dark:text-sky-400'
                          : 'text-black dark:text-slate-300'
                      )}
                    >
                      Sarah Dayan
                    </motion.p>
                    <motion.p
                      layout={layout}
                      initial={false}
                      transition={TRANSITION}
                      className={clsx(
                        'transition-colors duration-500',
                        step >= 6
                          ? 'text-slate-700 dark:text-slate-500'
                          : 'text-black dark:text-slate-300'
                      )}
                    >
                      Staff Engineer, Algolia
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimateSharedLayout>
        </div>
      }
      right={
        <CodeWindow className="!h-auto max-h-[none]">
          <CodeWindow.Code
            ref={inViewRef}
            tokens={tokens}
            tokenComponent={HeroToken}
            tokenProps={{
              currentGroup: state.group,
              currentChar: state.char,
              onCharComplete(charIndex) {
                if (!mounted.current) return
                setState((state) => ({ ...state, char: charIndex + 1 }))
              },
              async onGroupComplete(groupIndex) {
                if (!mounted.current) return
                setStep(groupIndex)

                if (groupIndex === 7) {
                  if (!supportsMd) return
                  await cursorControls.start({ opacity: 0.5, transition: { delay: 1 } })
                  if (!mounted.current) return
                  setWide(true)
                  setIsMd(true)
                  await cursorControls.start({ opacity: 0, transition: { delay: 0.5 } })
                }

                if (!mounted.current) return

                if (ranges[groupIndex + 1] && ranges[groupIndex + 1].immediate) {
                  setState({ char: 0, group: groupIndex + 1 })
                } else {
                  window.setTimeout(() => {
                    if (!mounted.current) return
                    setState({ char: 0, group: groupIndex + 1 })
                  }, GROUP_DELAY)
                }
              },
            }}
          />
        </CodeWindow>
      }
    />
  )
}

function AnimatedToken({ isActiveToken, onComplete, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      onComplete()
    }
  }, [visible])

  useEffect(() => {
    if (isActiveToken) {
      let id = window.setTimeout(() => {
        setVisible(true)
      }, CHAR_DELAY)
      return () => {
        window.clearTimeout(id)
      }
    }
  }, [isActiveToken])

  return (
    <>
      <span className={visible ? undefined : 'hidden'}>{children}</span>
      {isActiveToken && <span className="border -mx-px" style={{ height: '1.125rem' }} />}
    </>
  )
}

function HeroToken({ currentChar, onCharComplete, currentGroup, onGroupComplete, ...props }) {
  const { token } = props

  if (token[0].startsWith('char:')) {
    const [, groupIndex, indexInGroup] = token[0].split(':').map((x) => parseInt(x, 10))

    return (
      <AnimatedToken
        isActiveToken={currentGroup === groupIndex && currentChar === indexInGroup}
        onComplete={() => {
          if (token[0].endsWith(':last')) {
            onGroupComplete(groupIndex)
          } else {
            onCharComplete(indexInGroup)
          }
        }}
        {...props}
      />
    )
  }

  return <Token {...props} />
}

function Layout({ left, right, pin = 'left' }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 sm:mt-24 lg:mt-32 lg:grid lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="relative row-start-1 col-start-6 xl:col-start-7 col-span-7 xl:col-span-6">
        <div className="-mx-4 sm:mx-0">{right}</div>
      </div>
      <div className="relative row-start-1 col-start-1 col-span-5 xl:col-span-6 -mt-10">
        <div className="h-[24.25rem] max-w-xl mx-auto lg:max-w-none flex items-center justify-center">
          <div className="w-full flex-none">{left}</div>
        </div>
      </div>
    </div>
  )
}
