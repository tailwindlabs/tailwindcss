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

## Visible <span class="ml-2 font-semibold text-grey-dark text-sm uppercase tracking-wide">Default</span>

Use `.visible` to make an element visible. This will typically be used as a reset when using the `.invisible` utility.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="visible bg-grey-light w-24 h-24 rounded-full"></div>
@endcomponent

## Invisible

Use `.invisible` to hide an element, but still maintain its space.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="invisible bg-grey-light w-24 h-24 rounded-full"></div>
@endcomponent

## Responsive

To apply a visibility utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:invisible` to an element would apply the `invisible` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="visible bg-grey-light w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="invisible bg-grey-light w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="visible bg-grey-light w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="invisible bg-grey-light w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="visible bg-grey-light w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('code')
<div class="none:visible sm:invisible md:visible lg:invisible xl:visible ..."></div>
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
