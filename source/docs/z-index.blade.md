---
extends: _layouts.documentation
title: "Z-Index"
description: "Utilities for controlling the stack order of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.z-0',
      'z-index: 0;',
      "Set the z-index of the element to 0.",
    ],
    [
      '.z-10',
      'z-index: 10;',
      "Set the z-index of the element to 10.",
    ],
    [
      '.z-20',
      'z-index: 20;',
      "Set the z-index of the element to 20.",
    ],
    [
      '.z-30',
      'z-index: 30;',
      "Set the z-index of the element to 30.",
    ],
    [
      '.z-40',
      'z-index: 40;',
      "Set the z-index of the element to 40.",
    ],
    [
      '.z-50',
      'z-index: 50;',
      "Set the z-index of the element to 50.",
    ],
    [
      '.z-auto',
      'z-index: auto;',
      "Don't create a new stacking context.",
    ],
  ]
])

## Usage

Control the stack order (or three-dimensional positioning) of an element in Tailwind, regardless of order it has been displayed, using the `.z-{index}` utilities.

@component('_partials.code-sample')
<div class="relative h-32 text-center">
  <div class="z-40 absolute w-24 h-24 ml-0 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-2 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-4 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-6 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-8 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@slot('code')
<div class="z-40 ml-0 mt-0 bg-grey-light">z-40</div>
<div class="z-30 ml-2 mt-2 bg-grey">z-30</div>
<div class="z-20 ml-4 mt-4 bg-grey-dark">z-20</div>
<div class="z-10 ml-6 mt-6 bg-grey-darker">z-10</div>
<div class="z-0 ml-8 mt-8 bg-grey-darkest">z-0</div>
@endslot
@endcomponent

## Responsive

To control the z-index of an element at a specific breakpoint, add a `{screen}:` prefix to any existing z-index utility. For example, use `md:z-50` to apply the `z-50` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="relative w-full h-32 text-center">
  <div class="z-0 absolute w-full h-12 mt-12 bg-yellow-light flex justify-center items-center">yellow</div>
  <div class="z-40 absolute w-24 h-24 ml-4 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-6 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-8 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-10 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-12 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@endslot
@slot('sm')
<div class="relative h-32 text-center">
  <div class="z-10 absolute w-full h-12 mt-12 bg-yellow-light flex justify-center items-center">yellow</div>
  <div class="z-40 absolute w-24 h-24 ml-4 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-6 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-8 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-10 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-12 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@endslot
@slot('md')
<div class="relative h-32 text-center">
  <div class="z-20 absolute w-full h-12 mt-12 bg-yellow-light flex justify-center items-center">yellow</div>
  <div class="z-40 absolute w-24 h-24 ml-4 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-6 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-8 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-10 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-12 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@endslot
@slot('lg')
<div class="relative h-32 text-center">
  <div class="z-30 absolute w-full h-12 mt-12 bg-yellow-light flex justify-center items-center">yellow</div>
  <div class="z-40 absolute w-24 h-24 ml-4 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-6 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-8 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-10 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-12 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@endslot
@slot('xl')
<div class="relative h-32 text-center">
  <div class="z-40 absolute w-full h-12 mt-12 bg-yellow-light flex justify-center items-center">yellow</div>
  <div class="z-40 absolute w-24 h-24 ml-4 mt-0 bg-grey-light flex justify-center items-center">z-40</div>
  <div class="z-30 absolute w-24 h-24 ml-6 mt-2 bg-grey flex justify-center items-center">z-30</div>
  <div class="z-20 absolute w-24 h-24 ml-8 mt-4 bg-grey-dark flex justify-center items-center">z-20</div>
  <div class="z-10 absolute w-24 h-24 ml-10 mt-6 bg-grey-darker flex justify-center items-center">z-10</div>
  <div class="z-0 absolute w-24 h-24 ml-12 mt-8 bg-grey-darkest flex justify-center items-center">z-0</div>
</div>
@endslot
@slot('code')
<div class="none:z-0 sm:z-10 md:z-20 lg:z-30 xl:z-40 bg-yellow-light">yellow</div>
<div class="z-40 ml-4 mt-0 bg-grey-light">z-40</div>
<div class="z-30 ml-6 mt-2 bg-grey">z-30</div>
<div class="z-20 ml-8 mt-4 bg-grey-dark">z-20</div>
<div class="z-10 ml-10 mt-6 bg-grey-darker">z-10</div>
<div class="z-0 ml-12 mt-8 bg-grey-darkest">z-0</div>
@endslot
@endcomponent

## Customizing

### Z-Index Scale

By default Tailwind provides six numeric `z-index` utilities and an `auto` utility. You change, add, or remove these by editing the `zIndex` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'zIndex'])
  '0': 0,
- '10': 10,
- '20': 20,
- '30': 30,
- '40': 40,
- '50': 50,
+ '25': 25,
+ '50': 50,
+ '75': 75,
+ '100': 100,
  'auto': 'auto',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'z-index',
        'property' => 'zIndex',
    ],
    'variants' => [
        'responsive',
    ],
])
