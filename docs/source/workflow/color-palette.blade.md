---
extends: _layouts.markdown
title: "Color Palette"
---

# Color Palette

- Explain default color palette
- Document how to customize your color palette, using regular JS features in your config file to avoid duplication, merging colors, etc.
- Talk about naming, how it's easy to use color-based names or hierarchy-based names, whatever floats your boat


<div class="flex flex-wrap -mx-4 mb-8">
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-grey px-6 py-6 text-sm font-bold relative shadow z-10">
        Grey
      </div>
      <div class="text-black bg-white px-6 py-3 text-sm font-semibold flex justify-between">
        <span>White</span>
        <span>{{ strtoupper($page->config['colors']['white']) }}</span>
        </div>
      <div class="text-grey-darkest bg-grey-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['grey-lightest']) }}</span>
      </div>
      <div class="text-grey-darkest bg-grey-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['grey-lighter']) }}</span>
      </div>
      <div class="text-grey-darkest bg-grey-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['grey-light']) }}</span>
      </div>
      <div class="text-white bg-grey px-6 py-3 text-sm font-semibold flex justify-between flex justify-between">
        <span>Grey</span>
        <span>{{ strtoupper($page->config['colors']['grey']) }}</span>
      </div>
      <div class="text-white bg-grey-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['grey-dark']) }}</span>
      </div>
      <div class="text-white bg-grey-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['grey-darker']) }}</span>
      </div>
      <div class="text-white bg-grey-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['grey-darkest']) }}</span>
      </div>
      <div class="text-white bg-black px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Black</span>
        <span>{{ strtoupper($page->config['colors']['black']) }}</span>
      </div>
    </div>
  </div>
</div>


<div class="flex flex-wrap -mx-4 mb-8">
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-red px-6 py-6 text-sm font-bold relative shadow z-10">
        Red
      </div>
      <div class="text-red-darkest bg-red-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['red-lightest']) }}</span>
      </div>
      <div class="text-red-darkest bg-red-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['red-lighter']) }}</span>
      </div>
      <div class="text-white bg-red-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['red-light']) }}</span>
      </div>
      <div class="text-white bg-red px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Red</span>
        <span>{{ strtoupper($page->config['colors']['red']) }}</span>
      </div>
      <div class="text-white bg-red-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['red-dark']) }}</span>
      </div>
      <div class="text-white bg-red-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['red-darker']) }}</span>
      </div>
      <div class="text-white bg-red-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['red-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-orange px-6 py-6 text-sm font-bold relative shadow z-10">
        Orange
      </div>
      <div class="text-orange-darkest bg-orange-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['orange-lightest']) }}</span>
      </div>
      <div class="text-orange-darkest bg-orange-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['orange-lighter']) }}</span>
      </div>
      <div class="text-orange-darkest bg-orange-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['orange-light']) }}</span>
      </div>
      <div class="text-white bg-orange px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Orange</span>
        <span>{{ strtoupper($page->config['colors']['orange']) }}</span>
      </div>
      <div class="text-white bg-orange-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['orange-dark']) }}</span>
      </div>
      <div class="text-white bg-orange-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['orange-darker']) }}</span>
      </div>
      <div class="text-white bg-orange-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['orange-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-yellow-darkest bg-yellow px-6 py-6 text-sm font-bold relative shadow z-10">
        Yellow
      </div>
      <div class="text-yellow-darkest bg-yellow-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['yellow-lightest']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['yellow-lighter']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['yellow-light']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Yellow</span>
        <span>{{ strtoupper($page->config['colors']['yellow']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['yellow-dark']) }}</span>
      </div>
      <div class="text-yellow-darkest bg-yellow-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['yellow-darker']) }}</span>
      </div>
      <div class="text-white bg-yellow-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['yellow-darkest']) }}</span>
      </div>
    </div>
  </div>
</div>

