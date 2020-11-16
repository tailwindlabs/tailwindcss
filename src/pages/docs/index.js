import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import { ReactComponent as ScreencastsImage } from '@/img/screencasts.svg'
import { ReactComponent as GuidesImage } from '@/img/guides.svg'
import { ReactComponent as PlayImage } from '@/img/play.svg'
import Link from 'next/link'
import clsx from 'clsx'
import tinytime from 'tinytime'
import { Community } from '@/components/Community'
import styles from './index.module.css'

const whatsNew = [
  {
    title: 'Focus Ring Utilities',
    version: '2.0+',
    image: require('@/img/docs/focus-ring.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Dark Mode',
    version: '2.0+',
    image: require('@/img/docs/dark-mode.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Extended Color Palette',
    version: '2.0+',
    image: require('@/img/docs/color-palette.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Extend Variants',
    version: '2.0+',
    image: require('@/img/docs/extend-variants.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Extra Wide Breakpoint',
    version: '2.0+',
    image: require('@/img/docs/breakpoint.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Sharable Presets',
    image: require('@/img/docs/sharable-presets.svg').ReactComponent,
    href: '/',
  },
  {
    title: 'Gradients',
    image: require('@/img/docs/gradients.svg').ReactComponent,
    href: '/',
  },
  { title: 'Animations', image: require('@/img/docs/animations.svg').ReactComponent, href: '/' },
]

const latestUpdates = [
  {
    title: 'Tailwind CSS v1.9.0',
    date: '2020-10-13',
    url: 'https://blog.tailwindcss.com/tailwindcss-1-9',
    description:
      'We just released Tailwind CSS v1.9 which adds support for configuration presets, useful new CSS grid utilities, extended border radius, rotate, and skew scales, helpful accessibility improvements, and more!',
  },
  {
    title: 'Introducing Tailwind Play',
    date: '2020-10-07',
    url: 'https://blog.tailwindcss.com/introducing-tailwind-play',
    description:
      "Today we're excited to release the first version of Tailwind Play, an advanced online playground for Tailwind CSS that lets you use all of Tailwind's build-time features directly in the browser.",
  },
  {
    title: 'Headless UI: Unstyled, Accessible UI Components',
    date: '2020-10-06',
    url: 'https://blog.tailwindcss.com/headless-ui-unstyled-accessible-ui-components',
    description:
      'Headless UI is a set of completely unstyled, fully accessible UI components for React, Vue, and Alpine.js that make it easy to build fully accessible custom UI components, without sacrificing the ability to style them from scratch with simple utility classes.',
  },
]

const formatDate = tinytime('{MM} {DD}, {YYYY}').render

export default function DocsLandingPage() {
  return (
    <div className="px-4 sm:px-6 xl:px-8 pt-10 pb-16">
      <h1 className="text-5xl leading-none font-extrabold text-gray-900 mb-4">
        Getting started with Tailwind CSS
      </h1>
      <p className="text-2xl mb-10">
        Learn Tailwind the way that best matches your learning style.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        <div className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.violet[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Read the guides</h2>
                <p className="font-medium text-violet-100 text-shadow mb-4">
                  Learn how to get Tailwind set up with your favorite tools.
                </p>
                <Link href="/">
                  <a className="mt-auto bg-violet-800 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex">
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
        </div>
        <div className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.pink[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Try it in the browser</h2>
                <p className="font-medium text-rose-100 text-shadow mb-4">
                  Build something with Tailwind in our online playground.
                </p>
                <a
                  href="https://play.tailwindcss.com/"
                  className="mt-auto bg-rose-900 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex"
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
        </div>
        <div className="flex">
          <div className="w-full relative text-white overflow-hidden rounded-3xl flex shadow-lg">
            <div className={`w-full flex md:flex-col bg-gradient-to-br ${gradients.amber[0]}`}>
              <div className="sm:max-w-sm sm:flex-none md:w-auto md:flex-auto flex flex-col items-start relative z-10 p-6 xl:p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Watch the screencasts</h2>
                <p className="font-medium text-amber-100 text-shadow mb-4">
                  Build something with Tailwind in our online playground.
                </p>
                <Link href="/">
                  <a className="mt-auto bg-amber-900 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex">
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
        </div>
      </div>
      <section>
        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 mt-16 mb-8">
          What’s new in Tailwind
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 font-semibold text-gray-900 text-center">
          {whatsNew.map((item) => (
            <li key={item.title} className="flex">
              <Link href={item.href}>
                <a className="relative rounded-xl border border-black border-opacity-5 shadow-sm w-full pt-8 pb-6 px-6">
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
  meta: {},
  Layout: DocumentationLayout,
}
