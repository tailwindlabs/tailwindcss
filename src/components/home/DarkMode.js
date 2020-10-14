import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { motion } from 'framer-motion'
import { gradients } from '@/utils/gradients'
import { Paragraph, Icon, Caption, BigText, Link } from '@/components/home/common'
import { GradientLockup } from '@/components/GradientLockup'
import { CodeWindow } from '@/components/CodeWindow'

function DarkModeSwitch({ enabled, onChange }) {
  return (
    <div className="flex items-center space-x-4">
      <svg width="32" height="32" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2a1.4 1.4 0 011.4 1.4v1.4a1.4 1.4 0 11-2.8 0V3.4A1.4 1.4 0 0116 2zM6.1 6.1a1.4 1.4 0 011.98 0l.99.99a1.4 1.4 0 11-1.98 1.98l-.99-.99a1.4 1.4 0 010-1.98zm19.8 0a1.4 1.4 0 010 1.98l-.99.99a1.4 1.4 0 01-1.98-1.98l.99-.99a1.4 1.4 0 011.98 0zM9 16a7 7 0 1114 0 7 7 0 01-14 0zm-7 0a1.4 1.4 0 011.4-1.4h1.4a1.4 1.4 0 110 2.8H3.4A1.4 1.4 0 012 16zm23.8 0a1.4 1.4 0 011.4-1.4h1.4a1.4 1.4 0 110 2.8h-1.4a1.4 1.4 0 01-1.4-1.4zm-2.87 6.93a1.4 1.4 0 011.98 0l.99.99a1.4 1.4 0 01-1.98 1.98l-.99-.99a1.4 1.4 0 010-1.98zm-15.84 0a1.4 1.4 0 011.98 1.98l-.99.99a1.4 1.4 0 01-1.98-1.98l.99-.99zM16 25.8a1.4 1.4 0 011.4 1.4v1.4a1.4 1.4 0 11-2.8 0v-1.4a1.4 1.4 0 011.4-1.4z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="2"
            y1="2"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={enabled ? '#d4d4d8' : '#FACC15'} />
            <stop offset="1" stopColor={enabled ? '#d4d4d8' : '#FA9D16'} />
          </linearGradient>
        </defs>
      </svg>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`inline-flex items-center px-0.5 rounded-full w-18 h-9 ${
          enabled ? 'justify-end' : ''
        }`}
        style={{ backgroundColor: enabled ? '#000' : '#60D360' }}
      >
        <span className="sr-only">Enable dark mode</span>
        <motion.span
          layout
          className="bg-white rounded-full w-8 h-8"
          style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.1)' }}
        />
      </Switch>
      <svg width="24" height="24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.353 2.939a1 1 0 01.22 1.08 8 8 0 0010.408 10.408 1 1 0 011.301 1.3A10.003 10.003 0 0112 22C6.477 22 2 17.523 2 12c0-4.207 2.598-7.805 6.273-9.282a1 1 0 011.08.22z"
          fill={enabled ? '#000' : '#d4d4d8'}
        />
      </svg>
    </div>
  )
}

export function DarkMode() {
  const [enabled, setEnabled] = useState(true)

  return (
    <section>
      <div className="px-8 mb-20">
        <Icon className={`${gradients.green} mb-8`} />
        <Caption as="h2" className="text-green-600 mb-3">
          Dark mode
        </Caption>
        <BigText className="mb-8">Now with Dark Mode.</BigText>
        <Paragraph className="mb-6">
          Don’t want to be one of those websites that blinds people when they open it on their phone
          at 2am? Throw dark: in front of any color utility to apply it when dark mode is active.
          Works for background colors, text colors, border colors, and even gradients out-of-the-box
          — no configuration required.
        </Paragraph>
        <Link href="#" className="text-green-600">
          Learn more -&gt;
        </Link>
      </div>
      <GradientLockup
        color="green"
        rotate={-2}
        header={
          <div className="flex justify-center">
            <DarkModeSwitch enabled={enabled} onChange={setEnabled} />
          </div>
        }
        left={
          <div className={`relative z-10 rounded-xl shadow-lg -mr-8 ${enabled ? 'dark' : ''}`}>
            <div className="bg-white rounded-t-xl p-8 space-y-8 dark:bg-gray-800">
              <div className="flex items-center space-x-5">
                <img
                  src="https://unsplash.it/160/160?random"
                  alt=""
                  width="160"
                  height="160"
                  className="flex-none w-20 h-20 rounded-lg"
                />
                <div className="flex-auto space-y-0.5">
                  <p className="text-base leading-6 font-semibold uppercase text-lime-600 dark:text-lime-400">
                    <abbr title="Episode">Ep.</abbr> 145
                  </p>
                  <h2 className="text-xl leading-7 font-semibold text-black dark:text-white">
                    Statamic 3.0 and Tailwind CSS 2.0
                  </h2>
                  <p className="text-lg leading-6 font-medium text-gray-500 dark:text-gray-400">
                    Full Stack Radio
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-full overflow-hidden dark:bg-black">
                  <div
                    className="bg-lime-500 w-1/2 h-1.5 dark:bg-lime-400"
                    role="progressbar"
                    aria-valuenow={24 * 60 + 16}
                    aria-valuemin="0"
                    aria-valuemax={75 * 60 + 50}
                  />
                </div>
                <div className="flex justify-between text-sm leading-5 font-medium tabular-nums text-gray-500 dark:text-gray-400">
                  <div>24:16</div>
                  <div>75:50</div>
                </div>
              </div>
            </div>
            <div className="rounded-b-xl bg-gray-50 text-black py-4 px-3 grid grid-cols-7 items-center dark:bg-gray-900 dark:text-white">
              <button type="button" className="mx-auto">
                <svg width="24" height="24" fill="none">
                  <path
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button type="button" className="mx-auto">
                <svg width="17" height="18">
                  <path d="M0 0h2v18H0V0zM4 9l13-9v18L4 9z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="mx-auto">
                <svg width="34" height="39" fill="none">
                  <path
                    d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z"
                    fill="currentColor"
                  />
                  <path
                    d="M1 22c0 8.837 7.163 16 16 16s16-7.163 16-16S25.837 6 17 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M17 0L9 6l8 6V0z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="mx-auto">
                <svg width="50" height="50" fill="none">
                  <circle cx="25" cy="25" r="24" stroke="#D4D4D8" strokeWidth="1.5" />
                  <path d="M18 16h4v18h-4V16zM28 16h4v18h-4z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="mx-auto">
                <svg width="34" height="39" fill="none">
                  <path
                    d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z"
                    fill="currentColor"
                  />
                  <path
                    d="M33 22c0 8.837-7.163 16-16 16S1 30.837 1 22 8.163 6 17 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M17 0l8 6-8 6V0z" fill="currentColor" />
                </svg>
              </button>
              <button type="button" className="mx-auto">
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
                  <path d="M17 0H15V18H17V0Z" fill="currentColor" />
                  <path d="M13 9L0 0V18L13 9Z" fill="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                className="mx-auto border border-gray-300 rounded-md text-sm leading-5 font-medium py-0.5 px-2 text-gray-500 dark:border-gray-600 dark:text-gray-400"
              >
                1.0x
              </button>
            </div>
          </div>
        }
        right={<CodeWindow className="bg-green-500" />}
      />
    </section>
  )
}
