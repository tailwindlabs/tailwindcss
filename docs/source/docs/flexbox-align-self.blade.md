---
extends: _layouts.documentation
title: "Align Self"
description: "Utilities for controlling how an individual flex item is positioned along its container's cross axis."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.self-auto',
      'align-self: auto;',
      "Align item based on the container's <code>align-items</code> property.",
    ],
    [
      '.self-start',
      'align-self: flex-start;',
      "Align item against the start of the cross axis.",
    ],
    [
      '.self-center',
      'align-self: center;',
      "Align item along the center of the cross axis.",
    ],
    [
      '.self-end',
      'align-self: flex-end;',
      "Align item against the end of the cross axis.",
    ],
    [
      '.self-stretch',
      'align-self: stretch;',
      "Stretch item to fill the cross axis.",
    ],
  ]
])

## Auto <span class="ml-2 font-semibold text-grey-dark text-sm uppercase tracking-wide">Default</span>

Use `.self-auto` to align an item based on the value of the flex container's `align-items` property:

@component('_partials.code-sample')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-auto flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Start

Use `.self-start` to align an item to the start of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-start flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Center

Use `.self-center` to align an item along the center of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-center flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## End

Use `.self-end` to align an item to the end of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-end flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Stretch

Use `.self-stretch` to stretch an item to fill the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-start bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-stretch flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the alignment of a flex item at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:self-end` to apply the `self-end` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-auto flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-start flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-end flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-center flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex items-stretch bg-grey-lighter h-24">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="self-stretch flex-1 text-grey-darkest text-center bg-grey px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="items-stretch ...">
  <!-- ... -->
  <div class="none:self-auto sm:self-start md:self-end lg:self-center xl:self-stretch ...">2</div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'align-self',
        'property' => 'flexbox',
    ],
    'variants' => [
        'responsive',
    ],
    'extraMessage' => 'Note that modifying the <code>flexbox</code> property will affect which variants are generated for <em>all</em> Flexbox utilities, not just the align-self utilities.'
])
