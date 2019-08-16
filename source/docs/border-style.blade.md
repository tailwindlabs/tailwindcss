---
extends: _layouts.documentation
title: "Border Style"
description: "Utilities for controlling the style of an element's borders."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.border-solid',
      'border-style: solid;',
      "Sets the border style on an element to solid.",
    ],
    [
      '.border-dashed',
      'border-style: dashed;',
      "Sets the border style on an element to dashed.",
    ],
    [
      '.border-dotted',
      'border-style: dotted;',
      "Sets the border style on an element to dotted.",
    ],
    [
      '.border-double',
      'border-style: double;',
      "Sets the border style on an element to double.",
    ],
    [
      '.border-none',
      'border-style: none;',
      "Disables the border on an element.",
    ],
  ]
])

## Usage

Use `.border-{style}` to control an element's border style.

@component('_partials.code-sample')
<div class="block sm:flex sm:justify-around">
  <div class="sm:w-3/5 sm:mb-0 flex justify-around mb-6">
    <div class="flex-1">
      <p class="text-center text-sm text-gray-600 mb-1">.border-solid</p>
      <div class="mx-auto w-24 h-24 bg-gray-400 border-4 border-gray-600 border-solid"></div>
    </div>
    <div class="flex-1">
      <p class="text-center text-sm text-gray-600 mb-1">.border-dashed</p>
      <div class="mx-auto w-24 h-24 bg-gray-400 border-4 border-gray-600 border-dashed"></div>
    </div>
    <div class="flex-1">
      <p class="text-center text-sm text-gray-600 mb-1">.border-dotted</p>
      <div class="mx-auto w-24 h-24 bg-gray-400 border-4 border-gray-600 border-dotted"></div>
    </div>
  </div>
  <div class="sm:w-2/5 flex justify-around">
    <div class="flex-1">
      <p class="text-center text-sm text-gray-600 mb-1">.border-double</p>
      <div class="mx-auto w-24 h-24 bg-gray-400 border-4 border-gray-600 border-double"></div>
    </div>
    <div class="flex-1">
      <p class="text-center text-sm text-gray-600 mb-1">.border-none</p>
      <div class="mx-auto w-24 h-24 bg-gray-400 border-4 border-gray-600 border-none"></div>
    </div>
    <div class="flex-1 sm:hidden"></div>
  </div>
</div>
@slot('code')
<div class="border-solid border-4 border-gray-600 ..."></div>
<div class="border-dashed border-4 border-gray-600 ..."></div>
<div class="border-dotted border-4 border-gray-600 ..."></div>
<div class="border-double border-4 border-gray-600 ..."></div>
<div class="border-none border-4 border-gray-600 ..."></div>
@endslot
@endcomponent

## Responsive

To control the border style of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border style utility. For example, use `md:border-dotted` to apply the `border-dotted` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="border-solid w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('sm')
<div class="border-dashed w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('md')
<div class="border-dotted w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('lg')
<div class="border-double w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('xl')
<div class="border-none w-24 h-24 mx-auto border-8 border-gray-600 bg-gray-400"></div>
@endslot
@slot('code')
<div class="none:border-solid sm:border-dashed md:border-dotted lg:border-double xl:border-none">
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border style',
        'property' => 'borderStyle',
    ],
    'variants' => [
        'responsive',
    ],
])
