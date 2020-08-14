import { useIsHome } from '@/hooks/useIsHome'
import Link from 'next/link'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import { Search } from '@/components/Search'
import dynamic from 'next/dynamic'
import clsx from 'clsx'

const WorkflowAnimation = dynamic(() =>
  import('@/components/WorkflowAnimation').then((mod) => mod.WorkflowAnimation)
)

export function Header({ navIsOpen, onNavToggle }) {
  let isHome = useIsHome()

  if (isHome) {
    return (
      <div id="header">
        <div className="bg-gray-100 pt-24 lg:pt-0">
          <div className="fixed z-100 bg-gray-100 inset-x-0 top-0 border-b-2 border-gray-200 lg:border-b-0 lg:static flex items-center">
            <div className="w-full max-w-screen-xl relative mx-auto px-6">
              <div className="lg:border-b-2 lg:border-gray-200 h-24 flex flex-col justify-center">
                <HeaderInner navIsOpen={navIsOpen} onNavToggle={onNavToggle} />
              </div>
            </div>
          </div>
          <div className="w-full max-w-screen-xl relative mx-auto px-6 pt-16 pb-40 md:pb-24">
            <div className="xl:flex -mx-6">
              <div className="px-6 text-left md:text-center xl:text-left max-w-2xl md:max-w-3xl mx-auto">
                <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl xl:text-4xl font-medium leading-tight">
                  A utility-first CSS framework for{' '}
                  <span className="sm:block text-teal-500 font-medium">
                    rapidly building custom designs.
                  </span>
                </h1>
                <p className="mt-6 leading-relaxed sm:text-lg md:text-xl xl:text-lg text-gray-600">
                  Tailwind CSS is a highly customizable, low-level CSS framework that gives you all
                  of the building blocks you need to build bespoke designs without any annoying
                  opinionated styles you have to fight to override.
                </p>
                <div className="flex mt-6 justify-start md:justify-center xl:justify-start">
                  <Link href="/docs/installation">
                    <a className="rounded-lg px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 bg-teal-500 hover:bg-teal-600 md:text-lg xl:text-base text-white font-semibold leading-tight shadow-md">
                      Get Started
                    </a>
                  </Link>
                  <a
                    href="#what-is-tailwind"
                    className="ml-4 rounded-lg px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 bg-white hover:bg-gray-200 md:text-lg xl:text-base text-gray-800 font-semibold leading-tight shadow-md"
                  >
                    Why Tailwind?
                  </a>
                </div>
              </div>
              <div className="mt-12 xl:mt-0 px-6 flex-shrink-0 hidden md:block">
                <div className="mx-auto" style={{ width: '40rem', height: '30rem' }}>
                  <div className="flex flex-col p-2">
                    <WorkflowAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-wave bg-center bg-repeat-x -mb-8 md:hidden"
          style={{
            height: `${190 * 0.75}px`,
            marginTop: `-${190 * 0.75}px`,
            backgroundSize: `${1440 * 0.75}px ${190 * 0.75}px`,
          }}
        />
        <div
          className="bg-wave bg-center bg-repeat-x -mb-8 hidden md:block"
          style={{
            height: '190px',
            marginTop: '-190px',
            backgroundSize: '1440px 190px',
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div id="header">
        <div className="flex bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-100 h-16 items-center">
          <div className="w-full max-w-screen-xl relative mx-auto px-6">
            <HeaderInner navIsOpen={navIsOpen} onNavToggle={onNavToggle} />
          </div>
        </div>
      </div>
    </div>
  )
}

function HeaderInner({ navIsOpen, onNavToggle }) {
  let isHome = useIsHome()

  return (
    <div className="flex items-center -mx-6">
      <div className="lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8">
        <div className="flex items-center">
          <Link href="/">
            <a className="block lg:mr-4">
              <svg
                className={clsx('w-auto hidden md:block', {
                  'h-12': isHome,
                  'h-10': !isHome,
                })}
                viewBox="0 0 273 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Tailwind CSS</title>
                <path
                  fill="url(#paint0_linear)"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M32 16C24.8 16 20.3 19.6 18.5 26.8C21.2 23.2 24.35 21.85 27.95 22.75C30.004 23.2635 31.4721 24.7536 33.0971 26.4031C35.7443 29.0901 38.8081 32.2 45.5 32.2C52.7 32.2 57.2 28.6 59 21.4C56.3 25 53.15 26.35 49.55 25.45C47.496 24.9365 46.0279 23.4464 44.4029 21.7969C41.7557 19.1099 38.6919 16 32 16ZM18.5 32.2C11.3 32.2 6.8 35.8 5 43C7.7 39.4 10.85 38.05 14.45 38.95C16.504 39.4635 17.9721 40.9536 19.5971 42.6031C22.2443 45.2901 25.3081 48.4 32 48.4C39.2 48.4 43.7 44.8 45.5 37.6C42.8 41.2 39.65 42.55 36.05 41.65C33.996 41.1365 32.5279 39.6464 30.9029 37.9969C28.2557 35.3099 25.1919 32.2 18.5 32.2Z"
                />
                <path
                  fill="#2D3748"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M85.996 29.652H81.284V38.772C81.284 41.204 82.88 41.166 85.996 41.014V44.7C79.688 45.46 77.18 43.712 77.18 38.772V29.652H73.684V25.7H77.18V20.596L81.284 19.38V25.7H85.996V29.652ZM103.958 25.7H108.062V44.7H103.958V41.964C102.514 43.978 100.272 45.194 97.308 45.194C92.14 45.194 87.846 40.824 87.846 35.2C87.846 29.538 92.14 25.206 97.308 25.206C100.272 25.206 102.514 26.422 103.958 28.398V25.7ZM97.954 41.28C101.374 41.28 103.958 38.734 103.958 35.2C103.958 31.666 101.374 29.12 97.954 29.12C94.534 29.12 91.95 31.666 91.95 35.2C91.95 38.734 94.534 41.28 97.954 41.28ZM114.902 22.85C113.458 22.85 112.28 21.634 112.28 20.228C112.28 18.784 113.458 17.606 114.902 17.606C116.346 17.606 117.524 18.784 117.524 20.228C117.524 21.634 116.346 22.85 114.902 22.85ZM112.85 44.7V25.7H116.954V44.7H112.85ZM121.704 44.7V16.96H125.808V44.7H121.704ZM152.446 25.7H156.778L150.812 44.7H146.784L142.832 31.894L138.842 44.7H134.814L128.848 25.7H133.18L136.866 38.81L140.856 25.7H144.77L148.722 38.81L152.446 25.7ZM161.87 22.85C160.426 22.85 159.248 21.634 159.248 20.228C159.248 18.784 160.426 17.606 161.87 17.606C163.314 17.606 164.492 18.784 164.492 20.228C164.492 21.634 163.314 22.85 161.87 22.85ZM159.818 44.7V25.7H163.922V44.7H159.818ZM178.666 25.206C182.922 25.206 185.962 28.094 185.962 33.034V44.7H181.858V33.452C181.858 30.564 180.186 29.044 177.602 29.044C174.904 29.044 172.776 30.64 172.776 34.516V44.7H168.672V25.7H172.776V28.132C174.03 26.156 176.082 25.206 178.666 25.206ZM205.418 18.1H209.522V44.7H205.418V41.964C203.974 43.978 201.732 45.194 198.768 45.194C193.6 45.194 189.306 40.824 189.306 35.2C189.306 29.538 193.6 25.206 198.768 25.206C201.732 25.206 203.974 26.422 205.418 28.398V18.1ZM199.414 41.28C202.834 41.28 205.418 38.734 205.418 35.2C205.418 31.666 202.834 29.12 199.414 29.12C195.994 29.12 193.41 31.666 193.41 35.2C193.41 38.734 195.994 41.28 199.414 41.28ZM223.278 45.194C217.54 45.194 213.246 40.824 213.246 35.2C213.246 29.538 217.54 25.206 223.278 25.206C227.002 25.206 230.232 27.144 231.752 30.108L228.218 32.16C227.382 30.374 225.52 29.234 223.24 29.234C219.896 29.234 217.35 31.78 217.35 35.2C217.35 38.62 219.896 41.166 223.24 41.166C225.52 41.166 227.382 39.988 228.294 38.24L231.828 40.254C230.232 43.256 227.002 45.194 223.278 45.194ZM238.592 30.944C238.592 34.402 248.814 32.312 248.814 39.342C248.814 43.142 245.508 45.194 241.404 45.194C237.604 45.194 234.868 43.484 233.652 40.748L237.186 38.696C237.794 40.406 239.314 41.432 241.404 41.432C243.228 41.432 244.634 40.824 244.634 39.304C244.634 35.922 234.412 37.822 234.412 31.02C234.412 27.448 237.49 25.206 241.366 25.206C244.482 25.206 247.066 26.65 248.396 29.158L244.938 31.096C244.254 29.614 242.924 28.93 241.366 28.93C239.884 28.93 238.592 29.576 238.592 30.944ZM256.11 30.944C256.11 34.402 266.332 32.312 266.332 39.342C266.332 43.142 263.026 45.194 258.922 45.194C255.122 45.194 252.386 43.484 251.17 40.748L254.704 38.696C255.312 40.406 256.832 41.432 258.922 41.432C260.746 41.432 262.152 40.824 262.152 39.304C262.152 35.922 251.93 37.822 251.93 31.02C251.93 27.448 255.008 25.206 258.884 25.206C262 25.206 264.584 26.65 265.914 29.158L262.456 31.096C261.772 29.614 260.442 28.93 258.884 28.93C257.402 28.93 256.11 29.576 256.11 30.944Z"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="3.5"
                    y1={16}
                    x2={59}
                    y2={48}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2298BD" />
                    <stop offset={1} stopColor="#0ED7B5" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                className="w-10 h-10 block md:hidden"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Tailwind CSS</title>
                <path
                  d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
                  transform="translate(5 16)"
                  fill="url(#logoMarkGradient)"
                  fillRule="evenodd"
                />
                <defs>
                  <linearGradient x1="0%" y1="0%" y2="100%" id="logoMarkGradient">
                    <stop stopColor="#2298BD" />
                    <stop offset={1} stopColor="#0ED7B5" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex flex-grow min-w-0 lg:w-3/4 xl:w-4/5">
        <div className="w-full min-w-0 lg:px-6 xl:w-3/4 xl:px-12">
          <Search />
        </div>
        <button
          type="button"
          id="sidebar-open"
          className={clsx(
            'flex px-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700',
            {
              hidden: navIsOpen,
            }
          )}
          onClick={() => onNavToggle(true)}
          aria-label="Open site navigation"
        >
          <svg
            className="fill-current w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        <button
          type="button"
          id="sidebar-close"
          className={clsx(
            'flex px-6 items-center lg:hidden text-gray-500 focus:outline-none focus:text-gray-700',
            {
              hidden: !navIsOpen,
            }
          )}
          onClick={() => onNavToggle(false)}
          aria-label="Close site navigation"
        >
          <svg
            className="fill-current w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
        <div className="hidden lg:flex lg:items-center lg:justify-between xl:w-1/4 px-6">
          <div className="relative mr-4">
            <VersionSwitcher />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-start items-center text-gray-500">
            <a
              className="block flex items-center hover:text-gray-700 mr-5"
              href="https://github.com/tailwindcss/tailwindcss"
            >
              <svg
                className="fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>GitHub</title>
                <path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0" />
              </svg>
            </a>
            <a
              className="block flex items-center hover:text-gray-700 mr-5"
              href="https://twitter.com/tailwindcss"
            >
              <svg
                className="fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Twitter</title>
                <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84" />
              </svg>
            </a>
            <a className="block flex items-center hover:text-gray-700" href="/discord">
              <svg
                className="fill-current w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 146 146"
              >
                <title>Discord</title>
                <path
                  d="M107.75 125.001s-4.5-5.375-8.25-10.125c16.375-4.625 22.625-14.875 22.625-14.875-5.125 3.375-10 5.75-14.375 7.375-6.25 2.625-12.25 4.375-18.125 5.375-12 2.25-23 1.625-32.375-.125-7.125-1.375-13.25-3.375-18.375-5.375-2.875-1.125-6-2.5-9.125-4.25-.375-.25-.75-.375-1.125-.625-.25-.125-.375-.25-.5-.375-2.25-1.25-3.5-2.125-3.5-2.125s6 10 21.875 14.75c-3.75 4.75-8.375 10.375-8.375 10.375-27.625-.875-38.125-19-38.125-19 0-40.25 18-72.875 18-72.875 18-13.5 35.125-13.125 35.125-13.125l1.25 1.5c-22.5 6.5-32.875 16.375-32.875 16.375s2.75-1.5 7.375-3.625c13.375-5.875 24-7.5 28.375-7.875.75-.125 1.375-.25 2.125-.25 7.625-1 16.25-1.25 25.25-.25 11.875 1.375 24.625 4.875 37.625 12 0 0-9.875-9.375-31.125-15.875l1.75-2S110 19.626 128 33.126c0 0 18 32.625 18 72.875 0 0-10.625 18.125-38.25 19zM49.625 66.626c-7.125 0-12.75 6.25-12.75 13.875s5.75 13.875 12.75 13.875c7.125 0 12.75-6.25 12.75-13.875.125-7.625-5.625-13.875-12.75-13.875zm45.625 0c-7.125 0-12.75 6.25-12.75 13.875s5.75 13.875 12.75 13.875c7.125 0 12.75-6.25 12.75-13.875s-5.625-13.875-12.75-13.875z"
                  fillRule="nonzero"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
