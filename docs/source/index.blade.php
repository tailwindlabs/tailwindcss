@extends('_layouts.master')

@section('meta')
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@tailwindcss">
<meta name="twitter:title" content="Tailwind CSS">
<meta name="twitter:description" content="A utility-first CSS framework for rapidly building custom user interfaces.">
<meta name="twitter:image" content="https://tailwindcss.com/img/twitter-large-card.png">
<meta name="twitter:creator" content="@tailwindcss">
<meta property="og:url" content="https://tailwindcss.com/" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Tailwind CSS" />
<meta property="og:description" content="A utility-first CSS framework for rapidly building custom user interfaces." />
<meta property="og:image" content="https://tailwindcss.com/img/twitter-large-card.png" />
@endsection

@section('body')

<div class="flex flex-col">
  <div class="min-h-screen bg-pattern bg-center bg-grey-lighter border-t-6 border-tailwind-teal flex items-center justify-center leading-tight p-6 pb-16">
    <div>
      <div>
        <svg class="mx-auto block h-24 mb-3" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="b" cx="40" cy="40" r="40"/><filter x="-8.8%" y="-6.2%" width="117.5%" height="117.5%" filterUnits="objectBoundingBox" id="a"><feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1"/></filter><linearGradient x1="0%" y1="0%" y2="100%" id="c"><stop stop-color="#2383AE" offset="0%"/><stop stop-color="#6DD7B9" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(5 5)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#FFF" xlink:href="#b"/></g><path d="M25.6 33.92C27.52 26.24 32.32 22.4 40 22.4c11.52 0 12.96 8.64 18.72 10.08 3.84.96 7.2-.48 10.08-4.32-1.92 7.68-6.72 11.52-14.4 11.52-11.52 0-12.96-8.64-18.72-10.08-3.84-.96-7.2.48-10.08 4.32zM11.2 51.2c1.92-7.68 6.72-11.52 14.4-11.52 11.52 0 12.96 8.64 18.72 10.08 3.84.96 7.2-.48 10.08-4.32-1.92 7.68-6.72 11.52-14.4 11.52-11.52 0-12.96-8.64-18.72-10.08-3.84-.96-7.2.48-10.08 4.32z" fill="url(#c)" transform="translate(5 5)"/></g></svg>
        <h1 class="text-center font-semibold text-3xl tracking-tight mb-1">Tailwind <span class="tracking-tight">CSS</span></h1>
        <p class="text-center">
          <a href="https://github.com/tailwindcss/tailwindcss/releases" class="text-lg text-grey hover:text-grey-dark font-semibold tracking-tight">v{{ $page->version }}</a>
        </p>
      </div>
      <h2 class="mt-12 font-light text-3xl sm:text-4xl text-center">A Utility-First CSS Framework<br class="hidden sm:inline-block"> for Rapid UI Development</h2>
      <div class="mt-12 sm:flex sm:justify-center">
        <a class="mt-6 sm:mt-0 mx-auto sm:mx-2 max-w-xs rounded-full text-center leading-none font-semibold block px-12 py-3 border-2 border-tailwind-teal bg-tailwind-teal text-white hover:border-tailwind-teal-light hover:bg-tailwind-teal-light hover:bg-tailwind-teal-light" href="/docs/what-is-tailwind">Learn More</a>
        <a class="mt-6 sm:mt-0 mx-auto sm:mx-2 max-w-xs rounded-full text-center leading-none font-semibold block px-12 py-3 border-2 border-tailwind-teal text-tailwind-teal hover:text-white hover:border-tailwind-teal-light hover:bg-tailwind-teal-light hover:bg-tailwind-teal-light" href="https://github.com/tailwindcss/tailwindcss">GitHub</a>
      </div>
    </div>
  </div>
</div>

<div class="px-6">
  <div class="my-12 text-center uppercase">
    <span class="inline-block bg-soft px-4 text-grey-darker tracking-wide font-bold">A project by</span>
  </div>
  <div class="flex justify-center">
    <div class="pb-4 flex justify-center flex-wrap max-w-md xl:max-w-full border-b-2 border-grey-light">
      <div class="mb-8 w-64 md:flex-x-center">
        <div class="flex items-center">
          <img class="h-16 w-16 rounded-full" src="https://twitter.com/adamwathan/profile_image?size=original" alt="">
          <div class="pl-4">
            <a href="https://twitter.com/adamwathan" class="block hover:underline text-dark text-lg text-medium">Adam Wathan</a>
            <a href="https://twitter.com/adamwathan" class="block hover:underline text-tailwind-teal-dark text-sm">@adamwathan</a>
          </div>
        </div>
      </div>
      <div class="mb-8 w-64 md:flex-x-center">
        <div class="flex items-center">
          <img class="h-16 w-16 rounded-full" src="https://twitter.com/reinink/profile_image?size=original" alt="">
          <div class="pl-4">
            <a href="https://twitter.com/reinink" class="block hover:underline text-dark text-lg text-medium">Jonathan Reinink</a>
            <a href="https://twitter.com/reinink" class="block hover:underline text-tailwind-teal-dark text-sm">@reinink</a>
          </div>
        </div>
      </div>
      <div class="mb-8 w-64 md:flex-x-center">
        <div class="flex items-center">
          <img class="h-16 w-16 rounded-full" src="https://twitter.com/davidhemphill/profile_image?size=original">
          <div class="pl-4">
            <a href="https://twitter.com/davidhemphill" class="block hover:underline text-dark text-lg text-medium">David Hemphill</a>
            <a href="https://twitter.com/davidhemphill" class="block hover:underline text-tailwind-teal-dark text-sm">@davidhemphill</a>
          </div>
        </div>
      </div>
      <div class="mb-8 w-64 md:flex-x-center">
        <div class="flex items-center">
          <img class="h-16 w-16 rounded-full" src="https://twitter.com/steveschoger/profile_image?size=original" alt="">
          <div class="pl-4">
            <a href="https://twitter.com/steveschoger" class="block hover:underline text-dark text-lg text-medium">Steve Schoger</a>
            <a href="https://twitter.com/steveschoger" class="block hover:underline text-tailwind-teal-dark text-sm">@steveschoger</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-10 mb-16 mx-auto flex flex-wrap justify-center text-grey-darker">
    <a class="block flex items-center hover:text-tailwind-teal" href="https://github.com/tailwindcss/tailwindcss">
      <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"/></svg>
      <span class="ml-2">GitHub</span>
    </a>
    <a class="block ml-6 sm:ml-12 flex items-center hover:text-tailwind-teal" href="https://twitter.com/tailwindcss">
      <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"/></svg>
      <span class="ml-2">Twitter</span>
    </a>
  </div>
</div>

@endsection
