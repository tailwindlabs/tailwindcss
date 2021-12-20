import {
  IconContainer,
  Caption,
  BigText,
  Paragraph,
  Link,
  Widont,
  InlineCode,
} from '@/components/home/common'
import { Tabs } from '@/components/Tabs'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { lines as gridSample } from '../../samples/grid.html?highlight'
import { lines as transformsSample } from '../../samples/transforms.html?highlight'
import { lines as filtersSample } from '../../samples/filters.html?highlight'

const lines = {
  'CSS Grid': gridSample,
  Transforms: transformsSample,
  Filters: filtersSample,
}

const tabs = {
  'CSS Grid': (selected) => (
    <>
      <path
        d="M5 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6ZM5 29a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6ZM19 29a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-6ZM33 29a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-6ZM19 13a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H22a3 3 0 0 1-3-3v-6Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  Transforms: (selected) => (
    <>
      <path
        d="M5.632 11.725a3 3 0 0 1 2.554-3.388l3.96-.557a3 3 0 0 1 3.389 2.554l.835 5.941a3 3 0 0 1-2.553 3.388l-3.961.557a3 3 0 0 1-3.389-2.553l-.835-5.942ZM1 29a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-6ZM20 34a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-6ZM36.728 27.026a3 3 0 0 1 3.558-2.31l3.913.831a3 3 0 0 1 2.31 3.558l-1.247 5.87a3 3 0 0 1-3.558 2.31l-3.913-.832a3 3 0 0 1-2.31-3.558l1.247-5.869ZM22.236 9.17a3 3 0 0 1 3.202-2.783l17.956 1.255a3 3 0 0 1 2.784 3.202l-.419 5.986a3 3 0 0 1-3.202 2.783l-17.956-1.255a3 3 0 0 1-2.784-3.202l.419-5.986Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
    </>
  ),
  Filters: (selected) => (
    <>
      <path
        d="M31 30c0-7.18-5.82-13-13-13m-5.009 1C8.298 19.961 5 24.596 5 30c0 7.18 5.82 13 13 13 5.404 0 10.039-3.298 12-7.991"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="30"
        cy="18"
        r="13"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m26 30 4-4M21 27l6-6M18 22l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
}

function Block({ src, filter, ...props }) {
  return (
    <motion.div initial={false} {...props}>
      <div
        className={clsx(
          'relative pt-full bg-white rounded-lg shadow-lg overflow-hidden transition-[filter] duration-500',
          filter
        )}
      >
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </motion.div>
  )
}

export function ModernFeatures() {
  const [feature, setFeature] = useState('CSS Grid')

  const animate = (transforms, grid) => {
    if (feature === 'Transforms') {
      return {
        animate: transforms,
      }
    }
    return {
      animate: grid,
    }
  }

  return (
    <section id="modern-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer
          className="dark:bg-indigo-500 dark:highlight-white/20"
          light={require('@/img/icons/home/modern-features.png').default}
          dark={require('@/img/icons/home/dark/modern-features.png').default}
        />
        <Caption className="text-indigo-500 dark:text-indigo-400">Modern features</Caption>
        <BigText>
          <Widont>Cutting-edge is our comfort zone.</Widont>
        </BigText>
        <Paragraph as="div">
          <p>
            Tailwind is unapologetically modern, and takes advantage of all the latest and greatest
            CSS features to make the developer experience as enjoyable as possible.
          </p>
          <p>
            We've got first-class CSS grid support, composable transforms and gradients powered by
            CSS variables, support for modern state selectors like{' '}
            <InlineCode>:focus-visible</InlineCode>, and tons more.
          </p>
        </Paragraph>
        <Link href="/docs/grid-template-columns" color="indigo" darkColor="gray">
          Learn more<span className="sr-only">, grid template columns</span>
        </Link>
        <div className="mt-10">
          <Tabs
            tabs={tabs}
            selected={feature}
            onChange={setFeature}
            className="text-indigo-600 dark:text-indigo-400"
            iconClassName="text-indigo-500 dark:text-indigo-400"
          />
        </div>
      </div>
      <GridLockup
        className="mt-10 xl:mt-2"
        beams={0}
        left={
          <div className="flex text-4xl font-black lg:mt-10 xl:mt-18">
            <div className="w-full flex-none grid grid-cols-3 grid-rows-2 gap-8">
              <Block
                src={require('@/img/modern-features/1.jpg').default}
                filter={feature === 'Filters' && 'blur'}
                {...animate(
                  { scaleX: 1.1, scaleY: 1.1, rotate: -6, x: 0, y: 0 },
                  { scaleX: 1, scaleY: 1, rotate: 0, x: 0, y: 0 }
                )}
              />
              <Block
                className="col-start-3 col-end-4 row-start-2 row-end-3"
                src={require('@/img/modern-features/2.jpg').default}
                filter={feature === 'Filters' && 'sepia'}
                {...animate(
                  {
                    scaleX: 0.75,
                    scaleY: 0.75,
                    rotate: 6,
                    y: 60,
                    x: 8,
                  },
                  { scaleX: 1, scaleY: 1, rotate: 0, y: 0, x: 0 }
                )}
              />
              <Block
                className="origin-right"
                src={require('@/img/modern-features/3.jpg').default}
                filter={feature === 'Filters' && 'saturate-200'}
                {...animate(
                  { scaleX: 1.5, x: 0, y: 44, rotate: 0 },
                  { scaleX: 1, x: 0, y: 0, rotate: 0 }
                )}
              />
              <Block
                src={require('@/img/modern-features/4.jpg').default}
                filter={feature === 'Filters' && 'grayscale'}
                {...animate({ x: 0, y: 96, rotate: 0 }, { x: 0, y: 0, rotate: 0 })}
              />
              <motion.div
                className={clsx(
                  'relative bg-white rounded-lg shadow-lg overflow-hidden col-start-2 col-end-4 row-start-1 row-end-2 transition-[filter] duration-500',
                  feature === 'Filters' && 'invert'
                )}
                initial={false}
                {...animate(
                  { opacity: 1, x: 80, y: 16, rotate: 0 },
                  { opacity: 1, x: 0, y: 0, rotate: 0 }
                )}
              >
                <img
                  src={require('@/img/modern-features/5.jpg').default}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        }
        right={
          <CodeWindow>
            <AnimatePresence initial={false} exitBeforeEnter>
              <motion.div
                key={feature}
                className="w-full flex-auto flex min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CodeWindow.Code2 lines={lines[feature].length}>
                  {lines[feature].map((tokens, lineIndex) => (
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
                  ))}
                </CodeWindow.Code2>
              </motion.div>
            </AnimatePresence>
          </CodeWindow>
        }
      />
    </section>
  )
}
