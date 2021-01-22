import Link from 'next/link'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import { Search } from '@/components/Search'
import clsx from 'clsx'
import Router from 'next/router'
import { Logo } from '@/components/Logo'

export function Header({ navIsOpen, onNavToggle }) {
  return (
    <>
      <div className="sticky top-0 z-40 lg:z-50 w-full max-w-8xl mx-auto bg-white flex-none flex">
        <div className="flex-none pl-4 sm:pl-6 xl:pl-8 flex items-center border-b border-gray-200 lg:border-b-0 lg:w-60 xl:w-72">
          <Link href="/">
            <a
              className="overflow-hidden w-10 md:w-auto"
              onContextMenu={(e) => {
                e.preventDefault()
                Router.push('/brand')
              }}
            >
              <span className="sr-only">Tailwind CSS home page</span>
              <Logo className="w-auto h-6" />
            </a>
          </Link>
        </div>
        <div className="flex-auto border-b border-gray-200 h-18 flex items-center justify-between px-4 sm:px-6 lg:mx-6 lg:px-0 xl:mx-8">
          <Search />
          <div className="lg:w-64 pl-8 flex-shrink-0 flex items-center justify-end space-x-6">
            <VersionSwitcher className="hidden lg:block" />
            <a
              href="https://github.com/tailwindlabs/tailwindcss"
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <span className="sr-only">Tailwind CSS on GitHub</span>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="fixed z-50 bottom-4 right-4 w-16 h-16 rounded-full bg-gray-900 text-white block lg:hidden"
        onClick={() => onNavToggle(!navIsOpen)}
      >
        <span className="sr-only">Open site navigation</span>
        <svg
          width="24"
          height="24"
          fill="none"
          className={clsx(
            'absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform',
            {
              'opacity-0 scale-80': navIsOpen,
            }
          )}
        >
          <path
            d="M4 8h16M4 16h16"
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
          className={clsx(
            'absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform',
            {
              'opacity-0 scale-80': !navIsOpen,
            }
          )}
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  )
}
