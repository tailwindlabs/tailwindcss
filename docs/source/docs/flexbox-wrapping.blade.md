---
extends: _layouts.documentation
title: "Flex Wrapping"
description: "Utilities for controlling how flex items wrap."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-no-wrap',
      'flex-wrap: nowrap;',
      "Don't allow flex items to wrap.",
    ],
    [
      '.flex-wrap',
      'flex-wrap: wrap;',
      "Allow flex items to wrap in the normal direction.",
    ],
    [
      '.flex-wrap-reverse',
      'flex-wrap: wrap-reverse;',
      "Allow flex items to wrap in the reverse direction.",
    ],
  ]
])

## Don't wrap <span class="ml-2 font-semibold text-grey-dark text-sm uppercase tracking-wide">Default</span>

Use `.flex-no-wrap` to prevent flex items from wrapping, causing inflexible items to overflow the container if necessary:

@component('_partials.code-sample')
<div class="flex flex-no-wrap bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endcomponent

## Wrap normally

Use `.flex-wrap` to allow flex items to wrap:

@component('_partials.code-sample')
<div class="flex flex-wrap bg-grey-lighter">
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endcomponent

## Wrap reversed

Use `.flex-wrap-reverse` to wrap flex items in the reverse direction:

@component('_partials.code-sample')
<div class="flex flex-wrap-reverse bg-grey-lighter">
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endcomponent

## Responsive

To control how flex items wrap at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-wrap-reverse` to apply the `flex-wrap-reverse` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-no-wrap bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endslot
@slot('sm')
<div class="flex flex-wrap bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endslot
@slot('md')
<div class="flex flex-wrap-reverse bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endslot
@slot('lg')
<div class="flex flex-no-wrap bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endslot
@slot('xl')
<div class="flex flex-wrap bg-grey-lighter">
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
</div>
@endslot
@slot('code')
<div class="none:flex-no-wrap sm:flex-wrap md:flex-wrap-reverse lg:flex-no-wrap xl:flex-wrap ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'flex-wrap',
        'property' => 'flexbox',
    ],
    'variants' => [
        'responsive',
    ],
    'extraMessage' => 'Note that modifying the <code>flexbox</code> property will affect which variants are generated for <em>all</em> Flexbox utilities, not just the flex-wrap utilities.'
])
