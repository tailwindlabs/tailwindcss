import { useEffect, useState } from 'react'
import colorPalette from 'tailwindcss/colors'
import { kebabToTitleCase } from '@/utils/kebabToTitleCase'
import dlv from 'dlv'
import Alert from '@reach/alert'
import { Transition } from '@headlessui/react'

export function ColorPaletteReference({ colors }) {
  return (
    <div className="grid grid-cols-1 gap-8">
      {colors.map((color, i) => {
        let title = Array.isArray(color) ? color[0] : kebabToTitleCase(color)
        let value = Array.isArray(color) ? color[1] : color

        let palette =
          typeof value === 'string'
            ? [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((variant) => ({
                name: variant,
                value: dlv(colorPalette, [value, variant]),
              }))
            : Object.keys(value).map((name) => ({ name, value: value[name] }))

        return (
          <div key={i}>
            <div className="flex flex-col space-y-3 sm:flex-row text-xs sm:space-y-0 sm:space-x-4">
              <div className="w-16 shrink-0">
                <div className="h-10 flex flex-col justify-center">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {title
                      .split('')
                      .flatMap((l, i) => {
                        return i !== 0 && l.toUpperCase() === l ? [' ', l] : [l]
                      })
                      .join('')}
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1 grid grid-cols-5 2xl:grid-cols-10 gap-x-4 gap-y-3 2xl:gap-x-2">
                {palette.map((props, j) => (
                  <ColorPalette key={j} {...props} />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ColorPalette({ name, value }) {
  const [{ state }, setState] = useState({ state: 'idle' })

  useEffect(() => {
    if (state === 'copied') {
      const handle = window.setTimeout(() => {
        setState({ state: 'idle' })
      }, 1500)
      return () => {
        window.clearTimeout(handle)
      }
    }
  }, [state])

  return (
    <div className="relative flex">
      <div
        className="space-y-1.5 cursor-pointer"
        onClick={() =>
          navigator.clipboard.writeText(value).then(() => {
            setState({ state: 'copied' })
          })
        }
      >
        <div
          className="h-10 w-full rounded dark:ring-1 dark:ring-inset dark:ring-white/10"
          style={{ backgroundColor: value }}
        />
        <div className="px-0.5 md:flex md:justify-between md:space-x-2 2xl:space-x-0 2xl:block">
          <div className="w-6 font-medium text-slate-900 2xl:w-full dark:text-white">{name}</div>
          <div className="text-slate-500 font-mono lowercase dark:text-slate-400">
            {value.replace(/^#[a-f0-9]+/gi, (m) => m.toUpperCase())}
          </div>
        </div>
      </div>
      <Transition
        className="absolute bottom-full left-1/2 mb-3.5 pb-1 -translate-x-1/2"
        show={state === 'copied'}
        enter="transform ease-out duration-200 transition origin-bottom"
        enterFrom="scale-95 translate-y-0.5 opacity-0"
        enterTo="scale-100 translate-y-0 opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Alert className="relative bg-sky-500 text-white font-mono text-[0.625rem] leading-6 font-medium px-1.5 rounded-lg">
          Copied
          <svg
            aria-hidden="true"
            width="16"
            height="6"
            viewBox="0 0 16 6"
            className="text-sky-500 absolute top-full left-1/2 -mt-px -ml-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z"
              fill="currentColor"
            />
          </svg>
        </Alert>
      </Transition>
    </div>
  )
}
