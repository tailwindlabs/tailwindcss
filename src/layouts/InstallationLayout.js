import { BasicLayout } from '@/layouts/BasicLayout'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconContainer } from '@/components/home/common'

let tabs = {
  'Tailwind CLI': '/docs/installation',
  'Using PostCSS': '/docs/installation/using-postcss',
  'Framework Guides': '/docs/installation/framework-guides',
  'Play CDN': '/docs/installation/play-cdn',
}

let readNext = [
  {
    title: 'Utility-First Fundamentals',
    href: '/docs/utility-first',
    body: () => (
      <p>
        Using a utility-first workflow to build complex components from a constrained set of
        primitive utilities.
      </p>
    ),
    icon: {
      className: 'dark:bg-indigo-500 dark:highlight-white/20',
      light: require('@/img/icons/home/utility-first.png').default,
      dark: require('@/img/icons/home/dark/utility-first.png').default,
    },
  },
  {
    title: 'Responsive Design',
    href: '/docs/responsive-design',
    body: () => (
      <p>
        Build fully responsive user interfaces that adapt to any screen size using responsive
        modifiers.
      </p>
    ),
    icon: {
      className: 'dark:bg-indigo-500 dark:highlight-white/20',
      light: require('@/img/icons/home/mobile-first.png').default,
      dark: require('@/img/icons/home/dark/mobile-first.png').default,
    },
  },
  {
    title: 'Hover, Focus & Other States',
    href: '/docs/hover-focus-and-other-states',
    body: () => (
      <p>
        Style elements in interactive states like hover, focus, and more using conditional
        modifiers.
      </p>
    ),
    icon: {
      className: 'dark:bg-blue-500 dark:highlight-white/20',
      light: require('@/img/icons/home/state-variants.png').default,
      dark: require('@/img/icons/home/dark/state-variants.png').default,
    },
  },
  {
    title: 'Dark Mode',
    href: '/docs/dark-mode',
    body: () => (
      <p>Optimize your site for dark mode directly in your HTML using the dark mode modifier.</p>
    ),
    icon: {
      className: 'dark:bg-gray-600 dark:highlight-white/20',
      light: require('@/img/icons/home/dark-mode.png').default,
      dark: require('@/img/icons/home/dark/dark-mode.png').default,
    },
  },
  {
    title: 'Reusing Styles',
    href: '/docs/reusing-styles',
    body: () => (
      <p>
        Manage duplication and keep your projects maintainable by creating reusable abstractions.
      </p>
    ),
    icon: {
      className: 'dark:bg-sky-500 dark:highlight-white/20',
      light: require('@/img/icons/home/component-driven.png').default,
      dark: require('@/img/icons/home/dark/component-driven.png').default,
    },
  },
  {
    title: 'Customizing the Framework',
    href: '/docs/adding-custom-styles',
    body: () => (
      <p>Customize the framework to match your brand and extend it with your own custom styles.</p>
    ),
    icon: {
      className: 'dark:bg-pink-500 dark:highlight-white/30',
      light: require('@/img/icons/home/customization.png').default,
      dark: require('@/img/icons/home/dark/customization.png').default,
    },
  },
]

export function InstallationLayout({ children }) {
  let router = useRouter()

  return (
    <BasicLayout>
      <header id="header" className="mb-10 md:flex md:items-start">
        <div className="flex-auto max-w-4xl">
          <p className="mb-4 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
            Installation
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
            Get started with Tailwind CSS
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">
            Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any
            other templates for class names, generating the corresponding styles and then writing
            them to a static CSS file.
          </p>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-400">
            It's fast, flexible, and reliable — with zero-runtime.
          </p>
        </div>
      </header>
      <section className="mb-16 relative">
        <div className="relative z-10">
          <h2
            data-docsearch-ignore
            className="text-gray-900 text-xl tracking-tight font-bold mb-3 dark:text-gray-200"
          >
            Installation
          </h2>
          <div className="flex overflow-auto mb-6 -mx-4 sm:-mx-6">
            <div className="flex-none min-w-full px-4 sm:px-6">
              <ul className="border-b border-gray-200 space-x-6 flex whitespace-nowrap dark:border-gray-200/5">
                {Object.entries(tabs).map(([name, href]) => (
                  <li key={name}>
                    <h2>
                      <Link href={href} scroll={false}>
                        <a
                          className={clsx(
                            'flex text-sm leading-6 font-semibold pt-3 pb-2.5 border-b-2 -mb-px',
                            href === router.pathname
                              ? 'text-sky-500 border-current'
                              : 'text-gray-900 border-transparent hover:border-gray-300 dark:text-gray-200 dark:hover:border-gray-700'
                          )}
                        >
                          {name}
                        </a>
                      </Link>
                    </h2>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {children}
      </section>

      <section className="relative">
        <h2 className="text-gray-900 text-xl tracking-tight font-bold mb-3 dark:text-gray-200">
          What to read next
        </h2>
        <div className="mb-10 max-w-2xl prose xl:mb-0 dark:prose-dark">
          <p>
            Get familiar with some of the core concepts that make Tailwind CSS different from
            writing traditional CSS.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-x-16 gap-y-8 xl:grid-cols-2 xl:gap-y-10">
          {readNext.map((item) => (
            <li key={item.title} className="relative flex items-start">
              <IconContainer
                className={clsx('flex-none', item.icon.className)}
                light={item.icon.light}
                dark={item.icon.dark}
              />
              <div className="peer group flex-auto ml-6">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-200">
                  <Link href={item.href}>
                    <a className="before:absolute before:-inset-3 before:rounded-2xl sm:before:-inset-4">
                      {item.title}
                      <svg
                        viewBox="0 0 3 6"
                        className="ml-3 w-auto h-1.5 overflow-visible inline -mt-px text-gray-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </Link>
                </h3>
                <div className="prose prose-sm text-gray-600 dark:prose-dark">
                  <item.body />
                </div>
              </div>
              <div className="absolute -z-10 -inset-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 opacity-0 peer-hover:opacity-100 sm:-inset-4" />
            </li>
          ))}
        </ul>
      </section>
    </BasicLayout>
  )
}
