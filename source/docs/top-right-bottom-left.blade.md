---
extends: _layouts.documentation
title: "Top / Right / Bottom / Left"
description: "Utilities for controlling the placement of positioned elements."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.inset-0',
      "top: 0;\nright: 0;\nbottom: 0;\nleft: 0;",
      "Anchor absolutely positioned element to all the edges of the nearest positioned parent.",
    ],
    [
      '.inset-y-0',
      "top: 0;\nbottom: 0;",
      "Anchor absolutely positioned element to the top and bottom edges of the nearest positioned parent.",
    ],
    [
      '.inset-x-0',
      "right: 0;\nleft: 0;",
      "Anchor absolutely positioned element to the left and right edges of the nearest positioned parent.",
    ],
    [
      '.top-0',
      "top: 0;",
      "Anchor absolutely positioned element to the top edge of the nearest positioned parent.",
    ],
    [
      '.right-0',
      "right: 0;",
      "Anchor absolutely positioned element to the right edge of the nearest positioned parent.",
    ],
    [
      '.bottom-0',
      "bottom: 0;",
      "Anchor absolutely positioned element to the bottom edge of the nearest positioned parent.",
    ],
    [
      '.left-0',
      "left: 0;",
      "Anchor absolutely positioned element to the left edge of the nearest positioned parent.",
    ],
    [
      '.inset-auto',
      "top: auto;\nright: auto;\nbottom: auto;\nleft: auto;",
      "Reset absolutely positioned element to all the edges from a given breakpoint onwards.",
    ],
    [
      '.inset-y-auto',
      "top: auto;\nbottom: auto;",
      "Reset absolutely positioned element to the top and bottom edge",
    ],
    [
      '.inset-x-auto',
      "left: auto;\nright: auto;",
      "Reset absolutely positioned element to the left and right edge",
    ],
    [
      '.top-auto',
      "top: auto;",
      "Reset absolutely positioned element to the top edge",
    ],
    [
      '.bottom-auto',
      "bottom: auto;",
      "Reset absolutely positioned element to the bottom edge",
    ],
    [
      '.left-auto',
      "left: auto;",
      "Reset absolutely positioned element to the left edge",
    ],
    [
      '.right-auto',
      "right: auto;",
      "Reset absolutely positioned element to the right edge",
    ],
  ]
])

## Usage

Use the `.{top|right|bottom|left|inset}-0` utilities to anchor absolutely positioned elements against any of the edges of the nearest positioned parent.

Combined with Tailwind's padding and margin utilities, you'll probably find that these are all you need to precisely control absolutely positioned elements.

@component('_partials.code-sample')
<div class="flex justify-around mb-8">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.inset-x-0.top-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute inset-x-0 top-0 h-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.inset-y-0.right-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute inset-y-0 right-0 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.inset-x-0.bottom-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute inset-x-0 bottom-0 h-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.inset-y-0.left-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute inset-y-0 left-0 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.inset-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute inset-0 bg-gray-700"></div>
    </div>
  </div>
</div>
<div class="flex justify-around">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.left-0.top-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute left-0 top-0 h-8 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.top-0.right-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute top-0 right-0 h-8 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.right-0.bottom-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute right-0 bottom-0 h-8 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">.bottom-0.left-0</p>
    <div class="relative h-24 w-24 bg-gray-400">
      <div class="absolute bottom-0 left-0 h-8 w-8 bg-gray-700"></div>
    </div>
  </div>
  <div class="relative h-24 w-24 opacity-0"></div>
</div>

@slot('code')
<!-- Span top edge -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute inset-x-0 top-0 h-8 bg-gray-700"></div>
</div>

<!-- Span right edge -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute inset-y-0 right-0 w-8 bg-gray-700"></div>
</div>

<!-- Span bottom edge -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute inset-x-0 bottom-0 h-8 bg-gray-700"></div>
</div>

<!-- Span left edge -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute inset-y-0 left-0 bg-gray-700"></div>
</div>

<!-- Fill entire parent -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute inset-0 bg-gray-700"></div>
</div>

<!-- Pin to top left corner -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute left-0 top-0 h-8 w-8 bg-gray-700"></div>
</div>

<!-- Pin to top right corner -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute top-0 right-0 h-8 w-8 bg-gray-700"></div>
</div>

<!-- Pin to bottom right corner -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute bottom-0 right-0 h-8 w-8 bg-gray-700"></div>
</div>

<!-- Pin to bottom left corner -->
<div class="relative h-24 w-24 bg-gray-400">
  <div class="absolute bottom-0 left-0 h-8 w-8 bg-gray-700"></div>
</div>
@endslot
@endcomponent

## Responsive

To position an element only at a specific breakpoint, add a `{screen}:` prefix to any existing positioning utility. For example, adding the class `md:inset-y-0` to an element would apply the `inset-y-0` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="absolute inset-0 bg-gray-800 p-4 text-gray-500">Responsive element</div>
</div>
@endslot

@slot('sm')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="absolute bottom-0 left-0 bg-gray-800 p-4 text-gray-500">Responsive element</div>
</div>
@endslot

@slot('md')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="absolute top-0 inset-x-0 bg-gray-800 p-4 text-gray-500">Responsive element</div>
</div>
@endslot

@slot('lg')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="absolute right-0 inset-y-0 bg-gray-800 p-4 text-gray-500">Responsive element</div>
</div>
@endslot

@slot('xl')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="absolute bottom-0 inset-x-0 bg-gray-800 p-4 text-gray-500">Responsive element</div>
</div>
@endslot

@slot('code')
<div class="relative h-32 bg-gray-400 p-4">
  <div class="none:absolute none:inset-0 sm:bottom-0 sm:left-0 md:top-0 md:inset-x-0 lg:right-0 lg:inset-y-0 xl:bottom-0 xl:inset-x-0"></div>
</div>
@endslot
@endcomponent

## Customizing

### Top / Right / Bottom / Left scale

By default Tailwind only provides `0` and `auto` top/right/bottom/left/inset utilities. You can change, add, or remove these by editing the `theme.inset` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.inset'])
  '0': 0,
- auto: 'auto',
+ '1/2': '50%',
@endcomponent

### Negative values

If you'd like to add any negative top/right/bottom/left classes that take the same form as Tailwind's [negative margin](/docs/margin#negative-margins) classes, prefix the keys in your config file with a dash:

@component('_partials.customized-config', ['key' => 'theme.margin'])
+ '-16': '-4rem',
@endcomponent

Tailwind is smart enough to generate classes like `-top-16` when it sees the leading dash, not `top--16` like you might expect.

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'top, right, bottom, left, and inset',
        'property' => 'inset',
    ],
    'variants' => [
        'responsive',
    ],
])
