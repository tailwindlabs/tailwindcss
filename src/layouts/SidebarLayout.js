import Link from 'next/link'
import { useRouter } from 'next/router'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import { createContext, forwardRef, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import { gradients } from '@/utils/gradients'

export const SidebarContext = createContext()

const NavItem = forwardRef(({ href, children, isActive, isPublished, fallbackHref }, ref) => {
  return (
    <li ref={ref}>
      <Link href={isPublished ? href : fallbackHref}>
        <a
          className={clsx('px-3 py-2 transition-colors duration-200 relative block', {
            'text-cyan-700': isActive,
            'hover:text-gray-900 text-gray-500': !isActive && isPublished,
            'text-gray-400': !isActive && !isPublished,
          })}
        >
          <span
            className={clsx('rounded-md absolute inset-0 bg-cyan-50', {
              'opacity-0': !isActive
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
  const activeItemRef = useRef()
  const scrollRef = useRef()

  useIsomorphicLayoutEffect(() => {
    if (activeItemRef.current) {
      const scrollRect = scrollRef.current.getBoundingClientRect()
      const activeItemRect = activeItemRef.current.getBoundingClientRect()

      const top = activeItemRef.current.offsetTop
      const bottom = top - scrollRect.height + activeItemRect.height

      if (scrollRef.current.scrollTop > top || scrollRef.current.scrollTop < bottom) {
        scrollRef.current.scrollTop =
          activeItemRef.current.offsetTop - scrollRect.height / 2 + activeItemRect.height / 2
      }
    }
  }, [router.pathname])

  return (
    <nav
      id="nav"
      ref={scrollRef}
      className="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 sticky?lg:h-(screen-18)"
    >
      <div className="relative flex mb-8 px-3 lg:hidden">
        <VersionSwitcher />
      </div>
      <ul>
        <TopLevelNav />
        {children}
        {nav &&
          Object.keys(nav)
            .map((category) => {
              let publishedItems = nav[category].filter((item) => item.published !== false)
              if (publishedItems.length === 0 && !fallbackHref) return null
              return (
                <li key={category} className="mt-8">
                  <h5
                    className={clsx(
                      'px-3 mb-3 lg:mb-3 uppercase tracking-wide font-semibold text-sm lg:text-xs',
                      {
                        'text-gray-900': publishedItems.length > 0,
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
                </li>
              )
            })
            .filter(Boolean)}
      </ul>
    </nav>
  )
}

const TopLevelAnchor = forwardRef(
  ({ children, href, className, icon, isActive, onClick, color }, ref) => {
    return (
      <li>
        <a
          ref={ref}
          href={href}
          onClick={onClick}
          className={clsx(
            'flex items-center px-3 hover:text-gray-900 transition-colors duration-200',
            className,
            {
              'text-gray-900': isActive,
            }
          )}
        >
          <div className={`mr-3 rounded-md bg-gradient-to-br ${gradients[color][0]}`}>
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          {children}
        </a>
      </li>
    )
  }
)

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
    <>
      <TopLevelLink
        href="/docs"
        isActive={current === '' || current === 'docs'}
        color="pink"
        className="mb-4"
        icon={
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 6C10.0929 6 11.1175 6.29218 12 6.80269V16.8027C11.1175 16.2922 10.0929 16 9 16C7.90714 16 6.88252 16.2922 6 16.8027V6.80269C6.88252 6.29218 7.90714 6 9 6Z"
              fill="#FFF1F2"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 6C16.0929 6 17.1175 6.29218 18 6.80269V16.8027C17.1175 16.2922 16.0929 16 15 16C13.9071 16 12.8825 16.2922 12 16.8027V6.80269C12.8825 6.29218 13.9071 6 15 6Z"
              fill="#FECDD3"
            />
          </>
        }
      >
        Documentation
      </TopLevelLink>
      <TopLevelLink
        href="https://tailwindui.com/components?utm_source=tailwindcss&utm_medium=navigation"
        color="violet"
        className="mb-4"
        icon={
          <>
            <path d="M6 9l6-3 6 3v6l-6 3-6-3V9z" fill="#F5F3FF" />
            <path d="M6 9l6 3v6l-6-3V9z" fill="#DDD6FE" />
            <path d="M18 9l-6 3v6l6-3V9z" fill="#C4B5FD" />
          </>
        }
      >
        Components
      </TopLevelLink>
      <TopLevelLink
        href="https://play.tailwindcss.com"
        color="amber"
        className="mb-4"
        icon={
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.196 6.02a1 1 0 01.785 1.176l-2 10a1 1 0 01-1.961-.392l2-10a1 1 0 011.176-.784z"
              fill="#FDE68A"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.293 9.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L16.586 12l-1.293-1.293a1 1 0 010-1.414zM8.707 9.293a1 1 0 010 1.414L7.414 12l1.293 1.293a1 1 0 11-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0z"
              fill="#FDF4FF"
            />
          </>
        }
      >
        Playground
      </TopLevelLink>
      <TopLevelLink
        href="https://blog.tailwindcss.com"
        color="teal"
        className="mb-4"
        icon={
          <>
            <path
              d="M8 9a1 1 0 011-1h8a1 1 0 011 1v7.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 018 16.5V9z"
              fill="#6EE7B7"
            />
            <path
              d="M15 7a1 1 0 00-1-1H7a1 1 0 00-1 1v9.5A1.5 1.5 0 007.5 18H16v-.085a1.5 1.5 0 01-1-1.415V7z"
              fill="#ECFDF5"
            />
            <path fill="#A7F3D0" d="M8 8h5v4H8zM8 14h5v2H8z" />
          </>
        }
      >
        News
      </TopLevelLink>
      <TopLevelLink
        href="/resources"
        isActive={current === 'resources'}
        color="blue"
        className="mb-4"
        icon={
          <>
            <path d="M17 13a1 1 0 011 1v3a1 1 0 01-1 1H8.5a2.5 2.5 0 010-5H17z" fill="#93C5FD" />
            <path
              d="M12.743 7.722a1 1 0 011.414 0l2.122 2.121a1 1 0 010 1.414l-6.01 6.01a2.5 2.5 0 11-3.536-3.536l6.01-6.01z"
              fill="#BFDBFE"
            />
            <path d="M6 7a1 1 0 011-1h3a1 1 0 011 1v8.5a2.5 2.5 0 01-5 0V7z" fill="#EFF6FF" />
            <path d="M9.5 15.5a1 1 0 11-2 0 1 1 0 012 0z" fill="#60A5FA" />
          </>
        }
      >
        Resources
      </TopLevelLink>
      <TopLevelLink
        href="https://www.youtube.com/tailwindlabs"
        color="purple"
        className="mb-10"
        icon={
          <>
            <circle cx="12" cy="12" r="7" fill="#F3E8FF" />
            <path
              d="M14.52 11.136a1 1 0 010 1.728l-3.016 1.759A1 1 0 0110 13.759v-3.518a1 1 0 011.504-.864l3.015 1.76z"
              fill="#C084FC"
            />
          </>
        }
      >
        Screencasts
      </TopLevelLink>
    </>
  )
}

export function SidebarLayout({ children, navIsOpen, setNavIsOpen, nav, sidebar, fallbackHref }) {
  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <div className="w-full max-w-8xl mx-auto">
        <div className="lg:flex">
          <div
            id="sidebar"
            onClick={() => setNavIsOpen(false)}
            className={clsx(
              'fixed z-40 inset-0 flex-none h-full bg-black bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block',
              {
                hidden: !navIsOpen,
              }
            )}
          >
            <div
              id="navWrapper"
              onClick={(e) => e.stopPropagation()}
              className="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent overflow-hidden lg:top-18 bg-white mr-24 lg:mr-0"
            >
              <div className="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white" />
              <Nav nav={nav} fallbackHref={fallbackHref}>
                {sidebar}
              </Nav>
            </div>
          </div>
          <div
            id="content-wrapper"
            className={clsx(
              'min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible',
              {
                'overflow-hidden max-h-screen fixed': navIsOpen,
              }
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
