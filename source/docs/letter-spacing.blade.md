---
extends: _layouts.documentation
title: "Letter Spacing"
description: "Utilities for controlling the tracking (letter spacing) of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.tracking-tight',
      'letter-spacing: -0.05em;',
      'Set the letter spacing of an element to <code>-0.05em</code>.',
    ],
    [
      '.tracking-normal',
      'letter-spacing: 0;',
      'Set the letter spacing of an element to <code>0</code>.',
    ],
    [
      '.tracking-wide',
      'letter-spacing: 0.05em;',
      'Set the letter spacing of an element to <code>0.05em</code>.',
    ],
  ]
])

## Usage

Control the letter spacing of an element using the `.tracking-{size}` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-grey-dark">.tracking-tight</p>
  <p class="tracking-tight text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.tracking-normal</p>
  <p class="tracking-normal text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div>
  <p class="text-sm text-grey-dark">.tracking-wide</p>
  <p class="tracking-wide text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
@slot('code')
<p class="tracking-tight ...">The quick brown fox ...</p>
<p class="tracking-normal ...">The quick brown fox ...</p>
<p class="tracking-wide ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the letter spacing of an element at a specific breakpoint, add a `{screen}:` prefix to any existing letter spacing utility. For example, use `md:tracking-wide` to apply the `tracking-wide` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="tracking-tight text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="tracking-normal text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="tracking-wide text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="tracking-normal text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="tracking-tight text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:tracking-tight sm:tracking-normal md:tracking-wide lg:tracking-normal xl:tracking-tight ...">The quick brown fox jumped over the lazy dog.</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'tracking',
        'property' => 'tracking',
    ],
    'variants' => [
        'responsive',
    ],
])
