import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import { ReactComponent as ScreencastsImage } from '@/img/screencasts.svg'
import { ReactComponent as GuidesImage } from '@/img/guides.svg'
import { ReactComponent as PlayImage } from '@/img/play.svg'
import { ReactComponent as TuiLogo } from '@/img/tailwind-ui-logo-on-dark.svg'
import Link from 'next/link'
import clsx from 'clsx'
import tinytime from 'tinytime'
import { Community } from '@/components/Community'
import styles from './index.module.css'
import { Widont } from '@/components/Widont'
import { ReactComponent as TuiBundleLogo } from '@/img/tailwind-ui-bundle-logo.svg'
import { ReactComponent as RefactoringUiCompleteLogo } from '@/img/refactoring-ui-complete-logo.svg'

const whatsNew = [
  {
    title: 'Focus Ring Utilities',
    version: '2.0+',
    image: require('@/img/docs/focus-ring.svg').ReactComponent,
    href: '/docs/ring-width',
  },
  {
    title: 'Dark Mode',
    version: '2.0+',
    image: require('@/img/docs/dark-mode.svg').ReactComponent,
    href: '/docs/dark-mode',
  },
  {
    title: 'Extended Color Palette',
    version: '2.0+',
    image: require('@/img/docs/color-palette.svg').ReactComponent,
    href: '/docs/customizing-colors#color-palette-reference',
  },
  {
    title: 'Extend Variants',
    version: '2.0+',
    image: require('@/img/docs/extend-variants.svg').ReactComponent,
    href: '/docs/configuring-variants#enabling-extra-variants',
  },
  {
    title: 'Extra Wide Breakpoint',
    version: '2.0+',
    image: require('@/img/docs/breakpoint.svg').ReactComponent,
    href: '/docs/breakpoints',
  },
  {
    title: 'Shareable Presets',
    image: require('@/img/docs/shareable-presets.svg').ReactComponent,
    href: '/docs/presets',
  },
  {
    title: 'Gradients',
    image: require('@/img/docs/gradients.svg').ReactComponent,
    href: '/docs/gradient-color-stops',
  },
  {
    title: 'Animations',
    image: require('@/img/docs/animations.svg').ReactComponent,
    href: '/docs/animation',
  },
]

const latestUpdates = [
  {
    title: 'Tailwind CSS v2.1',
    date: '2021-04-05T19:00:00.000Z',
    url: 'https://blog.tailwindcss.com/tailwindcss-2-1',
    description:
      'We just released Tailwind CSS v2.1 which brings the new JIT engine to core, adds first-class CSS filter support, and more!',
  },
  {
    title: 'Just-In-Time: The Next Generation of Tailwind CSS',
    date: '2021-03-15T16:30:00.000Z',
    url: 'https://blog.tailwindcss.com/just-in-time-the-next-generation-of-tailwind-css',
    description:
      "One of the hardest constraints we've had to deal with as we've improved Tailwind CSS over the years is the generated file size in development. With enough customizations to your config file, the generated CSS can reach 10mb or more, and there's only so much CSS that build tools and even the browser itself will comfortably tolerate.",
  },
  {
    title: 'Welcoming James McDonald to Tailwind Labs',
    date: '2021-03-08T19:00:00.0Z',
    url: 'https://blog.tailwindcss.com/welcoming-james-mcdonald-to-tailwind-labs',
    description: `Many years ago I got a message from Steve that said something like "Have I ever shared this guy's Dribbble profile with you before? Been following him forever, some of my absolute favorite work I've ever found." That person was James McDonald, and today we're totally over the moon to share that James is joining our team full-time.`,
  },
  {
    title: '"Tailwind CSS: From Zero to Production" on YouTube',
    date: '2021-02-16T16:05:00.000Z',
    url: 'https://blog.tailwindcss.com/tailwindcss-from-zero-to-production',
    description:
      "Today we're excited to release Tailwind CSS: From Zero to Production, a new screencast series that teaches you everything you need to know to get up and running with Tailwind CSS v2.0 from scratch.",
  },
  {
    title: 'Welcoming David Luhr to Tailwind Labs',
    date: '2021-02-01T13:35:00.0Z',
    url: 'https://blog.tailwindcss.com/welcoming-david-luhr-to-tailwind-labs',
    description:
      "We started working with David Luhr last summer on a project-by-project basis to help us develop a Figma version of Tailwind UI (almost ready!), as well as to leverage his accessibility expertise when building Tailwind UI templates, ensuring we were following best practices and delivering markup that would work for everyone, no matter what tools they use to browse the web. Today we're excited to share that David has joined the team full-time!",
  },
  {
    title: 'Multi-line truncation with @tailwindcss/line-clamp',
    date: '2021-01-24T20:00:00Z',
    url: 'https://blog.tailwindcss.com/multi-line-truncation-with-tailwindcss-line-clamp',
    description:
      "Imagine you're implementing a beautiful design you or someone on your team carefully crafted in Figma. You've nailed all the different layouts at each breakpoint, perfected the whitespace and typography, and the photography you're using is really bringing the design to life.",
  },
  {
    title: 'Tailwind CSS v2.0',
    date: '2020-11-18T17:45:00.000Z',
    url: 'https://blog.tailwindcss.com/tailwindcss-v2',
    description:
      "Today we're finally releasing Tailwind CSS v2.0, including an all-new color palette, dark mode support, and tons more!",
  },
]

const formatDate = tinytime('{MM} {DD}, {YYYY}').render

