import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { gradients } from '@/utils/gradients'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { ReactComponent as Icon } from '@/img/icons/home/mobile-first.svg'
import styles from './MobileFirst.module.css'
import { tokenizeWithLines } from '../../macros/tokenize.macro'
import { addClassTokens2 } from '@/utils/addClassTokens'
import clsx from 'clsx'
import { useMedia } from '@/hooks/useMedia'

const MIN_WIDTH = 400
const HANDLE_RADIUS = 2.125

const images = {
  '/kevin-francis.jpg': require('@/img/kevin-francis.jpg').default,
  '/beach-house.jpg': require('@/img/beach-house.jpg').default,
  '/beach-house-view.jpg': require('@/img/beach-house-view.jpg').default,
  '/beach-house-interior.jpg': require('@/img/beach-house-interior.jpg').default,
}

const { code: html, lines, classNames } = tokenizeWithLines.html(
  `<div class="{container}">
  <div class="{header}">
    <p class="{preheading}">Entire house</p>
    <h2 class="{heading}">Beach House in Collingwood</h2>
  </div>
  <div class="{metaContainer}">
    <div class="{meta}">
      <svg width="20" height="20" fill="currentColor" class="text-violet-600">
        <path d="M9.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.784-.57-.381-1.81.587-1.81H7.03a1 1 0 00.95-.69L9.05 3.69z" />
      </svg>
      <div class="ml-1">
        <span class="text-black">4.94</span>
        <span class="{ratingCount}">(128)</span>
      </div>
      <div class="text-base font-normal mx-2">·</div>
      <div>Collingwood, Ontario</div>
    </div>
    <hr class="{hr}">
  </div>
  <div class="{footerContainer}">
    <p class="flex items-center text-black text-sm font-medium">
      <img src="/kevin-francis.jpg" alt="" class="w-6 h-6 rounded-full mr-2 bg-gray-100">
      Hosted by Kevin Francis
    </p>
    <button type="button" class="bg-violet-100 text-violet-700 text-base font-semibold px-6 py-2 rounded-lg">Check availability</button>
  </div>
  <div class="{imgContainer}">
    <div class="w-full grid grid-cols-3 grid-rows-2 gap-2">
      <div class="{imgLgContainer}">
        <img src="/beach-house.jpg" alt="" class="{imgLg}" />
      </div>
      <div class="{imgSmContainer}">
        <img src="/beach-house-interior.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg bg-gray-100" />
      </div>
      <div class="{imgSmContainer}">
        <img src="/beach-house-view.jpg" alt="" class="absolute inset-0 w-full h-full object-cover rounded-lg bg-gray-100" />
      </div>
    </div>
  </div>
</div>
`,
  'original',
  (code, { classNames }) =>
    code.replace(/\{([^}]+)\}/g, (m, key) => {
      const sm = classNames.sm[key].split(' ').filter(Boolean)
      const md = classNames.md[key].split(' ').filter(Boolean)
      const lg = classNames.lg[key].split(' ').filter(Boolean)

      return [
        ...sm,
        ...md.filter((c) => !sm.includes(c)).map((c) => `sm:${c}`),
        ...lg.filter((c) => !md.includes(c)).map((c) => `md:${c}`),
      ].join(' ')
    }),
  {
    classNames: {
      sm: {
        container: 'grid grid-cols-1',
        header: 'relative z-10 col-start-1 row-start-1 px-4 pt-40 pb-3 bg-gradient-to-t from-black',
        preheading: 'text-sm font-medium text-white',
        heading: 'text-xl font-semibold text-white',
        metaContainer: 'col-start-1 row-start-2 px-4',
        meta: 'flex items-center text-sm font-medium my-5',
        ratingCount: '',
        hr: 'w-16 border-gray-300 hidden',
        footerContainer: 'col-start-1 row-start-3 space-y-3 px-4',
        imgContainer: 'col-start-1 row-start-1 flex',
        imgLgContainer: 'relative col-span-3 row-span-2',
        imgLg: 'absolute inset-0 w-full h-full object-cover bg-gray-100',
        imgSmContainer: 'relative hidden',
      },
      md: {
        container: 'grid grid-cols-2 px-8 py-12 gap-x-8',
        header: 'relative z-10 col-start-1 row-start-1 bg-none',
        preheading: 'text-sm font-medium mb-1 text-gray-500',
        heading: 'text-2xl leading-7 font-semibold text-black',
        metaContainer: 'col-start-1 row-start-2 pb-16',
        meta: 'flex items-center text-sm font-medium mt-2 mb-4',
        ratingCount: 'hidden',
        hr: 'w-16 border-gray-300 block',
        footerContainer: 'col-start-1 row-start-3 space-y-3',
        imgContainer: 'col-start-2 row-start-1 row-span-3 flex',
        imgLgContainer: 'relative col-span-3 row-span-2',
        imgLg: 'absolute inset-0 w-full h-full object-cover rounded-lg bg-gray-100',
        imgSmContainer: 'relative hidden',
      },
      lg: {
        container: 'grid grid-cols-2 px-8 py-16 gap-x-8',
        header: 'relative z-10 col-start-1 row-start-1 bg-none',
        preheading: 'text-sm font-medium mb-1 text-gray-500',
        heading: 'text-3xl font-semibold text-black',
        metaContainer: 'col-start-1 row-start-2 pb-16',
        meta: 'flex items-center text-sm font-medium mt-2 mb-4',
        ratingCount: 'inline',
        hr: 'w-16 border-gray-300 block',
        footerContainer: 'col-start-1 row-start-3 space-y-3',
        imgContainer: 'col-start-2 row-start-1 row-span-3 flex',
        imgLgContainer: 'relative col-span-2 row-span-2',
        imgLg: 'absolute inset-0 w-full h-full object-cover rounded-lg bg-gray-100',
        imgSmContainer: 'relative block',
      },
    },
  }
)

