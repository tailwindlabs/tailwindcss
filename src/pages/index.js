import { Testimonials } from '@/components/Testimonials'
import { DarkMode } from '@/components/home/DarkMode'
import { ConstraintBased } from '@/components/home/ConstraintBased'
import { BuildAnything } from '@/components/home/BuildAnything'
import { Performance } from '@/components/home/Performance'
import { MobileFirst } from '@/components/home/MobileFirst'
import { StateVariants } from '@/components/home/StateVariants'
import { ComponentDriven } from '@/components/home/ComponentDriven'
import { Customization } from '@/components/home/Customization'
import { ModernFeatures } from '@/components/home/ModernFeatures'
import { EditorTools } from '@/components/home/EditorTools'
import { ReadyMadeComponents } from '@/components/home/ReadyMadeComponents'
import { SearchButton } from '@/components/Search'
import { Hero } from '@/components/home/Hero'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/home/Footer'
import NextLink from 'next/link'
import Head from 'next/head'
import { NavItems, NavPopover } from '@/components/Header'

function Header() {
  return (
    <header className="relative">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 bottom-10 bg-gray-50">
          <img
            src={require('@/img/beams/hero@75.jpg').default}
            alt=""
            className="absolute bottom-0 left-1/2 w-[150rem] ml-[-75rem] max-w-none"
          />
          <div
            className="absolute inset-0 bg-grid-gray-900/[0.04]"
            style={{
              backgroundPosition: 'bottom 1px center',
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
            }}
          />
        </div>
        <div className="relative pt-6 lg:pt-8 flex items-center justify-between text-gray-700 font-semibold text-sm leading-6">
          <Logo className="w-auto h-5" />
          <div className="flex items-center">
            <SearchButton className="text-gray-500 w-8 h-8 -my-1 flex items-center justify-center md:hidden">
              <span className="sr-only">Search</span>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m19 19-3.5-3.5" />
                <circle cx="11" cy="11" r="6" />
              </svg>
            </SearchButton>
            <div className="-my-1 ml-2 -mr-1 md:hidden">
              <NavPopover />
            </div>
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-8">
                <NavItems />
              </ul>
            </nav>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
          <h1 className="text-gray-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Rapidly build modern websites without ever leaving your HTML.
          </h1>
          <p className="mt-6 text-lg text-gray-600 text-center max-w-3xl mx-auto">
            A utility-first CSS framework packed with classes like{' '}
            <code className="font-mono font-medium text-sky-500">flex</code>,{' '}
            <code className="font-mono font-medium text-sky-500">pt-4</code>,{' '}
            <code className="font-mono font-medium text-sky-500">text-center</code> and{' '}
            <code className="font-mono font-medium text-sky-500">rotate-90</code> that can be
            composed to build any design, directly in your markup.
          </p>
          <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
            <NextLink href="/docs/installation">
              <a className="bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto">
                Get started
              </a>
            </NextLink>
            <SearchButton className="hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-gray-900/10 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-gray-400">
              {({ actionKey }) => (
                <>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-none text-gray-300"
                    aria-hidden="true"
                  >
                    <path d="m19 19-3.5-3.5" />
                    <circle cx="11" cy="11" r="6" />
                  </svg>
                  <span className="flex-auto">Quick search...</span>
                  {actionKey && (
                    <kbd className="font-sans font-semibold">
                      <abbr title={actionKey[1]} className="no-underline text-gray-300">
                        {actionKey[0]}
                      </abbr>{' '}
                      K
                    </kbd>
                  )}
                </>
              )}
            </SearchButton>
          </div>
        </div>
      </div>
      <Hero />
    </header>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Tailwind CSS - Rapidly build modern websites without ever leaving your HTML."
        />
        <meta
          key="og:title"
          property="og:title"
          content="Tailwind CSS - Rapidly build modern websites without ever leaving your HTML."
        />
        <title>Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.</title>
      </Head>
      <div className="mb-20 space-y-20 overflow-hidden sm:mb-32 sm:space-y-32 md:mb-40 md:space-y-40">
        <Header />
        <section className="text-center px-8">
          <h2 className="text-gray-900 text-4xl tracking-tight font-extrabold sm:text-5xl">
            “Best practices” don’t actually work.
          </h2>
          <figure>
            <blockquote>
              <p className="mt-6 max-w-3xl mx-auto text-lg">
                I’ve written{' '}
                <a
                  href="https://adamwathan.me/css-utility-classes-and-separation-of-concerns/"
                  className="text-sky-500 font-semibold"
                >
                  a few thousand words
                </a>{' '}
                on why traditional “semantic class names” are the reason CSS is hard to maintain,
                but the truth is you’re never going to believe me until you actually try it. If you
                can suppress the urge to retch long enough to give it a chance, I really think
                you’ll wonder how you ever worked with CSS any other way.
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center space-x-4 text-left">
              <img
                src={require('@/img/adam.jpg').default}
                alt=""
                className="w-14 h-14 rounded-full"
                loading="lazy"
              />
              <div>
                <div className="text-gray-900 font-semibold">Adam Wathan</div>
                <div className="mt-0.5 text-sm leading-6">Creator of Tailwind CSS</div>
              </div>
            </figcaption>
          </figure>
        </section>
      </div>
      <Testimonials />
      <div className="pt-20 mb-20 space-y-20 overflow-hidden sm:pt-32 sm:mb-32 sm:space-y-32 md:pt-40 md:mb-40 md:space-y-40">
        <ConstraintBased />
        <BuildAnything />
        <Performance />
        <MobileFirst />
        <StateVariants />
        <ComponentDriven />
        <DarkMode />
        <Customization />
        <ModernFeatures />
        <EditorTools />
        <ReadyMadeComponents />
      </div>
      <Footer />
    </>
  )
}