export default function DocsLandingPage() {
  return (
    <div className="px-4 sm:px-6 xl:px-8 pt-10 pb-16">
      <h1 className="text-5xl leading-none font-extrabold text-gray-900 tracking-tight mb-4">
        Getting started with Tailwind CSS
      </h1>
      <p className="text-2xl tracking-tight mb-10">
        Learn Tailwind the way that best matches your learning style.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        <section className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.violet[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Read the docs</h2>
                <p className="font-medium text-violet-100 text-shadow mb-4">
                  Learn how to get Tailwind set up in your project.
                </p>
                <Link href="/docs/installation">
                  <a className="mt-auto bg-violet-800 bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200 rounded-xl font-semibold py-2 px-4 inline-flex">
                    Start learning
                  </a>
                </Link>
              </div>
              <div className={`${styles.image} relative md:pl-6 xl:pl-8 hidden sm:block`}>
                <GuidesImage className="absolute top-6 left-6 md:static overflow-visible" />
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-20 hidden sm:block"
              style={{
                background: 'linear-gradient(to top, rgb(135, 94, 245), rgba(135, 94, 245, 0))',
              }}
            />
          </div>
        </section>
        <section className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.pink[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Try it in the browser</h2>
                <p className="font-medium text-rose-100 text-shadow mb-4">
                  Build something with Tailwind in our online playground.
                </p>
                <a
                  href="https://play.tailwindcss.com/"
                  className="mt-auto bg-rose-900 bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200 rounded-xl font-semibold py-2 px-4 inline-flex"
                >
                  Start building
                </a>
              </div>
              <div className={`${styles.image} relative md:pl-6 xl:pl-8 hidden sm:block`}>
                <PlayImage className="absolute top-6 left-6 md:static overflow-visible" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-rose-500 hidden sm:block" />
          </div>
        </section>
        <section className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.amber[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Watch the screencasts</h2>
                <p className="font-medium text-amber-100 text-shadow mb-4">
                  Learn more about Tailwind directly from the team on our channel.
                </p>
                <Link href="https://www.youtube.com/tailwindlabs">
                  <a className="mt-auto bg-amber-900 bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200 rounded-xl font-semibold py-2 px-4 inline-flex">
                    Start watching
                  </a>
                </Link>
              </div>
              <div className={`${styles.image} relative hidden sm:block`}>
                <div className="absolute left-2 bottom-3 xl:bottom-5">
                  <ScreencastsImage className="overflow-visible" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-500 hidden sm:block" />
          </div>
        </section>
        <section className="md:col-span-3 flex flex-wrap md:flex-nowrap items-center bg-gray-800 shadow-lg rounded-2xl py-6 md:py-4 px-6 md:pr-5 space-y-4 md:space-y-0 md:space-x-8">
          <h2 className="flex-none">
            <span className="sr-only">Tailwind UI</span>
            <TuiLogo className="w-40 h-auto" />
          </h2>
          <p className="flex-auto text-white text-lg font-medium">
            <Widont>Beautiful UI components, crafted by the creators of Tailwind CSS</Widont>
          </p>
          <a
            href="https://tailwindui.com/components"
            className="flex-none bg-white hover:bg-gray-100 transition-colors duration-200 text-gray-900 font-semibold rounded-lg py-3 px-4"
          >
            Browse components
          </a>
        </section>
      </div>
      <section>
        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 mt-16 mb-8">
          What’s new in Tailwind
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 font-semibold text-gray-900 text-center">
          {whatsNew.map((item) => (
            <li key={item.title} className="flex">
              <Link href={item.href}>
                <a className="relative rounded-xl ring-1 ring-black ring-opacity-5 shadow-sm w-full pt-8 pb-6 px-6">
                  {item.image && <item.image className="h-auto max-w-full mx-auto mb-3" />}
                  {item.title}
                  {item.version && (
                    <span className="absolute top-2 right-2 bg-fuchsia-100 text-fuchsia-600 rounded-full text-xs py-0.5 px-2">
                      {item.version}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <header className="flex items-center justify-between mt-16 mb-8">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900">Latest Updates</h2>
          <a href="https://blog.tailwindcss.com" className="font-medium text-gray-900">
            View all the latest updates
          </a>
        </header>
        <ul className="bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6">
          {latestUpdates.map((item, i) => (
            <li key={item.title}>
              <article>
                <a
                  href={item.url}
                  className="grid md:grid-cols-8 xl:grid-cols-9 items-start relative rounded-xl p-3 sm:p-5 xl:p-6 overflow-hidden hover:bg-white"
                >
                  <h3 className="font-semibold text-gray-900 md:col-start-3 md:col-span-6 xl:col-start-3 xl:col-span-7 mb-1 ml-9 md:ml-0">
                    {item.title}
                  </h3>
                  <time
                    dateTime={item.date}
                    className="md:col-start-1 md:col-span-2 row-start-1 md:row-end-3 flex items-center font-medium mb-1 md:mb-0"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className={clsx('w-3 h-3 mr-6 overflow-visible', {
                        'text-gray-300': i !== 0,
                        'text-cyan-400': i === 0,
                      })}
                    >
                      <circle cx="6" cy="6" r="6" fill="currentColor" />
                      {i === 0 && (
                        <circle
                          cx="6"
                          cy="6"
                          r="11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      )}
                      {i !== 0 && (
                        <path
                          d="M 6 -6 V -30"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="text-gray-200"
                        />
                      )}
                      {i !== latestUpdates.length - 1 && (
                        <path
                          d="M 6 18 V 500"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="text-gray-200"
                        />
                      )}
                    </svg>
                    {formatDate(new Date(item.date))}
                  </time>
                  <p className="md:col-start-3 md:col-span-6 xl:col-span-7 ml-9 md:ml-0">
                    {item.description}
                  </p>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 mt-16 mb-8">
          Get involved
        </h2>
        <Community />
      </section>
    </div>
  )
}

DocsLandingPage.layoutProps = {
  meta: {
    title: 'Documentation',
  },
  Layout: DocumentationLayout,
}
