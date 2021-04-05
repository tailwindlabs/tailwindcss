import Link from 'next/link'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import { Search } from '@/components/Search'
import clsx from 'clsx'
import Router from 'next/router'
import { Logo } from '@/components/Logo'

function BannerMarkMobile(props) {
  return (
    <svg fill="none" viewBox="0 0 848 513" {...props}>
      <path
        fill="#fff"
        fillOpacity={0.1}
        d="M424 0C310.94 0 240.26 56.944 212 170.811c42.4-56.944 91.86-78.295 148.4-64.054 32.266 8.114 55.311 31.686 80.836 57.777 41.552 42.489 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.295-148.4 64.054-32.245-8.114-55.311-31.686-80.836-57.777C577.212 49.193 529.088 0 424 0zM212 256.217c-113.06 0-183.74 56.944-212 170.812 42.4-56.945 91.86-78.296 148.4-64.055 32.245 8.114 55.311 31.686 80.836 57.777 41.552 42.49 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.296-148.4 64.054-32.245-8.113-55.311-31.685-80.836-57.777-41.552-42.489-89.676-91.683-194.764-91.683z"
      />
      <path
        stroke="#fff"
        strokeOpacity={0.2}
        d="M360.522 106.272l-.122.485.122-.485zm0 0c32.383 8.143 55.504 31.778 80.966 57.805l.105.107-.318.312.318-.311c20.78 21.248 43.155 44.121 73.45 61.692 30.282 17.564 68.498 29.84 120.957 29.84 56.444 0 102.26-14.213 137.486-42.595 34.73-27.982 59.217-69.776 73.424-125.433-20.822 27.449-43.355 46.428-67.609 56.898-24.842 10.723-51.456 12.503-79.823 5.358-32.389-8.15-55.544-31.819-81.032-57.872l-.039-.04.357-.35-.357.35c-20.78-21.25-43.155-44.122-73.449-61.693C514.675 12.777 476.459.5 424 .5c-56.444 0-102.26 14.213-137.486 42.595-34.73 27.982-59.217 69.776-73.424 125.434 20.822-27.45 43.355-46.429 67.609-56.898 24.842-10.723 51.456-12.504 79.823-5.359zm45.885 241.978l.286-.28-.286.28.039.04c25.488 26.053 48.643 49.722 81.032 57.872 28.367 7.145 54.981 5.365 79.823-5.358 24.254-10.47 46.787-29.449 67.609-56.898-14.207 55.657-38.694 97.452-73.424 125.433-35.226 28.382-81.042 42.595-137.486 42.595-52.459 0-90.675-12.276-120.957-29.84-30.295-17.571-52.67-40.443-73.45-61.692l-.337.329.337-.329-.039-.041c-25.488-26.053-48.643-49.722-81.032-57.872-28.367-7.145-54.98-5.364-79.823 5.359-24.254 10.469-46.787 29.448-67.609 56.898 14.207-55.657 38.694-97.452 73.424-125.434C109.74 270.93 155.556 256.717 212 256.717c52.459 0 90.675 12.277 120.957 29.841 30.295 17.57 52.67 40.443 73.45 61.692z"
      />
      <path
        stroke="url(#mark-mobile__paint0_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M647.5 120c-6-4.5-13.5-12.5-13.5-12.5"
      />
      <path
        stroke="url(#mark-mobile__paint1_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M212 256c11.118 0 21.598.551 31.5 1.586"
      />
      <path
        stroke="url(#mark-mobile__paint2_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M632.5 255.793c-11.118 0-21.598-.551-31.5-1.586"
      />
      <defs>
        <linearGradient
          id="mark-mobile__paint0_linear"
          x1={648.5}
          x2={636.5}
          y1={119.803}
          y2={108}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="mark-mobile__paint1_linear"
          x1={220.5}
          x2={245}
          y1={256.783}
          y2={257.783}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="mark-mobile__paint2_linear"
          x1={624}
          x2={599.5}
          y1={255.01}
          y2={254.01}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

function BannerMarkLeft(props) {
  return (
    <svg fill="none" viewBox="0 0 848 513" {...props}>
      <path
        fill="#fff"
        fillOpacity={0.1}
        d="M424 0C310.94 0 240.26 56.944 212 170.811c42.4-56.944 91.86-78.295 148.4-64.054 32.266 8.114 55.311 31.686 80.836 57.777 41.552 42.489 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.295-148.4 64.054-32.245-8.114-55.311-31.686-80.836-57.777C577.212 49.193 529.088 0 424 0zM212 256.217c-113.06 0-183.74 56.944-212 170.812 42.4-56.945 91.86-78.296 148.4-64.055 32.245 8.114 55.311 31.686 80.836 57.777 41.552 42.49 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.296-148.4 64.054-32.245-8.113-55.311-31.685-80.836-57.777-41.552-42.489-89.676-91.683-194.764-91.683z"
      />
      <path
        stroke="#fff"
        strokeOpacity={0.2}
        d="M360.522 106.272l-.122.485.122-.485zm0 0c32.383 8.143 55.504 31.778 80.966 57.805l.105.107-.318.312.318-.311c20.78 21.248 43.155 44.121 73.45 61.692 30.282 17.564 68.498 29.84 120.957 29.84 56.444 0 102.26-14.213 137.486-42.595 34.73-27.982 59.217-69.776 73.424-125.433-20.822 27.449-43.355 46.428-67.609 56.898-24.842 10.723-51.456 12.503-79.823 5.358-32.389-8.15-55.544-31.819-81.032-57.872l-.039-.04.357-.35-.357.35c-20.78-21.25-43.155-44.122-73.449-61.693C514.675 12.777 476.459.5 424 .5c-56.444 0-102.26 14.213-137.486 42.595-34.73 27.982-59.217 69.776-73.424 125.434 20.822-27.45 43.355-46.429 67.609-56.898 24.842-10.723 51.456-12.504 79.823-5.359zm45.885 241.978l.286-.28-.286.28.039.04c25.488 26.053 48.643 49.722 81.032 57.872 28.367 7.145 54.981 5.365 79.823-5.358 24.254-10.47 46.787-29.449 67.609-56.898-14.207 55.657-38.694 97.452-73.424 125.433-35.226 28.382-81.042 42.595-137.486 42.595-52.459 0-90.675-12.276-120.957-29.84-30.295-17.571-52.67-40.443-73.45-61.692l-.337.329.337-.329-.039-.041c-25.488-26.053-48.643-49.722-81.032-57.872-28.367-7.145-54.98-5.364-79.823 5.359-24.254 10.469-46.787 29.448-67.609 56.898 14.207-55.657 38.694-97.452 73.424-125.434C109.74 270.93 155.556 256.717 212 256.717c52.459 0 90.675 12.277 120.957 29.841 30.295 17.57 52.67 40.443 73.45 61.692z"
      />
      <path
        stroke="url(#mark-left__paint0_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M212 256c11.118 0 21.598.551 31.5 1.586"
      />
      <path
        stroke="url(#mark-left__paint1_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M632.5 255.793c-11.118 0-21.598-.551-31.5-1.586"
      />
      <defs>
        <linearGradient
          id="mark-left__paint0_linear"
          x1={220.5}
          x2={245}
          y1={256.783}
          y2={257.783}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="mark-left__paint1_linear"
          x1={624}
          x2={599.5}
          y1={255.01}
          y2={254.01}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

function BannerMarkRight(props) {
  return (
    <svg fill="none" viewBox="0 0 848 513" {...props}>
      <path
        fill="#fff"
        fillOpacity={0.1}
        d="M424 0C310.94 0 240.26 56.944 212 170.811c42.4-56.944 91.86-78.295 148.4-64.054 32.266 8.114 55.311 31.686 80.836 57.777 41.552 42.489 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.295-148.4 64.054-32.245-8.114-55.311-31.686-80.836-57.777C577.212 49.193 529.088 0 424 0zM212 256.217c-113.06 0-183.74 56.944-212 170.812 42.4-56.945 91.86-78.296 148.4-64.055 32.245 8.114 55.311 31.686 80.836 57.777 41.552 42.49 89.676 91.683 194.764 91.683 113.06 0 183.74-56.944 212-170.811-42.4 56.944-91.86 78.296-148.4 64.054-32.245-8.113-55.311-31.685-80.836-57.777-41.552-42.489-89.676-91.683-194.764-91.683z"
      />
      <path
        stroke="#fff"
        strokeOpacity={0.2}
        d="M360.522 106.272l-.122.485.122-.485zm0 0c32.383 8.143 55.504 31.778 80.966 57.805l.105.107-.318.312.318-.311c20.78 21.248 43.155 44.121 73.45 61.692 30.282 17.564 68.498 29.84 120.957 29.84 56.444 0 102.26-14.213 137.486-42.595 34.73-27.982 59.217-69.776 73.424-125.433-20.822 27.449-43.355 46.428-67.609 56.898-24.842 10.723-51.456 12.503-79.823 5.358-32.389-8.15-55.544-31.819-81.032-57.872l-.039-.04.357-.35-.357.35c-20.78-21.25-43.155-44.122-73.449-61.693C514.675 12.777 476.459.5 424 .5c-56.444 0-102.26 14.213-137.486 42.595-34.73 27.982-59.217 69.776-73.424 125.434 20.822-27.45 43.355-46.429 67.609-56.898 24.842-10.723 51.456-12.504 79.823-5.359zm45.885 241.978l.286-.28-.286.28.039.04c25.488 26.053 48.643 49.722 81.032 57.872 28.367 7.145 54.981 5.365 79.823-5.358 24.254-10.47 46.787-29.449 67.609-56.898-14.207 55.657-38.694 97.452-73.424 125.433-35.226 28.382-81.042 42.595-137.486 42.595-52.459 0-90.675-12.276-120.957-29.84-30.295-17.571-52.67-40.443-73.45-61.692l-.337.329.337-.329-.039-.041c-25.488-26.053-48.643-49.722-81.032-57.872-28.367-7.145-54.98-5.364-79.823 5.359-24.254 10.469-46.787 29.448-67.609 56.898 14.207-55.657 38.694-97.452 73.424-125.434C109.74 270.93 155.556 256.717 212 256.717c52.459 0 90.675 12.277 120.957 29.841 30.295 17.57 52.67 40.443 73.45 61.692z"
      />
      <path
        stroke="url(#mark-right__paint0_linear)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M148.4 362.974c-20.178-5.082-39.454-5.631-57.83-1.648"
      />
      <defs>
        <linearGradient
          id="mark-right__paint0_linear"
          x1={106.175}
          x2={151.193}
          y1={360.811}
          y2={362.062}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Header({ navIsOpen, onNavToggle }) {
  return (
    <>
      <div className="py-2 bg-gradient-to-r from-indigo-600 to-light-blue-500 overflow-hidden">
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <BannerMarkMobile className="sm:hidden absolute right-1/2 transform translate-x-[235px] translate-y-[-90px] w-[848px] h-[513px]" />
          <BannerMarkLeft className="hidden sm:block absolute right-1/2 transform translate-x-[-150px] translate-y-[-250px] w-[848px] h-[513px]" />
          <BannerMarkRight className="hidden sm:block absolute left-1/2 transform translate-x-[330px] translate-y-[-357px] w-[848px] h-[513px]" />
          <div className="relative flex justify-center items-center">
            <div className="text-sm font-medium text-white">
              Just-in-Time: The Next Generation of Tailwind&nbsp;CSS
            </div>
            <span
              aria-hidden="true"
              className="hidden sm:block mx-6 h-6 w-px bg-white bg-opacity-20"
            ></span>
            <div className="ml-6 sm:ml-0">
              <Link href="/docs/just-in-time-mode">
                <a className="whitespace-nowrap inline-flex rounded-md bg-white py-2 px-3 text-xs font-semibold uppercase text-blue-500 hover:bg-opacity-90">
                  Learn more &rarr;
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
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
