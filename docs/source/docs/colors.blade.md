---
extends: _layouts.documentation
title: "Colors"
description: null
---

Developing an organized, consistent and beautiful color palette is critical to the design success of a project. Tailwind provides a fantastic color system that makes this very easy to accomplish.

## Default color palette

To get you started, we've provided a generous palette of great looking colors that are perfect for prototyping, or even as a starting point for your color palette. That said, don't hesitate to [customize](#customizing) them for your project.

<div class="flex flex-wrap -mx-4">
  <div class="w-full md:w-1/2 lg:w-1/3 mb-8 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-grey px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Grey</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey']) }}</span>
        </div>
      </div>
      <div class="text-black bg-white px-6 py-3 text-sm font-semibold flex justify-between">
        <span>White</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['white']) }}</span>
      </div>
      <div class="text-grey-darkest bg-grey-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-lightest']) }}</span>
      </div>
      <div class="text-grey-darkest bg-grey-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-lighter']) }}</span>
      </div>
      <div class="text-grey-darkest bg-grey-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-light']) }}</span>
      </div>
      <div class="text-white bg-grey px-6 py-3 text-sm font-semibold flex justify-between flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey']) }}</span>
      </div>
      <div class="text-white bg-grey-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-dark']) }}</span>
      </div>
      <div class="text-white bg-grey-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-darker']) }}</span>
      </div>
      <div class="text-white bg-grey-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['grey-darkest']) }}</span>
      </div>
      <div class="text-white bg-black px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Black</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['black']) }}</span>
      </div>
    </div>
  </div>

  <div class="w-full md:w-1/2 lg:w-1/3 mb-8 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-new-grey px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Grey</div>
        <div class="flex justify-between">
          <span class="-opacity-0">Base</span>
          <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey']) }}</span>
        </div>
      </div>
      <div class="text-black bg-new-white px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">White</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-white']) }}</span>
      </div>
      <div class="text-grey-darkest bg-new-grey-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Lightest</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-lightest']) }}</span>
      </div>
      <div class="text-grey-darkest bg-new-grey-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Lighter</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-lighter']) }}</span>
      </div>
      <div class="text-grey-darkest bg-new-grey-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Light</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-light']) }}</span>
      </div>
      <div class="text-white bg-new-grey px-6 py-3 text-sm font-semibold flex justify-between flex justify-between">
        <span class="-opacity-0">Base</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey']) }}</span>
      </div>
      <div class="text-white bg-new-grey-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Dark</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-dark']) }}</span>
      </div>
      <div class="text-white bg-new-grey-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Darker</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-darker']) }}</span>
      </div>
      <div class="text-white bg-new-grey-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Darkest</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-grey-darkest']) }}</span>
      </div>
      <div class="text-white bg-new-black px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="-opacity-0">Black</span>
        <span class="font-normal opacity-75 lowercase truncate">{{ strtoupper($page->config['colors']['new-black']) }}</span>
      </div>
    </div>
  </div>

  <div class="w-full md:w-1/2 lg:w-1/3 mb-8 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-grey px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Grey</div>
        <div class="flex justify-between">
          <span class="opacity-0">Base</span>
          <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey']) }}</span>
        </div>
      </div>
      <div class="text-black bg-white px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">White</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['white']) }}</span>
      </div>
      <div class="text-grey-darkest bg-smoke-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Lightest</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-lightest']) }}</span>
      </div>
      <div class="text-grey-darkest bg-smoke-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Lighter</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-lighter']) }}</span>
      </div>
      <div class="text-grey-darkest bg-smoke px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Light</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-light']) }}</span>
      </div>
      <div class="text-white bg-smoke-dark px-6 py-3 text-sm font-semibold flex justify-between flex justify-between">
        <span class="opacity-0">Base</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey']) }}</span>
      </div>
      <div class="text-white bg-smoke-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Dark</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-dark']) }}</span>
      </div>
      <div class="text-white bg-slate px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Darker</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-darker']) }}</span>
      </div>
      <div class="text-white bg-slate-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Darkest</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['grey-darkest']) }}</span>
      </div>
      <div class="text-white bg-slate-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span class="opacity-0">Black</span>
        <span class="font-normal opacity-0">{{ strtoupper($page->config['colors']['black']) }}</span>
      </div>
    </div>
  </div>
</div>

