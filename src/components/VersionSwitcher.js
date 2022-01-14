import pkg from 'tailwindcss/package.json?fields=version'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'

export function VersionSwitcher({ className }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="text-xs leading-5 font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5">
        v{pkg.version}
        <svg width="6" height="3" className="ml-2 overflow-visible" aria-hidden="true">
          <path
            d="M0 0L3 3L6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Menu.Button>
      <Menu.Items className="absolute top-full mt-1 py-2 w-40 rounded-lg bg-white shadow ring-1 ring-slate-900/5 text-sm leading-6 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:highlight-white/5">
        <Menu.Item disabled>
          <span className="flex items-center justify-between px-3 py-1 text-sky-500 dark:text-sky-400">
            v{pkg.version}
            <svg width="24" height="24" fill="none" aria-hidden="true">
              <path
                d="m7.75 12.75 2.25 2.5 6.25-6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://v2.tailwindcss.com"
              className={clsx(
                'block px-3 py-1',
                active && 'bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
              )}
            >
              v2.2.19
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://v1.tailwindcss.com"
              className={clsx(
                'block px-3 py-1',
                active && 'bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
              )}
            >
              v1.9.6
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="https://tailwindcss-v0.netlify.app/"
              className={clsx(
                'block px-3 py-1',
                active && 'bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
              )}
            >
              v0.7.4
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
