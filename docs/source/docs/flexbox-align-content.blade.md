---
extends: _layouts.documentation
title: "Align Content"
description: "Utilities for controlling how lines are positioned in multi-line flex containers."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.content-start',
      'align-content: flex-start;',
      "Pack lines against the start of the cross axis.",
    ],
    [
      '.content-center',
      'align-content: center;',
      "Pack lines in the center of the cross axis.",
    ],
    [
      '.content-end',
      'align-content: flex-end;',
      "Pack lines against the end of the cross axis.",
    ],
    [
      '.content-between',
      'align-content: space-between;',
      "Distribute lines along the cross axis by adding an equal amount of space between each line.",
    ],
    [
      '.content-around',
      'align-content: space-around;',
      "Distribute lines along the cross axis by adding an equal amount of space around each line.",
    ],
  ]
])

## Start <span class="ml-2 font-semibold text-grey-dark text-sm uppercase tracking-wide">Default</span>

Use `.content-start` to pack lines in a flex container against the start of the cross axis:

@component('_partials.code-sample')
<div class="flex content-start flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endcomponent

## Center

Use `.content-center` to pack lines in a flex container in the center of the cross axis:

@component('_partials.code-sample')
<div class="flex content-center flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endcomponent

## End

Use `.content-end` to pack lines in a flex container against the end of the cross axis:

@component('_partials.code-sample')
<div class="flex content-end flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endcomponent

## Space between

Use `.content-between` to distribute lines in a flex container such that there is an equal amount of space between each line:

@component('_partials.code-sample')
<div class="flex content-between flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endcomponent

## Space around

Use `.content-around` to distribute lines in a flex container such that there is an equal amount of space around each line:

@component('_partials.code-sample')
<div class="flex content-around flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endcomponent

## Responsive

To control the alignment of flex content at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:content-around` to apply the `content-around` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex content-start flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endslot
@slot('sm')
<div class="flex content-end flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endslot
@slot('md')
<div class="flex content-center flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endslot
@slot('lg')
<div class="flex content-between flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endslot
@slot('xl')
<div class="flex content-around flex-wrap bg-grey-lighter h-48">
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-grey-darker text-center bg-grey-light p-2">5</div>
  </div>
</div>
@endslot
@slot('code')
<div class="none:content-start sm:content-end md:content-center lg:content-between xl:content-around ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'align-content',
        'property' => 'flexbox',
    ],
    'variants' => [
        'responsive',
    ],
    'extraMessage' => 'Note that modifying the <code>flexbox</code> property will affect which variants are generated for <em>all</em> Flexbox utilities, not just the align-content utilities.'
])