<div class="flex flex-wrap -mx-4">
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-red px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Red</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red']) }}</span>
        </div>
      </div>
      <div class="text-red-darkest bg-red-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-lightest']) }}</span>
      </div>
      <div class="text-red-darkest bg-red-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-lighter']) }}</span>
      </div>
      <div class="text-white bg-red-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-light']) }}</span>
      </div>
      <div class="text-white bg-red px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red']) }}</span>
      </div>
      <div class="text-white bg-red-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-dark']) }}</span>
      </div>
      <div class="text-white bg-red-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-darker']) }}</span>
      </div>
      <div class="text-white bg-red-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['red-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-orange px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Orange</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange']) }}</span>
        </div>
      </div>
      <div class="text-orange-darkest bg-orange-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-lightest']) }}</span>
      </div>
      <div class="text-orange-darkest bg-orange-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-lighter']) }}</span>
      </div>
      <div class="text-orange-darkest bg-orange-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-light']) }}</span>
      </div>
      <div class="text-white bg-orange px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange']) }}</span>
      </div>
      <div class="text-white bg-orange-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-dark']) }}</span>
      </div>
      <div class="text-white bg-orange-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-darker']) }}</span>
      </div>
      <div class="text-white bg-orange-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['orange-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-yellow-darkest bg-yellow px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Yellow</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow']) }}</span>
        </div>
      </div>
      <div class="text-yellow-darkest bg-yellow-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-lightest']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-lighter']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-light']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-dark']) }}</span>
      </div>
      <div class="text-white bg-yellow-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-darker']) }}</span>
      </div>
      <div class="text-white bg-yellow-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['yellow-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-green px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Green</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green']) }}</span>
        </div>
      </div>
      <div class="text-green-darkest bg-green-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-lightest']) }}</span>
      </div>
      <div class="text-green-darkest bg-green-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-lighter']) }}</span>
      </div>
      <div class="text-green-darkest bg-green-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-light']) }}</span>
      </div>
      <div class="text-white bg-green px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green']) }}</span>
      </div>
      <div class="text-white bg-green-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-dark']) }}</span>
      </div>
      <div class="text-white bg-green-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-darker']) }}</span>
      </div>
      <div class="text-white bg-green-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['green-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-teal px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Teal</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal']) }}</span>
        </div>
      </div>
      <div class="text-teal-darkest bg-teal-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-lightest']) }}</span>
      </div>
      <div class="text-teal-darkest bg-teal-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-lighter']) }}</span>
      </div>
      <div class="text-teal-darkest bg-teal-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-light']) }}</span>
      </div>
      <div class="text-white bg-teal px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal']) }}</span>
      </div>
      <div class="text-white bg-teal-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-dark']) }}</span>
      </div>
      <div class="text-white bg-teal-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-darker']) }}</span>
      </div>
      <div class="text-white bg-teal-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['teal-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-blue px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Blue</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue']) }}</span>
        </div>
      </div>
      <div class="text-blue-darkest bg-blue-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-lightest']) }}</span>
      </div>
      <div class="text-blue-darkest bg-blue-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-lighter']) }}</span>
      </div>
      <div class="text-white bg-blue-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-light']) }}</span>
      </div>
      <div class="text-white bg-blue px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue']) }}</span>
      </div>
      <div class="text-white bg-blue-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-dark']) }}</span>
      </div>
      <div class="text-white bg-blue-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-darker']) }}</span>
      </div>
      <div class="text-white bg-blue-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['blue-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-indigo px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Indigo</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo']) }}</span>
        </div>
      </div>
      <div class="text-indigo-darkest bg-indigo-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-lightest']) }}</span>
      </div>
      <div class="text-indigo-darkest bg-indigo-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-lighter']) }}</span>
      </div>
      <div class="text-white bg-indigo-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-light']) }}</span>
      </div>
      <div class="text-white bg-indigo px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo']) }}</span>
      </div>
      <div class="text-white bg-indigo-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-dark']) }}</span>
      </div>
      <div class="text-white bg-indigo-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-darker']) }}</span>
      </div>
      <div class="text-white bg-indigo-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['indigo-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-purple px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Purple</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple']) }}</span>
        </div>
      </div>
      <div class="text-purple-darkest bg-purple-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-lightest']) }}</span>
      </div>
      <div class="text-purple-darkest bg-purple-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-lighter']) }}</span>
      </div>
      <div class="text-white bg-purple-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-light']) }}</span>
      </div>
      <div class="text-white bg-purple px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple']) }}</span>
      </div>
      <div class="text-white bg-purple-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-dark']) }}</span>
      </div>
      <div class="text-white bg-purple-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-darker']) }}</span>
      </div>
      <div class="text-white bg-purple-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['purple-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-pink px-6 py-4 text-sm font-semibold relative shadow z-10">
        <div class="tracking-wide uppercase mb-6">Pink</div>
        <div class="flex justify-between">
          <span>Base</span>
          <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink']) }}</span>
        </div>
      </div>
      <div class="text-pink-darkest bg-pink-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-lightest']) }}</span>
      </div>
      <div class="text-pink-darkest bg-pink-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-lighter']) }}</span>
      </div>
      <div class="text-white bg-pink-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-light']) }}</span>
      </div>
      <div class="text-white bg-pink px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Base</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink']) }}</span>
      </div>
      <div class="text-white bg-pink-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-dark']) }}</span>
      </div>
      <div class="text-white bg-pink-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-darker']) }}</span>
      </div>
      <div class="text-white bg-pink-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span class="font-normal opacity-75">{{ strtoupper($page->config['colors']['pink-darkest']) }}</span>
      </div>
    </div>
  </div>
</div>

## Customizing

Tailwind makes it a breeze to modify the default color palette for you project. Remember, you own these colors and nothing will break if you change everything about them.

By default Tailwind defines the entire color palette in a `colors` object at the top of your Tailwind config file. These colors are then assigned to `textColors`, `backgroundColors` and `borderColors`. This approach works well since it provides a consistent naming system across all the utilities. However, you're welcome to modify them independently of one-another as well.

```js
var colors = {
  'transparent': 'transparent',

  'black': '#222b2f',
  'grey-darkest': '#364349',
  'grey-darker': '#596a73',
  'grey-dark': '#70818a',
  'grey': '#9babb4',

  // ...
}

module.exports = {
  colors: colors,
  textColors: colors,
  backgroundColors: colors,
  borderColors: Object.assign({ default: colors['grey-light'] }, colors),

  // ...
}
```

You'll notice above that the color palette is also assigned to the `colors` key of your Tailwind config. This makes it easy to access them in your custom CSS using the `config()` function. For example:

```css
.error { color: config('colors.grey-darker') }
```

## Naming

In the default color palette we've used literal color names, like `red`, `green` and `blue`. Another common approach to naming colors is choosing functional names based on how the colors are used, such as `primary`, `secondary`, and `brand`.

You can also choose different approaches to how you name your color variants. In the default color palette we've again used literal variants, like `light`, `dark`, and `darker`. Another common approach here is to use a numeric scale, like `100`, `200` and `300`.

You should feel free to choose whatever color naming approach makes the most sense to you.
