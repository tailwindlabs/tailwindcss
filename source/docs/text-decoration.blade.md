---
extends: _layouts.documentation
title: "Text Decoration"
description: "Utilities for controlling the decoration of text."
features:
  responsive: true
  customizable: false
  hover: true
  focus: true
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.underline',
      'text-decoration: underline;',
      'Underlines the text within an element.',
    ],
    [
      '.line-through',
      'text-decoration: line-through;',
      'Adds a line through the text within an element.',
    ],
    [
      '.no-underline',
      'text-decoration: none;',
      'Disables any text decorations previously applied to an element.',
    ],
  ]
])

## Underline

Use the `.underline` utility to underline text.

@component('_partials.code-sample')
<p class="underline text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="underline ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Line Through

Use the `.line-through` utility to strike out text.

@component('_partials.code-sample')
<p class="line-through text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="line-through ...">The quick brown fox ...</p>
@endslot
@endcomponent

## No Underline

Use the `.no-underline` utility to remove underline or line-through styling.

@component('_partials.code-sample')
<div class="text-center">
  <a href="#" class="no-underline text-blue-500 text-lg">Link with no underline</a>
</div>
@slot('code')
<a href="#" class="no-underline ...">Link with no underline</a>
@endslot
@endcomponent

## Responsive

To control the text decoration of an element at a specific breakpoint, add a `{screen}:` prefix to any existing text decoration utility. For example, use `md:underline` to apply the `underline` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="underline text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="no-underline text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="line-through text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="underline text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="no-underline text-lg text-gray-800">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:underline sm:no-underline md:line-through lg:underline xl:no-underline ...">
  The quick brown fox jumped over the lazy dog.
</p>
@endslot
@endcomponent

## Hover

To control the text decoration of an element on hover, add the `hover:` prefix to any existing text decoration utility. For example, use `hover:underline` to apply the `underline` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<a href="#hover" class="no-underline hover:underline text-blue-500 text-lg">Link</a>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<a href="#" class="... md:no-underline md:hover:underline ...">Link</a>
```

## Focus

To control the text decoration of an element on focus, add the `focus:` prefix to any existing text decoration utility. For example, use `focus:underline` to apply the `underline` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-white focus:underline focus:shadow-outline text-gray-900 appearance-none inline-block w-full text-gray-900 border rounded py-3 px-4 focus:outline-none" value="Focus me" placeholder="Focus me">
</div>

@slot('code')
<input class="focus:underline ..." value="Focus me">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="md:focus:underline ..." value="Focus me">
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text decoration',
        'property' => 'textDecoration',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
