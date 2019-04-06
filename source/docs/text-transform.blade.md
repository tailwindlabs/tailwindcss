---
extends: _layouts.documentation
title: "Text Transform"
description: "Utilities for controlling the transformation of text."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.uppercase',
      'text-transform: uppercase;',
      'Makes all text uppercase within an element.',
    ],
    [
      '.lowercase',
      'text-transform: lowercase;',
      'Makes all text lowercase within an element.',
    ],
    [
      '.capitalize',
      'text-transform: capitalize;',
      'Capitalizes the text within an element.',
    ],
    [
      '.normal-case',
      'text-transform: none;',
      'Disables any text transformations previously applied to an element.',
    ],
  ]
])

## Normal Case <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use the `.normal-case` utility to preserve the original casing. This is typically used to reset capitalization at different breakpoints.

@component('_partials.code-sample')
<p class="normal-case text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="normal-case ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Uppercase

Use the `.uppercase` utility to uppercase text.

@component('_partials.code-sample')
<p class="uppercase text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="uppercase ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Lowercase

Use the `.lowercase` utility to lowercase text.

@component('_partials.code-sample')
<p class="lowercase text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="lowercase ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Capitalize

Use the `.capitalize` utility to capitalize text.

@component('_partials.code-sample')
<p class="capitalize text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="capitalize ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the text transformation of an element at a specific breakpoint, add a `{screen}:` prefix to any existing text transformation utility. For example, use `md:uppercase` to apply the `uppercase` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="uppercase text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="lowercase text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="capitalize text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="normal-case text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="uppercase text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:uppercase sm:lowercase md:capitalize lg:normal-case xl:uppercase ...">
  The quick brown fox jumped over the lazy dog.
</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text transformation',
        'property' => 'textTransform',
    ],
    'variants' => [
        'responsive',
    ],
])
