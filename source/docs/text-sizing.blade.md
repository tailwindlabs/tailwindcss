---
extends: _layouts.documentation
title: "Font Size"
description: "Utilities for controlling the font size of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.text-xs',
      'font-size: .75rem;',
      'Set the text size to <code>.75rem</code> (<code>12px</code>).',
    ],
    [
      '.text-sm',
      'font-size: .875rem;',
      'Set the text size to <code>.875rem</code> (<code>14px</code>).',
    ],
    [
      '.text-base',
      'font-size: 1rem;',
      'Set the text size to <code>1rem</code> (<code>16px</code>).',
    ],
    [
      '.text-lg',
      'font-size: 1.125rem;',
      'Set the text size to <code>1.125rem</code> (<code>18px</code>).',
    ],
    [
      '.text-xl',
      'font-size: 1.25rem;',
      'Set the text size to <code>1.25rem</code> (<code>20px</code>).',
    ],
    [
      '.text-2xl',
      'font-size: 1.5rem;',
      'Set the text size to <code>1.5rem</code> (<code>24px</code>).',
    ],
    [
      '.text-3xl',
      'font-size: 1.875rem;',
      'Set the text size to <code>1.875rem</code> (<code>30px</code>).',
    ],
    [
      '.text-4xl',
      'font-size: 2.25rem;',
      'Set the text size to <code>2.25rem</code> (<code>36px</code>).',
    ],
    [
      '.text-5xl',
      'font-size: 3rem;',
      'Set the text size to <code>3rem</code> (<code>48px</code>).',
    ],
  ]
])

## Usage

Control the font size of an element using the `.text-{size}` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-xs</p>
  <p class="text-xs truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-sm</p>
  <p class="text-sm truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-base</p>
  <p class="text-base truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-lg</p>
  <p class="text-lg truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-xl</p>
  <p class="text-xl truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-2xl</p>
  <p class="text-2xl truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-3xl</p>
  <p class="text-3xl truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-4xl</p>
  <p class="text-4xl truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
<div>
  <p class="text-sm text-grey-dark">.text-5xl</p>
  <p class="text-5xl truncate text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
</div>
@slot('code')
<p class="text-xs ...">The quick brown fox ...</p>
<p class="text-sm ...">The quick brown fox ...</p>
<p class="text-base ...">The quick brown fox ...</p>
<p class="text-lg ...">The quick brown fox ...</p>
<p class="text-xl ...">The quick brown fox ...</p>
<p class="text-2xl ...">The quick brown fox ...</p>
<p class="text-3xl ...">The quick brown fox ...</p>
<p class="text-4xl ...">The quick brown fox ...</p>
<p class="text-5xl ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the font size of an element at a specific breakpoint, add a `{screen}:` prefix to any existing font size utility. For example, use `md:text-lg` to apply the `text-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'font-sans'])
@slot('none')
<p class="text-base text-grey-darkest truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="text-lg text-grey-darkest truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="text-xl text-grey-darkest truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="text-2xl text-grey-darkest truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="text-3xl text-grey-darkest truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl ...">The quick brown fox jumped over the lazy dog.</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text sizing',
        'property' => 'textSizes',
    ],
    'variants' => [
        'responsive',
    ],
])
