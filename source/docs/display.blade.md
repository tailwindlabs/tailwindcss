---
extends: _layouts.documentation
title: "Display"
description: "Utilities for controlling the display box type of an element."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.hidden',
      'display: none;',
      "Set the box type of the element to <code>none</code>.",
    ],
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
      '.grid',
      'display: grid;',
      "Set the box type of the element to <code>grid</code>.",
    ],
    [
      '.table',
      'display: table;',
      "Set the box type of the element to <code>table</code>.",
    ],
    [
      '.table-caption',
      'display: table-caption;',
      "Set the box type of the element to <code>table-caption</code>.",
    ],
    [
      '.table-cell',
      'display: table-cell;',
      "Set the box type of the element to <code>table-cell</code>.",
    ],
    [
      '.table-column',
      'display: table-column;',
      "Set the box type of the element to <code>table-column</code>.",
    ],
    [
      '.table-column-group',
      'display: table-column-group;',
      "Set the box type of the element to <code>table-column-group</code>.",
    ],
    [
      '.table-footer-group',
      'display: table-footer-group;',
      "Set the box type of the element to <code>table-footer-group</code>.",
    ],
    [
      '.table-header-group',
      'display: table-header-group;',
      "Set the box type of the element to <code>table-header-group</code>.",
    ],
    [
      '.table-row-group',
      'display: table-row-group;',
      "Set the box type of the element to <code>table-row-group</code>.",
    ],
    [
      '.table-row',
      'display: table-row;',
      "Set the box type of the element to <code>table-row</code>.",
    ],
  ]
])

## Block

Use `.block` to create a block-level element.

@component('_partials.code-sample')
<div class="bg-gray-200 p-4">
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2">1</span>
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2 mt-2">2</span>
  <span class="block text-gray-700 text-center bg-gray-400 px-4 py-2 mt-2">3</span>
</div>
@endcomponent

## Inline Block

Use `.inline-block` to create an inline block-level element.

@component('_partials.code-sample')
<div class="bg-gray-200">
  <div class="inline-block text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="inline-block text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="inline-block text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline

Use `.inline` to create an inline element.

@component('_partials.code-sample')
<div class="bg-gray-200">
  <div class="inline text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="inline text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="inline text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endcomponent

## Flex

Use `.flex` to create a block-level flex container.

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline flex

Use `.inline-flex` to create an inline flex container.

@component('_partials.code-sample')
<div class="inline-flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Grid

Use `.grid` to create a grid container.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid gap-4 grid-cols-3">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
</div>
@slot('code')
<div class="grid gap-4 grid-cols-3">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Table

Use the `.table`, `.table-row`, `.table-cell`, `.table-caption`, `.table-column`, `.table-column-group`, `.table-header-group`, `table-row-group`, and `.table-footer-group` utilities to create elements that behave like their respective table elements.

@component('_partials.code-sample')
<div class="table w-full">
  <div class="table-row-group">
    <div class="table-row">
      <div class="table-cell bg-gray-400 text-gray-700 px-4 py-2 text-sm">A cell with more content</div>
      <div class="table-cell bg-gray-200 text-gray-700 px-4 py-2 text-sm">Cell 2</div>
      <div class="table-cell bg-gray-400 text-gray-700 px-4 py-2 text-sm">Cell 3</div>
    </div>
    <div class="table-row">
      <div class="table-cell bg-gray-200 text-gray-700 px-4 py-2 text-sm">Cell 4</div>
      <div class="table-cell bg-gray-400 text-gray-700 px-4 py-2 text-sm">A cell with more content</div>
      <div class="table-cell bg-gray-200 text-gray-700 px-4 py-2 text-sm">Cell 6</div>
    </div>
  </div>
</div>
@endcomponent

## Hidden

Use `.hidden` to set an element to `display: none` and remove it from the page layout (compare with `.invisible` from the [visibility](/docs/visibility#invisible) documentation).

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="hidden text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the display property of an element at a specific breakpoint, add a `{screen}:` prefix to any existing display utility class. For example, use `md:inline-flex` to apply the `inline-flex` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="inline-flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="block bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="hidden bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
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
