---
extends: _layouts.documentation
title: "Align Items"
description: "Utilities for controlling how flex items are positioned along a container's cross axis."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.items-stretch',
      'align-items: flex-stretch;',
      "Stretch items to fill the cross axis.",
    ],
    [
      '.items-start',
      'align-items: flex-start;',
      "Align items against the start of the cross axis.",
    ],
    [
      '.items-center',
      'align-items: center;',
      "Align items along the center of the cross axis.",
    ],
    [
      '.items-end',
      'align-items: flex-end;',
      "Align items against the end of the cross axis.",
    ],
    [
      '.items-baseline',
      'align-items: baseline;',
      "Align the baselines of each item.",
    ],
  ]
])

### Stretch <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.items-stretch` to stretch items to fill the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Start

Use `.items-start` to align items to the start of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.items-center` to align items along the center of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-center bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.items-end` to align items to the end of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-end bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Baseline

Use `.items-baseline` to align items along the flex container's cross axis such that all of their baselines align:

@component('_partials.code-sample')
<div class="flex items-baseline bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endcomponent

## Responsive

To control the alignment of flex items at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:items-center` to apply the `items-center` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex items-stretch bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('sm')
<div class="flex items-start bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('md')
<div class="flex items-center bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('lg')
<div class="flex items-end bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('xl')
<div class="flex items-baseline bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('code')
<div class="none:items-stretch sm:items-start md:items-center lg:items-end xl:items-baseline ...">
  <!-- ... -->
</div>
@endslot
@endcomponent
