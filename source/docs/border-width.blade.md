---
extends: _layouts.documentation
title: "Border Width"
description: "Utilities for controlling the width of an element's borders."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.border',
      'border-width: 1px;',
    ],
    [
      '.border-0',
      'border-width: 0;',
    ],
    [
      '.border-2',
      'border-width: 2px;',
    ],
    [
      '.border-4',
      'border-width: 4px;',
    ],
    [
      '.border-8',
      'border-width: 8px;',
    ],
    [
      '.border-t',
      'border-top-width: 1px;',
    ],
    [
      '.border-r',
      'border-right-width: 1px;',
    ],
    [
      '.border-b',
      'border-bottom-width: 1px;',
    ],
    [
      '.border-l',
      'border-left-width: 1px;',
    ],
    [
      '.border-t-0',
      'border-top-width: 0;',
    ],
    [
      '.border-r-0',
      'border-right-width: 0;',
    ],
    [
      '.border-b-0',
      'border-bottom-width: 0;',
    ],
    [
      '.border-l-0',
      'border-left-width: 0;',
    ],
    [
      '.border-t-2',
      'border-top-width: 2px;',
    ],
    [
      '.border-r-2',
      'border-right-width: 2px;',
    ],
    [
      '.border-b-2',
      'border-bottom-width: 2px;',
    ],
    [
      '.border-l-2',
      'border-left-width: 2px;',
    ],
    [
      '.border-t-4',
      'border-top-width: 4px;',
    ],
    [
      '.border-r-4',
      'border-right-width: 4px;',
    ],
    [
      '.border-b-4',
      'border-bottom-width: 4px;',
    ],
    [
      '.border-l-4',
      'border-left-width: 4px;',
    ],
    [
      '.border-t-8',
      'border-top-width: 8px;',
    ],
    [
      '.border-r-8',
      'border-right-width: 8px;',
    ],
    [
      '.border-b-8',
      'border-bottom-width: 8px;',
    ],
    [
      '.border-l-8',
      'border-left-width: 8px;',
    ],
  ]
])

## All sides

Use the `.border`, `.border-0`, `.border-2`, `.border-4`, or `.border-8` utilities to set the border width for all sides of an element.

@component('_partials.code-sample')
<div class="flex">
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-0</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-0 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-2</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-2 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-4</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-4 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-8</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-8 border-gray-600"></div>
  </div>
</div>
@slot('code')
<div class="border-0 border-gray-600 ..."></div>
<div class="border border-gray-600 ..."></div>
<div class="border-2 border-gray-600 ..."></div>
<div class="border-4 border-gray-600 ..."></div>
<div class="border-8 border-gray-600 ..."></div>
@endslot
@endcomponent

## Individual sides

Use the `.border-{side}`, `.border-{side}-0`, `.border-{side}-2`, `.border-{side}-4`, or `.border-{side}-8` utilities to set the border width for one side of an element.

@component('_partials.code-sample')
<div class="flex">
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-t-2</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-t-2 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-r-2</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-r-2 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-b-2</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-b-2 border-gray-600"></div>
  </div>
  <div class="w-1/2 sm:flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.border-l-2</p>
    <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-400 border-l-2 border-gray-600"></div>
  </div>
</div>
@slot('code')
<div class="border-t-2 border-gray-600 ..."></div>
<div class="border-r-2 border-gray-600 ..."></div>
<div class="border-b-2 border-gray-600 ..."></div>
<div class="border-l-2 border-gray-600 ..."></div>
@endslot
@endcomponent

<h2 class="flex items-center">
  Between elements
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.3.0+
  </span>
</h2>


You can also add borders between child elements using the `divide-{x/y}-{width}` and `divide-{color}` utilities.

Learn more in the [Divide Width](/docs/divide-width) and [Divide Color](/docs/divide-color) documentation.

@component('_partials.code-sample')
<div class="divide-y divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>

@slot('code')
<div class="divide-y divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

## Responsive

To control the border width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border width utility. For example, use `md:border-t-4` to apply the `border-t-4` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="w-24 h-24 mx-auto border-2 border-gray-600 bg-gray-400"></div>
@endslot
@slot('sm')
<div class="w-24 h-24 mx-auto border-2 border-t-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('md')
<div class="w-24 h-24 mx-auto border-2 border-t-8 border-r-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('lg')
<div class="w-24 h-24 mx-auto border-2 border-t-8 border-r-8 border-b-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('xl')
<div class="w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('code')
<div class="none:border-2 sm:border-t-8 md:border-r-8 lg:border-b-8 xl:border-8">
</div>
@endslot
@endcomponent

## Customizing

### Border Widths

By default Tailwind provides five `border-width` utilities, and the same number of utilities per side (top, right, bottom, and left). You change, add, or remove these by editing the `theme.borderWidth` section of your Tailwind config. The values in this section will also control which utilities will be generated side.

@component('_partials.customized-config', ['key' => 'theme.borderWidth'])
  default: '1px',
  '0': '0',
  '2': '2px',
+ '3': '3px',
  '4': '4px',
+ '6': '6px',
- '8': '8px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border width',
        'property' => 'borderWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
