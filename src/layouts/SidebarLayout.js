import Link from 'next/link'
import { useRouter } from 'next/router'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import { useIsHome } from '@/hooks/useIsHome'
import { createContext, forwardRef, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'

export const SidebarContext = createContext()

const NavItem = forwardRef(({ href, children, isActive, isPublished, fallbackHref }, ref) => {
  return (
    <li className="mb-3 lg:mb-1" ref={ref}>
      <Link href={isPublished ? href : fallbackHref}>
        <a
          className={clsx('px-2 -mx-2 py-1 transition duration-200 ease-in-out relative block', {
            'text-teal-600 font-medium': isActive,
            'hover:translate-x-2px hover:text-gray-900 text-gray-600 font-medium':
              !isActive && isPublished,
            'hover:translate-x-2px text-gray-400 font-medium': !isActive && !isPublished,
          })}
        >
          <span
            className={clsx('rounded absolute inset-0 bg-teal-200', {
              'opacity-25': isActive,
              'opacity-0': !isActive,
            })}
          />
          <span className="relative">{children}</span>
        </a>
      </Link>
    </li>
  )
})

function Nav({ nav, children, fallbackHref }) {
  const router = useRouter()
  const isHome = useIsHome()
  const activeItemRef = useRef()
  const scrollRef = useRef()

  useIsomorphicLayoutEffect(() => {
    if (activeItemRef.current) {
      const scrollRect = scrollRef.current.getBoundingClientRect()
      const activeItemRect = activeItemRef.current.getBoundingClientRect()
      scrollRef.current.scrollTop =
        activeItemRect.top - scrollRect.top - scrollRect.height / 2 + activeItemRect.height / 2
    }
  }, [])

  return (
    <nav
      id="nav"
      ref={scrollRef}
      className={clsx('px-6 pt-6 overflow-y-auto text-base lg:text-sm lg:py-12 lg:pl-6 lg:pr-8', {
        'sticky?lg:h-screen': isHome,
        'sticky?lg:h-(screen-16)': !isHome,
      })}
    >
      <div className="relative -mx-2 w-24 mb-8 lg:hidden">
        <VersionSwitcher />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <TopLevelNav />
      {children}
      {nav &&
        Object.keys(nav)
          .map((category) => {
            let publishedItems = nav[category].filter((item) => item.published !== false)
            if (publishedItems.length === 0 && !fallbackHref) return null
            return (
              <div className="mb-8" key={category}>
                <h5
                  className={clsx(
                    'mb-3 lg:mb-2 uppercase tracking-wide font-bold text-sm lg:text-xs',
                    {
                      'text-gray-500': publishedItems.length > 0,
                      'text-gray-400': publishedItems.length === 0,
                    }
                  )}
                >
                  {category}
                </h5>
                <ul>
                  {(fallbackHref ? nav[category] : publishedItems).map((item, i) => (
                    <NavItem
                      key={i}
                      href={item.href}
                      isActive={item.href === router.pathname}
                      ref={item.href === router.pathname ? activeItemRef : undefined}
                      isPublished={item.published !== false}
                      fallbackHref={fallbackHref}
                    >
                      {item.shortTitle || item.title}
                    </NavItem>
                  ))}
                </ul>
              </div>
            )
          })
          .filter(Boolean)}
    </nav>
  )
}

const TopLevelAnchor = forwardRef(({ children, href, className, icon, isActive, onClick }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={clsx(
        'flex items-center px-2 -mx-2 py-1 hover:text-gray-900 font-medium',
        className,
        {
          'text-gray-600': !isActive,
          'text-gray-900': isActive,
        }
      )}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24">
        {icon}
      </svg>
      <span className="ml-3">{children}</span>
    </a>
  )
})

function TopLevelLink({ href, as, ...props }) {
  if (/^https?:\/\//.test(href)) {
    return <TopLevelAnchor href={href} {...props} />
  }

  return (
    <Link href={href} as={as} passHref>
      <TopLevelAnchor {...props} />
    </Link>
  )
}

