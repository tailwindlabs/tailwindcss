---
extends: _layouts.documentation
title: "Order"
description: "Utilities for controlling the order of flex items."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.order-first',
      'order: -9999;',
    ],
    [
      '.order-last',
      'order: 9999;',
    ],
    [
      '.order-none',
      'order: 0;',
    ],
    [
      '.order-1',
      'order: 1;',
    ],
    [
      '.order-2',
      'order: 2;',
    ],
    [
      '.order-3',
      'order: 3;',
    ],
    [
      '.order-4',
      'order: 4;',
    ],
    [
      '.order-5',
      'order: 5;',
    ],
    [
      '.order-6',
      'order: 6;',
    ],
    [
      '.order-7',
      'order: 7;',
    ],
    [
      '.order-8',
      'order: 8;',
    ],
    [
      '.order-9',
      'order: 9;',
    ],
    [
      '.order-10',
      'order: 10;',
    ],
    [
      '.order-11',
      'order: 11;',
    ],
    [
      '.order-12',
      'order: 12;',
    ],
  ]
])

## Usage

Use `.order-{order}` to render flex items in a different order than they appear in the DOM.

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="order-last text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@slot('code')
<div class="flex">
  <div class="order-last">1</div>
  <div>2</div>
  <div>3</div>
</div>
@endslot
@endcomponent


## Responsive

To apply a flex direction utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:flex-row` to an element would apply the `flex-row` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="order-first text-gray-700 text-center bg-white px-4 py-2 m-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">4</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">5</div>
</div>
@endslot
@slot('sm')
<div class="flex bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="order-last text-gray-700 text-center bg-white px-4 py-2 m-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">4</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">5</div>
</div>
@endslot
@slot('md')
<div class="flex bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="order-none text-gray-700 text-center bg-white px-4 py-2 m-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">4</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">5</div>
</div>
@endslot
@slot('lg')
<div class="flex bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="order-first text-gray-700 text-center bg-white px-4 py-2 m-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">4</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">5</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="order-last text-gray-700 text-center bg-white px-4 py-2 m-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">4</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">5</div>
</div>
@endslot
@slot('code')
<div class="flex">
  <div>1</div>
  <div>2</div>
  <div class="none:order-first sm:order-last md:order-none lg:order-first xl:order-last">3</div>
  <div>4</div>
  <div>5</div>
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides utilities for `order-first`, `order-last`, `order-none`, and an `order-{number}` utility for the numbers 1 through 12. You change, add, or remove these by editing the `theme.order` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.order'])
  first: '-9999',
  last: '9999',
- none: '0',
+ normal: '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
- '7': '7',
- '8': '8',
- '9': '9',
- '10': '10',
- '11': '11',
- '12': '12',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'order',
        'property' => 'order',
    ],
    'variants' => [
        'responsive',
    ],
])
