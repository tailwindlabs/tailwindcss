---
extends: _layouts.documentation
title: "Visibility"
description: "Utilities for controlling the visibility of an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.visible',
      'visibility: visible;',
      "Make an element visible.",
    ],
    [
      '.invisible',
      'visibility: hidden;',
      "Hide an element without affecting the layout of the document.",
    ],
  ]
])

## Visible

Use `.visible` to make an element visible. This is mostly useful for undoing the `.invisible` utility at different screen sizes.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="bg-gray-400 w-32 h-12"></div>
<div class="visible bg-gray-600 w-32 h-12"></div>
<div class="bg-gray-400 w-32 h-12"></div>
@slot('code')
<div class="flex justify-center">
  <div class="bg-gray-400"></div>
  <div class="bg-gray-600 visible"></div>
  <div class="bg-gray-400"></div>
</div>
@endslot
@endcomponent

## Invisible

Use `.invisible` to hide an element, but still maintain its place in the DOM, affecting the layout of other elements (compare with `.hidden` from the [display](/docs/display#hidden) documentation).

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="bg-gray-400 w-32 h-12"></div>
<div class="invisible bg-gray-600 w-32 h-12"></div>
<div class="bg-gray-400 w-32 h-12"></div>
@slot('code')
<div class="flex justify-center">
  <div class="bg-gray-400"></div>
  <div class="bg-gray-600 invisible"></div>
  <div class="bg-gray-400"></div>
</div>
@endslot
@endcomponent

## Responsive

To apply a visibility utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:invisible` to an element would apply the `invisible` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="bg-gray-400 w-32 h-12"></div>
  <div class="visible bg-gray-600 w-32 h-12"></div>
  <div class="bg-gray-400 w-32 h-12"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="bg-gray-400 w-32 h-12"></div>
  <div class="invisible bg-gray-600 w-32 h-12"></div>
  <div class="bg-gray-400 w-32 h-12"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="bg-gray-400 w-32 h-12"></div>
  <div class="visible bg-gray-600 w-32 h-12"></div>
  <div class="bg-gray-400 w-32 h-12"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="bg-gray-400 w-32 h-12"></div>
  <div class="invisible bg-gray-600 w-32 h-12"></div>
  <div class="bg-gray-400 w-32 h-12"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="bg-gray-400 w-32 h-12"></div>
  <div class="visible bg-gray-600 w-32 h-12"></div>
  <div class="bg-gray-400 w-32 h-12"></div>
</div>
@endslot
@slot('code')
<div class="flex justify-center">
  <div class="bg-gray-400"></div>
  <div class="bg-gray-600 none:visible sm:invisible md:visible lg:invisible xl:visible"></div>
  <div class="bg-gray-400"></div>
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'visibility',
        'property' => 'visibility',
    ],
    'variants' => [
        'responsive',
    ],
])
