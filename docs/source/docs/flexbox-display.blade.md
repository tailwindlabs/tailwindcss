---
extends: _layouts.documentation
title: "Flex Display"
description: "Utilities for creating flex containers."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex',
      'display: flex;',
      "Create a block-level flex container.",
    ],
    [
      '.inline-flex',
      'display: inline-flex;',
      "Create an inline flex container.",
    ],
  ]
])

## Flex

Use `.flex` to create a block-level flex container:

@component('_partials.code-sample')
<div class="flex bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline flex

Use `.inline-flex` to create an inline flex container:

@component('_partials.code-sample')
<div class="inline-flex bg-grey-lighter">
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
<div class="flex bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="inline-flex bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="block bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="hidden bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-grey-lighter">
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
        'name' => 'flex display',
        'property' => 'flexbox',
    ],
    'variants' => [
        'responsive',
    ],
    'extraMessage' => 'Note that modifying the <code>flexbox</code> property will affect which variants are generated for <em>all</em> Flexbox utilities, not just the display utilities.'
])
