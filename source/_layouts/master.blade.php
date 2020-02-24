<!DOCTYPE html>
<html lang="en" class="bg-white antialiased">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00b4b6">
  <title>@yield('title', $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS - A Utility-First CSS Framework for Rapid UI Development')</title>
  <meta name="theme-color" content="#ffffff">
  @yield('meta')
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link rel="stylesheet" href="{{ mix('/css/main.css', 'assets/build') }}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css">
  <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v1.11.1/dist/alpine.js" defer></script>
</head>
<body data-sidebar-visible="true" class="text-gray-900 leading-normal">

@yield('body')

<div style="display: none;" x-data="{ show: false }" x-show="show" x-init="localStorage.getItem('hideBanner') === null ? (setTimeout(() => show = true, 500)) : (show = false)" x-transition:enter="ease-out duration-500" x-transition:enter-start="opacity-0 scale-95 translate-y-2" x-transition:enter-end="opacity-100 scale-100 translate-y-0" x-transition:leave="ease-in duration-300" x-transition:leave-start="opacity-100 scale-100 translate-y-0" x-transition:leave-end="opacity-0 scale-95 translate-y-2" class="transition transform fixed z-100 bottom-0 inset-x-0 pb-2 sm:pb-5">
  <div class="max-w-screen-xl mx-auto px-2 sm:px-4">
    <div class="p-2 rounded-lg bg-gray-900 shadow-lg sm:p-3">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <img class="h-6" src="/img/tailwind-ui-logo-on-dark.svg" alt="">
          <p class="ml-3 font-medium text-white truncate">
            <span class="lg:hidden">
              <span class="sr-only">Tailwind UI</span> is coming this week!
            </span>
            <span class="hidden lg:inline text-gray-400">
              <strong class="text-white font-semibold mr-1">Coming this week!</strong>
              <span class="xl:hidden">Beautiful UI components by the creators of Tailwind CSS.</span>
              <span class="hidden xl:inline">Beautiful UI components, crafted by the creators of Tailwind CSS.</span>
            </span>
          </p>
        </div>
        <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <div class="rounded-md shadow-sm">
            <a href="https://tailwindui.com?utm_source=tailwindcss&utm_medium=footer-banner" class="flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-900 bg-white hover:text-gray-800 focus:outline-none focus:underline">
              Learn more
            </a>
          </div>
        </div>
        <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
          <button @click="localStorage.setItem('hideBanner', true); show = false" type="button" class="-mr-1 flex p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
            <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

@if ($page->production)
  <!-- Google Analytics  -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-109068504-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-109068504-1');
  </script>
@endif

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
@stack('scripts')

</body>
</html>
