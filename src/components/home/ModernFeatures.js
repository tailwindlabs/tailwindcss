import { IconContainer, Caption, BigText, Paragraph, Link, Widont } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { gradients as allGradients } from '@/utils/gradients'
import { ReactComponent as Icon } from '@/img/icons/home/browser-support.svg'
import { Fragment, useState } from 'react'
import { AnimatePresence, motion, useInvertedScale } from 'framer-motion'
import { usePrevious } from '@/hooks/usePrevious'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import clsx from 'clsx'

const gradients = [
  allGradients.purple,
  allGradients.blue,
  allGradients.lightblue,
  allGradients.teal,
  allGradients.amber,
  allGradients.pink,
]

const codeWindowClassNames = [
  'bg-fuchsia-500',
  'bg-blue-400',
  'bg-light-blue-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-rose-500',
]

const blocksClassNames = [
  'text-purple-300',
  'text-blue-300',
  'text-light-blue-300',
  'text-emerald-300',
  'text-amber-300',
  'text-rose-300',
]

const lines = {
  grid: tokenizeWithLines.html(`<div class="grid grid-flow-col grid-rows-2 grid-cols-3 gap-4">
  <div>
    1
  </div>
  <div class="col-start-3">
    2
  </div>
  <div>
    3
  </div>
  <div>
    4
  </div>
  <div class="row-start-1 col-start-2 col-span-2">
    5
  </div>
</div>
`).lines,
  transforms: tokenizeWithLines.html(`<div class="grid grid-flow-col grid-rows-2 grid-cols-3 gap-4">
  <div class="transform scale-110 -rotate-6">
    1
  </div>
  <div class="col-start-3 [transform scale-75 rotate-6 translate-x-2 translate-y-15]">
    2
  </div>
  <div class="[transform scale-150 translate-y-11]">
    3
  </div>
  <div class="[transform translate-y-24]">
    4
  </div>
  <div class="row-start-1 col-start-2 col-span-2 [transform translate-x-20 translate-y-4]">
    5
  </div>
</div>
`).lines,
  gradients: tokenizeWithLines.html(`<div class="bg-gradient-to-br from-fuchsia-500 to-purple-600"></div>
<div class="bg-gradient-to-br from-light-blue-400 to-indigo-500"></div>
<div class="bg-gradient-to-br from-cyan-400 to-light-blue-500"></div>
<div class="bg-gradient-to-br from-green-400 to-cyan-500"></div>
<div class="bg-gradient-to-br from-yellow-400 to-orange-500"></div>
<div class="bg-gradient-to-br from-pink-500 to-rose-500"></div>
`).lines,
}