<div class="flex flex-wrap -mx-4 mb-8">
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-green px-6 py-6 text-sm font-bold relative shadow z-10">
        Green
      </div>
      <div class="text-green-darkest bg-green-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['green-lightest']) }}</span>
      </div>
      <div class="text-green-darkest bg-green-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['green-lighter']) }}</span>
      </div>
      <div class="text-green-darkest bg-green-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['green-light']) }}</span>
      </div>
      <div class="text-white bg-green px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Green</span>
        <span>{{ strtoupper($page->config['colors']['green']) }}</span>
      </div>
      <div class="text-white bg-green-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['green-dark']) }}</span>
      </div>
      <div class="text-white bg-green-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['green-darker']) }}</span>
      </div>
      <div class="text-white bg-green-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['green-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-teal px-6 py-6 text-sm font-bold relative shadow z-10">
        Teal
      </div>
      <div class="text-teal-darkest bg-teal-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['teal-lightest']) }}</span>
      </div>
      <div class="text-teal-darkest bg-teal-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['teal-lighter']) }}</span>
      </div>
      <div class="text-teal-darkest bg-teal-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['teal-light']) }}</span>
      </div>
      <div class="text-white bg-teal px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Teal</span>
        <span>{{ strtoupper($page->config['colors']['teal']) }}</span>
      </div>
      <div class="text-white bg-teal-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['teal-dark']) }}</span>
      </div>
      <div class="text-white bg-teal-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['teal-darker']) }}</span>
      </div>
      <div class="text-white bg-teal-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['teal-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-blue px-6 py-6 text-sm font-bold relative shadow z-10">
        Blue
      </div>
      <div class="text-blue-darkest bg-blue-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['blue-lightest']) }}</span>
      </div>
      <div class="text-blue-darkest bg-blue-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['blue-lighter']) }}</span>
      </div>
      <div class="text-white bg-blue-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['blue-light']) }}</span>
      </div>
      <div class="text-white bg-blue px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Blue</span>
        <span>{{ strtoupper($page->config['colors']['blue']) }}</span>
      </div>
      <div class="text-white bg-blue-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['blue-dark']) }}</span>
      </div>
      <div class="text-white bg-blue-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['blue-darker']) }}</span>
      </div>
      <div class="text-white bg-blue-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['blue-darkest']) }}</span>
      </div>
    </div>
  </div>
</div>

<div class="flex flex-wrap -mx-4 mb-8">
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-indigo px-6 py-6 text-sm font-bold relative shadow z-10">
        Indigo
      </div>
      <div class="text-indigo-darkest bg-indigo-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['indigo-lightest']) }}</span>
      </div>
      <div class="text-indigo-darkest bg-indigo-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['indigo-lighter']) }}</span>
      </div>
      <div class="text-white bg-indigo-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['indigo-light']) }}</span>
      </div>
      <div class="text-white bg-indigo px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Indigo</span>
        <span>{{ strtoupper($page->config['colors']['indigo']) }}</span>
      </div>
      <div class="text-white bg-indigo-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['indigo-dark']) }}</span>
      </div>
      <div class="text-white bg-indigo-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['indigo-darker']) }}</span>
      </div>
      <div class="text-white bg-indigo-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['indigo-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-purple px-6 py-6 text-sm font-bold relative shadow z-10">
        Purple
      </div>
      <div class="text-purple-darkest bg-purple-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['purple-lightest']) }}</span>
      </div>
      <div class="text-purple-darkest bg-purple-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['purple-lighter']) }}</span>
      </div>
      <div class="text-white bg-purple-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['purple-light']) }}</span>
      </div>
      <div class="text-white bg-purple px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Purple</span>
        <span>{{ strtoupper($page->config['colors']['purple']) }}</span>
      </div>
      <div class="text-white bg-purple-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['purple-dark']) }}</span>
      </div>
      <div class="text-white bg-purple-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['purple-darker']) }}</span>
      </div>
      <div class="text-white bg-purple-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['purple-darkest']) }}</span>
      </div>
    </div>
  </div>
  <div class="w-full md:w-1/3 px-4">
    <div class="rounded overflow-hidden">
      <div class="text-white bg-pink px-6 py-6 text-sm font-bold relative shadow z-10">
        Pink
      </div>
      <div class="text-pink-darkest bg-pink-lightest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lightest</span>
        <span>{{ strtoupper($page->config['colors']['pink-lightest']) }}</span>
      </div>
      <div class="text-pink-darkest bg-pink-lighter px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Lighter</span>
        <span>{{ strtoupper($page->config['colors']['pink-lighter']) }}</span>
      </div>
      <div class="text-white bg-pink-light px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Light</span>
        <span>{{ strtoupper($page->config['colors']['pink-light']) }}</span>
      </div>
      <div class="text-white bg-pink px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Pink</span>
        <span>{{ strtoupper($page->config['colors']['pink']) }}</span>
      </div>
      <div class="text-white bg-pink-dark px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Dark</span>
        <span>{{ strtoupper($page->config['colors']['pink-dark']) }}</span>
      </div>
      <div class="text-white bg-pink-darker px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darker</span>
        <span>{{ strtoupper($page->config['colors']['pink-darker']) }}</span>
      </div>
      <div class="text-white bg-pink-darkest px-6 py-3 text-sm font-semibold flex justify-between">
        <span>Darkest</span>
        <span>{{ strtoupper($page->config['colors']['pink-darkest']) }}</span>
      </div>
    </div>
  </div>
</div>
