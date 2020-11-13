import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import { ReactComponent as ScreencastsImage } from '@/img/screencasts.svg'
import { ReactComponent as GuidesImage } from '@/img/guides.svg'
import Link from 'next/link'
import clsx from 'clsx'
import tinytime from 'tinytime'
import { Community } from '@/components/Community'

const whatsNew = [
  {
    title: 'Focus Ring Utilities',
    version: '2.0+',
    image: require('@/img/docs/focus-ring.svg').ReactComponent,
  },
  {
    title: 'Dark Mode',
    version: '2.0+',
    image: require('@/img/docs/dark-mode.svg').ReactComponent,
  },
  {
    title: 'Extended Color Palette',
    version: '2.0+',
    image: require('@/img/docs/color-palette.svg').ReactComponent,
  },
  {
    title: 'Extend Variants',
    version: '2.0+',
    image: require('@/img/docs/extend-variants.svg').ReactComponent,
  },
  {
    title: 'Extra Wide Breakpoint',
    version: '2.0+',
    image: require('@/img/docs/breakpoint.svg').ReactComponent,
  },
  { title: 'Sharable Presets', image: require('@/img/docs/sharable-presets.svg').ReactComponent },
  {
    title: 'Gradients',
    image: require('@/img/docs/gradients.svg').ReactComponent,
  },
  { title: 'Animations', image: require('@/img/docs/animations.svg').ReactComponent },
]

const latestUpdates = [
  {
    title: 'Tailwind CSS v1.9.0',
    date: '2020-11-17',
    description:
      'We just released Tailwind CSS v1.9 which adds support for configuration presets, useful new CSS grid utilities, extended border radius, rotate, and skew scales, helpful accessibility improvements, and more!',
  },
  {
    title: 'Introducing Tailwind Play',
    date: '2020-11-17',
    description:
      "Today we're excited to release the first version of Tailwind Play, an advanced online playground for Tailwind CSS that lets you use all of Tailwind's build-time features directly in the browser.",
  },
]

const formatDate = tinytime('{MM} {DD}, {YYYY}').render

export default function DocsLandingPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 pt-10">
      <h1 className="text-5xl leading-none font-extrabold text-gray-900 mb-4">
        Getting started with Tailwind CSS
      </h1>
      <p className="text-2xl mb-10">
        Learn Tailwind the way that best matches your learning style.
      </p>
      <div className="flex -mx-4">
        <div className="w-1/3 flex-none px-4 flex">
          <div className="relative text-white overflow-hidden rounded-3xl flex">
            <div className={`flex flex-col bg-gradient-to-br ${gradients.violet[0]}`}>
              <div className="relative z-10 p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Read the guides</h2>
                <p className="font-medium text-violet-100 text-shadow mb-4">
                  Learn how to get Tailwind set up with your favorite tools.
                </p>
                <Link href="/">
                  <a className="bg-violet-800 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex">
                    Start learning
                  </a>
                </Link>
              </div>
              <div className="pl-8 mt-auto">
                <div className="relative" style={{ paddingTop: `${(180 / 309) * 100}%` }}>
                  <GuidesImage className="absolute inset-0 w-full h-full overflow-visible" />
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-20"
              style={{
                background: 'linear-gradient(to top, rgb(135, 94, 245), rgba(135, 94, 245, 0))',
              }}
            />
          </div>
        </div>
        <div className="w-1/3 flex-none px-4 flex">
          <div className="relative text-white overflow-hidden rounded-3xl flex">
            <div className={`flex flex-col bg-gradient-to-br ${gradients.pink[0]}`}>
              <div className="relative z-10 p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Try it in the browser</h2>
                <p className="font-medium text-rose-100 text-shadow mb-4">
                  Build something with Tailwind in our online playground.
                </p>
                <Link href="/">
                  <a className="bg-rose-900 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex">
                    Start building
                  </a>
                </Link>
              </div>
              <div className="pl-8 mt-auto">
                <div className="relative" style={{ paddingTop: `${(180 / 309) * 100}%` }}>
                  <GuidesImage className="absolute inset-0 w-full h-full overflow-visible" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-rose-500" />
          </div>
        </div>
        <div className="w-1/3 flex-none px-4 flex">
          <div className="relative text-white overflow-hidden rounded-3xl flex">
            <div className={`flex flex-col bg-gradient-to-br ${gradients.amber[0]}`}>
              <div className="relative z-10 p-8">
                <h2 className="text-xl font-semibold mb-2 text-shadow">Watch the screencasts</h2>
                <p className="font-medium text-amber-100 text-shadow mb-4">
                  Build something with Tailwind in our online playground.
                </p>
                <Link href="/">
                  <a className="bg-amber-900 bg-opacity-50 rounded-xl font-semibold py-2 px-4 inline-flex">
                    Start watching
                  </a>
                </Link>
              </div>
              <div className="pl-8 mt-auto">
                <div className="relative" style={{ paddingTop: `${(180 / 309) * 100}%` }}>
                  <div className="absolute bottom-0 -left-8 right-0">
                    <div
                      className="absolute bottom-0 left-0 w-full"
                      style={{ paddingTop: `${(238 / 341) * 100}%` }}
                    >
                      <ScreencastsImage className="absolute inset-0 w-full h-full overflow-visible" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-500" />
          </div>
        </div>
      </div>
      <section>
        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 mt-16 mb-8">
          What’s new in Tailwind
        </h2>
        <ul className="grid grid-cols-4 gap-8 font-semibold text-gray-900 text-center">
          {whatsNew.map((item) => (
            <li key={item.title} className="flex">
              <Link href="/">
                <a className="relative rounded-xl border border-black border-opacity-5 shadow-sm w-full pt-8 pb-6 px-6">
                  {item.image && <item.image className="mx-auto mb-3" />}
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
        <ul className="bg-gray-50 rounded-3xl p-6">
          {latestUpdates.map((item, i) => (
            <li key={item.title}>
              <article>
                <a
                  href="#"
                  className="grid grid-cols-9 items-start relative rounded-xl p-6 overflow-hidden hover:bg-white"
                >
                  <h3 className="font-semibold text-gray-900 col-start-3 col-span-7 mb-1">
                    {item.title}
                  </h3>
                  <time
                    dateTime={item.date}
                    className="col-start-1 col-span-2 row-start-1 row-span-2 flex items-center font-medium"
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
                  <p className="col-start-3 col-span-7">{item.description}</p>
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
