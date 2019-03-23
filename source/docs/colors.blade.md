---
extends: _layouts.documentation
title: "Colors"
description: null
titleBorder: true
---

Developing an organized, consistent and beautiful color palette is critical to the design success of a project. Tailwind provides a fantastic color system that makes this very easy to accomplish.

## Default color palette

To get you started, we've provided a generous palette of great looking colors that are perfect for prototyping, or even as a starting point for your color palette. That said, don't hesitate to [customize](#customizing) them for your project.

<div class="flex flex-wrap -mx-2">

  <div class="px-2 w-full relative mt-4">
    <h3 class="markdown">Black & White</h3>
    <div class="-mx-2 -mt-5 flex flex-wrap">
      <div class="w-1/2 md:w-1/3 px-2">
        <div class="flex items-center mt-5">
          <div class="h-12 w-12 rounded-lg shadow-inner bg-black"></div>
          <div class="ml-2 text-gray-800 text-xs leading-none pl-1">
            <div class="font-semibold">Black</div>
            <div class="mt-1 font-normal opacity-75">#000000</div>
          </div>
        </div>
      </div>
      <div class="w-1/2 md:w-1/3 px-2">
        <div class="flex items-center mt-5">
          <div class="h-12 w-12 rounded-lg shadow-inner bg-white"></div>
          <div class="ml-2 text-gray-800 text-xs leading-none pl-1">
            <div class="font-semibold">White</div>
            <div class="mt-1 font-normal opacity-75">#FFFFFF</div>
          </div>
        </div>
      </div>
    </div>
  </div>

@include('_partials.color-palette', [
  'colorName' => 'Gray',
  'color' => 'gray',
  'breakpoint' => '500',
])

@include('_partials.color-palette', [
  'colorName' => 'Red',
  'color' => 'red',
  'breakpoint' => '500',
])

@include('_partials.color-palette', [
  'colorName' => 'Orange',
  'color' => 'orange',
  'breakpoint' => '500',
])

@include('_partials.color-palette', [
  'colorName' => 'Yellow',
  'color' => 'yellow',
  'breakpoint' => '500',
])

@include('_partials.color-palette', [
  'colorName' => 'Green',
  'color' => 'green',
  'breakpoint' => '400',
])

@include('_partials.color-palette', [
  'colorName' => 'Teal',
  'color' => 'teal',
  'breakpoint' => '400',
])

@include('_partials.color-palette', [
  'colorName' => 'Blue',
  'color' => 'blue',
  'breakpoint' => '400',
])

@include('_partials.color-palette', [
  'colorName' => 'Indigo',
  'color' => 'indigo',
  'breakpoint' => '400',
])

@include('_partials.color-palette', [
  'colorName' => 'Purple',
  'color' => 'purple',
  'breakpoint' => '400',
])

@include('_partials.color-palette', [
  'colorName' => 'Pink',
  'color' => 'pink',
  'breakpoint' => '400',
])
</div>

## Customizing

Tailwind makes it a breeze to modify the default color palette for your project. Remember, you own these colors and nothing will break if you change everything about them.

By default Tailwind defines the entire color palette in a `colors` object at the top of your Tailwind config file. These colors are then assigned to `textColors`, `backgroundColors` and `borderColors`. This approach works well since it provides a consistent naming system across all the utilities. However, you're welcome to modify them independently of one-another as well.

```js
var colors = {
  'transparent': 'transparent',

  'black': '#222b2f',

  'gray': {
      '100': '#F7FAFC',
      '200': '#EDF2F7',
      '300': '#E2E8F0',
      '400': '#CBD5E0',
      '500': '#A0AEC0',
      '600': '#718096',
      '700': '#4A5568',
      '800': '#2D3748',
      '900': '#1A202C',
   },

  // ...
}

module.exports = {
  colors: colors,
  textColors: colors,
  backgroundColors: colors,
  borderColors: Object.assign({ default: colors.gray[300] }, colors),

  // ...
}
```

You'll notice above that the color palette is also assigned to the `colors` key of your Tailwind config. This makes it easy to access them in your custom CSS using the `theme()` function. For example:

```css
.error { color: theme('colors.gray[700]') }
```

## Naming

In the default color palette we've used literal color names, like `red`, `green` and `blue`. Another common approach to naming colors is choosing functional names based on how the colors are used, such as `primary`, `secondary`, and `brand`.

You can also choose different approaches to how you name your color variants. In the default color palette we've used a numeric scale, like `100`, `200` and `300`. Another common approach here is to use literal variants, like `light`, `dark`, and `darker`.

You should feel free to choose whatever color naming approach makes the most sense to you.
