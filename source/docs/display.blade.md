---
extends: _layouts.documentation
title: "Display"
description: "Utilities for controlling the display box type of an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.block',
      'display: block;',
      "Set the box type of the element to <code>block</code>.",
    ],
    [
      '.inline-block',
      'display: inline-block;',
      "Set the box type of the element to <code>inline-block</code>.",
    ],
    [
      '.inline',
      'display: inline;',
      "Set the box type of the element to <code>inline</code>.",
    ],
    [
      '.flex',
      'display: flex;',
      "Set the box type of the element to <code>flex</code>.",
    ],
    [
      '.inline-flex',
      'display: inline-flex;',
      "Set the box type of the element to <code>inline-flex</code>.",
    ],
    [
      '.table',
      'display: table;',
      "Set the box type of the element to <code>table</code>.",
    ],
    [
      '.table-row',
      'display: table-row;',
      "Set the box type of the element to <code>table-row</code>.",
    ],
    [
      '.table-cell',
      'display: table-cell;',
      "Set the box type of the element to <code>table-cell</code>.",
    ],
    [
      '.hidden',
      'display: none;',
      "Set the box type of the element to <code>none</code>.",
    ],
  ]
])

## Flex

Use `.flex` to create a block-level flex container:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline flex

Use `.inline-flex` to create an inline flex container:

@component('_partials.code-sample')
<div class="inline-flex bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the display property of an element at a specific breakpoint, add a `{screen}:` prefix to any existing display utility class. For example, use `md:inline-flex` to apply the `inline-flex` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="inline-flex bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="block bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="hidden bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-gray-200">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:flex sm:inline-flex md:block lg:hidden xl:flex ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'display',
        'property' => 'display',
    ],
    'variants' => [
        'responsive',
    ],
])
