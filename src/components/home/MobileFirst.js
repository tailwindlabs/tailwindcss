import { IconContainer, Caption, BigText, Paragraph, Link } from '@/components/home/common'
import { CodeWindow, getClassNameForToken } from '@/components/CodeWindow'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { addClassTokens2 } from '@/utils/addClassTokens'
import clsx from 'clsx'
import { GridLockup } from '../GridLockup'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { lines } from '../../pages/examples/mobile-first-demo'

addClassTokens2(lines)

const MIN_WIDTH = 400

function BrowserWindow({ size, onChange }) {
  let x = useMotionValue(0)
  let constraintsRef = useRef()
  let handleRef = useRef()
  let iframeRef = useRef()
  let iframePointerEvents = useMotionValue('auto')

  useEffect(() => {
    function onMessage(e) {
      if (e.source === iframeRef.current.contentWindow) {
        onChange(e.data)
      }
    }

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    let observer = new window.ResizeObserver(() => {
      let width = constraintsRef.current.offsetWidth - handleRef.current.offsetWidth
      if (x.get() > width) {
        x.set(width)
      }
    })
    observer.observe(constraintsRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    handleRef.current.onselectstart = () => false
  }, [])

  return (
    <div className="relative">
      <motion.div
        className="shadow-xl sm:rounded-xl min-w-full max-w-full demo-sm:min-w-0 demo-sm:max-w-none"
        style={{ width: useTransform(x, (x) => x + MIN_WIDTH) }}
      >
        <div className="sm:rounded-xl ring-1 ring-slate-900/5">
          <div className="sm:rounded-t-xl bg-gradient-to-b from-white to-[#FBFBFB] dark:bg-none dark:bg-slate-700 dark:highlight-white/10">
            <div
              className={clsx(
                'py-2.5 grid items-center px-4',
                size === undefined ? 'gap-6' : 'gap-8'
              )}
              style={{
                gridTemplateColumns:
                  size === undefined ? '2.625rem 1fr 2.625rem' : '7.125rem 1fr 7.125rem',
              }}
            >
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]" />
                <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]" />
                <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]" />
                {size !== undefined && (
                  <>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      className="ml-4 flex-none text-slate-400 dark:text-slate-500"
                    >
                      <path
                        d="m15 7-5 5 5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      className="ml-2 flex-none text-slate-400 dark:text-slate-500"
                    >
                      <path
                        d="m10 7 5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </div>
              <div>
                <div className="bg-slate-100 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-slate-900/5 mx-auto w-4/5 dark:bg-slate-800 dark:text-slate-500">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-slate-300 w-3.5 h-3.5 mr-1.5 dark:text-slate-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  workcation.com
                </div>
              </div>
              {size !== undefined && (
                <div className="flex justify-end">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    className="text-slate-400 dark:text-slate-500"
                  >
                    <path
                      d="M12.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM12.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM12.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 text-xs leading-5 overflow-hidden">
              <div className="pointer-events-none select-none bg-slate-100 text-slate-400 rounded-tr border border-slate-900/5 px-4 py-1.5 -mb-px -ml-px flex items-center justify-center space-x-2 dark:bg-slate-800 dark:text-slate-500">
                <svg
                  width="17"
                  height="10"
                  fill="currentColor"
                  className="flex-none text-slate-300 dark:text-slate-500"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 0C6.233 0 4.817 1.111 4.25 3.334c.85-1.112 1.842-1.528 2.975-1.25.647.158 1.109.618 1.62 1.127C9.68 4.041 10.643 5 12.75 5c2.267 0 3.683-1.111 4.25-3.333-.85 1.111-1.841 1.528-2.975 1.25-.647-.159-1.109-.619-1.62-1.128C11.57.96 10.607 0 8.5 0ZM4.25 5C1.983 5 .567 6.111 0 8.334c.85-1.112 1.842-1.528 2.975-1.25.647.158 1.109.618 1.62 1.127C5.43 9.041 6.393 10 8.5 10c2.267 0 3.684-1.11 4.25-3.333-.85 1.111-1.842 1.528-2.975 1.25-.647-.159-1.109-.619-1.62-1.128C7.32 5.96 6.357 5 4.25 5Z"
                  />
                </svg>
                <div className="truncate">Tailwind UI - Official Tailwind CSS Components</div>
              </div>
              <div className="pointer-events-none select-none text-slate-900 font-medium px-4 py-1.5 flex items-center justify-center space-x-2 dark:text-slate-200">
                <svg
                  width="15"
                  height="14"
                  fill="currentColor"
                  className="flex-none text-indigo-600 dark:text-slate-400"
                >
                  <path d="M6.541 11.753a1.803 1.803 0 0 1-.485 1.277c-.241.253-.552.426-.89.497-.34.07-.691.034-1.01-.103a1.736 1.736 0 0 1-.776-.67 1.79 1.79 0 0 1-.272-1c.004-.306.086-.604.239-.866.152-.262.37-.48.63-.628-.01.047.039-.024 0 0l.797-.723a3.759 3.759 0 0 0 .988-2.535c0-1.28-.734-2.581-1.788-3.262.04.024-.015-.041 0 0a1.72 1.72 0 0 1-.63-.628 1.766 1.766 0 0 1-.238-.865A1.802 1.802 0 0 1 3.592.97c.24-.253.55-.426.89-.496.338-.07.69-.035 1.008.102.319.139.59.372.776.67.187.298.282.647.272 1a3.77 3.77 0 0 0 1.006 2.552l.35.35c.14.125.287.241.44.35.265.143.489.36.644.625a1.73 1.73 0 0 1-.645 2.381c.015-.03-.027.016 0 0a3.89 3.89 0 0 0-1.296 1.393 4.007 4.007 0 0 0-.496 1.856Zm1.921-9.512c0 .348.101.69.29.979.188.29.457.515.77.648a1.678 1.678 0 0 0 1.872-.382 1.803 1.803 0 0 0 .372-1.919 1.752 1.752 0 0 0-.632-.79 1.685 1.685 0 0 0-2.168.22c-.322.33-.503.778-.504 1.244Zm1.718 7.751c-.34 0-.672.104-.954.297a1.752 1.752 0 0 0-.633.79A1.802 1.802 0 0 0 8.966 13a1.679 1.679 0 0 0 1.871.382c.314-.134.582-.36.77-.65a1.796 1.796 0 0 0-.214-2.223 1.684 1.684 0 0 0-1.214-.516Zm4.393-2.995c0-.348-.1-.688-.29-.978a1.727 1.727 0 0 0-.77-.649 1.677 1.677 0 0 0-.993-.1 1.7 1.7 0 0 0-.878.482 1.803 1.803 0 0 0-.373 1.92c.13.32.35.596.633.79a1.684 1.684 0 0 0 2.167-.22c.323-.331.504-.779.504-1.245Z" />
                  <path d="M2.147 5.237c-.34 0-.672.103-.954.296a1.753 1.753 0 0 0-.633.79 1.803 1.803 0 0 0 .373 1.92c.24.245.545.413.878.48.333.069.679.034.993-.099.314-.133.582-.359.77-.648a1.795 1.795 0 0 0-.214-2.223 1.714 1.714 0 0 0-1.213-.516Z" />
                </svg>
                <div className="truncate">Workcation - Find a trip that suits you</div>
              </div>
              <div className="pointer-events-none select-none bg-slate-100 text-slate-400 rounded-tl border border-slate-900/5 pl-4 pr-8 py-1.5 -mb-px -mr-4 flex items-center justify-center space-x-2 dark:bg-slate-800 dark:text-slate-500">
                <svg
                  width="15"
                  height="16"
                  fill="currentColor"
                  className="flex-none text-slate-300 dark:text-slate-500"
                >
                  <path d="m2.973 9.822 9.154-3.056c-.183-1.144-.314-1.908-.465-2.491-.162-.627-.291-.795-.342-.853a1.785 1.785 0 0 0-.643-.467c-.071-.03-.27-.102-.917-.063-.684.042-1.581.181-3.003.406-1.42.225-2.318.37-2.98.542-.627.162-.796.292-.854.342a1.792 1.792 0 0 0-.466.643c-.03.071-.102.271-.063.918.041.683.181 1.581.406 3.002.063.399.12.755.173 1.077Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M.447 9.117C.012 6.367-.206 4.993.265 3.89a4.166 4.166 0 0 1 1.09-1.5C2.26 1.6 3.633 1.382 6.382.946c2.75-.436 4.125-.653 5.229-.182a4.164 4.164 0 0 1 1.5 1.09c.79.904 1.007 2.278 1.442 5.028.436 2.75.653 4.124.182 5.227a4.164 4.164 0 0 1-1.09 1.5c-.903.79-2.278 1.008-5.028 1.443-2.749.436-4.124.653-5.227.182a4.166 4.166 0 0 1-1.5-1.09C1.1 13.241.883 11.867.447 9.117Zm4.85 4.882c.735-.044 1.684-.193 3.087-.415 1.404-.222 2.351-.374 3.066-.56.691-.179 1.01-.354 1.216-.534a2.68 2.68 0 0 0 .7-.964c.108-.252.176-.609.133-1.322-.045-.736-.193-1.685-.416-3.088-.222-1.404-.373-2.352-.559-3.066-.18-.692-.354-1.01-.534-1.216a2.678 2.678 0 0 0-.964-.7c-.252-.108-.609-.176-1.323-.133-.736.044-1.684.193-3.088.415-1.403.223-2.35.374-3.065.56-.692.179-1.01.354-1.216.534a2.678 2.678 0 0 0-.7.964c-.108.251-.176.609-.133 1.322.045.737.193 1.685.415 3.088.223 1.404.374 2.352.56 3.066.179.692.354 1.01.534 1.216.265.303.594.543.964.7.252.109.608.176 1.323.133Z"
                  />
                </svg>
                <div className="truncate">
                  Headless UI – Unstyled, fully accessible UI components
                </div>
              </div>
            </div>
          </div>
          <div className="relative bg-white border-t border-slate-200 rounded-b-xl pb-8 -mb-8 dark:bg-slate-800 dark:border-slate-900/50">
            <motion.iframe
              ref={iframeRef}
              src="/examples/mobile-first-demo"
              title="Mobile-first Demo"
              className="w-full h-[30.625rem]"
              style={{ pointerEvents: iframePointerEvents }}
            />
          </div>
        </div>
      </motion.div>
      <div
        ref={constraintsRef}
        className="absolute inset-y-0 pointer-events-none"
        style={{
          right: `-${22 / 16}rem`,
          width: `calc(100% - ${MIN_WIDTH}px + ${22 / 16}rem)`,
        }}
      >
        <motion.div
          ref={handleRef}
          drag="x"
          _dragX={x}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={constraintsRef}
          className="absolute z-10 top-1/2 left-0 p-2 -mt-6 hidden demo-sm:flex items-center justify-center pointer-events-auto cursor-ew-resize"
          style={{ x }}
          onDragStart={() => {
            document.documentElement.classList.add('dragging-ew')
            iframePointerEvents.set('none')
          }}
          onDragEnd={() => {
            document.documentElement.classList.remove('dragging-ew')
            iframePointerEvents.set('auto')
          }}
        >
          <div className="w-1.5 h-8 bg-slate-500/60 rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}

function Marker({ label, active, className }) {
  return (
    <div className={clsx('flex items-start flex-none', className)}>
      <div className="flex flex-col items-center ml-[-2px]">
        <div
          className={clsx('w-px h-14', active ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800')}
        />
        <div
          className={clsx(
            'mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1',
            active
              ? 'bg-indigo-600 ring-indigo-600'
              : 'bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700'
          )}
        />
      </div>
      <div
        className={clsx(
          'ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0',
          active
            ? 'bg-indigo-50 text-indigo-600 ring-indigo-600 dark:bg-indigo-500 dark:text-white dark:highlight-white/10'
            : 'bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5'
        )}
      >
        {label}
      </div>
    </div>
  )
}

export function MobileFirst() {
  let [size, setSize] = useState()

  return (
    <section id="mobile-first" className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <IconContainer
          className="dark:bg-indigo-500 dark:highlight-white/20"
          light={require('@/img/icons/home/mobile-first.png').default}
          dark={require('@/img/icons/home/dark/mobile-first.png').default}
        />
        <Caption className="text-indigo-500 dark:text-indigo-400">Mobile-first</Caption>
        <BigText>Responsive everything.</BigText>
        <Paragraph as="div">
          <p>
            Wrestling with a bunch of complex media queries in your CSS sucks, so Tailwind lets you
            build responsive designs right in your HTML instead.
          </p>
          <p>
            Throw a screen size in front of literally any utility class and watch it magically apply
            at a specific breakpoint.
          </p>
        </Paragraph>
        <Link href="/docs/responsive-design" color="indigo" darkColor="gray">
          Learn more<span className="sr-only">, responsive design</span>
        </Link>
      </div>
      <div className="hidden mt-16 mb-12 border-b border-slate-100 xl:mb-0 demo-sm:block dark:border-slate-800">
        <div className="mb-[-3px] flex max-w-7xl mx-auto px-6 sm:px-8 md:px-10">
          <Marker label="sm" active={size !== undefined} className="ml-[40rem] w-32" />
          <Marker label="md" active={size === 'md' || size === 'lg'} className="w-64" />
          <Marker label="lg" active={size === 'lg'} className="w-64" />
          <Marker label="xl" className="w-64" />
          <Marker label="2xl" />
        </div>
      </div>
      <GridLockup
        className="mt-10 demo-sm:-mt-2.5"
        overhang="md"
        beams={0}
        left={
          <>
            <div className="sm:px-2 demo-sm:-mt-24 xl:mt-0">
              <BrowserWindow size={size} onChange={setSize} />
            </div>
            <CodeWindow className="!max-h-[24.75rem] lg:!h-[24.75rem]">
              <CodeWindow.Code2 lines={lines.length}>
                {lines.map((tokens, lineIndex) => (
                  <div key={lineIndex}>
                    {tokens.map((token, tokenIndex) => {
                      if (token.types[token.types.length - 1] === 'class') {
                        let isSm = token.content.startsWith('sm:')
                        let isMd = token.content.startsWith('md:')
                        let isLg = token.content.startsWith('lg:')

                        if (isSm || isMd || isLg) {
                          let faded =
                            size === undefined ||
                            (size === 'sm' && (isMd || isLg)) ||
                            (size === 'md' && isLg)
                          let highlighted =
                            (size === 'sm' && isSm) ||
                            (size === 'md' && isMd) ||
                            (size === 'lg' && isLg)

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
