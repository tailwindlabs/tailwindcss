---
extends: _layouts.documentation
title: "Font Smoothing"
description: "Utilities for controlling the font smoothing of an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.antialiased',
      "-webkit-font-smoothing: antialiased;\n-moz-osx-font-smoothing: grayscale;",
      'Set the font smoothing of an element to antialiased.',
    ],
    [
      '.subpixel-antialiased',
      "-webkit-font-smoothing: auto;\n-moz-osx-font-smoothing: auto;",
      'Set the font smoothing of an element to subpixel antialiasing (the default).',
    ],
  ]
])

## Subpixel Antialiasing

Use the `.subpixel-antialiased` utility to render text using subpixel antialiasing.

@component('_partials.code-sample')
<p class="subpixel-antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Grayscale Antialiasing

Use the `.antialiased` utility to render text using grayscale antialiasing.

@component('_partials.code-sample')
<p class="antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="antialiased ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the font smoothing of an element at a specific breakpoint, add a `{screen}:` prefix to any existing font smoothing utility. For example, use `md:antialiased` to apply the `antialiased` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="subpixel-antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="subpixel-antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="antialiased text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:antialiased sm:subpixel-antialiased md:antialiased lg:subpixel-antialiased xl:antialiased ...">
  The quick brown fox jumped over the lazy dog.
</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'font smoothing',
        'property' => 'fontSmoothing',
    ],
    'variants' => [
        'responsive',
    ],
])