function TopLevelNav() {
  let { pathname } = useRouter()
  let current = pathname.split('/')[1]

  return (
    <div className="mb-10">
      <TopLevelLink
        href="/docs/installation"
        isActive={current === '' || current === 'docs'}
        icon={
          <>
            <path
              className="text-gray-400 fill-current"
              d="M12 21a2 2 0 0 1-1.41-.59l-.83-.82A2 2 0 0 0 8.34 19H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4a5 5 0 0 1 4 2v16z"
            />
            <path
              className="text-gray-700 fill-current"
              d="M12 21V5a5 5 0 0 1 4-2h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4.34a2 2 0 0 0-1.42.59l-.83.82A2 2 0 0 1 12 21z"
            />
          </>
        }
      >
        Documentation
      </TopLevelLink>
      <TopLevelLink
        href="/components"
        isActive={current === 'components'}
        className="mt-3 lg:mt-1"
        icon={
          <>
            <path
              className="text-gray-400 fill-current"
              d="M3 6l9 4v12l-9-4V6zm14-3v2c0 1.1-2.24 2-5 2s-5-.9-5-2V3c0 1.1 2.24 2 5 2s5-.9 5-2z"
            />
            <polygon className="text-gray-700 fill-current" points="21 6 12 10 12 22 21 18" />
          </>
        }
      >
        Components
      </TopLevelLink>
      <TopLevelLink
        href="/course"
        isActive={current === 'course'}
        className="mt-3 lg:mt-1"
        icon={
          <>
            <path
              className="text-gray-400 fill-current"
              d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm0 2v2h2V5H4zm0 4v2h2V9H4zm0 4v2h2v-2H4zm0 4v2h2v-2H4zM18 5v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2z"
            />
            <path
              className="text-gray-700 fill-current"
              d="M9 5h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 8h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
            />
          </>
        }
      >
        Screencasts
      </TopLevelLink>
      <TopLevelLink
        href="https://blog.tailwindcss.com"
        className="mt-3 lg:mt-1"
        icon={
          <g fillRule="evenodd" clipRule="evenodd">
            <path
              fill="#CBD5E0"
              d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm2 3a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V7a1 1 0 00-1-1H7z"
            />
            <path
              fill="#4A5568"
              d="M13 7a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm-7 8a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm8-5a1 1 0 100 2h3a1 1 0 100-2h-3z"
            />
          </g>
        }
      >
        Blog
      </TopLevelLink>
      <TopLevelLink
        href="/resources"
        isActive={current === 'resources'}
        className="mt-3 lg:mt-1"
        icon={
          <>
            <path
              className="text-gray-400 fill-current"
              d="M9 22c.19-.14.37-.3.54-.46L17.07 14H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9zM4 2h4a2 2 0 0 1 2 2v14a4 4 0 1 1-8 0V4c0-1.1.9-2 2-2zm2 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
            />
            <path
              className="text-gray-700 fill-current"
              d="M11 18.66V7.34l2.07-2.07a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83L11 18.66z"
            />
          </>
        }
      >
        Resources
      </TopLevelLink>
      <TopLevelLink
        href="/community"
        isActive={current === 'community'}
        className="mt-3 lg:mt-1"
        icon={
          <>
            <path
              className="text-gray-400 fill-current"
              d="M20.3 12.04l1.01 3a1 1 0 0 1-1.26 1.27l-3.01-1a7 7 0 1 1 3.27-3.27zM11 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            />
            <path
              className="text-gray-700 fill-current"
              d="M15.88 17.8a7 7 0 0 1-8.92 2.5l-3 1.01a1 1 0 0 1-1.27-1.26l1-3.01A6.97 6.97 0 0 1 5 9.1a9 9 0 0 0 10.88 8.7z"
            />
          </>
        }
      >
        Community
      </TopLevelLink>
    </div>
  )
}

export function SidebarLayout({ children, navIsOpen, setNavIsOpen, nav, sidebar, fallbackHref }) {
  let isHome = useIsHome()

  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <div className="lg:flex -mx-6">
          <div
            id="sidebar"
            className={clsx(
              'fixed inset-0 h-full bg-white z-90 w-full border-b -mb-16 lg:-mb-0 lg:static lg:h-auto lg:overflow-y-visible lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5',
              {
                hidden: !navIsOpen,
                'pt-24': isHome,
                'pt-16': !isHome,
              }
            )}
          >
            <div
              id="navWrapper"
              className={clsx(
                'h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent overflow-hidden',
                {
                  'lg:top-0 bg-gray-100': isHome,
                  'lg:top-16 bg-white': !isHome,
                }
              )}
            >
              {isHome && (
                <div
                  className="hidden lg:block h-16 pointer-events-none absolute inset-x-0 z-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0))',
                  }}
                />
              )}
              <Nav nav={nav} fallbackHref={fallbackHref}>
                {sidebar}
              </Nav>
            </div>
          </div>
          <div
            id="content-wrapper"
            className={clsx(
              'min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible lg:w-3/4 xl:w-4/5',
              {
                'overflow-hidden max-h-screen fixed': navIsOpen,
              }
            )}
          >
            <div id="content">
              <div id="app" className="flex">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
