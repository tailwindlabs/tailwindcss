---
extends: _layouts.documentation
title: "Justify Content"
description: "Utilities for controlling flex items are positioned along a container's main axis."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.justify-start',
      'justify-content: flex-start;',
      "Justify items against the start of the container.",
    ],
    [
      '.justify-center',
      'justify-content: center;',
      "Justify items in the center of the container.",
    ],
    [
      '.justify-end',
      'justify-content: flex-end;',
      "Justify items against the end of the container.",
    ],
    [
      '.justify-between',
      'justify-content: space-between;',
      "Justify items by adding an equal amount of space between each one.",
    ],
    [
      '.justify-around',
      'justify-content: space-around;',
      "Justify items by adding an equal amount of space around each one.",
    ],
  ]
])

### Start <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.justify-start` to justify items against the start of the flex container's main axis:

@component('_partials.code-sample')
<div class="flex justify-start bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.justify-center` to justify items along the center of the flex container's main axis:

@component('_partials.code-sample')
<div class="flex justify-center bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.justify-end` to justify items against the end of the flex container's main axis:

@component('_partials.code-sample')
<div class="flex justify-end bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Space between

Use `.justify-between` to justify items along the flex container's main axis such that there is an equal amount of space between each item:

@component('_partials.code-sample')
<div class="flex justify-between bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Space around

Use `.justify-around` to justify items along the flex container's main axis such that there is an equal amount of space around each item:

@component('_partials.code-sample')
<div class="flex justify-around bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To justify flex items at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:justify-between` to apply the `justify-between` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-start bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex justify-end bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex justify-between bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex justify-around bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:justify-start sm:justify-center md:justify-end lg:justify-between xl:justify-around ...">
  <!-- ... -->
</div>
@endslot
@endcomponent
