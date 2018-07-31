---
extends: _layouts.documentation
title: "Style &amp; Decoration"
description: "Utilities for controlling the style of text."
features:
  responsive: true
  customizable: true
  hover: true
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
      '.roman',
      'font-style: normal;',
      'Remove italics within an element.',
    ],
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

## Italics

Use the `.italic` utility to make text italic.

@component('_partials.code-sample')
<p class="italic text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="italic ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.roman` utility to display text normally. This is typically used to reset italic text at different breakpoints.

@component('_partials.code-sample')
<p class="roman text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="roman ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Capitalization

Use the `.uppercase` utility to uppercase text.

@component('_partials.code-sample')
<p class="uppercase text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="uppercase ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.lowercase` utility to lowercase text.

@component('_partials.code-sample')
<p class="lowercase text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="lowercase ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.capitalize` utility to capitalize text.

@component('_partials.code-sample')
<p class="capitalize text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="capitalize ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.normal-case` utility to preserve the original casing. This is typically used to reset capitalization at different breakpoints.

@component('_partials.code-sample')
<p class="normal-case text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="normal-case ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Underlines

Use the `.underline` utility to underline text.

@component('_partials.code-sample')
<p class="underline text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="underline ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.line-through` utility to strike out text.

@component('_partials.code-sample')
<p class="line-through text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="line-through ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.no-underline` utility to remove underline or line-through styling.

@component('_partials.code-sample')
<div class="text-center">
  <a href="#" class="no-underline text-blue text-lg">Link with no underline</a>
</div>
@slot('code')
<a href="#" class="no-underline ...">Link with no underline</a>
@endslot
@endcomponent

## Antialiasing

Use the `.antialiased` utility to render text using grayscale antialiasing.

@component('_partials.code-sample')
<p class="antialiased text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="antialiased ...">The quick brown fox ...</p>
@endslot
@endcomponent

Use the `.subpixel-antialiased` utility to render text using subpixel antialiasing.

@component('_partials.code-sample')
<p class="subpixel-antialiased text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@slot('code')
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the style and decoration of an element at a specific breakpoint, add a `{screen}:` prefix to any existing style and decoration utility. For example, use `md:underline` to apply the `underline` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="underline text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="no-underline text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="uppercase text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="normal-case text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="italic text-lg text-grey-darkest">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:underline sm:no-underline md:uppercase lg:normal-case xl:italic ...">The quick brown fox jumped over the lazy dog.</p>
@endslot
@endcomponent

## Hover

To control the style and decoration of an element on hover, add the `hover:` prefix to any existing style and decoration utility. For example, use `hover:underline` to apply the `underline` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<a href="#hover" class="no-underline hover:underline text-blue text-lg">Link</a>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<a href="#" class="... md:no-underline md:hover:underline ...">Link</a>
```

## Focus

To control the style and decoration of an element on focus, add the `focus:` prefix to any existing style and decoration utility. For example, use `focus:uppercase` to apply the `uppercase` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-white focus:uppercase focus:shadow-outline text-black appearance-none inline-block w-full text-black border rounded py-3 px-4 focus:outline-none" value="Focus me" placeholder="Focus me">
</div>

@slot('code')
<input class="focus:uppercase ..." value="Focus me">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="md:focus:uppercase ..." value="Focus me">
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text style',
        'property' => 'textStyle',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
