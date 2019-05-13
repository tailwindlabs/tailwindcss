---
extends: _layouts.documentation
title: "Font Style"
description: "Utilities for controlling the style of text."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.italic',
      'font-style: italic;',
      'Italicizes the text within an element.',
    ],
    [
      '.not-italic',
      'font-style: normal;',
      'Remove italics within an element.',
    ],
  ]
])

## No Italics

Use the `.not-italic` utility to display text normally. This is typically used to reset italic text at different breakpoints.

@component('_partials.code-sample')
<p class="not-italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="not-italic ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Italics

Use the `.italic` utility to make text italic.

@component('_partials.code-sample')
<p class="italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="italic ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the font style of an element at a specific breakpoint, add a `{screen}:` prefix to any existing font style utility. For example, use `md:italic` to apply the `italic` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="not-italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="not-italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="italic text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:italic sm:not-italic md:italic lg:not-italic xl:italic ...">
  The quick brown fox jumped over the lazy dog.
</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'font style',
        'property' => 'fontStyle',
    ],
    'variants' => [
        'responsive',
    ],
])
