---
extends: _layouts.documentation
title: "Line Height"
description: "Utilities for controlling the leading (line height) of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.leading-none',
      'line-height: 1;',
      'Set the line height of an element to <code>1</code>.',
    ],
    [
      '.leading-tight',
      'line-height: 1.25;',
      'Set the line height of an element to <code>1.25</code>.',
    ],
    [
      '.leading-normal',
      'line-height: 1.5;',
      'Set the line height of an element to <code>1.5</code>.',
    ],
    [
      '.leading-loose',
      'line-height: 2;',
      'Set the line height of an element to <code>2</code>.',
    ],
  ]
])

## Usage

Control the line height of an element using the `.leading-{size}` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-grey-dark">.leading-none</p>
  <p class="leading-none text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.leading-tight</p>
  <p class="leading-tight text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.leading-normal</p>
  <p class="leading-normal text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
<div>
  <p class="text-sm text-grey-dark">.leading-loose</p>
  <p class="leading-loose text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
@slot('code')
<p class="leading-none ...">Lorem ipsum dolor sit amet ...</p>
<p class="leading-tight ...">Lorem ipsum dolor sit amet ...</p>
<p class="leading-normal ...">Lorem ipsum dolor sit amet ...</p>
<p class="leading-loose ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Responsive

To control the line height of an element at a specific breakpoint, add a `{screen}:` prefix to any existing line height utility. For example, use `md:leading-loose` to apply the `leading-loose` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="leading-none text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('sm')
<p class="leading-tight text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('md')
<p class="leading-normal text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('lg')
<p class="leading-loose text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('xl')
<p class="leading-normal text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('code')
<p class="none:leading-none sm:leading-tight md:leading-normal lg:leading-loose xl:leading-normal ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'leading',
        'property' => 'leading',
    ],
    'variants' => [
        'responsive',
    ],
])