addClassTokens2(lines)

function BrowserWindow({ size, onChange, height = 385 }) {
  const x = useMotionValue(0)
  const constraintsRef = useRef()
  const [constraintsWidth, setConstraintsWidth] = useState()
  const md = useMedia('(min-width: 768px)')
  const marginRight = useTransform(x, (x) => -x)

  useIsomorphicLayoutEffect(() => {
    const update = () => {
      const width =
        constraintsRef.current.offsetWidth -
        parseInt(window.getComputedStyle(document.documentElement).fontSize, 10) *
          (HANDLE_RADIUS * 2)
      setConstraintsWidth(width)
      x.set(-width)
    }
    const observer = new window.ResizeObserver(update)
    observer.observe(constraintsRef.current)
    update()
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!constraintsWidth) return

    function updateSize(x) {
      if (!md) {
        onChange('sm')
      } else if (constraintsWidth >= 500) {
        if (x < -((constraintsWidth / 3) * 2)) {
          size !== 'sm' && onChange('sm')
        } else if (x < -(constraintsWidth / 3)) {
          size !== 'md' && onChange('md')
        } else if (x >= -(constraintsWidth / 3)) {
          size !== 'lg' && onChange('lg')
        }
      } else {
        if (x < -(constraintsWidth / 2)) {
          size !== 'sm' && onChange('sm')
        } else {
          size !== 'md' && onChange('md')
        }
      }
    }

    updateSize(x.get())

    return x.onChange(updateSize)
  }, [x, size, constraintsWidth, md])

  return (
    <div className="relative">
      <motion.div
        className="shadow-lg rounded-xl"
        style={{ marginRight: md ? marginRight : 'auto' }}
      >
        <div className="rounded-xl ring-1 ring-black ring-opacity-5">
          <div
            className="py-2 grid items-center gap-6 px-4 rounded-tr-xl sm:rounded-t-xl bg-gradient-to-b from-gray-50 to-gray-100"
            style={{ gridTemplateColumns: '1fr minmax(min-content, 640px) 1fr' }}
          >
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-gray-300" />
            </div>
            <div className="border border-black border-opacity-5 rounded-md overflow-hidden shadow-sm">
              <div className="bg-gradient-to-b from-white to-gray-50 text-sm py-1.5 text-center">
                workcation.com
              </div>
            </div>
          </div>
          <div className="relative bg-white border-t border-gray-200 rounded-b-xl pb-8 -mb-8">
            <div
              className="overflow-auto"
              style={{ height }}
              dangerouslySetInnerHTML={{
                __html: html
                  .replace(/\{([^}]+)\}/g, (_, name) => classNames[size][name] || '')
                  .replace(/src="([^"]+)"/g, (_, src) => `src="${images[src]}" loading="lazy"`)
                  .replace(/<button type="button"/g, '<div class="cursor-pointer inline-flex"><div')
                  .replace(/<\/button>/g, '</div></div>'),
              }}
            ></div>
          </div>
        </div>
      </motion.div>
      <div
        ref={constraintsRef}
        className="absolute bottom-0 pointer-events-none"
        style={{
          top: `${50 / 16}rem`,
          right: `-${HANDLE_RADIUS}rem`,
          width: `calc(100% - ${MIN_WIDTH}px + ${HANDLE_RADIUS}rem + ${HANDLE_RADIUS}rem - 2px)`,
        }}
      >
        <motion.div
          drag="x"
          _dragX={x}
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={constraintsRef}
          className="absolute z-10 top-1/2 right-0 bg-indigo-900 rounded-full border-4 border-white shadow-lg hidden md:flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-500 focus-visible:ring-white"
          style={{
            x,
            width: `${HANDLE_RADIUS * 2}rem`,
            height: `${HANDLE_RADIUS * 2}rem`,
            marginTop: `-${HANDLE_RADIUS}rem`,
          }}
          onDragStart={() => document.body.classList.add('cursor-grabbing')}
          onDragEnd={() => document.body.classList.remove('cursor-grabbing')}
        >
          <svg width="40" height="40" fill="none">
            <path
              d="M26.665 13.333L33.332 20l-6.667 6.667m-13.333 0L6.665 20l6.667-6.667"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export function MobileFirst() {
  const [size, setSize] = useState('lg')

  return (
    <section id="mobile-first">
      <div className="px-4 sm:px-6 md:px-8 mb-10 sm:mb-16 md:mb-20">
        <IconContainer className={`${gradients.violet[0]} mb-8`}>
          <Icon />
        </IconContainer>
        <Caption as="h2" className="text-violet-600 mb-3">
          Mobile-first
        </Caption>
        <BigText className="mb-8">Responsive everything.</BigText>
        <Paragraph as="div" className="mb-6">
          <p>
            Wrestling with a bunch of complex media queries in your CSS sucks, so Tailwind lets you
            build responsive designs right in your HTML instead.
          </p>
          <p>
            Throw a screen size in front of literally any utility class and watch it magically apply
            at a specific breakpoint.
          </p>
        </Paragraph>
        <Link href="/docs/responsive-design" className="text-violet-600 hover:text-violet-800">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="violet"
        rotate={2}
        left={
          <>
            <div className="pr-8 sm:px-6 md:px-2 lg:px-0 max-w-screen-sm lg:max-w-3xl xl:max-w-5xl mx-auto">
              <BrowserWindow size={size} onChange={setSize} />
            </div>
            <CodeWindow className={`bg-indigo-500 ${styles.code}`}>
              <CodeWindow.Code2 lines={lines.length}>
                {lines.map((tokens, lineIndex) => (
                  <div key={lineIndex}>
                    {tokens.map((token, tokenIndex) => {
                      if (
                        token.types[token.types.length - 1] === 'class' &&
                        (token.content.startsWith('sm:') || token.content.startsWith('md:'))
                      ) {
                        const faded =
                          size === 'sm' || (size !== 'lg' && token.content.startsWith('md:'))
                        const highlighted =
                          (size === 'md' && token.content.startsWith('sm:')) ||
                          (size === 'lg' && token.content.startsWith('md:'))

                        return (
                          <span
                            key={tokenIndex}
                            className={clsx(
                              'code-highlight transition duration-500',
                              getClassNameForToken(token),
                              { 'opacity-50': faded, 'bg-code-highlight': highlighted }
                            )}
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
                  </div>
                ))}
              </CodeWindow.Code2>
            </CodeWindow>
          </>
        }
      />
    </section>
  )
}
