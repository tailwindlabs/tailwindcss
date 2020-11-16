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
import { Search } from '@/components/Search'
import { Hero } from '@/components/home/Hero'
import { BigText, Link, Paragraph, Widont } from '@/components/home/common'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/home/Footer'
import NextLink from 'next/link'

function NpmInstallButton() {
  const [state, setState] = useState('idle')

  useEffect(() => {
    let current = true
    if (state === 'copying') {
      navigator.clipboard
        .writeText('npm install tailwindcss')
        .then(() => {
          if (current) {
            setState('copied')
          }
        })
        .catch(() => {
          if (current) {
            setState('error')
          }
        })
    } else if (state === 'copied' || state === 'error') {
      window.setTimeout(() => {
        if (current) {
          setState('idle')
        }
      }, 2000)
    }
    return () => (current = false)
  }, [state])

  return (
    <button
      type="button"
      className="w-full sm:w-auto flex-none bg-gray-50 text-gray-400 font-mono leading-6 py-3 sm:px-6 border border-gray-200 rounded-xl flex items-center justify-center space-x-2 sm:space-x-4"
      onClick={() => setState('copying')}
    >
      <span className="text-black">
        <span className="hidden sm:inline text-gray-500" aria-hidden="true">
          ${' '}
        </span>
        npm install tailwindcss
      </span>
      <span className="sr-only">(click to copy to clipboard)</span>
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M8 16c0 1.886 0 2.828.586 3.414C9.172 20 10.114 20 12 20h4c1.886 0 2.828 0 3.414-.586C20 18.828 20 17.886 20 16v-4c0-1.886 0-2.828-.586-3.414C18.828 8 17.886 8 16 8m-8 8h4c1.886 0 2.828 0 3.414-.586C16 14.828 16 13.886 16 12V8m-8 8c-1.886 0-2.828 0-3.414-.586C4 14.828 4 13.886 4 12V8c0-1.886 0-2.828.586-3.414C5.172 4 6.114 4 8 4h4c1.886 0 2.828 0 3.414.586C16 5.172 16 6.114 16 8" />
      </svg>
    </button>
  )
}

export default function Home() {
  return (
    <div className="space-y-44 overflow-hidden b">
      <header className="relative z-10 max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="px-4 sm:px-6 md:px-8 mb-20 xl:mb-8">
          <div className="border-b border-gray-200 py-6 flex items-center justify-between mb-20 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Search />
            <a
              href="https://github.com/tailwindlabs/tailwindcss"
              className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="sr-only">Tailwind CSS on GitHub</span>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </a>
          </div>
          <Logo className="w-auto h-7 sm:h-8" />
          <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-none font-extrabold tracking-tight text-black mt-14 mb-10">
            Rapidly build modern websites without ever leaving your HTML.
          </h1>
          <p className="max-w-screen-lg text-lg sm:text-2xl sm:leading-10 font-medium mb-11">
            A utility-first CSS framework packed with classes like flex, pt-4, text-center and
            rotate-90 that can be composed to build any design, directly in your markup.
          </p>
          <div className="flex flex-wrap space-y-4 sm:space-y-0 sm:space-x-4 text-center">
            <NextLink href="/docs">
              <a className="w-full sm:w-auto flex-none bg-black text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl">
                Get started
              </a>
            </NextLink>
            <NpmInstallButton />
          </div>
        </div>
        <Hero />
      </header>
      <section className="relative z-10 text-center max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="px-4 sm:px-6 md:px-8">
          <BigText as="h2" className="mb-8">
            <Widont>“Best practices” don’t actually work.</Widont>
          </BigText>
          <Paragraph className="mx-auto mb-6">
            I've written a few thousand words on why traditional "semantic class names" are the
            reason CSS is hard to maintain, but the truth is you're never going to believe me until
            you actually try it. If you can suppress the initial gag reflex long enough to give it a
            chance, I promise you're in for a good time.
          </Paragraph>
          <Link href="#" className="text-light-blue-500">
            Read our pitch for utility-first CSS -&gt;
          </Link>
        </div>
      </section>
      <Testimonials />
      <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto space-y-44">
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
    </div>
  )
}
