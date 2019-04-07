---
extends: _layouts.documentation
title: "Vertical Alignment"
description: "Utilities for controlling the vertical alignment of an inline or table-cell box."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.align-baseline',
      'vertical-align: baseline;',
      "Align the baseline of an element with the baseline of its parent.",
    ],
    [
      '.align-top',
      'vertical-align: top;',
      "Align the top of an element and its descendants with the top of the entire line.",
    ],
    [
      '.align-middle',
      'vertical-align: middle;',
      "Align the middle of an element with the baseline plus half the x-height of the parent.",
    ],
    [
      '.align-bottom',
      'vertical-align: bottom;',
      "Align the bottom of an element and its descendants with the bottom of the entire line.",
    ],
    [
      '.align-text-top',
      'vertical-align: text-top;',
      "Align the top of an element with the top of the parent element's font.",
    ],
    [
      '.align-text-bottom',
      'vertical-align: text-bottom;',
      "Align the bottom of an element with the bottom of the parent element's font.",
    ],
  ]
])

## Baseline

Use `.align-baseline` to align the baseline of an element with the baseline of its parent.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-baseline bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-baseline</span>
</div>
@slot('code')
<span class="inline-block align-baseline ...">...</span>
@endslot
@endcomponent

## Top

Use `.align-top` to align the top of an element and its descendants with the top of the entire line.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-top bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-top</span>
</div>
@slot('code')
<span class="inline-block align-top ...">...</span>
@endslot
@endcomponent

## Middle

Use `.align-middle` to align the middle of an element with the baseline plus half the x-height of the parent.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-middle bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-middle</span>
</div>
@slot('code')
<span class="inline-block align-middle ...">...</span>
@endslot
@endcomponent

## Bottom

Use `.align-bottom` to align the bottom of an element and its descendants with the bottom of the entire line.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-bottom bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-bottom</span>
</div>
@slot('code')
<span class="inline-block align-bottom ...">...</span>
@endslot
@endcomponent

## Text Top

Use `.align-text-top` to align the top of an element with the top of the parent element's font.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-text-top bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-text-top</span>
</div>
@slot('code')
<span class="inline-block align-text-top ...">...</span>
@endslot
@endcomponent

## Text Bottom

Use `.align-text-bottom` to align the bottom of an element with the bottom of the parent element's font.

@component('_partials.code-sample')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-text-bottom bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">.align-text-bottom</span>
</div>
@slot('code')
<span class="inline-block align-text-bottom ...">...</span>
@endslot
@endcomponent

## Responsive

To control the vertical alignment only at a specific breakpoint, add a `{screen}:` prefix to any existing vertical align utility. For example, adding the class `md:align-top` to an element would apply the `align-top` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-top bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@slot('sm')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-middle bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@slot('md')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-bottom bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@slot('lg')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-text-top bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@slot('xl')
<div class="leading-none relative">
  <span class="w-1 h-8 inline-block align-text-bottom bg-blue-300">
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-8"></span>
    <span class="absolute top-0 border-blue-300 border-t border-b w-full h-4"></span>
  </span>
  <span class="relative z-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@slot('code')
<div class="leading-none relative">
  <span class="none:align-top sm:align-middle md:align-bottom lg:align-text-top xl:align-text-bottom ...">...</span>
  <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'vertical alignment',
        'property' => 'verticalAlign',
    ],
    'variants' => [
        'responsive',
    ],
])