export function ModernFeatures() {
  const [feature, setFeature] = useState('grid')
  const [selectedGradient, setSelectedGradient] = useState(gradients[0])
  const prevFeature = usePrevious(feature)

  const augment = (style, x, y, rotate = false) => {
    let augmented = {}
    for (let k in style) {
      if (k === 'x') augmented[k] = [style[k] + 50 * x, style[k]]
      else if (k === 'y') augmented[k] = [style[k] + 50 * y, style[k]]
      else if (k === 'rotate' && rotate) augmented[k] = [style[k] + 10 * x, style[k]]
      else augmented[k] = [style[k], style[k]]
    }
    return augmented
  }

  const animate = (transforms, grid, x, y) => {
    if (feature === 'transforms') {
      return {
        animate: prevFeature === 'gradients' ? augment(transforms, x, y, true) : transforms,
        transition:
          prevFeature === 'gradients' ? { delay: 0.3, duration: 0.25, ease: [0, 0, 0.2, 1] } : {},
      }
    }
    if (feature === 'grid') {
      return {
        animate: prevFeature === 'gradients' ? augment(grid, x, y) : grid,
        transition:
          prevFeature === 'gradients' ? { delay: 0.3, duration: 0.25, ease: [0, 0, 0.2, 1] } : {},
      }
    }
    if (feature === 'gradients' && prevFeature === 'grid') {
      return {
        animate: { ...grid, x: grid.x + 50 * x, y: grid.y + 50 * y },
        transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
      }
    }
    if (feature === 'gradients' && prevFeature === 'transforms') {
      return {
        animate: {
          ...transforms,
          x: transforms.x + 50 * x,
          y: transforms.y + 50 * y,
          rotate: (transforms.rotate || 0) + 10 * x,
        },
        transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
      }
    }
  }

  return (
    <section id="modern-features">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${allGradients.purple[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-purple-600 mb-3">
          Modern features
        </Caption>
        <BigText className="mb-8">
          <Widont>Cutting-edge is our comfort zone.</Widont>
        </BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Tailwind is unapologetically modern, and takes advantage of all the latest and greatest
            CSS features to make the developer experience as enjoyable as possible.
          </p>
          <p>
            We've got first-class CSS grid support, composable transforms and gradients powered by
            CSS variables, support for modern state selectors like <code>:focus-visible</code>, and
            tons more.
          </p>
        </Paragraph>
        <Link href="/docs/grid-template-columns" className="text-purple-600 hover:text-purple-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="purple"
        rotate={-2}
        gradientProps={{
          initial: false,
          animate: {
            backgroundImage: `linear-gradient(to bottom right, ${selectedGradient[1]}, ${selectedGradient[2]})`,
          },
        }}
        header={
          <div className="flex overflow-auto py-0.5 -my-0.5 pl-0.5 -mx-4 sm:-mx-6 md:-mx-8 xl:-ml-4 xl:mr-0">
            <Tabs
              tabs={{ grid: 'CSS Grid', transforms: 'Transforms', gradients: 'Gradients' }}
              selected={feature}
              onChange={setFeature}
              className="mx-auto xl:mx-0 px-4 sm:px-6 md:px-8 xl:px-0"
            />
          </div>
        }
        left={
          <div
            className={clsx(
              'flex pl-4 pb-6 sm:pl-0 lg:pb-0 lg:mr-6 text-4xl font-black',
              blocksClassNames[gradients.indexOf(selectedGradient)]
            )}
          >
            <motion.div
              key="blocks"
              initial={false}
              animate={{ opacity: feature === 'grid' || feature === 'transforms' ? 1 : 0 }}
              transition={{
                duration: 0.3,
                delay: feature === 'grid' || feature === 'transforms' ? 0.3 : 0,
              }}
              className={`w-full flex-none grid grid-cols-3 grid-rows-2 gap-4 ${
                feature === 'gradients' ? 'pointer-events-none' : ''
              }`}
            >
              <motion.div
                className="relative"
                initial={false}
                {...animate(
                  { scaleX: 1.1, scaleY: 1.1, rotate: -6, x: 0, y: 0 },
                  { scaleX: 1, scaleY: 1, rotate: 0, x: 0, y: 0 },
                  -1,
                  -1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>1</Number>
              </motion.div>
              <motion.div
                className="relative col-start-3 col-end-4 row-start-2 row-end-3"
                initial={false}
                {...animate(
                  {
                    scaleX: 0.75,
                    scaleY: 0.75,
                    rotate: 6,
                    y: 60,
                    x: 8,
                  },
                  { scaleX: 1, scaleY: 1, rotate: 0, y: 0, x: 0 },
                  1,
                  1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>2</Number>
              </motion.div>
              <motion.div
                className="relative origin-right"
                initial={false}
                {...animate(
                  { scaleX: 1.5, x: 0, y: 44, rotate: 0 },
                  { scaleX: 1, x: 0, y: 0, rotate: 0 },
                  -1,
                  1
                )}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>3</Number>
              </motion.div>
              <motion.div
                className="relative"
                initial={false}
                {...animate({ x: 0, y: 96, rotate: 0 }, { x: 0, y: 0, rotate: 0 }, 0, 1)}
              >
                <div className="pt-full bg-white rounded-xl shadow-lg flex items-center justify-center" />
                <Number>4</Number>
              </motion.div>
              <motion.div
                className="relative bg-white rounded-xl shadow-lg flex items-center justify-center col-start-2 col-end-4 row-start-1 row-end-2"
                initial={false}
                {...animate(
                  { opacity: 1, x: 80, y: 16, rotate: 0 },
                  { opacity: 1, x: 0, y: 0, rotate: 0 },
                  1,
                  -1
                )}
              >
                <Number>5</Number>
              </motion.div>
            </motion.div>

            <motion.ul
              key="gradients"
              className={`self-center bg-white shadow-lg rounded-3xl w-full flex-none -ml-full p-2 grid grid-cols-6 ${
                feature === 'gradients' ? '' : 'pointer-events-none'
              }`}
              initial={false}
              animate={{ opacity: feature === 'gradients' ? 1 : 0 }}
              transition={{ duration: 0.3, delay: feature === 'gradients' ? 0.3 : 0 }}
            >
              {gradients.map((gradient, i) => (
                <motion.li
                  key={gradient}
                  initial={false}
                  animate={feature === 'gradients' ? { opacity: [0, 1] } : { opacity: 0 }}
                  transition={{ delay: feature === 'gradients' ? 0.3 + 0.06 * i : 0 }}
                >
                  <button
                    type="button"
                    className="relative flex w-full pt-full rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-white focus-visible:ring-inset focus-visible:ring-gray-400"
                    onClick={() => setSelectedGradient(gradient)}
                  >
                    <span className="sr-only"></span>
                    <div
                      className={clsx(
                        'absolute inset-0 rounded-full bg-gray-200 transition-transform duration-500 transform',
                        {
                          'scale-80': selectedGradient !== gradient,
                        }
                      )}
                    />
                    <div
                      className={`absolute z-10 inset-1 sm:inset-2 lg:inset-1 xl:inset-2 rounded-full bg-gradient-to-br ${gradient[0]}`}
                    />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        }
        right={
          <CodeWindow
            className={clsx(
              'transition-colors duration-200',
              codeWindowClassNames[gradients.indexOf(selectedGradient)]
            )}
          >
            <AnimatePresence initial={false} exitBeforeEnter>
              <motion.div
                key={feature}
                className="w-full flex-auto flex min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CodeWindow.Code2
                  lines={
                    feature === 'gradients' ? lines[feature].length + 10 : lines[feature].length
                  }
                >
                  {feature === 'gradients' ? (
                    <GradientsCode lines={lines.gradients} selectedGradient={selectedGradient} />
                  ) : (
                    lines[feature].map((tokens, lineIndex) => (
                      <Fragment key={lineIndex}>
                        {tokens.map((token, tokenIndex) => {
                          if (token.types[token.types.length - 1] === 'attr-value') {
                            return (
                              <span key={tokenIndex} className={getClassNameForToken(token)}>
                                {token.content.split(/\[([^\]]+)\]/).map((part, i) =>
                                  i % 2 === 0 ? (
                                    part
                                  ) : (
                                    <span key={i} className="code-highlight bg-code-highlight">
                                      {part}
                                    </span>
                                  )
                                )}
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
                    ))
                  )}
                </CodeWindow.Code2>
              </motion.div>
            </AnimatePresence>
          </CodeWindow>
        }
      />
    </section>
  )
}

function GradientsCode({ lines, selectedGradient }) {
  const activeIndex = Object.keys(gradients).findIndex((k) => gradients[k] === selectedGradient)

  return (
    <div className="mono mono-active flex flex-col items-start">
      {lines.map((tokens, lineIndex) => {
        const isComment = lineIndex < lines.length - 1 && lineIndex !== activeIndex

        return (
          <Fragment key={lineIndex}>
            {lineIndex !== 0 && lineIndex !== lines.length - 1 && (
              <div
                className="transition-transform duration-500"
                style={{ transform: `translateY(${lineIndex <= activeIndex ? '-100%' : '0'})` }}
              >
                <span>{'<!--'}</span>
              </div>
            )}
            <div
              className={clsx('transition-transform duration-500', { 'not-mono': !isComment })}
              style={{
                transform: `translateY(${
                  lineIndex === activeIndex && lineIndex !== 0
                    ? '100%'
                    : activeIndex > lineIndex && lineIndex !== 0
                    ? '200%'
                    : activeIndex > lineIndex
                    ? '100%'
                    : '0'
                })`,
              }}
            >
              {tokens.map((token, tokenIndex) => (
                <span key={tokenIndex} className={getClassNameForToken(token)}>
                  {token.content}
                </span>
              ))}
            </div>
            {lineIndex !== 0 && lineIndex !== lines.length - 1 && (
              <div
                className="transition-transform duration-500"
                style={{ transform: `translateY(${lineIndex <= activeIndex ? '-100%' : '0'})` }}
              >
                <span>{'-->'}</span>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

function Number({ children }) {
  const { scaleX, scaleY } = useInvertedScale()
  return (
    <motion.div
      className="absolute top-1/2 left-0 w-full -mt-5 text-center"
      style={{ scaleX, scaleY }}
    >
      {children}
    </motion.div>
  )
}
