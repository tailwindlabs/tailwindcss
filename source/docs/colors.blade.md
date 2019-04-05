---
extends: _layouts.documentation
title: "Colors"
description: "Customizing the default color palette for your project."
titleBorder: true
---

@include('_partials.work-in-progress')

Developing an organized color palette is critical to the design success of a project. Tailwind provides a well-thought-out default color system that makes this very easy to accomplish.

## Default color palette

To get you started, we've provided a generous palette of great looking colors that are perfect for prototyping, or even as a starting point for your own custom color palette.

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

### Customizing

The `theme.colors` property allows you to override Tailwind's default color palette.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: '#5c6ac4',
      blue: '#007ace',
      red: '#de3618',
    }
  }
}
```

By default this color palette is shared by the `textColor`, `borderColor`, and `backgroundColor` utilities. The above configuration would generate classes like `.text-indigo`, `.border-blue`, and `.bg-red`.

You can define your colors as a simple list of key-value pairs, or using a nested object notation where the nested keys are added to the base color name as modifiers:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: {
        lighter: '#b3bcf5',
        default: '#5c6ac4',
        dark: '#202e78',
      }
    }
  }
}
```

Like many other places in Tailwind, the `default` key is special and means "no modifier", so this configuration would generate classes like `.text-indigo-lighter`, `.text-indigo`, and `.text-indigo-dark`.

