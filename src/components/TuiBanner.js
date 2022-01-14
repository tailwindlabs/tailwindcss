import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import logo from '@/img/tailwind-ui-logo-on-dark.svg'
import { wait } from '@/utils/wait'
import { loadImage } from '@/utils/loadImage'

export function TuiBanner() {
  let ref = useRef()
  let [state, setState] = useState('waiting')

  useEffect(() => {
    if (state === 'waiting') {
      try {
        if (window.localStorage.getItem('hideBanner') !== null) {
          return
        }
      } catch (_) {
        return
      }
      let current = true
      Promise.all([wait(500), loadImage(logo)]).then(() => {
        if (current) {
          setState('visible')
        }
      })
      return () => {
        current = false
      }
    }

    if (state === 'hidden') {
      let node = ref.current
      let removeBanner = () => setState('removed')
      node.addEventListener('transitionend', removeBanner, { once: true })
      return () => {
        node.removeEventListener('transitionend', removeBanner)
      }
    }
  }, [state])

  return (
    <div
      ref={ref}
      className={clsx('transition transform fixed z-100 bottom-0 inset-x-0 pb-2 sm:pb-5', {
        'opacity-0 scale-95 translate-y-2 pointer-events-none':
          state === 'waiting' || state === 'hidden',
        'opacity-100 scale-100 translate-y-0 ease-out duration-500': state === 'visible',
        'ease-in duration-300': state === 'hidden',
        hidden: state === 'removed',
      })}
    >
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
        <div className="p-2 rounded-lg bg-slate-900 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <img className="h-6" src={logo} alt="" />
              <p className="ml-3 font-medium text-white truncate">
                <span className="lg:hidden">
                  <span className="sr-only">Tailwind UI</span> is now in early access!
                </span>
                <span className="hidden lg:inline text-slate-400">
                  <strong className="text-white font-semibold mr-1">Now in early access!</strong>
                  <span className="xl:hidden">
                    Beautiful UI components by the creators of Tailwind CSS.
                  </span>
                  <span className="hidden xl:inline">
                    Beautiful UI components, crafted by the creators of Tailwind CSS.
                  </span>
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <div className="rounded-md shadow-sm">
                <a
                  href="https://tailwindui.com?utm_source=tailwindcss&utm_medium=footer-banner"
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-slate-900 bg-white hover:text-slate-800 focus:outline-none focus:underline"
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className="order-2 shrink-0 sm:order-3 sm:ml-2">
              <button
                onClick={() => {
                  try {
                    window.localStorage.setItem('hideBanner', true)
                  } catch (_) {}
                  setState('hidden')
                }}
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-slate-800 focus:outline-none focus:bg-slate-800"
                aria-label="Hide banner"
              >
                <svg
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
