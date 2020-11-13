import { DocumentationLayout } from '@/layouts/DocumentationLayout'
import { gradients } from '@/utils/gradients'
import { ReactComponent as ScreencastsImage } from '@/img/screencasts.svg'
import { ReactComponent as GuidesImage } from '@/img/guides.svg'
import Link from 'next/link'
import clsx from 'clsx'
import tinytime from 'tinytime'

const whatsNew = [
  {
    title: 'Focus Ring Utilities',
    version: '2.0+',
  },
  { title: 'Dark Mode', version: '2.0+' },
  { title: 'Extended Color Palette', version: '2.0+' },
  { title: 'Extend Variants', version: '2.0+' },
  {
    title: 'Extra Wide Breakpoint',
    version: '2.0+',
  },
  { title: 'Sharable Presets' },
  {
    title: 'Gradients',
  },
  { title: 'Animations' },
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
                <p className="font-medium text-violet-100 text-shadow mb-4">
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
              <div className="relative z-10 p-8 pb-0">
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
              <div className="relative mt-auto" style={{ paddingTop: `${(180 / 309) * 100}%` }}>
                <div
                  className="absolute bottom-0 left-0 w-full"
                  style={{ paddingTop: `${(238 / 341) * 100}%` }}
                >
                  <ScreencastsImage className="absolute inset-0 w-full h-full overflow-visible" />
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
        <ul className="grid grid-cols-4 gap-8 font-semibold text-gray-900">
          {whatsNew.map((item) => (
            <li key={item.title} className="flex">
              <Link href="/">
                <a className="relative rounded-xl border border-black border-opacity-5 shadow-sm flex justify-center w-full pt-8 pb-6 px-6">
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
        <ul className="grid grid-cols-2 gap-8">
          <li>
            <a href="#" className="flex items-start space-x-4">
              <svg fill="currentColor" className="flex-none text-gray-900 w-12 h-12">
                <rect width="48" height="48" rx="12" />
                <path
                  d="M23.997 12a12 12 0 00-3.792 23.388c.6.12.816-.264.816-.576l-.012-2.04c-3.336.72-4.044-1.608-4.044-1.608-.552-1.392-1.332-1.764-1.332-1.764-1.08-.744.084-.72.084-.72 1.2.084 1.836 1.236 1.836 1.236 1.08 1.824 2.808 1.296 3.492.996.12-.78.42-1.308.756-1.608-2.664-.3-5.46-1.332-5.46-5.928 0-1.32.468-2.388 1.236-3.228a4.32 4.32 0 01.12-3.168s1.008-.324 3.3 1.224a11.496 11.496 0 016 0c2.292-1.56 3.3-1.224 3.3-1.224.66 1.644.24 2.88.12 3.168.768.84 1.236 1.92 1.236 3.228 0 4.608-2.808 5.616-5.484 5.916.432.372.816 1.104.816 2.22l-.012 3.3c0 .312.216.696.828.576A12 12 0 0023.997 12z"
                  className="text-gray-50"
                />
              </svg>
              <div className="flex-auto">
                <h3 className="font-bold text-gray-900">GitHub Discussions</h3>
                <p>Connect with members of the Tailwind CSS community.</p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start space-x-4">
              <svg fill="currentColor" className="text-indigo-400 w-12 h-12">
                <rect width="48" height="48" rx="12" />
                <path
                  d="M21.637 23.57c-.745 0-1.332.653-1.332 1.45 0 .797.6 1.45 1.332 1.45.744 0 1.332-.653 1.332-1.45.013-.797-.588-1.45-1.332-1.45zm4.767 0c-.744 0-1.332.653-1.332 1.45 0 .797.6 1.45 1.332 1.45.745 0 1.332-.653 1.332-1.45 0-.797-.587-1.45-1.332-1.45z"
                  className="text-indigo-50"
                />
                <path
                  d="M32.75 12.613H15.248a2.684 2.684 0 00-2.678 2.69v17.66a2.684 2.684 0 002.678 2.69h14.811l-.692-2.416 1.672 1.554 1.58 1.463 2.809 2.482V15.304a2.684 2.684 0 00-2.678-2.69zm-5.042 17.058s-.47-.561-.862-1.058c1.711-.483 2.364-1.554 2.364-1.554-.535.353-1.045.6-1.502.77a8.591 8.591 0 01-1.894.562 9.151 9.151 0 01-3.383-.013 10.964 10.964 0 01-1.92-.561 7.652 7.652 0 01-.953-.445c-.04-.026-.078-.039-.117-.065-.027-.013-.04-.026-.053-.039-.235-.13-.365-.222-.365-.222s.627 1.045 2.285 1.541c-.392.497-.875 1.084-.875 1.084-2.886-.091-3.983-1.985-3.983-1.985 0-4.206 1.88-7.615 1.88-7.615C20.211 18.661 22 18.7 22 18.7l.131.157c-2.35.679-3.435 1.71-3.435 1.71s.287-.156.77-.378c1.398-.614 2.508-.784 2.965-.823.079-.013.144-.026.223-.026a10.647 10.647 0 016.57 1.228s-1.033-.98-3.253-1.66l.183-.208s1.79-.04 3.67 1.371c0 0 1.881 3.41 1.881 7.615 0 0-1.11 1.894-3.997 1.985z"
                  className="text-indigo-50"
                />
              </svg>
              <div className="flex-auto">
                <h3 className="font-bold text-gray-900">Discord</h3>
                <p>Join our Discord group to chat with other Tailwind users.</p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start space-x-4">
              <svg fill="currentColor" className="text-light-blue-400 w-12 h-12">
                <rect width="48" height="48" rx="12" />
                <path
                  d="M37.127 15.989h-.001a11.04 11.04 0 01-3.093.836 5.336 5.336 0 002.37-2.932 10.815 10.815 0 01-3.421 1.284 5.42 5.42 0 00-3.933-1.679c-2.976 0-5.385 2.373-5.385 5.3-.003.406.044.812.138 1.207a15.351 15.351 0 01-11.102-5.54 5.235 5.235 0 00-.733 2.663c0 1.837.959 3.461 2.406 4.413a5.338 5.338 0 01-2.449-.662v.066c0 2.57 1.86 4.708 4.32 5.195a5.55 5.55 0 01-1.418.186c-.34 0-.68-.033-1.013-.099.684 2.106 2.676 3.637 5.034 3.68a10.918 10.918 0 01-6.69 2.269 11.21 11.21 0 01-1.285-.077 15.237 15.237 0 008.242 2.394c9.918 0 15.337-8.077 15.337-15.083 0-.23-.006-.459-.017-.683a10.864 10.864 0 002.686-2.746l.007.008z"
                  className="text-light-blue-50"
                />
              </svg>
              <div className="flex-auto">
                <h3 className="font-bold text-gray-900">Twitter</h3>
                <p>Follow the Tailwind Twitter account for news and updates.</p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start space-x-4">
              <svg fill="currentColor" className="text-red-500 w-12 h-12">
                <rect width="48" height="48" rx="12" />
                <path
                  d="M36.83 18.556c0-2.285-1.681-4.124-3.758-4.124a184.713 184.713 0 00-8.615-.182h-.914c-2.925 0-5.799.05-8.612.183-2.072 0-3.753 1.848-3.753 4.133A75.6 75.6 0 0011 23.99a78.487 78.487 0 00.173 5.429c0 2.285 1.68 4.139 3.753 4.139 2.955.137 5.987.198 9.07.192 3.087.01 6.11-.054 9.069-.193 2.077 0 3.758-1.853 3.758-4.138.121-1.813.177-3.62.172-5.434a73.982 73.982 0 00-.165-5.428zM21.512 28.97v-9.979l7.363 4.987-7.363 4.992z"
                  className="text-red-50"
                />
              </svg>
              <div className="flex-auto">
                <h3 className="font-bold text-gray-900">YouTube</h3>
                <p>Watch screencasts and feature tutorials of Tailwind.</p>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

DocsLandingPage.layoutProps = {
  meta: {},
  Layout: DocumentationLayout,
}
